/**
 * Coin Selection Step Component
 * Step 2: Seleção de quantidade de moedas
 */

import { animated, useSpring } from '@react-spring/web'
import type { StepComponentProps } from '@/types/praise.types'

interface CoinSelectionStepProps extends StepComponentProps {
  coinAmount: number
  onCoinChange: (amount: number) => void
}

export const CoinSelectionStep = ({
  coinAmount,
  onCoinChange,
}: CoinSelectionStepProps) => {
  const coinAnimation = useSpring({
    from: { scale: 0.8, opacity: 0 },
    to: { scale: 1, opacity: 1 },
    config: { tension: 300, friction: 30 },
  })

  const sliderAnimation = useSpring({
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0px)' },
    config: { tension: 280, friction: 60 },
  })

  const quickSelectAnimation = useSpring({
    from: { opacity: 0, transform: 'translateY(10px)' },
    to: { opacity: 1, transform: 'translateY(0px)' },
    config: { tension: 300, friction: 30 },
    delay: 200,
  })

  const quickSelectAmounts = [10, 25, 50, 75, 100]

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-[#171717] dark:text-[#f5f5f5] mb-2">
          Quantas moedas você quer enviar?
        </h2>
        <p className="text-[#525252] dark:text-[#a3a3a3]">
          Quanto maior o valor, maior o reconhecimento
        </p>
      </div>
      
      <div className="text-center py-8">
        <animated.div style={coinAnimation} className="w-32 h-32 bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
          <i className="ph-fill ph-coins text-white text-7xl"></i>
        </animated.div>
        <div className="text-7xl font-bold text-[#171717] dark:text-[#f5f5f5] mb-2">
          {coinAmount}
        </div>
        <p className="text-xl text-[#525252] dark:text-[#a3a3a3]">moedas</p>
      </div>

      {/* Coin Slider */}
      <animated.div style={sliderAnimation} className="space-y-6 max-w-2xl mx-auto">
        <input
          type="range"
          min="5"
          max="100"
          step="5"
          value={coinAmount}
          onChange={(e) => onCoinChange(Number(e.target.value))}
          className="w-full h-4 bg-[#e5e5e5] dark:bg-[#404040] rounded-lg appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, rgb(5 150 105) 0%, rgb(16 185 129) ${((coinAmount - 5) / 95) * 100}%, rgb(226 232 240) ${((coinAmount - 5) / 95) * 100}%, rgb(226 232 240) 100%)`,
          }}
        />
        
        {/* Quick Select Buttons */}
        <animated.div style={quickSelectAnimation} className="flex flex-wrap justify-center gap-3">
          {quickSelectAmounts.map((amount) => (
            <button
              key={amount}
              onClick={() => onCoinChange(amount)}
              className={`px-6 py-3 rounded-xl font-bold text-lg transition-all ${
                coinAmount === amount
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg scale-110'
                  : 'bg-[#f5f5f5] dark:bg-[#404040] text-[#404040] dark:text-[#d4d4d4] hover:bg-[#e5e5e5] dark:hover:bg-[#525252]'
              }`}
            >
              {amount}
            </button>
          ))}
        </animated.div>
      </animated.div>
    </div>
  )
}
