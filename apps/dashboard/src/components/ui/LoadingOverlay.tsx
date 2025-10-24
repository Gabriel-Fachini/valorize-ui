import { LottieAnimation } from './LottieAnimation'

interface LoadingOverlayProps {
  message?: string
  className?: string
}

export const LoadingOverlay = ({ 
  className = '',
}: LoadingOverlayProps) => {
  return (
    <div className={`absolute inset-0 z-50 flex items-center justify-center bg-white dark:bg-[#1a1a1a] backdrop-blur-sm ${className}`}>
      <div className="flex flex-col items-center space-y-4">
        <div className="w-64 h-64">
          <LottieAnimation 
            path="/animations/loading.json"
            loop={true}
            autoplay={true}
          />
        </div>
      </div>
    </div>
  )
}
