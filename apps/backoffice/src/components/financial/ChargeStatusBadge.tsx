import { Badge } from '@/components/ui/badge'
import type { ChargeStatus } from '@/types/financial'

interface ChargeStatusBadgeProps {
  status: ChargeStatus
}

const STATUS_LABELS: Record<ChargeStatus, string> = {
  PENDING: 'Pendente',
  PAID: 'Pago',
  OVERDUE: 'Vencido',
  CANCELED: 'Cancelado',
  PARTIAL: 'Parcial',
}

const STATUS_VARIANTS: Record<
  ChargeStatus,
  'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' | 'info'
> = {
  PENDING: 'warning',
  PAID: 'success',
  OVERDUE: 'destructive',
  CANCELED: 'outline',
  PARTIAL: 'info',
}

export function ChargeStatusBadge({ status }: ChargeStatusBadgeProps) {
  return <Badge variant={STATUS_VARIANTS[status]}>{STATUS_LABELS[status]}</Badge>
}
