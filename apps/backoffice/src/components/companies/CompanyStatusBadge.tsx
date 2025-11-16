import { Badge } from '@/components/ui/badge'
import type { CompanyStatus } from '@/types/company'

interface CompanyStatusBadgeProps {
  status: boolean | CompanyStatus
}

export function CompanyStatusBadge({ status }: CompanyStatusBadgeProps) {
  const isActive =
    typeof status === 'boolean' ? status : status === 'ACTIVE'

  return (
    <Badge variant={isActive ? 'success' : 'destructive'}>
      {isActive ? 'Ativa' : 'Inativa'}
    </Badge>
  )
}
