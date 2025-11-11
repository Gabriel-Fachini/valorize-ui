/**
 * Redemption Status Badge Component
 * Displays redemption status with appropriate color and label
 */

import { type FC } from 'react'
import { Badge } from '@/components/ui/badge'
import type { RedemptionStatus } from '@/types/redemptions'

interface RedemptionStatusBadgeProps {
  status: RedemptionStatus | string
  variant?: 'default' | 'secondary' | 'destructive' | 'outline'
}

export const RedemptionStatusBadge: FC<RedemptionStatusBadgeProps> = ({ status }) => {
  const getStatusVariant = (status: RedemptionStatus | string): 'default' | 'secondary' | 'destructive' | 'outline' => {
    switch (status) {
      case 'pending':
        return 'outline'
      case 'processing':
        return 'secondary'
      case 'completed':
      case 'sent':
      case 'shipped':
      case 'delivered':
        return 'default'
      case 'failed':
      case 'cancelled':
        return 'destructive'
      default:
        return 'outline'
    }
  }

  const getStatusLabel = (status: RedemptionStatus | string): string => {
    const labels: Record<string, string> = {
      pending: 'Pendente',
      processing: 'Processando',
      completed: 'Concluído',
      sent: 'Enviado',
      shipped: 'Enviado para Entrega',
      delivered: 'Entregue',
      failed: 'Falha',
      cancelled: 'Cancelado',
    }
    return labels[String(status)] || String(status)
  }

  return <Badge variant={getStatusVariant(status)}>{getStatusLabel(status)}</Badge>
}

export default RedemptionStatusBadge
