import { LottieAnimation } from './LottieAnimation'

interface RedemptionSuccessAnimationProps {
  className?: string
}

export const RedemptionSuccessAnimation = ({ className = '' }: RedemptionSuccessAnimationProps) => {
  return (
    <div className={`relative w-full h-full ${className}`}>
      {/* Confetti Animation - Background */}
      <div className="absolute inset-0 z-10">
        <LottieAnimation
          path="/animations/confetti.json"
          loop={true}
          autoplay={true}
          speed={0.4}
          scale={1.2}
          className="w-full h-full"
        />
      </div>
      
      {/* Gift Animation - Center, Gigantic */}
      <div className="absolute inset-0 z-20 flex items-center justify-center">
        <LottieAnimation
          path="/animations/gift.json"
          loop={true}
          autoplay={true}
          speed={0.4}
          scale={1.2}
          className="w-80 h-80"
        />
      </div>
    </div>
  )
}
