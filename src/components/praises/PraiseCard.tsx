/**
 * PraiseCard Component
 * Individual praise card display
 */

import { animated } from '@react-spring/web'
import type { PraiseData } from '@/hooks/usePraisesData'

interface PraiseCardProps {
  praise: PraiseData
  valueColor?: string
  style?: React.CSSProperties
  onLike?: (praiseId: string) => void
}

// Default value colors mapping
const defaultValueColors = {
  'Excelência': 'from-purple-500 to-indigo-600',
  'Colaboração': 'from-green-500 to-emerald-600',
  'Inovação': 'from-blue-500 to-cyan-600',
  'Liderança': 'from-orange-500 to-red-600',
  'Dedicação': 'from-pink-500 to-rose-600',
} as const

export const PraiseCard = ({ 
  praise, 
  valueColor, 
  style = {},
  onLike,
}: PraiseCardProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getValueColor = () => {
    if (valueColor) return valueColor
    return defaultValueColors[praise.value as keyof typeof defaultValueColors] ?? 'from-purple-500 to-indigo-600'
  }

  const handleLike = () => {
    if (onLike) {
      onLike(praise.id)
    }
  }

  return (
    <animated.div
      style={style}
      className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-white/30 dark:border-gray-700/30 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl hover:shadow-2xl duration-300 group"
    >
      <div className="flex items-start space-x-3 sm:space-x-4">
        {/* Avatar From */}
        <div className="flex-shrink-0">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-white font-semibold text-sm sm:text-lg">
              {praise.from.name.charAt(0)}
            </span>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2 sm:gap-0">
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-gray-900 dark:text-gray-100 text-sm sm:text-base">
                {praise.from.name}
              </span>
              <span className="text-gray-500 dark:text-gray-400">→</span>
              <span className="font-semibold text-gray-900 dark:text-gray-100 text-sm sm:text-base">
                {praise.to.name}
              </span>
            </div>
            <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              {formatDate(praise.createdAt)}
            </span>
          </div>

          {/* Message */}
          <p className="text-sm sm:text-base text-gray-700 dark:text-gray-200 mb-4 leading-relaxed">
            {praise.message}
          </p>

          {/* Footer */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
            <div className={`inline-flex items-center px-3 py-1.5 bg-gradient-to-r ${getValueColor()} rounded-full shadow-lg`}>
              <span className="text-white text-sm font-semibold">
                {praise.value}
              </span>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="flex items-center space-x-1 bg-yellow-100 dark:bg-yellow-900/30 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full">
                <span className="text-yellow-600 dark:text-yellow-400 text-xs sm:text-sm">💰</span>
                <span className="text-yellow-700 dark:text-yellow-300 font-semibold text-xs sm:text-sm">
                  +{praise.coins}
                </span>
              </div>
              
              {onLike && (
                <button 
                  onClick={handleLike}
                  className="p-1.5 sm:p-2 rounded-full bg-gray-100/80 dark:bg-gray-700/80 hover:bg-gray-200/80 dark:hover:bg-gray-600/80 transition-colors"
                >
                  <span className="text-red-500 text-sm sm:text-base">❤️</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </animated.div>
  )
}