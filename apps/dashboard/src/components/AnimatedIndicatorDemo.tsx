import { useState } from 'react'
import { useSpring, animated } from '@react-spring/web'

const ITEMS = [
  { id: 1, label: 'Item 1', emoji: '🎯' },
  { id: 2, label: 'Item 2', emoji: '🚀' },
  { id: 3, label: 'Item 3', emoji: '⭐' },
]

const ITEM_HEIGHT = 60
const ITEM_GAP = 12

export const AnimatedIndicatorDemo = () => {
  const [activeIndex, setActiveIndex] = useState(0)

  const indicatorStyle = useSpring({
    transform: `translateY(${activeIndex * (ITEM_HEIGHT + ITEM_GAP)}px)`,
    config: { tension: 280, friction: 20 },
  })

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">
          Indicador Animado Demo
        </h2>
        
        <div className="relative space-y-3">
          {/* Indicador animado */}
          <animated.div
            style={indicatorStyle}
            className="absolute left-0 right-0 h-[60px] bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-500/20 dark:to-blue-500/20 rounded-xl border-2 border-purple-300 dark:border-purple-500"
            aria-hidden="true"
          />

          {/* Lista de itens */}
          {ITEMS.map((item, index) => (
            <button
              key={item.id}
              onClick={() => setActiveIndex(index)}
              className={`relative z-10 w-full h-[60px] flex items-center gap-4 px-6 rounded-xl font-medium transition-colors ${
                activeIndex === index
                  ? 'text-purple-600 dark:text-purple-400'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <span className="text-3xl">{item.emoji}</span>
              <span className="text-lg">{item.label}</span>
              {activeIndex === index && (
                <span className="ml-auto text-sm text-purple-500 dark:text-purple-400">
                  ✓ Ativo
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Info de debug */}
        <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            <strong>Índice ativo:</strong> {activeIndex}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            <strong>Posição Y:</strong> {activeIndex * (ITEM_HEIGHT + ITEM_GAP)}px
          </p>
        </div>
      </div>
    </div>
  )
}

