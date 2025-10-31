import { type FC, useRef, useState } from 'react'
import { useSprings, animated } from '@react-spring/web'
import { useDrag } from 'react-use-gesture'
import clamp from 'lodash.clamp'
import swap from 'lodash-move'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'

const fn = (order: number[], active = false, originalIndex = 0, curIndex = 0, y = 0) => (index: number) =>
  active && index === originalIndex
    ? {
        y: curIndex * 80 + y,
        scale: 1.02,
        zIndex: 1,
        shadow: 15,
        immediate: (key: string) => key === 'y' || key === 'zIndex',
      }
    : {
        y: order.indexOf(index) * 80,
        scale: 1,
        zIndex: 0,
        shadow: 1,
        immediate: false,
      }

interface ListItem {
  icon: string
  title: string
  description: string
  enabled: boolean
}

interface DraggableListProps {
  items: ListItem[]
}

const DraggableList: FC<DraggableListProps> = ({ items }) => {
  const order = useRef(items.map((_, index) => index))
  const [itemStates, setItemStates] = useState(items.map(item => item.enabled))
  const [springs, api] = useSprings(items.length, fn(order.current))

  const bind = useDrag(({ args: [originalIndex], active, movement: [, y] }) => {
    const curIndex = order.current.indexOf(originalIndex)
    const curRow = clamp(Math.round((curIndex * 80 + y) / 80), 0, items.length - 1)
    const newOrder = swap(order.current, curIndex, curRow)
    api.start(fn(newOrder, active, originalIndex, curIndex, y))
    if (!active) order.current = newOrder
  })

  const handleSwitchChange = (index: number, checked: boolean) => {
    setItemStates(prev => {
      const newStates = [...prev]
      newStates[index] = checked
      return newStates
    })
  }

  return (
    <div className="relative w-full" style={{ height: items.length * 80 }}>
      {springs.map(({ zIndex, shadow, y, scale }, i) => (
        <animated.div
          key={i}
          style={{
            zIndex,
            boxShadow: shadow.to(s => `rgba(0, 0, 0, 0.15) 0px ${s}px ${2 * s}px 0px`),
            y,
            scale,
            position: 'absolute',
            width: '100%',
            touchAction: 'none',
          }}
        >
          <div className="flex items-center gap-4 bg-card border rounded-lg p-4 cursor-grab active:cursor-grabbing">
            <div
              {...bind(i)}
              className="flex items-center gap-4 flex-1 select-none"
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                <i className={`ph ${items[i].icon} text-2xl text-primary`} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-base">{items[i].title}</h3>
                <p className="text-sm text-muted-foreground">{items[i].description}</p>
              </div>
            </div>
            <Switch
              checked={itemStates[i]}
              onCheckedChange={(checked) => handleSwitchChange(i, checked)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </animated.div>
      ))}
    </div>
  )
}

export const TestTab: FC = () => {
  const mockItems: ListItem[] = [
    {
      icon: 'ph-lightbulb',
      title: 'Innovation',
      description: 'Constantly seeking new and better ways to solve problems',
      enabled: true,
    },
    {
      icon: 'ph-users-three',
      title: 'Collaboration',
      description: 'Working together to achieve common goals',
      enabled: true,
    },
    {
      icon: 'ph-target',
      title: 'Excellence',
      description: 'Striving for the highest quality in everything we do',
      enabled: false,
    },
    {
      icon: 'ph-heart',
      title: 'Customer First',
      description: 'Putting our customers at the center of our decisions',
      enabled: true,
    },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Lista Arrastável</CardTitle>
          <CardDescription>
            Teste de componente com animações de drag & drop usando react-spring e react-use-gesture
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="min-h-[400px] bg-muted/30 rounded-lg p-6">
            <DraggableList items={mockItems} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Como funciona</CardTitle>
          <CardDescription>
            Explicação das bibliotecas e lógica do componente
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-sm mb-2">🎨 @react-spring/web</h3>
            <p className="text-sm text-muted-foreground">
              Biblioteca de animações que cria transições suaves e performáticas usando física baseada em molas.
              Anima as propriedades: posição Y, escala, z-index e sombra.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-sm mb-2">👆 react-use-gesture</h3>
            <p className="text-sm text-muted-foreground">
              Hook que detecta gestos do usuário (arrastar, pinch, scroll). Captura o movimento do mouse/touch
              e fornece as coordenadas para calcular a nova posição do item.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-sm mb-2">🔢 lodash.clamp</h3>
            <p className="text-sm text-muted-foreground">
              Função utilitária que limita um número entre valores mínimo e máximo. Garante que o item
              arrastado não saia dos limites da lista (entre 0 e comprimento-1).
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-sm mb-2">🔄 lodash-move</h3>
            <p className="text-sm text-muted-foreground">
              Move elementos de uma posição para outra em um array. Reordena a lista quando o usuário
              solta o item em uma nova posição.
            </p>
          </div>

          <div className="pt-4 border-t">
            <h3 className="font-semibold text-sm mb-2">⚡ Fluxo de funcionamento</h3>
            <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
              <li>Usuário clica e arrasta um item</li>
              <li>react-use-gesture detecta o movimento e passa as coordenadas</li>
              <li>lodash.clamp garante que a posição está dentro dos limites</li>
              <li>lodash-move reordena o array temporariamente</li>
              <li>react-spring anima a transição suavemente</li>
              <li>Ao soltar, a nova ordem é salva definitivamente</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
