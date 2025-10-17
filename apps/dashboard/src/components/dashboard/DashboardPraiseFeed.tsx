import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { SkeletonPraiseCard } from '@/components/praises/SkeletonPraiseCard'
import { PraiseCard } from '@/components/praises/PraiseCard'
import { usePraisesData } from '@/hooks/usePraisesData'

interface DashboardPraiseFeedProps {
  limit?: number
  className?: string
}

export const DashboardPraiseFeed = ({ limit = 10, className = '' }: DashboardPraiseFeedProps) => {
  const navigate = useNavigate()
  const { praises, loading, actions } = usePraisesData()
  const [localFilter, setLocalFilter] = useState<'all' | 'sent' | 'received'>('all')

  const handleFilterChange = (filter: 'all' | 'sent' | 'received') => {
    setLocalFilter(filter)
    actions.setFilter(filter)
  }

  const filteredPraises = praises.slice(0, limit)

  if (loading.praises) {
    return (
      <div className={`grid grid-cols-1 gap-4 ${className}`}>
        {Array.from({ length: limit }).map((_, index) => (
          <SkeletonPraiseCard key={index} />
        ))}
      </div>
    )
  }

  if (filteredPraises.length === 0) {
    return (
      <div className="bg-white/70 dark:bg-[#2a2a2a]/80 backdrop-blur-xl border border-white/30 dark:border-neutral-700/30 rounded-2xl p-8 text-center">
        <div className="flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-neutral-800 rounded-2xl mx-auto mb-4">
          <i className="ph-duotone ph-sparkle text-gray-400" style={{ fontSize: '24px' }}></i>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Nenhum elogio ainda
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Seja o primeiro a enviar um elogio e reconhecer o trabalho dos seus colegas!
        </p>
        <Button onClick={() => navigate({ to: '/elogios' })}>
          Enviar Primeiro Elogio
        </Button>
      </div>
    )
  }

  return (
    <div className={className}>
      {/* Filter Buttons */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
        <Button
          variant={localFilter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleFilterChange('all')}
          className="whitespace-nowrap"
        >
          Todos
        </Button>
        <Button
          variant={localFilter === 'sent' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleFilterChange('sent')}
          className="whitespace-nowrap"
        >
          Enviados
        </Button>
        <Button
          variant={localFilter === 'received' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleFilterChange('received')}
          className="whitespace-nowrap"
        >
          Recebidos
        </Button>
      </div>

      {/* Praises Feed */}
      <div className="grid grid-cols-1 gap-4">
        {filteredPraises.map((praise, index) => (
          <PraiseCard
            key={praise.id}
            praise={praise}
            style={{
              opacity: 0,
              transform: 'translateY(20px)',
              animationDelay: `${index * 100}ms`,
            }}
          />
        ))}
      </div>

      {/* View All Button */}
      {praises.length > limit && (
        <div className="mt-6 text-center">
          <Button
            variant="outline"
            onClick={() => navigate({ to: '/elogios' })}
          >
            Ver Todos os Elogios
          </Button>
        </div>
      )}
    </div>
  )
}

