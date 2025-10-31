import { type FC, useState, useEffect, useMemo, useRef } from 'react'
import { companyValuesService } from '@/services/companyValues'
import type { CompanyValue } from '@/types/companyValues'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { ValueForm } from './ValueForm'
import { useSprings, useTransition, a } from '@react-spring/web'
import { useDrag } from '@use-gesture/react'
import clamp from 'lodash.clamp'
import swap from 'lodash-move'

// Função pura para calcular os estilos dos itens durante drag
const fn =
  (
    order: number[],
    active = false,
    originalIndex = 0,
    curIndex = 0,
    y = 0,
    itemHeight = 116
  ) =>
  (index: number) =>
    active && index === originalIndex
      ? {
          y: curIndex * itemHeight + y,
          scale: 1.02,
          zIndex: 1,
          shadow: 15,
          immediate: (key: string) => key === 'y' || key === 'zIndex'
        }
      : {
          y: order.indexOf(index) * itemHeight,
          scale: 1,
          zIndex: 0,
          shadow: 1,
          immediate: false
        }


export const ValuesTab: FC = () => {
  const [values, setValues] = useState<CompanyValue[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | undefined>()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedValue, setSelectedValue] = useState<CompanyValue | null>(null)
  const CARD_HEIGHT = 96
  const GAP = 20
  const ITEM_HEIGHT = CARD_HEIGHT + GAP

  const activeValues = useMemo(() => values.filter(v => v.is_active), [values])
  const inactiveValues = useMemo(() => values.filter(v => !v.is_active), [values])

  // Inicializar order - mesma abordagem do TestTab
  const order = useRef<number[]>([])
  const prevActiveValuesIds = useRef<string[]>([])

  useEffect(() => {
    loadValues()
  }, [])

  const loadValues = async () => {
    setIsLoading(true)
    setError(undefined)
    try {
      const data = await companyValuesService.list()
      const sorted = [...data].sort((a, b) => {
        if (a.position === b.position) return 0
        return a.position < b.position ? -1 : 1
      })
      setValues(sorted)
    } catch (err) {
      console.error('Error loading company values:', err)
      setError('Erro ao carregar valores da empresa. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async (value: Partial<CompanyValue>) => {
    try {
      if (value.id) {
        await companyValuesService.update(value.id, value)
      } else {
        await companyValuesService.create(value)
      }
      setIsFormOpen(false)
      setSelectedValue(null)
      loadValues()
    } catch (err) {
      console.error('Error saving value:', err)
      setError('Erro ao salvar valor. Tente novamente.')
      throw err
    }
  }

  const handleToggleActive = async (value: CompanyValue) => {
    try {
      await companyValuesService.update(value.id, { is_active: !value.is_active })
      setValues((prev) => {
        const updated = prev.map((v) =>
          v.id === value.id ? { ...v, is_active: !v.is_active } : v
        )
        return updated.sort((a, b) => {
          if (a.is_active !== b.is_active) return a.is_active ? -1 : 1
          if (a.position === b.position) return 0
          return a.position < b.position ? -1 : 1
        })
      })
    } catch (err) {
      console.error('Error toggling active state:', err)
      setError('Erro ao atualizar status do valor. Tente novamente.')
    }
  }

  const handleReorder = async (orderedIds: string[]) => {
    try {
      // Update otimista: atualiza o estado local primeiro
      setValues((prev) => {
        const byId = new Map(prev.map((v) => [v.id, v]))
        const activeReordered = orderedIds
          .map((id) => byId.get(id)!)
          .filter((v) => v !== undefined)
          .map((v, idx) => ({ ...v, position: idx }))
        const inactive = prev.filter((v) => !v.is_active)
        return [...activeReordered, ...inactive]
      })

      // Persiste no backend
      await companyValuesService.reorder(orderedIds)
    } catch (err) {
      console.error('Error reordering values:', err)
      setError('Erro ao reordenar valores. Tente novamente.')
      // Em caso de erro, recarrega do servidor
      loadValues()
    }
  }

  // Springs para animação de drag - inicializa com posições corretas
  const [springs, api] = useSprings(
    activeValues.length,
    fn(
      activeValues.length > 0 ? activeValues.map((_, i) => i) : [],
      false,
      0,
      0,
      0,
      ITEM_HEIGHT
    )
  )

  // Sincroniza order.current quando activeValues muda (após load ou reorder)
  useEffect(() => {
    const currentIds = activeValues.map(v => v.id).join(',')
    const prevIds = prevActiveValuesIds.current.join(',')

    // Se a lista mudou (diferente ordem de IDs ou tamanho diferente), reseta order
    if (currentIds !== prevIds && activeValues.length > 0) {
      order.current = activeValues.map((_, i) => i)
      prevActiveValuesIds.current = activeValues.map(v => v.id)
      // Atualiza springs para refletir a nova ordem
      api.start(fn(order.current, false, 0, 0, 0, ITEM_HEIGHT))
    }
  }, [activeValues, api, ITEM_HEIGHT])

  // Transições para valores inativos
  const inactiveTransitions = useTransition(inactiveValues, {
    keys: (v) => v.id,
    from: { opacity: 0, transform: 'translateY(-8px)' },
    enter: { opacity: 1, transform: 'translateY(0px)' },
    leave: { opacity: 0, transform: 'translateY(-8px)' }
  })

  // Bind do drag gesture (igual ao exemplo do TestTab)
  const bind = useDrag(({ args: [originalIndex], active, movement: [, y] }) => {
    const curIndex = order.current.indexOf(originalIndex)
    const curRow = clamp(
      Math.round((curIndex * ITEM_HEIGHT + y) / ITEM_HEIGHT),
      0,
      activeValues.length - 1
    )
    const newOrder = swap(order.current, curIndex, curRow)

    // Atualiza as animações (igual ao exemplo)
    api.start(fn(newOrder, active, originalIndex, curIndex, y, ITEM_HEIGHT))

    // Quando soltar, atualiza a ordem
    if (!active) {
      order.current = newOrder
      const orderedIds = newOrder.map((i) => activeValues[i].id)
      handleReorder(orderedIds)
    }
  })


  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-2xl font-bold">Valores da Empresa</h2>
          <p className="text-muted-foreground">
            Gerencie os valores que serão usados nos elogios.
          </p>
        </div>
        <Button onClick={() => { setSelectedValue(null); setIsFormOpen(true) }}>
          <i className="ph ph-plus mr-2" />
          Adicionar Valor
        </Button>
      </div>

      <ValueForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        value={selectedValue}
        onSave={handleSave}
        onCancel={() => { setIsFormOpen(false); setSelectedValue(null) }}
      />

      {isLoading && <p>Carregando...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!isLoading && values.length === 0 && !error && (
        <div className="mt-6 rounded-lg border p-6 text-center text-muted-foreground">
          <p className="mb-2">Nenhum valor cadastrado ainda</p>
          <p className="text-sm">Clique em "Adicionar Valor" para criar o primeiro</p>
        </div>
      )}

      {!isLoading && activeValues.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">Valores Ativos</h3>
          <div
            className="relative"
            style={{
              height:
                activeValues.length > 0
                  ? (activeValues.length - 1) * ITEM_HEIGHT + CARD_HEIGHT
                  : 0
            }}
          >
            {springs.map(({ zIndex, shadow, y, scale }, i) => {
              const value = activeValues[i]
              return (
                <a.div
                  key={value.id}
                  className="absolute left-0 right-0 will-change-transform"
                  style={{
                    zIndex,
                    boxShadow: shadow.to(
                      (s) => `rgba(0, 0, 0, 0.15) 0px ${s}px ${2 * s}px 0px`
                    ),
                    y,
                    scale,
                    touchAction: 'none'
                  }}
                >
                  <div
                    className="p-4 border rounded-lg flex justify-between items-center hover:bg-muted/30 transition-colors bg-white dark:bg-gray-800"
                    style={{ height: CARD_HEIGHT }}
                  >
                    <div
                      {...bind(i)}
                      className="flex items-center gap-4 flex-1 cursor-grab active:cursor-grabbing select-none"
                    >
                      <div className="text-muted-foreground">
                        <i className="ph ph-dots-six-vertical text-xl" />
                      </div>
                      {/* Renderizar ícone Phosphor */}
                      <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center">
                        <i
                          className={`ph-duotone ph-${value.iconName || 'lightbulb'}`}
                          style={{ color: value.iconColor || '#00D959', fontSize: '40px' }}
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold flex items-center gap-2">
                          {value.title}
                        </h3>
                        {value.description && (
                          <p className="text-sm text-muted-foreground">
                            {value.description}
                          </p>
                        )}
                        {value.example && (
                          <p className="text-sm text-muted-foreground italic">
                            Ex: "{value.example}"
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedValue(value)
                          setIsFormOpen(true)
                        }}
                      >
                        <i className="ph ph-pencil-simple" />
                      </Button>
                      <Switch
                        checked={true}
                        onCheckedChange={() => handleToggleActive(value)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  </div>
                </a.div>
              )
            })}
          </div>
        </div>
      )}

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Valores Desativados</h3>
        {inactiveValues.length === 0 ? (
          <div className="rounded-lg border p-6 text-center text-muted-foreground">
            Nenhum valor desativado no momento
          </div>
        ) : (
          <div className="space-y-4">
            {inactiveTransitions((style, value) => (
              <a.div
                key={value.id}
                style={style}
                className="p-4 border rounded-lg flex justify-between items-center hover:bg-muted/30 transition-colors bg-white dark:bg-gray-800"
              >
                <div className="flex items-center gap-4">
                  {/* Renderizar ícone Phosphor */}
                  <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center">
                    <i
                      className={`ph-duotone ph-${value.iconName || 'lightbulb'}`}
                      style={{
                        color: value.iconColor || '#00D959',
                        fontSize: '40px'
                      }}
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold flex items-center gap-2">
                      {value.title}
                    </h3>
                    {value.description && (
                      <p className="text-sm text-muted-foreground">
                        {value.description}
                      </p>
                    )}
                    {value.example && (
                      <p className="text-sm text-muted-foreground italic">
                        Ex: "{value.example}"
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedValue(value)
                      setIsFormOpen(true)
                    }}
                  >
                    <i className="ph ph-pencil-simple" />
                  </Button>
                  <Switch
                    checked={false}
                    onCheckedChange={() => handleToggleActive(value)}
                  />
                </div>
              </a.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}