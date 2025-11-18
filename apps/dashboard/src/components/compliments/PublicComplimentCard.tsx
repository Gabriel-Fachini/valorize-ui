import { animated } from '@react-spring/web'
import { useState } from 'react'
import type { ComplimentFeedItem } from '@/types'

interface PublicComplimentCardProps {
  item: ComplimentFeedItem
  style?: React.CSSProperties
}

export const PublicComplimentCard = ({ item, style = {} }: PublicComplimentCardProps) => {
  const [showFullMessage, setShowFullMessage] = useState(false)

  const truncateMessage = (message: string, maxLength = 120) => {
    if (message.length <= maxLength) return message
    return message.substring(0, maxLength) + '...'
  }

  const shouldTruncate = item.message.length > 120

  return (
    <animated.div
      style={style}
      className="bg-white/70 dark:bg-[#2a2a2a]/80 backdrop-blur-xl border border-white/30 dark:border-neutral-700/30 rounded-2xl p-4 shadow-lg"
    >
      <div className="space-y-3">
        {/* Avatars Section - Top */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Sender Avatar */}
            {item.sender.avatar ? (
              <img
                src={item.sender.avatar}
                alt={item.sender.name}
                className="w-10 h-10 rounded-full object-cover shadow-md ring-2 ring-white/50 dark:ring-neutral-700/50"
              />
            ) : (
              <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center shadow-md ring-2 ring-white/50 dark:ring-neutral-700/50">
                <span className="text-white font-semibold text-sm">
                  {item.sender.name.charAt(0)}
                </span>
              </div>
            )}

            {/* Arrow Icon */}
            <i className="ph-bold ph-arrow-right text-primary-600 dark:text-primary-400 text-lg" />

            {/* Receiver Avatar */}
            {item.receiver.avatar ? (
              <img
                src={item.receiver.avatar}
                alt={item.receiver.name}
                className="w-10 h-10 rounded-full object-cover shadow-md ring-2 ring-white/50 dark:ring-neutral-700/50"
              />
            ) : (
              <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center shadow-md ring-2 ring-white/50 dark:ring-neutral-700/50">
                <span className="text-white font-semibold text-sm">
                  {item.receiver.name.charAt(0)}
                </span>
              </div>
            )}
          </div>

          {/* Time */}
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {item.timeAgo}
          </span>
        </div>

        {/* Names and Departments */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
            {item.sender.name}
          </span>
          {item.sender.department && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              ({item.sender.department})
            </span>
          )}
          <span className="text-gray-500 dark:text-gray-400">→</span>
          <span className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
            {item.receiver.name}
          </span>
          {item.receiver.department && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              ({item.receiver.department})
            </span>
          )}
        </div>

        {/* Message */}
        <div>
          <p className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed">
            {showFullMessage || !shouldTruncate
              ? item.message
              : truncateMessage(item.message)}
            {shouldTruncate && (
              <button
                onClick={() => setShowFullMessage(!showFullMessage)}
                className="ml-1 text-primary-600 dark:text-primary-400 hover:underline font-medium text-xs"
              >
                {showFullMessage ? 'ver menos' : 'ver mais'}
              </button>
            )}
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Value Badge */}
          <div
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full shadow-sm"
            style={{
              backgroundColor: item.companyValue.iconColor || '#3B82F6',
            }}
          >
            {item.companyValue.iconName && (
              <i
                className={`ph-duotone ph-${item.companyValue.iconName} text-white text-sm`}
              />
            )}
            <span className="text-white text-xs font-semibold">
              {item.companyValue.title}
            </span>
          </div>

          {/* Coins Badge */}
          <div className="inline-flex items-center gap-1 bg-gradient-to-r from-primary-600 to-primary-700 px-3 py-1.5 rounded-full shadow-sm">
            <i className="ph-bold ph-coins text-white text-sm" />
            <span className="text-white font-bold text-xs">
              +{item.coins}
            </span>
          </div>
        </div>
      </div>
    </animated.div>
  )
}
