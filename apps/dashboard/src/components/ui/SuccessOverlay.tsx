import { memo, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { animated } from '@react-spring/web'
import { useSuccessTransition } from '@/hooks/useAnimations'
import { LottieAnimation } from './LottieAnimation'

interface SuccessOverlayProps {
  isVisible: boolean
  title?: string
  description?: string
  coinAmount?: number
  userName?: string
  valueName?: string
  valueIcon?: string
  valueColor?: string
  onNewPraise?: () => void
  onGoHome?: () => void
}

const SuccessContent = memo(({
  title,
  description,
  coinAmount,
  userName,
  valueName,
  valueIcon,
  valueColor,
  onNewPraise,
  onGoHome,
}: Omit<SuccessOverlayProps, 'isVisible'>) => {
  const defaultDescription = userName 
    ? `${userName} receberá sua mensagem especial`
    : 'Seu reconhecimento foi enviado com sucesso!'

  return (
    <div className="flex flex-col items-center bg-white/90 dark:bg-[#262626]/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg space-y-8 py-8 max-w-xl w-full">
      {/* Animation Section - Gigantic Center */}
      <div className="w-96 h-96 flex items-center justify-center">
        <div className="relative w-full h-full">
          {/* Light Effect Animation - Background */}
          <div className="absolute inset-0 z-10">
            <LottieAnimation
              path="/animations/confetti.json"
              loop={true}
              autoplay={true}
              speed={1}
              scale={1}
              className="w-full h-full"
            />
          </div>
          
          {/* Like Animation - Center, Gigantic */}
          <div className="absolute inset-0 z-20 flex items-center justify-center">
            <LottieAnimation
              path="/animations/like.json"
              loop={true}
              autoplay={true}
              speed={0.4}
              scale={2.6}
              className="w-80 h-80"
            />
          </div>
        </div>
      </div>
      
      {/* Text Content - Sequential */}
      <div className="text-center space-y-4">
        <h3 className="text-3xl font-bold text-[#171717] dark:text-[#f5f5f5]">
          {title}
        </h3>
        
        <p className="text-lg text-[#525252] dark:text-[#d4d4d4] max-w-md">
          {description ?? defaultDescription}
        </p>
        
        {/* Value Badge */}
        {valueName && valueIcon && valueColor && (
          <div>
            <div className={`inline-flex items-center px-4 py-2 bg-gradient-to-r ${valueColor} rounded-full shadow-lg`}>
              <span className="text-white text-sm font-semibold mr-2">{valueIcon}</span>
              <span className="text-white text-sm font-semibold">{valueName}</span>
            </div>
          </div>
        )}
        
        {/* Coin Amount */}
        {coinAmount && (
          <div className="inline-flex items-center justify-center space-x-2 bg-green-100 dark:bg-green-900/30 px-6 py-3 rounded-full">
            <i className="ph-fill ph-coins text-green-600 dark:text-green-400 text-2xl"></i>
            <span className="text-green-700 dark:text-green-300 text-xl font-bold">+{coinAmount} moedas</span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 w-full max-w-md">
        <button
          onClick={onNewPraise}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 shadow-lg"
        >
          <i className="ph ph-plus-circle" />
          Novo Elogio
        </button>
        <button
          onClick={onGoHome}
          className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 shadow-lg"
        >
          <i className="ph ph-house" />
          Página Inicial
        </button>
      </div>
    </div>
  )
})

SuccessContent.displayName = 'SuccessContent'

export const SuccessOverlay = memo(({
  isVisible,
  title = 'Elogio Enviado!',
  description,
  coinAmount,
  userName,
  valueName,
  valueIcon,
  valueColor,
  onNewPraise,
  onGoHome,
}: SuccessOverlayProps) => {
  const transition = useSuccessTransition(isVisible)

  const contentProps = useMemo(() => ({
    title,
    description,
    coinAmount,
    userName,
    valueName,
    valueIcon,
    valueColor,
    onNewPraise,
    onGoHome,
  }), [title, description, coinAmount, userName, valueName, valueIcon, valueColor, onNewPraise, onGoHome])

  return (
    <>
      {transition((style, item) =>
        item ? createPortal(
          <animated.div
            style={style}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <SuccessContent {...contentProps} />
          </animated.div>,
          document.body,
        ) : null,
      )}
    </>
  )
})

SuccessOverlay.displayName = 'SuccessOverlay'