/**
 * TransactionsPage
 * Main transactions page displaying user's wallet transaction history
 */

import { animated, useSpring } from '@react-spring/web'
import { 
  BalanceHeader,
  TransactionFeed,
} from '@/components/transactions'
import { 
  usePageEntrance,
  useListTrail,
  useCardEntrance,
} from '@/hooks/useAnimations'
import { useTransactions } from '@/hooks/useTransactions'

export const TransactionsPage = () => {
  // Data management
  const {
    transactions,
    filters,
    balance,
    loading,
    loadingMore,
    loadingBalance,
    hasMore,
    setFilters,
    loadMore,
  } = useTransactions()

  // Animations
  const pageAnimation = usePageEntrance()
  const transactionsTrail = useListTrail(transactions)
  const feedSectionAnimation = useCardEntrance()
  const filtersAnimation = useCardEntrance()

  const headerSpring = useSpring({
    from: { opacity: 0, transform: 'translateY(-20px)' },
    to: { opacity: 1, transform: 'translateY(0px)' },
    config: { tension: 280, friction: 60 },
  })

  return (
    <animated.div 
      style={pageAnimation}
      className="min-h-screen bg-gradient-to-br from-gray-50/80 via-white/60 to-purple-50/80 dark:from-gray-900/95 dark:via-gray-800/90 dark:to-gray-900/95"
    >
      {/* Liquid Glass Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-indigo-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-gradient-to-br from-blue-400/15 to-cyan-600/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute -bottom-40 right-1/3 w-72 h-72 bg-gradient-to-br from-pink-400/20 to-rose-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">

        {/* Header */}
        <animated.div style={headerSpring} className="mb-8">
          <h1 data-tour="transactions-page" className="mb-2 text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400">
            Transações
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Acompanhe o histórico de movimentações das suas moedas
          </p>
        </animated.div>

        <div className="space-y-6 sm:space-y-8">
          
          {/* Balance Header */}
          <div data-tour="transactions-balance">
            <BalanceHeader
              balance={balance}
              loading={loadingBalance}
            />
          </div>

          {/* Transaction Feed */}
          <div data-tour="transactions-feed">
            <TransactionFeed
              transactions={transactions}
              filters={filters}
              hasMore={hasMore}
              loading={loading}
              loadingMore={loadingMore}
              trail={transactionsTrail}
              filtersAnimation={filtersAnimation}
              feedSectionAnimation={feedSectionAnimation}
              onFiltersChange={setFilters}
              onLoadMore={loadMore}
            />
          </div>

        </div>
      </div>
    </animated.div>
  )
}