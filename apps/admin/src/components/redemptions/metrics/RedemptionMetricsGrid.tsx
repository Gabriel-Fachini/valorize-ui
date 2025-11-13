import type { FC } from 'react'
import { MetricCard } from '@/components/dashboard/MetricCard'
import type { RedemptionMetrics } from '@/types/redemptions'
import { animated } from '@react-spring/web'
import { useStatsTrail } from '@valorize/shared/hooks'

interface RedemptionMetricsGridProps {
  metrics?: RedemptionMetrics
  isLoading?: boolean
}

export const RedemptionMetricsGrid: FC<RedemptionMetricsGridProps> = ({
  metrics,
  isLoading = false,
}) => {
  const trail = useStatsTrail(5)

  // Phosphor icons
  const GiftIcon = () => <i className="ph ph-gift text-2xl" />
  const CoinsIcon = () => <i className="ph ph-coins text-2xl" />
  const CurrencyIcon = () => <i className="ph ph-currency-circle-dollar text-2xl" />
  const UsersIcon = () => <i className="ph ph-users text-2xl" />
  const RepeatIcon = () => <i className="ph ph-repeat text-2xl" />

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`
    }
    return num.toString()
  }

  // Parse trend value from string (e.g., "+200%" -> 200)
  const parseTrendValue = (trendStr: string): number => {
    return parseFloat(trendStr.replace(/[^0-9.-]/g, ''))
  }

  const metricsData = [
    {
      title: 'Total de Resgates',
      value: formatNumber(metrics?.volume.totalRedemptions ?? 0),
      subtitle: `Período: ${metrics?.period ? new Date(metrics.period.startDate).toLocaleDateString('pt-BR') : 'N/A'}`,
      icon: <GiftIcon />,
      trend: metrics?.volume.periodComparison
        ? {
            value: parseTrendValue(metrics.volume.periodComparison.redemptionsChange),
            label: 'vs período anterior',
          }
        : undefined,
      tooltip: 'Total de prêmios resgatados no período. Inclui todas as categorias: vouchers e produtos.',
    },
    {
      title: 'Moedas Gastas',
      value: formatNumber(metrics?.volume.totalCoinsSpent ?? 0),
      subtitle: `Média: ${metrics?.volume.avgCoinsPerRedemption.toFixed(0) ?? 0} por resgate`,
      icon: <CoinsIcon />,
      tooltip: 'Total de moedas virtuais gastas em resgates no período analisado.',
    },
    {
      title: 'Valor Total BRL',
      value: `R$ ${metrics?.volume.totalValueBRL ?? 0}`,
      subtitle: `Valor médio: R$ ${((metrics?.volume.totalValueBRL ?? 0) / (metrics?.volume.totalRedemptions ?? 1)).toFixed(2)}`,
      icon: <CurrencyIcon />,
      trend: metrics?.volume.periodComparison
        ? {
            value: parseFloat(metrics.volume.periodComparison.valueChange.replace(/[R$\s+]/g, '')),
            label: 'vs período anterior',
          }
        : undefined,
      tooltip: 'Valor total em reais dos prêmios resgatados, baseado no custo de mercado.',
    },
    {
      title: 'Engajamento',
      value: `${metrics?.userEngagement.percentageOfActive.toFixed(1) ?? 0}%`,
      subtitle: `${metrics?.userEngagement.uniqueRedeemers ?? 0} resgatadores únicos`,
      icon: <UsersIcon />,
      tooltip: 'Percentual de usuários ativos que realizaram pelo menos um resgate no período.',
    },
    {
      title: 'Taxa de Repetição',
      value: `${metrics?.userEngagement.repeatRate.toFixed(1) ?? 0}%`,
      subtitle: `${metrics?.userEngagement.repeatRedeemers ?? 0} usuários repetem`,
      icon: <RepeatIcon />,
      tooltip: 'Percentual de usuários que realizaram mais de um resgate. Indica engajamento contínuo.',
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 auto-rows-fr">
      {trail.map((style: Record<string, unknown>, index: number) => (
        <animated.div key={metricsData[index].title} style={style as Record<string, unknown>}>
          <MetricCard
            title={metricsData[index].title}
            value={metricsData[index].value}
            subtitle={metricsData[index].subtitle}
            icon={metricsData[index].icon}
            trend={metricsData[index].trend}
            isLoading={isLoading}
            tooltip={metricsData[index].tooltip}
          />
        </animated.div>
      ))}
    </div>
  )
}
