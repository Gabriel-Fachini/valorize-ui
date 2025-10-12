import { useState } from 'react'
import { animated, useSpring } from '@react-spring/web'
import { PraiseModal } from '@/components/PraiseModal'
import {
  PraiseFeed, 
  SuccessModal, 
} from '@/components/praises'
import { 
  usePageEntrance,
  useListTrail,
  useCardEntrance,
  useSuccessTransition,
} from '@/hooks/useAnimations'
import { usePraisesData, type PraiseUser, type PraiseCompanyValue } from '@/hooks/usePraisesData'
import { PageLayout } from '@/components/layout/PageLayout'

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
    praises,
    currentFilter,
    loading,
    actions,
    computed,
  } = usePraisesData()

  // Animations (hooks diretos evitando função que invoca hooks internamente)
  const pageAnimation = usePageEntrance()
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
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div>
            <h1 className="mb-2 text-4xl font-bold text-gray-900 dark:text-gray-100">
              Elogios
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Elogie seus colegas e fortaleça a cultura positiva da empresa!
            </p>
          </div>
          
          {/* Botão destacado de novo elogio */}
          <button
            onClick={handleNewPraise}
            disabled={!computed.canSendPraise}
            className={`flex items-center gap-2 px-6 py-3 sm:px-8 sm:py-4 bg-primary-600 text-white rounded-xl font-bold text-base sm:text-lg shadow-xl hover:shadow-2xl hover:shadow-primary-500/30 transition-all duration-200 ${!computed.canSendPraise ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary-700 hover:scale-105'}`}
          >
            <i className="ph-bold ph-plus-circle text-xl sm:text-2xl"></i>
            <span className="whitespace-nowrap">Novo Elogio</span>
          </button>
        </div>
      </animated.div>
        
        {/* Error Message */}
        {computed.combinedErrorMessage && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700/50 rounded-xl">
            <div className="flex items-center space-x-2">
              <span className="text-red-500 text-lg">⚠️</span>
              <p className="text-sm text-red-600 dark:text-red-400">{computed.combinedErrorMessage}</p>
            </div>
          </div>
        )}

        {/* Praise Feed */}
        <div data-tour="praises-feed">
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
      </div>

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
    </PageLayout>
  )
}
