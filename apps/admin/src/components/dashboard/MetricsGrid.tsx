import type { FC } from 'react'
import { MetricCard } from './MetricCard'
import type { DashboardMetrics } from '../../types/dashboard'
import { animated } from '@react-spring/web'
import { useStatsTrail } from '@valorize/shared/hooks'

interface MetricsGridProps {
  metrics: DashboardMetrics
  isLoading?: boolean
}

export const MetricsGrid: FC<MetricsGridProps> = ({ metrics, isLoading = false }) => {
  const trail = useStatsTrail(5)

  // Phosphor icons (using web component style)
  const HeartIcon = () => (
    <i className="ph ph-heart text-2xl" />
  )

  const CoinsIcon = () => (
    <i className="ph ph-coins text-2xl" />
  )

  const UsersIcon = () => (
    <i className="ph ph-users text-2xl" />
  )

  const GiftIcon = () => (
    <i className="ph ph-gift text-2xl" />
  )

  const ChartLineIcon = () => (
    <i className="ph ph-chart-line-up text-2xl" />
  )

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`
    }
    return num.toString()
  }

  const metricsData = [
    {
      title: 'Elogios Enviados',
      value: formatNumber(metrics.totalCompliments),
      subtitle: 'Últimos 30 dias',
      icon: <HeartIcon />,
      tooltip: 'Quantidade total de elogios enviados entre colaboradores nos últimos 30 dias. Cada elogio representa um reconhecimento de valor realizado na plataforma.',
    },
    {
      title: 'Moedas Movimentadas',
      value: formatNumber(metrics.coinsDistributed),
      subtitle: 'Últimos 30 dias',
      icon: <CoinsIcon />,
      tooltip: 'Total de moedas virtuais distribuídas através de elogios nos últimos 30 dias. Cada elogio enviado distribui moedas que podem ser usadas para resgatar prêmios.',
    },
    {
      title: 'Usuários Ativos',
      value: formatNumber(metrics.activeUsers.count),
      subtitle: `${metrics.activeUsers.percentage.toFixed(1)}% do total`,
      icon: <UsersIcon />,
      tooltip: 'Usuários que realizaram alguma ação na plataforma nos últimos 30 dias. Cálculo: usuários que enviaram ou receberam elogios, resgataram prêmios ou visualizaram conteúdo dividido pelo total de usuários cadastrados.',
    },
    {
      title: 'Prêmios Resgatados',
      value: formatNumber(metrics.prizesRedeemed),
      subtitle: 'Últimos 30 dias',
      icon: <GiftIcon />,
      tooltip: 'Número de prêmios resgatados pelos colaboradores nos últimos 30 dias. Representa a utilização das moedas acumuladas através dos elogios recebidos.',
    },
    {
      title: 'Engajamento',
      value: `${metrics.engagementRate.toFixed(1)}%`,
      subtitle: 'Taxa de participação',
      icon: <ChartLineIcon />,
      tooltip: 'Percentual de usuários que participam ativamente da plataforma. Cálculo: (usuários que enviaram elogios + usuários que resgataram prêmios) dividido pelo total de usuários ativos, multiplicado por 100.',
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {trail.map((style, index) => (
        <animated.div key={metricsData[index].title} style={style as any}>
          <MetricCard
            title={metricsData[index].title}
            value={metricsData[index].value}
            subtitle={metricsData[index].subtitle}
            icon={metricsData[index].icon}
            isLoading={isLoading}
            tooltip={metricsData[index].tooltip}
          />
        </animated.div>
      ))}
    </div>
  )
}
