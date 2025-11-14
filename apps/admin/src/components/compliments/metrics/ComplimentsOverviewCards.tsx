/**
 * Compliments Overview Cards
 * Displays 5 main metric cards at the top of the dashboard
 */

import type { FC } from 'react'
import { MetricCard, MetricCardSkeleton } from '@/components/dashboard/MetricCard'
import type { ComplimentsOverview } from '@/types/compliments'

interface ComplimentsOverviewCardsProps {
  data?: ComplimentsOverview
  isLoading?: boolean
}

export const ComplimentsOverviewCards: FC<ComplimentsOverviewCardsProps> = ({
  data,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <MetricCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (!data) {
    return null
  }

  const {
    totalCompliments,
    totalCoinsDistributed,
    activeUsers,
    avgCoinsPerCompliment,
    engagementRate,
    comparison,
  } = data

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {/* Total Compliments */}
      <MetricCard
        title="Total Elogios"
        value={totalCompliments?.toLocaleString('pt-BR') ?? '0'}
        icon={<i className="ph ph-heart text-2xl" />}
        trend={
          comparison
            ? {
                value: comparison.complimentsChange,
                label: comparison.complimentsChangeLabel,
              }
            : undefined
        }
        tooltip="Quantidade total de reconhecimentos enviados no período"
      />

      {/* Total Coins */}
      <MetricCard
        title="Total Moedas"
        value={totalCoinsDistributed?.toLocaleString('pt-BR') ?? '0'}
        icon={<i className="ph ph-coins text-2xl" />}
        trend={
          comparison
            ? {
                value: comparison.coinsChange,
                label: comparison.coinsChangeLabel,
              }
            : undefined
        }
        tooltip="Soma de todas as moedas distribuídas via elogios"
      />

      {/* Active Users */}
      <MetricCard
        title="Usuários Ativos"
        value={activeUsers?.count.toLocaleString('pt-BR') ?? '0'}
        subtitle={`${activeUsers?.percentage.toFixed(0) ?? '0'}% do total`}
        icon={<i className="ph ph-users text-2xl" />}
        trend={
          comparison
            ? {
                value: comparison.usersChange,
                label: comparison.usersChangeLabel,
              }
            : undefined
        }
        tooltip="Colaboradores que enviaram ou receberam pelo menos 1 elogio"
      />

      {/* Avg Coins per Compliment */}
      <MetricCard
        title="Média Moedas"
        value={avgCoinsPerCompliment?.toFixed(1) ?? '0'}
        subtitle="por elogio"
        icon={<i className="ph ph-chart-line text-2xl" />}
        tooltip="Média de moedas por elogio enviado"
      />

      {/* Engagement Rate */}
      <MetricCard
        title="Taxa Engajamento"
        value={engagementRate?.toFixed(1) ?? '0'}
        subtitle="elogios/usuário ativo"
        icon={<i className="ph ph-trend-up text-2xl" />}
        tooltip="Média de elogios por usuário ativo"
      />
    </div>
  )
}
