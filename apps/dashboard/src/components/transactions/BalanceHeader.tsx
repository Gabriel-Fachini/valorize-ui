/**
 * BalanceHeader Component
 * Displays current wallet balance with visual cards
 */

import { animated } from '@react-spring/web'
import type { UserBalance } from '@/types'

interface BalanceHeaderProps {
  balance: UserBalance
  loading?: boolean
  style?: React.CSSProperties
  className?: string
}

export const BalanceHeader = ({
  balance,
  loading = false,
  style = {},
  className = '',
}: BalanceHeaderProps) => {
  const formatBalance = (amount: number) => {
    return amount.toLocaleString('pt-BR')
  }

  if (loading) {
    return (
      <animated.div style={style} className={`space-y-4 ${className}`}>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
          Transações
        </h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Skeleton cards */}
          {Array.from({ length: 2 }).map((_, index) => (
            <div
              key={index}
              className="
                bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm 
                border border-white/30 dark:border-gray-700/30 
                rounded-xl sm:rounded-2xl p-4 sm:p-6
              "
            >
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse w-24" />
                  <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded animate-pulse w-16" />
                </div>
                <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-xl animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </animated.div>
    )
  }

  return (
    <animated.div style={style} className={`space-y-4 sm:space-y-6 ${className}`}>
      {/* Balance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {/* Compliment Balance Card */}
        <div className="
          bg-gradient-to-br from-green-50 to-emerald-50 
          dark:from-green-900/20 dark:to-emerald-900/20
          border border-green-200/50 dark:border-green-800/30
          rounded-xl sm:rounded-2xl p-4 sm:p-6
          hover:shadow-lg transition-all duration-200
        ">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm sm:text-base font-medium text-green-700 dark:text-green-300 mb-1">
                Para Elogiar
              </p>
              <p className="text-2xl sm:text-3xl font-bold text-green-800 dark:text-green-200">
                {formatBalance(balance.complimentBalance)}
              </p>
            </div>
            <div className="
              w-12 h-12 sm:w-14 sm:h-14
              bg-green-500/20 dark:bg-green-400/20
              rounded-xl flex items-center justify-center
            ">
              <span className="text-xl sm:text-2xl">💎</span>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-green-600 dark:text-green-400 mt-2">
            Moedas disponíveis para enviar elogios
          </p>
        </div>

        {/* Redeemable Balance Card */}
        <div className="
          bg-gradient-to-br from-blue-50 to-indigo-50 
          dark:from-blue-900/20 dark:to-indigo-900/20
          border border-blue-200/50 dark:border-blue-800/30
          rounded-xl sm:rounded-2xl p-4 sm:p-6
          hover:shadow-lg transition-all duration-200
        ">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm sm:text-base font-medium text-blue-700 dark:text-blue-300 mb-1">
                Para Resgatar
              </p>
              <p className="text-2xl sm:text-3xl font-bold text-blue-800 dark:text-blue-200">
                {formatBalance(balance.redeemableBalance)}
              </p>
            </div>
            <div className="
              w-12 h-12 sm:w-14 sm:h-14
              bg-blue-500/20 dark:bg-blue-400/20
              rounded-xl flex items-center justify-center
            ">
              <span className="text-xl sm:text-2xl">🏆</span>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-blue-600 dark:text-blue-400 mt-2">
            Moedas acumuladas para trocar por prêmios
          </p>
        </div>
      </div>
    </animated.div>
  )
}