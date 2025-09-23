/**
 * StatsCards Component
 * Displays statistics cards for sent, received, and points
 */

import { animated } from '@react-spring/web'

interface StatCard {
  label: string
  value: string
  icon: string
  gradient: string
}

interface StatsCardsProps {
  stats?: StatCard[]
  trail: Array<Record<string, unknown>> // Animation trail from useAnimations
}

// Default stats (can be overridden via props)
const defaultStats: StatCard[] = [
  { label: 'Enviados', value: '12', icon: '📤', gradient: 'from-green-400 to-emerald-500' },
  { label: 'Recebidos', value: '8', icon: '📥', gradient: 'from-blue-400 to-indigo-500' },
  { label: 'Pontos', value: '420', icon: '⭐', gradient: 'from-purple-400 to-pink-500' },
]

export const StatsCards = ({ stats = defaultStats, trail }: StatsCardsProps) => {

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
      {trail.reverse().map((style, index) => {
        const stat = stats[index]
        if (!stat) return null
        
        return (
          <animated.div 
            key={index}
            style={style}
            className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-white/30 dark:border-gray-700/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-xl hover:shadow-2xl hover:scale-105"
          >
            <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-2 sm:gap-0">
              <div className="text-center sm:text-left">
                <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300">{stat.label}</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">{stat.value}</p>
              </div>
              <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r ${stat.gradient} rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg`}>
                <span className="text-lg sm:text-xl">{stat.icon}</span>
              </div>
            </div>
          </animated.div>
        )
      })}
    </div>
  )
}