interface LoadingOverlayProps {
  message?: string
  className?: string
}

export const LoadingOverlay = ({ 
  message = 'Carregando...', 
  className = '',
}: LoadingOverlayProps) => {
  return (
    <div className={`absolute inset-0 z-50 flex items-center justify-center bg-white dark:bg-[#1a1a1a] backdrop-blur-sm ${className}`}>
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full animate-pulse shadow-lg shadow-green-500/50"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-white font-bold text-3xl">V</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-3 h-3 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-3 h-3 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
        <p className="text-gray-600 dark:text-gray-300 font-medium">{message}</p>
      </div>
    </div>
  )
}
