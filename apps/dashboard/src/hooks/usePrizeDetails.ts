import { useState, useEffect, useCallback, useMemo } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Prize, PrizeVariant } from '@/types/prize.types'

interface UsePrizeDetailsProps {
  prize: Prize | undefined
}

interface UsePrizeDetailsReturn {
  selectedVariantId: string | undefined
  setSelectedVariantId: (id: string | undefined) => void
  handleVariantChange: (variantId: string) => void
  handleProceedToConfirm: () => void
  selectedVariant: PrizeVariant | undefined
  hasStockIssue: boolean
  canProceed: boolean
}

export const usePrizeDetails = ({ prize }: UsePrizeDetailsProps): UsePrizeDetailsReturn => {
  const navigate = useNavigate()
  const [selectedVariantId, setSelectedVariantId] = useState<string | undefined>(undefined)

  // Memoize selected variant
  const selectedVariant = useMemo(() => {
    if (!prize?.variants || !selectedVariantId) return undefined
    return prize.variants.find(variant => variant.id === selectedVariantId)
  }, [prize?.variants, selectedVariantId])

  // Check if there are stock issues
  const hasStockIssue = useMemo(() => {
    if (!prize) return false
    
    // If no variants, check main stock
    if (!prize.variants || prize.variants.length === 0) {
      return prize.stock === 0
    }
    
    // If has variants, check if all are out of stock
    return prize.variants.every(variant => variant.stock === 0)
  }, [prize])

  // Check if user can proceed with redemption
  const canProceed = useMemo(() => {
    if (!prize || hasStockIssue) return false
    
    // If no variants, can proceed
    if (!prize.variants || prize.variants.length === 0) {
      return true
    }
    
    // If has variants, must have one selected and it must be in stock
    if (!selectedVariantId) return false
    
    const variant = prize.variants.find(v => v.id === selectedVariantId)
    return variant ? variant.stock > 0 : false
  }, [prize, selectedVariantId, hasStockIssue])

  // Auto-select first available variant with stock
  useEffect(() => {
    if (!prize?.variants || prize.variants.length === 0 || selectedVariantId) return

    const availableVariant = prize.variants.find(variant => variant.stock > 0)
    if (availableVariant) {
      setSelectedVariantId(availableVariant.id)
    }
  }, [prize?.variants, selectedVariantId])

  // Handle variant selection
  const handleVariantChange = useCallback((variantId: string) => {
    setSelectedVariantId(variantId)
  }, [])

  // Handle proceed to confirmation
  const handleProceedToConfirm = useCallback(() => {
    if (!prize || !canProceed) return

    // Validate variant selection if prize has variants
    if (prize.variants && prize.variants.length > 0 && !selectedVariantId) {
      // This should not happen due to canProceed check, but just in case
      return
    }

    // Navigate to confirmation page
    navigate({ 
      to: '/prizes/$prizeId/confirm',
      params: { prizeId: prize.id },
      search: { variantId: selectedVariantId },
    })
  }, [prize, canProceed, selectedVariantId, navigate])

  return {
    selectedVariantId,
    setSelectedVariantId,
    handleVariantChange,
    handleProceedToConfirm,
    selectedVariant,
    hasStockIssue,
    canProceed,
  }
}
