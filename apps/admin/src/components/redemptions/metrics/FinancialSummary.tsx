import type { FC } from 'react'
import type { FinancialImpactMetrics } from '@/types/redemptions'
import { animated, useSpring } from '@react-spring/web'

interface FinancialSummaryProps {
  financialImpact?: FinancialImpactMetrics
  totalRedemptions?: number
  isLoading?: boolean
}

const FinancialMetricCard: FC<{
  icon: string
  title: string
  value: string
  subtitle: string
}> = ({ icon, title, value, subtitle }) => {
  return (
    <div className="p-4 rounded-xl border bg-card hover:bg-accent/50 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-sm text-muted-foreground font-medium">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary text-lg">
          <i className={`ph ${icon}`} />
        </div>
      </div>
      <p className="text-xs text-muted-foreground">{subtitle}</p>
    </div>
  )
}

const LoadingSkeleton: FC = () => (
  <div className="space-y-4">
    {/* Main metric skeleton */}
    <div className="p-4 rounded-lg border bg-card">
      <div className="h-4 w-32 bg-muted animate-pulse rounded mb-3" />
      <div className="h-8 w-24 bg-muted animate-pulse rounded mb-2" />
      <div className="h-3 w-48 bg-muted/60 animate-pulse rounded" />
    </div>

    {/* Sub metrics skeleton */}
    <div className="grid grid-cols-2 gap-3">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="p-4 rounded-lg border bg-card">
          <div className="h-4 w-24 bg-muted animate-pulse rounded mb-2" />
          <div className="h-6 w-16 bg-muted animate-pulse rounded mb-2" />
          <div className="h-3 w-28 bg-muted/60 animate-pulse rounded" />
        </div>
      ))}
    </div>
  </div>
)

export const FinancialSummary: FC<FinancialSummaryProps> = ({
  financialImpact,
  totalRedemptions = 0,
  isLoading = false,
}) => {
  const animation = useSpring({
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0px)' },
    delay: 500,
  })

  if (isLoading) {
    return (
      <animated.div
        style={animation as any}
        className="rounded-3xl border bg-card p-6 shadow-sm"
      >
        <div className="mb-6">
          <div className="h-5 w-40 bg-muted animate-pulse rounded mb-2" />
          <div className="h-4 w-56 bg-muted/60 animate-pulse rounded" />
        </div>
        <LoadingSkeleton />
      </animated.div>
    )
  }

  const data = financialImpact || {
    totalCost: 0,
    voucherCost: 0,
    physicalCost: 0,
    avgCostPerRedemption: 0,
    projectedMonthlyCost: 0,
  }

  // Ensure all values are numbers with fallback to 0
  const totalCost = data.totalCost ?? 0
  const voucherCost = data.voucherCost ?? 0
  const physicalCost = data.physicalCost ?? 0
  const avgCostPerRedemption = data.avgCostPerRedemption ?? 0
  const projectedMonthlyCost = data.projectedMonthlyCost ?? 0

  return (
    <animated.div
      style={animation as any}
      className="rounded-3xl border bg-card p-6 shadow-sm"
    >
      <div className="mb-6">
        <h3 className="text-lg font-semibold">Impacto Financeiro</h3>
        <p className="text-sm text-muted-foreground">
          Análise de custos e projeções
        </p>
      </div>

      <div className="space-y-4">
        {/* Main metric - Total Cost */}
        <div className="p-4 rounded-xl border bg-accent/50 hover:bg-accent transition-colors">
          <p className="text-sm text-muted-foreground font-medium">Custo Total de Resgates</p>
          <p className="text-3xl font-bold mt-2">R$ {totalCost.toFixed(2)}</p>
          <p className="text-xs text-muted-foreground mt-2">
            {totalRedemptions} resgates processados no período
          </p>
        </div>

        {/* Breakdown grid */}
        <div className="grid grid-cols-2 gap-3">
          <FinancialMetricCard
            icon="ph-ticket"
            title="Custo em Vouchers"
            value={`R$ ${voucherCost.toFixed(2)}`}
            subtitle={`${totalCost > 0 ? ((voucherCost / totalCost) * 100).toFixed(0) : 0}% do total`}
          />
          <FinancialMetricCard
            icon="ph-package"
            title="Custo em Produtos"
            value={`R$ ${physicalCost.toFixed(2)}`}
            subtitle={`${totalCost > 0 ? ((physicalCost / totalCost) * 100).toFixed(0) : 0}% do total`}
          />
          <FinancialMetricCard
            icon="ph-calculator"
            title="Custo Médio/Resgate"
            value={`R$ ${avgCostPerRedemption.toFixed(2)}`}
            subtitle={`Baseado em ${totalRedemptions} resgates`}
          />
          <FinancialMetricCard
            icon="ph-trend-up"
            title="Projeção Mensal"
            value={`R$ ${projectedMonthlyCost.toFixed(2)}`}
            subtitle="Baseado no período atual"
          />
        </div>
      </div>
    </animated.div>
  )
}
