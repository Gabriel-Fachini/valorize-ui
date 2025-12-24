import { useState, useEffect, useCallback, useMemo } from 'react'
import { usePrizeById, useRedeemPrize } from '@/hooks/usePrizes'
import { useAddresses, useCreateAddress, useUpdateAddress, useDeleteAddress } from '@/hooks/useAddresses'
import { useUser } from '@/hooks/useUser'
import type { Address, AddressInput } from '@/types/address.types'
import type { Prize, PrizeVariant } from '@/types/prize.types'

interface UsePrizeConfirmationProps {
  prizeId: string
  variantId?: string
}

interface UsePrizeConfirmationReturn {
  // Data
  prize: Prize | undefined
  selectedVariant: PrizeVariant | undefined
  addresses: Address[]
  selectedAddressId: string | undefined
  isVoucher: boolean

  // Loading states
  isLoading: boolean
  isRedeeming: boolean
  isCreatingAddress: boolean
  isUpdatingAddress: boolean
  isDeletingAddress: boolean

  // Error states
  errorMessage: string | null

  // Modal states
  showAddressModal: boolean
  showSuccessModal: boolean
  editingAddress: string | null

  // Actions
  setSelectedAddressId: (id: string) => void
  handleOpenAddressModal: (addressId?: string) => void
  handleCloseAddressModal: () => void
  handleSaveAddress: (input: AddressInput) => Promise<void>
  handleDeleteAddress: (addressId: string) => void
  handleConfirmRedemption: () => Promise<void>
  handleCloseSuccessModal: () => void
  setErrorMessage: (message: string | null) => void
}

export const usePrizeConfirmation = ({
  prizeId,
  variantId,
}: UsePrizeConfirmationProps): UsePrizeConfirmationReturn => {
  // Data fetching
  const { data: prize, isLoading: prizeLoading } = usePrizeById(prizeId)
  const { data: addresses = [], isLoading: addressesLoading } = useAddresses()
  const { onBalanceMovement } = useUser()
  
  // Mutations
  const redeemMutation = useRedeemPrize()
  const createAddressMutation = useCreateAddress()
  const updateAddressMutation = useUpdateAddress()
  const deleteAddressMutation = useDeleteAddress()
  
  // Local state
  const [selectedAddressId, setSelectedAddressId] = useState<string | undefined>(undefined)
  const [showAddressModal, setShowAddressModal] = useState(false)
  const [editingAddress, setEditingAddress] = useState<string | null>(null)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  
  // Computed values
  const selectedVariant = useMemo(() => {
    return prize?.variants?.find(v => v.id === variantId)
  }, [prize?.variants, variantId])

  const isVoucher = useMemo(() => {
    return prize?.type === 'voucher'
  }, [prize?.type])

  const isLoading = prizeLoading || addressesLoading

  // Auto-select default address (fixed bug) - Skip for vouchers
  useEffect(() => {
    if (isVoucher) return // Vouchers don't need address selection

    if (addresses.length > 0 && !selectedAddressId) {
      const defaultAddress = addresses.find(addr => addr.isDefault)
      const addressToSelect = defaultAddress?.id ?? addresses[0]?.id
      if (addressToSelect) {
        setSelectedAddressId(addressToSelect)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addresses.length, selectedAddressId, isVoucher]) // Only depend on length to avoid infinite loops
  
  // Address modal handlers
  const handleOpenAddressModal = useCallback((addressId?: string) => {
    setEditingAddress(addressId ?? null)
    setShowAddressModal(true)
  }, [])
  
  const handleCloseAddressModal = useCallback(() => {
    setShowAddressModal(false)
    setEditingAddress(null)
  }, [])
  
  const handleSaveAddress = useCallback(async (input: AddressInput) => {
    try {
      if (editingAddress) {
        await updateAddressMutation.mutateAsync({ id: editingAddress, input })
      } else {
        const newAddress = await createAddressMutation.mutateAsync(input)
        setSelectedAddressId(newAddress.id)
      }
      handleCloseAddressModal()
    } catch (error) {
      if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.error('Error saving address:', error)
      }
      setErrorMessage('Erro ao salvar endereço. Tente novamente.')
      throw error
    }
  }, [editingAddress, updateAddressMutation, createAddressMutation, handleCloseAddressModal])
  
  const handleDeleteAddress = useCallback(async (addressId: string) => {
    try {
      await deleteAddressMutation.mutateAsync(addressId)
      if (selectedAddressId === addressId) {
        setSelectedAddressId(undefined)
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.error('Error deleting address:', error)
      }
      setErrorMessage('Erro ao excluir endereço. Tente novamente.')
    }
  }, [deleteAddressMutation, selectedAddressId])
  
  const handleConfirmRedemption = useCallback(async () => {
    // Only require address for physical products
    if (!isVoucher && !selectedAddressId) {
      setErrorMessage('Por favor, selecione um endereço para entrega')
      return
    }

    if (!prize) return

    try {
      await redeemMutation.mutateAsync({
        prizeId: prize.id,
        variantId: variantId,
        addressId: isVoucher ? undefined : selectedAddressId,
      })

      onBalanceMovement()
      setShowSuccessModal(true)
    } catch (error) {
      if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.error('Error redeeming prize:', error)
      }
      const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message
      setErrorMessage(errorMessage ?? 'Erro ao resgatar prêmio. Verifique seu saldo e tente novamente.')
    }
  }, [isVoucher, selectedAddressId, prize, variantId, redeemMutation, onBalanceMovement])
  
  const handleCloseSuccessModal = useCallback(() => {
    setShowSuccessModal(false)
  }, [])
  
  return {
    // Data
    prize: prize ?? undefined,
    selectedVariant,
    addresses,
    selectedAddressId,
    isVoucher,

    // Loading states
    isLoading,
    isRedeeming: redeemMutation.isPending,
    isCreatingAddress: createAddressMutation.isPending,
    isUpdatingAddress: updateAddressMutation.isPending,
    isDeletingAddress: deleteAddressMutation.isPending,

    // Error states
    errorMessage,

    // Modal states
    showAddressModal,
    showSuccessModal,
    editingAddress,

    // Actions
    setSelectedAddressId,
    handleOpenAddressModal,
    handleCloseAddressModal,
    handleSaveAddress,
    handleDeleteAddress,
    handleConfirmRedemption,
    handleCloseSuccessModal,
    setErrorMessage,
  }
}
