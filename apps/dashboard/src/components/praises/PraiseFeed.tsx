import { animated } from '@react-spring/web'
import { PraiseCard } from './PraiseCard'
import { SkeletonPraiseCard } from './SkeletonPraiseCard'
import { EmptyState } from './EmptyState'
import { GenericTabsNavigation, useGenericTabs } from '@/components/ui'
import type { PraiseData } from '@/hooks/usePraisesData'
import type { TabItem } from '@/components/ui/GenericTabsNavigation'

interface PraiseFeedProps {
  praises: PraiseData[]
  currentFilter: 'all' | 'sent' | 'received'
  trail: Array<Record<string, unknown>>
  filterAnimation: Record<string, unknown>
  feedSectionAnimation: Record<string, unknown>
  onNewPraise?: () => void
  onFilterChange?: (filter: 'all' | 'sent' | 'received') => void
  loading?: boolean
}

export const PraiseFeed = ({ 
  praises, 
  currentFilter,
  trail, 
  filterAnimation, 
  feedSectionAnimation,
  onNewPraise,
  onFilterChange,
  loading = false,
}: PraiseFeedProps) => {
  // Configuração das abas de filtro
  const praiseFilterTabs: TabItem[] = [
    {
      value: 'all',
      label: 'Todos',
      icon: 'ph-list',
      'aria-label': 'Ver todos os elogios',
    },
    {
      value: 'received',
      label: 'Recebidos',
      icon: 'ph-arrow-down',
      'aria-label': 'Ver elogios recebidos',
    },
    {
      value: 'sent',
      label: 'Enviados',
      icon: 'ph-arrow-up',
      'aria-label': 'Ver elogios enviados',
    },
  ]

  const { activeTab, tabItems, handleTabChange } = useGenericTabs({
    tabs: praiseFilterTabs,
    defaultTab: currentFilter,
  })

  // Sincronizar com o filtro externo
  const handleTabChangeWithCallback = (value: string) => {
    handleTabChange(value)
    onFilterChange?.(value as 'all' | 'sent' | 'received')
  }

  return (
    <animated.div style={feedSectionAnimation} className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">
          Feed de Reconhecimentos
        </h2>
        <animated.div style={filterAnimation}>
          <GenericTabsNavigation
            items={tabItems}
            activeTab={activeTab}
            onChange={handleTabChangeWithCallback}
            variant="compact"
            data-tour="praises-filter-tabs"
          />
        </animated.div>
      </div>

      {/* Praise Cards, Skeletons, or Empty State */}
      {loading ? (
        <div className="space-y-4 sm:space-y-6">
          {Array.from({ length: 3 }).map((_, index) => {
            // Apply trail animation in natural order (top to bottom)
            const style = trail[index] || {}
            
            return (
              <animated.div key={`skeleton-${index}`} style={style}>
                <SkeletonPraiseCard />
              </animated.div>
            )
          })}
        </div>
      ) : praises.length > 0 ? (
        <div className="space-y-4 sm:space-y-6">
          {praises.map((praise, index) => {
            // Apply trail animation in natural order (top to bottom)
            const style = trail[index] || {}
            
            return (
              <animated.div key={praise.id} style={style}>
                <PraiseCard
                  praise={praise}
                />
              </animated.div>
            )
          })}
        </div>
      ) : (
        <EmptyState
          type="praises"
          onAction={onNewPraise}
        />
      )}
    </animated.div>
  )
}
