import { useState } from 'react'
import { animated, useTrail, config } from '@react-spring/web'
import { PraiseModal } from '@/components/PraiseModal'
import { 
  PraiseHeader, 
  StatsCards, 
  PraiseFeed, 
  SuccessModal, 
} from '@/components/praises'
import { 
  usePageEntrance,
  usePageHeaderEntrance,
  useFabEntrance,
  useListTrail,
  useStatsTrail,
  useCardEntrance,
  useSuccessTransition,
} from '@/hooks/useAnimations'
import { usePraisesData, type PraiseUser, type PraiseCompanyValue } from '@/hooks/usePraisesData'

export const PraisesPage = () => {
  const [showModal, setShowModal] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [lastPraise, setLastPraise] = useState<{ 
    user: PraiseUser
    value: PraiseCompanyValue
    coins: number 
  } | null>(null)

  // Data management
  const {
    users,
    companyValues,
    userBalance,
    praises,
    currentFilter,
    loading,
    actions,
    computed,
  } = usePraisesData()

  // Animations (hooks diretos evitando função que invoca hooks internamente)
  const pageAnimation = usePageEntrance()
  const headerAnimation = usePageHeaderEntrance()
  const fabAnimation = useFabEntrance()
  const statsTrail = useStatsTrail(3)
  const praisesTrail = useListTrail(praises)
  const feedSectionAnimation = useCardEntrance()
  const filterAnimation = useCardEntrance()
  const successTransition = useSuccessTransition(showSuccess)

  const handlePraiseSuccess = (data: { 
    user: PraiseUser
    value: PraiseCompanyValue
    coins: number
    message: string 
  }) => {
    setLastPraise({ user: data.user, value: data.value, coins: data.coins })
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
    // Refresh balance after successful compliment
    actions.refreshBalance()
    // Invalidate cache to force refresh of praises
    actions.invalidateCache()
    // Refresh praises to show the new one
    actions.refreshPraises()
  }

  const handleNewPraise = () => {
    setShowModal(true)
  }

  const handleLikePraise = (praiseId: string) => {
    // TODO: Implement like functionality
    void praiseId // Placeholder to avoid unused parameter warning
  }

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

      {/* Header */}
      <PraiseHeader
        userBalance={userBalance}
        isLoadingBalance={loading.balance}
        style={headerAnimation}
      />

      {/* Main Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        
        {/* Error Message */}
        {computed.combinedErrorMessage && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700/50 rounded-xl">
            <div className="flex items-center space-x-2">
              <span className="text-red-500 text-lg">⚠️</span>
              <p className="text-sm text-red-600 dark:text-red-400">{computed.combinedErrorMessage}</p>
            </div>
          </div>
        )}
        
        {/* Stats Cards */}
        <StatsCards trail={statsTrail} />

        {/* Praise Feed */}
        <PraiseFeed
          praises={praises}
          currentFilter={currentFilter}
          trail={praisesTrail}
          filterAnimation={filterAnimation}
          feedSectionAnimation={feedSectionAnimation}
          onNewPraise={handleNewPraise}
          onLikePraise={handleLikePraise}
          onFilterChange={actions.setFilter}
          loading={loading.praises}
        />
      </div>

      {/* Floating Action Button */}
      <animated.button
        style={fabAnimation}
        onClick={() => setShowModal(true)}
        disabled={!computed.canSendPraise}
        className={`fixed bottom-4 right-4 sm:bottom-8 sm:right-8 z-40 w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl sm:rounded-2xl shadow-2xl hover:shadow-3xl flex items-center justify-center text-white text-xl sm:text-2xl font-bold hover:scale-110 duration-300 backdrop-blur-xl border border-white/20 ${!computed.canSendPraise ? 'opacity-50 cursor-not-allowed hover:scale-100' : ''}`}
      >
        {computed.isAnyLoading ? (
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <span>✨</span>
        )}
      </animated.button>

      {/* Praise Modal */}
      <PraiseModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={handlePraiseSuccess}
        users={users}
        companyValues={companyValues}
      />

      {/* Success Modal */}
      <SuccessModal
        user={lastPraise?.user}
        value={lastPraise?.value}
        coins={lastPraise?.coins}
        transition={successTransition}
      />
    </animated.div>
  )
}
