import { memo, useMemo } from 'react'
import { animated } from '@react-spring/web'
import { useSuccessTransition } from '@/hooks/useAnimations'

interface SuccessOverlayProps {
  isVisible: boolean
  title?: string
  description?: string
  icon?: string
  coinAmount?: number
  userName?: string
  valueName?: string
  valueIcon?: string
  valueColor?: string
}

const SuccessContent = memo(({
  title,
  description,
  icon,
  coinAmount,
  userName,
  valueName,
  valueIcon,
  valueColor,
}: Omit<SuccessOverlayProps, 'isVisible'>) => {
  const defaultDescription = userName 
    ? `${userName} receberá sua mensagem especial`
    : 'Seu reconhecimento foi enviado com sucesso!'

  return (
    <div className="bg-white dark:bg-[#262626] rounded-3xl p-12 max-w-lg shadow-2xl text-center">
      <div className="w-28 h-28 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
        <i className={`${icon} text-white text-7xl`}></i>
      </div>
      
      <h3 className="text-3xl font-bold text-[#171717] dark:text-[#f5f5f5] mb-4">
        {title}
      </h3>
      
      <p className="text-lg text-[#525252] dark:text-[#d4d4d4] mb-4">
        {description ?? defaultDescription}
      </p>
      
      {/* Value Badge */}
      {valueName && valueIcon && valueColor && (
        <div className="mb-4">
          <div className={`inline-flex items-center px-4 py-2 bg-gradient-to-r ${valueColor} rounded-full shadow-lg`}>
            <span className="text-white text-sm font-semibold mr-2">{valueIcon}</span>
            <span className="text-white text-sm font-semibold">{valueName}</span>
          </div>
        </div>
      )}
      
      {/* Coin Amount */}
      {coinAmount && (
        <div className="flex items-center justify-center space-x-2 bg-green-100 dark:bg-green-900/30 px-6 py-3 rounded-full inline-flex">
          <i className="ph-fill ph-coins text-green-600 dark:text-green-400 text-2xl"></i>
          <span className="text-green-700 dark:text-green-300 text-xl font-bold">+{coinAmount} moedas</span>
        </div>
      )}
    </div>
  )
})

SuccessContent.displayName = 'SuccessContent'

export const SuccessOverlay = memo(({
  isVisible,
  title = 'Elogio Enviado!',
  description,
  icon = 'ph-bold ph-check',
  coinAmount,
  userName,
  valueName,
  valueIcon,
  valueColor,
}: SuccessOverlayProps) => {
  const transition = useSuccessTransition(isVisible)

  const contentProps = useMemo(() => ({
    title,
    description,
    icon,
    coinAmount,
    userName,
    valueName,
    valueIcon,
    valueColor,
  }), [title, description, icon, coinAmount, userName, valueName, valueIcon, valueColor])

  return (
    <>
      {transition((style, item) =>
        item ? (
          <animated.div
            style={style}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
          >
            <SuccessContent {...contentProps} />
          </animated.div>
        ) : null,
      )}
    </>
  )
})

SuccessOverlay.displayName = 'SuccessOverlay'