import { animated, useSpring } from '@react-spring/web'
import {
  TransactionFeed,
  ExpiringCoinsAlert,
} from '@/components/transactions'
import {
  usePageEntrance,
  useCardEntrance,
} from '@/hooks/useAnimations'
import { useTransactions } from '@/hooks/useTransactions'
import { PageLayout } from '@/components/layout/PageLayout'
import { PageHeader } from '@/components/ui/PageHeader'

export const TransactionsPage = () => {
  // Data management
  const {
    transactions,
    balance,
    uiFilters,
    loading,
    loadingMore,
    hasMore,
    setUIFilters,
    loadMore,
  } = useTransactions()

  // Animations
  const pageAnimation = usePageEntrance()
  const feedSectionAnimation = useCardEntrance()
  const filtersAnimation = useCardEntrance()

  const headerSpring = useSpring({
    from: { opacity: 0, transform: 'translateY(-20px)' },
    to: { opacity: 1, transform: 'translateY(0px)' },
    config: { tension: 280, friction: 60 },
  })

  const alertSpring = useSpring({
    from: { opacity: 0, transform: 'translateY(-10px)' },
    to: { opacity: 1, transform: 'translateY(0px)' },
    config: { tension: 280, friction: 60 },
    delay: 100,
  })

  return (
    <PageLayout maxWidth="6xl">
      <animated.div style={pageAnimation as any}>
        {/* Main Content */}
        <div className="relative z-10">

        {/* Header */}
        <animated.div style={headerSpring}>
          <PageHeader
            title="Transações"
            description="Acompanhe o histórico de movimentações das suas moedas"
            dataTour="transactions-page"
          />
        </animated.div>

        <div className="space-y-6 sm:space-y-8">

          {/* Expiring Coins Alert */}
          <animated.div style={alertSpring}>
            <ExpiringCoinsAlert expiringCoins={balance?.expiringCoins} />
          </animated.div>

          {/* Transaction Feed */}
          <div data-tour="transactions-feed">
            <TransactionFeed
              transactions={transactions}
              filters={uiFilters}
              hasMore={hasMore}
              loading={loading}
              loadingMore={loadingMore}
              filtersAnimation={filtersAnimation}
              feedSectionAnimation={feedSectionAnimation}
              onFiltersChange={setUIFilters}
              onLoadMore={loadMore}
            />
          </div>

        </div>
      </div>
      </animated.div>
    </PageLayout>
  )
}