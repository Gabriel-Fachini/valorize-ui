/**
 * PraiseHeader Component
 * Header section for the Praises page with navigation and balance
 */

import { animated } from '@react-spring/web'
import type { UserBalance } from '@/hooks/usePraisesData'

interface PraiseHeaderProps {
  userBalance: UserBalance
  isLoadingBalance: boolean
  onBack?: () => void
  style?: Record<string, unknown>
}

export const PraiseHeader = ({ 
  userBalance, 
  isLoadingBalance, 
  onBack,
  style = {},
}: PraiseHeaderProps) => {
  const handleBack = () => {
    if (onBack) {
      onBack()
    } else {
      window.history.back()
    }
  }

  return (
    <animated.div 
      style={style}
      className="sticky top-0 z-50 bg-white/40 dark:bg-gray-800/30 backdrop-blur-xl border-b border-white/20 dark:border-gray-700/30"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button 
              onClick={handleBack}
              className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-white/60 dark:bg-gray-700/60 backdrop-blur-sm border border-white/30 dark:border-gray-600/30 hover:bg-white/80 dark:hover:bg-gray-600/80 duration-200"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Elogios
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 hidden sm:block">
                Reconheça e celebre sua equipe
              </p>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="flex items-center space-x-1 sm:space-x-2 bg-white/60 dark:bg-gray-700/60 backdrop-blur-sm border border-white/30 dark:border-gray-600/30 rounded-lg sm:rounded-xl px-2 sm:px-4 py-1.5 sm:py-2">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-md sm:rounded-lg flex items-center justify-center">
                <span className="text-xs sm:text-sm font-bold text-white">💰</span>
              </div>
              {isLoadingBalance ? (
                <div className="w-4 h-4 border border-gray-300 border-t-gray-600 rounded-full animate-spin" />
              ) : (
                <span className="font-semibold text-gray-900 dark:text-gray-100 text-sm sm:text-base">
                  {userBalance.complimentBalance}
                </span>
              )}
              <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 hidden sm:inline">moedas</span>
            </div>
          </div>
        </div>
      </div>
    </animated.div>
  )
}