import { type FC, useState, useEffect, useMemo, useRef } from 'react'
import { companyValuesService } from '@/services/companyValues'
import type { CompanyValue } from '@/types/companyValues'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ValueForm } from './ValueForm'
import { useSprings, useTransition, a } from '@react-spring/web'
import { useDrag } from '@use-gesture/react'
import { move, clamp } from '@/lib/utils'
import { SkeletonText, SkeletonBase } from '@/components/ui/Skeleton'

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
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false)
  const [valueToDelete, setValueToDelete] = useState<CompanyValue | null>(null)
  const CARD_HEIGHT = 96
  const GAP = 20
  const ITEM_HEIGHT = CARD_HEIGHT + GAP

  const activeValues = useMemo(() => values.filter(v => v.is_active), [values])
  const inactiveValues = useMemo(() => values.filter(v => !v.is_active), [values])

  // Inicializar order - mesma abordagem do TestTab
  const order = useRef<number[]>([])
  const prevActiveValuesIds = useRef<number[]>([])

  useEffect(() => {
    loadValues()
  }, [])

  const loadValues = async () => {
    setIsLoading(true)
    setError(undefined)
    try {
      const data = await companyValuesService.list()
      const sorted = [...data].sort((a, b) => {
        const aOrder = a.order ?? a.position ?? 0
        const bOrder = b.order ?? b.position ?? 0
        if (aOrder === bOrder) return 0
        return aOrder < bOrder ? -1 : 1
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

  const handleDeleteClick = (value: CompanyValue) => {
    setValueToDelete(value)
    setIsConfirmationModalOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!valueToDelete) return

    try {
      await companyValuesService.delete(valueToDelete.id)
      setIsConfirmationModalOpen(false)
      setValueToDelete(null)
      loadValues()
    } catch (err) {
      console.error('Error deleting value:', err)
      setError('Erro ao deletar valor. Tente novamente.')
      setIsConfirmationModalOpen(false)
      setValueToDelete(null)
    }
  }

  const handleDeleteCancel = () => {
    setIsConfirmationModalOpen(false)
    setValueToDelete(null)
  }

  const handleReactivate = async (value: CompanyValue) => {
    try {
      await companyValuesService.update(value.id, { is_active: true })
      loadValues()
    } catch (err) {
      console.error('Error reactivating value:', err)
      setError('Erro ao reativar valor. Tente novamente.')
    }
  }

  const handleReorder = async (orderedIds: number[]) => {
    try {
      // Update otimista: atualiza o estado local primeiro
      setValues((prev) => {
        const byId = new Map(prev.map((v) => [v.id, v]))
        const activeReordered = orderedIds
          .map((id) => byId.get(id)!)
          .filter((v) => v !== undefined)
          .map((v, idx) => ({ ...v, order: idx, position: idx }))
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
    const currentIds = activeValues.map(v => v.id.toString()).join(',')
    const prevIds = prevActiveValuesIds.current.map(id => id.toString()).join(',')

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
    const newOrder = move(order.current, curIndex, curRow)

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
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center gap-2">
                <i className="ph ph-sparkle text-xl" />
                Valores da Empresa
              </CardTitle>
              <CardDescription>
                Gerencie os valores que serão usados nos elogios.
              </CardDescription>
            </div>
            <Button onClick={() => { setSelectedValue(null); setIsFormOpen(true) }}>
              <i className="ph ph-plus mr-2" />
              Adicionar Valor
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {isLoading && (
            <div className="space-y-6">
              {/* Valores Ativos Skeleton */}
              <div>
                <SkeletonText width="lg" height="md" className="mb-4" />
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="p-4 border rounded-lg flex justify-between items-center bg-white dark:bg-gray-800"
                      style={{ height: 96 }}
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <SkeletonBase>
                          <div className="h-6 w-6 bg-neutral-300 dark:bg-neutral-600 rounded" />
                        </SkeletonBase>
                        <div className="flex-1 space-y-2">
                          <SkeletonText width="xl" height="sm" />
                          <SkeletonText width="lg" height="sm" />
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <SkeletonBase>
                          <div className="h-8 w-8 bg-neutral-300 dark:bg-neutral-600 rounded" />
                        </SkeletonBase>
                        <SkeletonBase>
                          <div className="h-8 w-8 bg-neutral-300 dark:bg-neutral-600 rounded" />
                        </SkeletonBase>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 flex items-center gap-2">
              <i className="ph ph-warning text-xl" />
              <span>{error}</span>
            </div>
          )}

          {!isLoading && values.length === 0 && !error && (
            <div className="rounded-lg border p-6 text-center text-muted-foreground">
              <p className="mb-2">Nenhum valor cadastrado ainda</p>
              <p className="text-sm">Clique em "Adicionar Valor" para criar o primeiro</p>
            </div>
          )}

          {!isLoading && activeValues.length > 0 && (
            <div>
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
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedValue(value)
                              setIsFormOpen(true)
                            }}
                            className="h-10 w-10 border-2"
                            title="Editar valor"
                          >
                            <i className="ph ph-pencil-simple text-lg" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteClick(value)
                            }}
                            className="h-10 w-10 border-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-300 hover:border-red-400"
                            title="Desativar valor"
                          >
                            <i className="ph ph-eye-slash text-lg" />
                          </Button>
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
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          setSelectedValue(value)
                          setIsFormOpen(true)
                        }}
                        className="h-10 w-10 border-2"
                        title="Editar valor"
                      >
                        <i className="ph ph-pencil-simple text-lg" />
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleReactivate(value)}
                        className="text-green-600 hover:text-green-700 hover:bg-green-50 border-2 border-green-300 hover:border-green-400"
                      >
                        <i className="ph ph-arrow-counter-clockwise mr-2" />
                        Reativar
                      </Button>
                    </div>
                  </a.div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <ValueForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        value={selectedValue}
        onSave={handleSave}
        onCancel={() => { setIsFormOpen(false); setSelectedValue(null) }}
      />

      <Dialog
        open={isConfirmationModalOpen}
        onOpenChange={(open) => {
          if (!open) {
            handleDeleteCancel()
          }
        }}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <div className="flex flex-col items-center justify-center text-orange-500 dark:text-orange-400 mb-2">
              <i className="ph ph-warning text-5xl" />
            </div>
            <DialogTitle className="text-center text-xl font-bold text-foreground">
              Desativar Valor
            </DialogTitle>
            <DialogDescription className="text-center text-foreground">
              Tem certeza que deseja desativar o valor{' '}
              <strong className="font-semibold text-foreground">
                "{valueToDelete?.title}"
              </strong>?
              <br />
              <br />
              <span className="text-muted-foreground">
                Este valor não será mais exibido nos elogios, mas poderá ser reativado posteriormente.
              </span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row sm:justify-center gap-2">
            <Button onClick={handleDeleteCancel} variant="outline">
              Cancelar
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Desativar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}