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
import { PageLayout } from '@/components/layout/PageLayout'

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
    <PageLayout maxWidth="6xl">
      <animated.div style={pageAnimation}>
        {/* Main Content */}
        <div className="relative z-10">

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
    </PageLayout>
  )
}