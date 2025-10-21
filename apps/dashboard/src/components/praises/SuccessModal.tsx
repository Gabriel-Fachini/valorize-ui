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
            <div className="bg-white/95 dark:bg-[#2a2a2a]/95 backdrop-blur-xl border border-white/30 dark:border-neutral-700/30 rounded-3xl p-8 max-w-md w-full shadow-2xl text-center">
              <div className="w-20 h-20 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-primary-500/30">
                <i className="ph-bold ph-confetti text-white text-4xl"></i>
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
              
              <div className="flex items-center justify-center space-x-2 text-primary-600 dark:text-primary-400">
                <i className="ph-bold ph-coins text-2xl"></i>
                <span className="font-bold text-lg">+{coins} moedas enviadas</span>
              </div>
            </div>
          </animated.div>
        ) : null,
      )}
    </>
  )
}