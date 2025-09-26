/**
 * SuccessModal Component
 * Success animation modal for when a praise is sent
 */

import { animated } from '@react-spring/web'
import type { PraiseUser, PraiseCompanyValue } from '@/hooks/usePraisesData'

interface SuccessModalProps {
  user?: PraiseUser
  value?: PraiseCompanyValue
  coins?: number
  transition: (fn: (style: Record<string, unknown>, item: boolean) => React.ReactNode) => React.ReactNode
}

export const SuccessModal = ({ 
  user, 
  value, 
  coins,
  transition,
}: SuccessModalProps) => {
  return (
    <>
      {transition((style: Record<string, unknown>, item: boolean) =>
        item ? (
          <animated.div
            style={style}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm"
          >
            <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border border-white/30 dark:border-gray-700/30 rounded-3xl p-8 max-w-md w-full shadow-2xl text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                <span className="text-white text-4xl">🎉</span>
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Elogio Enviado!
              </h3>
              
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Seu reconhecimento foi enviado para <strong>{user?.name}</strong> com sucesso!
              </p>
              
              {value && (
                <div className="mb-4">
                  <div className={`inline-flex items-center px-4 py-2 bg-gradient-to-r ${value.color} rounded-full shadow-lg mb-2`}>
                    <span className="text-white text-sm font-semibold mr-2">{value.icon}</span>
                    <span className="text-white text-sm font-semibold">{value.name}</span>
                  </div>
                </div>
              )}
              
              <div className="flex items-center justify-center space-x-2 text-yellow-600 dark:text-yellow-400">
                <span className="text-2xl">💰</span>
                <span className="font-bold text-lg">+{coins} moedas enviadas</span>
              </div>
            </div>
          </animated.div>
        ) : null,
      )}
    </>
  )
}