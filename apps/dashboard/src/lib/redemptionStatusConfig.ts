import { statusColors } from './colors'

export interface StatusInfo {
  badge: string
  icon: string
  label: string
}

export const redemptionStatusConfig: Record<string, StatusInfo> = {
  pending: {
    badge: `${statusColors.pending.bg} ${statusColors.pending.text} ${statusColors.pending.border}`,
    icon: 'ph-bold ph-clock',
    label: 'Pendente',
  },
  processing: {
    badge: `${statusColors.processing.bg} ${statusColors.processing.text} ${statusColors.processing.border}`,
    icon: 'ph-bold ph-arrows-clockwise',
    label: 'Processando',
  },
  shipped: {
    badge: `${statusColors.shipped.bg} ${statusColors.shipped.text} ${statusColors.shipped.border}`,
    icon: 'ph-bold ph-package',
    label: 'Enviado',
  },
  delivered: {
    badge: `${statusColors.completed.bg} ${statusColors.completed.text} ${statusColors.completed.border}`,
    icon: 'ph-bold ph-check-circle',
    label: 'Concluído',
  },
  completed: {
    badge: `${statusColors.completed.bg} ${statusColors.completed.text} ${statusColors.completed.border}`,
    icon: 'ph-bold ph-check-circle',
    label: 'Concluído',
  },
  cancelled: {
    badge: `${statusColors.cancelled.bg} ${statusColors.cancelled.text} ${statusColors.cancelled.border}`,
    icon: 'ph-bold ph-x-circle',
    label: 'Cancelado',
  },
  sent: {
    badge: `${statusColors.sent.bg} ${statusColors.sent.text} ${statusColors.sent.border}`,
    icon: 'ph-bold ph-check-circle',
    label: 'Enviado',
  },
  failed: {
    badge: `${statusColors.failed.bg} ${statusColors.failed.text} ${statusColors.failed.border}`,
    icon: 'ph-bold ph-warning-circle',
    label: 'Falha no envio',
  },
  refunded: {
    badge: `${statusColors.refunded.bg} ${statusColors.refunded.text} ${statusColors.refunded.border}`,
    icon: 'ph-bold ph-arrow-counter-clockwise',
    label: 'Reembolsado',
  },
}

export const getStatusInfo = (status: string): StatusInfo => {
  const safeStatus = status.toLowerCase()
  return redemptionStatusConfig[safeStatus] ?? redemptionStatusConfig.pending
}
