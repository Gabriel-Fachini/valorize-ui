import { memo, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { animated } from '@react-spring/web'
import { useSuccessTransition } from '@/hooks/useAnimations'
import { LottieAnimation } from './LottieAnimation'
import type { PrizeType } from '@/types/prize.types'

interface RedemptionSuccessOverlayProps {
  isVisible: boolean
  title?: string
  description?: string
  prizeName?: string
  prizeImage?: string
  prizeType?: PrizeType
  onGoToPrizes?: () => void
  onGoToRedemptions?: () => void
}

const RedemptionSuccessContent = memo(({
  title,
  description,
  prizeName,
  onGoToPrizes,
  onGoToRedemptions,
}: Omit<RedemptionSuccessOverlayProps, 'isVisible' | 'prizeImage'>) => {
  const defaultDescription = 'Seu prêmio foi resgatado com sucesso. Acompanhe o status na página de resgates.'

  return (
    <div className="flex flex-col items-center bg-white/90 dark:bg-[#262626]/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg space-y-8 py-8 max-w-xl w-full">
      {/* Animation Section - 8x Larger Gift */}
      <div className="w-[312px] h-[312px] flex items-center justify-center relative">
        {/* Confetti Animation - Full Background Coverage */}
        <div className="absolute inset-0 z-10">
          <LottieAnimation
            path="/animations/confetti.json"
            loop={true}
            autoplay={true}
            speed={1}
            scale={1.4}
            className="w-full h-full"
          />
        </div>
        
        {/* Gift Animation - 8x Larger (768px = 96px base * 8) */}
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <LottieAnimation
            path="/animations/gift.json"
            loop={true}
            autoplay={true}
            speed={1}
            scale={1}
            className="w-full h-full"
          />
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
        
        {/* Prize Badge */}
        {prizeName && (
          <div>
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 rounded-full shadow-lg">
              <span className="text-white text-sm font-semibold mr-2">🎁</span>
              <span className="text-white text-sm font-semibold">{prizeName}</span>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 w-full max-w-md">
        <button
          onClick={onGoToPrizes}
          className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 shadow-lg"
        >
          <i className="ph ph-storefront" />
          Voltar para a Loja
        </button>
        <button
          onClick={onGoToRedemptions}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 shadow-lg"
        >
          <i className="ph-bold ph-package" />
          Ver Resgates
        </button>
      </div>
    </div>
  )
})

RedemptionSuccessContent.displayName = 'RedemptionSuccessContent'

export const RedemptionSuccessOverlay = memo(({
  isVisible,
  title = 'Prêmio Resgatado!',
  description,
  prizeName,
  prizeImage,
  prizeType: _prizeType, // Available for future use
  onGoToPrizes,
  onGoToRedemptions,
}: RedemptionSuccessOverlayProps) => {
  const transition = useSuccessTransition(isVisible)

  const contentProps = useMemo(() => ({
    title,
    description,
    prizeName,
    prizeImage,
    onGoToPrizes,
    onGoToRedemptions,
  }), [title, description, prizeName, prizeImage, onGoToPrizes, onGoToRedemptions])

  return (
    <>
      {transition((style, item) =>
        item ? createPortal(
          <animated.div
            style={style as any}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <RedemptionSuccessContent {...contentProps} />
          </animated.div>,
          document.body,
        ) : null,
      )}
    </>
  )
})

RedemptionSuccessOverlay.displayName = 'RedemptionSuccessOverlay'
