/**
 * Confirmation Step Component
 * Step 4: Preview do elogio antes de enviar
 */

import { animated, useSpring } from '@react-spring/web'
import type { ConfirmationStepProps } from '@/types/praise.types'

export const ConfirmationStep = ({
  formData,
  selectedUser,
  selectedValue,
}: ConfirmationStepProps) => {
  const previewAnimation = useSpring({
    from: { opacity: 0, transform: 'scale(0.95)' },
    to: { opacity: 1, transform: 'scale(1)' },
    config: { tension: 300, friction: 30 },
  })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#171717] dark:text-[#f5f5f5] mb-2">
          Confirme seu elogio
        </h2>
        <p className="text-[#525252] dark:text-[#a3a3a3]">
          Revise as informações antes de enviar
        </p>
      </div>
      
      {/* Preview Card */}
      <animated.div style={previewAnimation} className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-200 dark:border-green-700/50 rounded-2xl p-8 max-w-3xl mx-auto">
        <div className="flex items-start space-x-6">
          <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
            <i className="ph-bold ph-user text-white text-3xl"></i>
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-3">
              <span className="font-bold text-[#171717] dark:text-[#f5f5f5]">Para:</span>
              <span className="text-lg text-[#404040] dark:text-[#e5e5e5]">{selectedUser?.name}</span>
            </div>
            <p className="text-[#404040] dark:text-[#e5e5e5] mb-4 text-lg leading-relaxed">{formData.message}</p>
            <div className="flex items-center justify-between flex-wrap gap-4">
              {selectedValue && (
                <div className={`inline-flex items-center px-4 py-2 bg-gradient-to-r ${selectedValue.color} rounded-full shadow-lg`}>
                  <span className="text-white font-bold flex items-center space-x-2">
                    <span className="text-xl">{selectedValue.icon}</span>
                    <span>{selectedValue.name}</span>
                  </span>
                </div>
              )}
              <div className="flex items-center space-x-2 bg-green-100 dark:bg-green-900/30 px-4 py-2 rounded-full">
                <i className="ph-fill ph-coins text-green-600 dark:text-green-400 text-xl"></i>
                <span className="text-green-700 dark:text-green-300 font-bold text-lg">
                  +{formData.coins}
                </span>
              </div>
            </div>
          </div>
        </div>
      </animated.div>
    </div>
  )
}
