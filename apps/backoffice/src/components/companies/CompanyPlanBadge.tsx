import { Badge } from '@/components/ui/badge'
import type { PlanType } from '@/types/company'

interface CompanyPlanBadgeProps {
  planType: PlanType
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
  return (
    <Badge variant={PLAN_VARIANTS[planType]}>
      {PLAN_LABELS[planType]}
    </Badge>
  )
}
