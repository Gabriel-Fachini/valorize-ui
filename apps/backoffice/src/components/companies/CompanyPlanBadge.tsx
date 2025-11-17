import { Badge } from '@/components/ui/badge'
import type { PlanType } from '@/types/company'

interface CompanyPlanBadgeProps {
  planType: PlanType | null
}

const PLAN_LABELS: Record<PlanType, string> = {
  ESSENTIAL: 'Essential',
  PROFESSIONAL: 'Professional',
}

const PLAN_VARIANTS: Record<PlanType, 'info' | 'default'> = {
  ESSENTIAL: 'info',
  PROFESSIONAL: 'default',
}

export function CompanyPlanBadge({ planType }: CompanyPlanBadgeProps) {
  if (!planType) {
    return (
      <Badge variant="outline" className="text-muted-foreground">
        Sem plano
      </Badge>
    )
  }

  return (
    <Badge variant={PLAN_VARIANTS[planType]}>
      {PLAN_LABELS[planType]}
    </Badge>
  )
}
