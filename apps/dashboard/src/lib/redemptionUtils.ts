import type { Redemption } from '@/types/redemption.types'

// Constants
export const CANCEL_WINDOW_MS = 24 * 60 * 60 * 1000 // 24 hours
export const COUNTDOWN_SECONDS = 3
export const FALLBACK_PRIZE_IMAGE = '/valorize_logo.png'

// Utility functions
export const isVoucherRedemption = (redemption: Redemption | null): boolean => {
  if (!redemption) return false
  // Check if prize type exists and is voucher (case-insensitive)
  const prizeType = redemption.prize?.type
  if (!prizeType) return false
  return prizeType.toLowerCase() === 'voucher'
}

export const canCancelRedemption = (redemption: Redemption | null): boolean => {
  if (!redemption) return false

  // Vouchers cannot be cancelled
  if (isVoucherRedemption(redemption)) return false

  const status = redemption.status.toLowerCase()
  // Final states that cannot be cancelled
  if (status === 'cancelled' || status === 'delivered' || status === 'refunded' || status === 'completed') {
    return false
  }

  const created = new Date(redemption.redeemedAt).getTime()
  const now = Date.now()
  return now - created <= CANCEL_WINDOW_MS
}

export const formatRedemptionDate = (dateString: string): string => {
  return new Date(dateString).toLocaleString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export const formatCoinsAmount = (amount: number): string => {
  return new Intl.NumberFormat('pt-BR').format(amount)
}

export const getPrizeImage = (redemption: Redemption): string => {
  return redemption.prize?.images?.[0] ?? FALLBACK_PRIZE_IMAGE
}

export const getPrizeName = (redemption: Redemption): string => {
  return redemption.prize?.name ?? `Resgate #${redemption.id.slice(0, 8).toUpperCase()}`
}

export const getPrizeCategory = (redemption: Redemption): string => {
  return redemption.prize?.category ?? 'Prêmio'
}

export const getVariantInfo = (redemption: Redemption): string | null => {
  return redemption.variant ? `${redemption.variant.name}: ${redemption.variant.value}` : null
}
