import { animated } from '@react-spring/web'
import type { PraiseData } from '@/hooks/usePraisesData'

interface PraiseCardProps {
  praise: PraiseData
  valueColor?: string
  style?: React.CSSProperties
}

// Default value colors mapping - Verde como principal
const defaultValueColors = {
  'Excelência': 'from-primary-500 to-primary-600',
  'Colaboração': 'from-primary-400 to-primary-600',
  'Inovação': 'from-primary-500 to-primary-700',
  'Liderança': 'from-primary-600 to-primary-700',
  'Dedicação': 'from-primary-500 to-primary-600',
} as const

export const PraiseCard = ({ 
  praise, 
  valueColor, 
  style = {},
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
    return defaultValueColors[praise.value as keyof typeof defaultValueColors] ?? 'from-primary-500 to-primary-600'
  }

  return (
    <animated.div
      style={style}
      className="bg-white/70 dark:bg-[#2a2a2a]/80 backdrop-blur-xl border border-white/30 dark:border-neutral-700/30 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl hover:shadow-2xl group transition-all duration-200"
    >
      <div className="flex items-start space-x-3 sm:space-x-4">
        {/* Avatar From */}
        <div className="flex-shrink-0">
          {praise.from.avatar ? (
            <img 
              src={praise.from.avatar} 
              alt={praise.from.name}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover shadow-lg ring-2 ring-white/50 dark:ring-neutral-700/50"
            />
          ) : (
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary-600 rounded-full flex items-center justify-center shadow-lg ring-2 ring-white/50 dark:ring-neutral-700/50">
              <span className="text-white font-semibold text-sm sm:text-lg">
                {praise.from.name.charAt(0)}
              </span>
            </div>
          )}
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
            <div className={`inline-flex items-center px-4 py-2 bg-gradient-to-r ${getValueColor()} rounded-full shadow-lg`}>
              <span className="text-white text-sm sm:text-base font-bold drop-shadow-md">
                {praise.value}
              </span>
            </div>
            
            <div className="flex items-center space-x-1.5 bg-gradient-to-r from-primary-600 to-primary-700 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-lg">
              <i className="ph-bold ph-coins text-white text-sm sm:text-base drop-shadow-md"></i>
              <span className="text-white font-bold text-sm sm:text-base drop-shadow-md">
                +{praise.coins}
              </span>
            </div>
          </div>
        </div>
      </div>
    </animated.div>
  )
}