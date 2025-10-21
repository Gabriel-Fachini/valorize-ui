/**
 * Value Selection Step Component
 * Step 1: Seleção de valor da empresa
 */

import { animated, useSpring } from '@react-spring/web'
import type { PraiseCompanyValue } from '@/hooks/usePraisesData'
import type { SelectionStepProps } from '@/types/praise.types'

interface ValueSelectionStepProps extends SelectionStepProps<PraiseCompanyValue> {
  selectedUserName?: string
}

export const ValueSelectionStep = ({
  selectedItem,
  onSelect,
  items,
  selectedUserName,
}: ValueSelectionStepProps) => {
  const cardAnimation = useSpring({
    from: { opacity: 0, transform: 'scale(0.95)' },
    to: { opacity: 1, transform: 'scale(1)' },
    config: { tension: 280, friction: 60 },
  })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#171717] dark:text-[#f5f5f5] mb-2">
          Qual valor {selectedUserName} demonstrou?
        </h2>
        <p className="text-[#525252] dark:text-[#a3a3a3]">
          Escolha o valor da empresa que melhor representa esta ação
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((value) => (
          <animated.div
            key={value.id}
            style={cardAnimation}
          >
            <button
              onClick={() => onSelect(value)}
              className={`w-full p-6 rounded-2xl border-2 transition-all ${
                selectedItem?.id === value.id
                  ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/20 scale-[1.02] shadow-lg shadow-pink-500/20'
                  : 'border-[#e5e5e5] dark:border-[#404040] bg-white dark:bg-[#262626] hover:border-pink-300 hover:scale-[1.01]'
              }`}
            >
              <div className={`w-16 h-16 bg-gradient-to-r ${value.color} rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                <span className="text-3xl">{value.icon}</span>
              </div>
              <h5 className="font-bold text-[#171717] dark:text-[#f5f5f5] mb-2 text-lg">{value.name}</h5>
              <p className="text-sm text-[#525252] dark:text-[#a3a3a3] text-center leading-relaxed">{value.description}</p>
            </button>
          </animated.div>
        ))}
      </div>
    </div>
  )
}
