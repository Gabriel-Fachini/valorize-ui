import { useState, useEffect } from 'react'
import { useParams, useNavigate, useSearch } from '@tanstack/react-router'
import { usePrizeById, useRedeemPrize } from '@/hooks/usePrizes'
import { useAddresses, useCreateAddress, useUpdateAddress, useDeleteAddress } from '@/hooks/useAddresses'
import { useUser } from '@/hooks/useUser'
import { useSpring, animated } from '@react-spring/web'
import { PageLayout } from '@/components/layout/PageLayout'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AddressForm } from '@/components/ui/AddressForm'
import type { AddressInput } from '@/types/address.types'

export const PrizeConfirmationPage = () => {
  const { prizeId } = useParams({ strict: false })
  const search = useSearch({ strict: false })
  const variantId = (search as { variantId?: string }).variantId
  const navigate = useNavigate()
  
  const { data: prize, isLoading: prizeLoading } = usePrizeById(prizeId)
  const { data: addresses = [], isLoading: addressesLoading } = useAddresses()
  const { onBalanceMovement } = useUser()
  
  const redeemMutation = useRedeemPrize()
  const createAddressMutation = useCreateAddress()
  const updateAddressMutation = useUpdateAddress()
  const deleteAddressMutation = useDeleteAddress()

  const [selectedAddressId, setSelectedAddressId] = useState<string | undefined>(undefined)
  const [showAddressModal, setShowAddressModal] = useState(false)
  const [editingAddress, setEditingAddress] = useState<string | null>(null)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const fadeIn = useSpring({
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0px)' },
    config: { tension: 280, friction: 60 },
  })

  const modalSpring = useSpring({
    from: { opacity: 0, transform: 'scale(0.9)' },
    to: { opacity: showAddressModal || showSuccessModal ? 1 : 0, transform: showAddressModal || showSuccessModal ? 'scale(1)' : 'scale(0.9)' },
    config: { tension: 300, friction: 20 },
  })

  // Auto-select default address
  useEffect(() => {
    if (addresses.length > 0 && !selectedAddressId) {
      const defaultAddress = addresses.find(addr => addr.isDefault)
      setSelectedAddressId(defaultAddress?.id ?? addresses[0].id)
    }
  }, [addresses, selectedAddressId])

  const selectedVariant = prize?.variants?.find(v => v.id === variantId)

  const handleOpenAddressModal = (addressId?: string) => {
    setEditingAddress(addressId ?? null)
    setShowAddressModal(true)
  }

  const handleCloseAddressModal = () => {
    setShowAddressModal(false)
    setEditingAddress(null)
  }

  const handleSaveAddress = async (input: AddressInput) => {
    try {
      if (editingAddress) {
        await updateAddressMutation.mutateAsync({ id: editingAddress, input })
      } else {
        const newAddress = await createAddressMutation.mutateAsync(input)
        setSelectedAddressId(newAddress.id)
      }
      handleCloseAddressModal()
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error saving address:', error)
      setErrorMessage('Erro ao salvar endereço. Tente novamente.')
      throw error // Re-throw to let the form handle it
    }
  }

  const handleDeleteAddress = async (addressId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este endereço?')) {
      try {
        await deleteAddressMutation.mutateAsync(addressId)
        if (selectedAddressId === addressId) {
          setSelectedAddressId(undefined)
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error deleting address:', error)
        setErrorMessage('Erro ao excluir endereço. Tente novamente.')
      }
    }
  }

  const handleConfirmRedemption = async () => {
    if (!selectedAddressId) {
      setErrorMessage('Por favor, selecione um endereço para entrega')
      return
    }

    if (!prize) return

    try {
      await redeemMutation.mutateAsync({
        prizeId: prize.id,
        variantId: variantId,
        addressId: selectedAddressId,
      })
      
      onBalanceMovement()
      setShowSuccessModal(true)
    } catch (error: unknown) {
      // eslint-disable-next-line no-console
      console.error('Error redeeming prize:', error)
      const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message
      setErrorMessage(errorMessage ?? 'Erro ao resgatar prêmio. Verifique seu saldo e tente novamente.')
    }
  }

  if (prizeLoading || addressesLoading) {
    return (
      <PageLayout maxWidth="4xl">
        <div className="relative">
          <animated.div style={fadeIn} className="space-y-6">
            {/* Back button skeleton */}
            <div className="h-10 w-24 rounded-lg bg-gray-200 dark:bg-[#262626] animate-pulse" />

            {/* Title skeleton */}
            <div className="h-9 w-64 rounded-lg bg-gray-200 dark:bg-[#262626] animate-pulse" />

            {/* Prize Summary skeleton */}
            <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 p-6 backdrop-blur-xl">
              <div className="mb-4 h-7 w-48 rounded-lg bg-gray-200 dark:bg-[#262626] animate-pulse" />
              <div className="flex gap-4">
                <div className="h-24 w-24 rounded-lg bg-gray-200 dark:bg-[#262626] animate-pulse" />
                <div className="flex-1 space-y-3">
                  <div className="h-6 w-3/4 rounded-lg bg-gray-200 dark:bg-[#262626] animate-pulse" />
                  <div className="h-5 w-1/2 rounded-full bg-gray-200 dark:bg-[#262626] animate-pulse" />
                  <div className="h-8 w-32 rounded-lg bg-gray-200 dark:bg-[#262626] animate-pulse" />
                </div>
              </div>
            </div>

            {/* Address Selection skeleton */}
            <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 p-6 backdrop-blur-xl">
              <div className="mb-4 flex items-center justify-between">
                <div className="h-7 w-56 rounded-lg bg-gray-200 dark:bg-[#262626] animate-pulse" />
                <div className="h-10 w-40 rounded-lg bg-gray-200 dark:bg-[#262626] animate-pulse" />
              </div>
              <div className="space-y-3">
                <div className="h-32 rounded-lg bg-gray-200 dark:bg-[#262626] animate-pulse" />
                <div className="h-32 rounded-lg bg-gray-200 dark:bg-[#262626] animate-pulse" />
              </div>
            </div>

            {/* Confirmation Button skeleton */}
            <div className="h-14 w-full rounded-xl bg-gray-200 dark:bg-[#262626] animate-pulse" />
          </animated.div>
        </div>
      </PageLayout>
    )
  }

  if (!prize) {
    return (
      <PageLayout maxWidth="4xl">
        <div className="flex min-h-[60vh] items-center justify-center p-4">
          <div className="rounded-2xl border border-red-200 dark:border-red-500/20 bg-red-50 dark:bg-red-500/10 p-8 text-center backdrop-blur-xl">
            <i className="ph-bold ph-warning-circle text-red-600 dark:text-red-400 text-6xl mb-4 block"></i>
            <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">Prêmio não encontrado</h2>
            <Button
              onClick={() => navigate({ to: '/prizes' })}
              className="mt-4 bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900"
            >
              <i className="ph ph-storefront"></i>
              Voltar para a loja
            </Button>
          </div>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout maxWidth="4xl">
      <animated.div style={fadeIn} className="relative">
        <Button
          variant="outline"
          onClick={() => navigate({ to: `/prizes/${prizeId}` })}
          className="mb-6"
        >
          <i className="ph ph-arrow-left"></i>
          Voltar
        </Button>

        <h1 className="mb-8 text-3xl font-bold text-gray-900 dark:text-white">
          Confirmar Resgate
        </h1>

        {errorMessage && (
          <div className="mb-6 rounded-2xl border border-red-200 dark:border-red-500/20 bg-red-50 dark:bg-red-500/10 p-4 backdrop-blur-xl">
            <div className="flex items-start gap-3">
              <i className="ph-bold ph-warning-circle text-red-600 dark:text-red-400 text-xl flex-shrink-0"></i>
              <div className="flex-1">
                <p className="text-red-600 dark:text-red-400">{errorMessage}</p>
                <Button
                  variant="link"
                  onClick={() => setErrorMessage(null)}
                  className="mt-2 h-auto p-0 text-red-600 dark:text-red-400"
                >
                  Fechar
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {/* Prize Summary */}
          <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 p-6 backdrop-blur-xl">
            <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Resumo do Prêmio</h2>
            
            <div className="flex gap-4">
              <img
                src={prize.images[0]}
                alt={prize.name}
                className="h-24 w-24 rounded-lg object-cover"
              />
              
              <div className="flex-1">
                <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">{prize.name}</h3>
                
                <div className="mb-2 flex items-center gap-2">
                  <Badge variant="secondary" className="rounded-full">
                    {prize.category}
                  </Badge>
                  {selectedVariant && (
                    <Badge variant="outline" className="rounded-full">
                      {selectedVariant.name}: {selectedVariant.value}
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    {prize.coinPrice.toLocaleString('pt-BR')}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">moedas</span>
                </div>
              </div>
            </div>
          </div>

          {/* Address Selection */}
          <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 p-6 backdrop-blur-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Endereço de Entrega</h2>
              <Button
                onClick={() => handleOpenAddressModal()}
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <i className="ph-bold ph-plus"></i>
                Novo Endereço
              </Button>
            </div>

            {addresses.length === 0 ? (
              <div className="py-8 text-center">
                <i className="ph-bold ph-map-pin text-gray-400 dark:text-gray-600 text-5xl mb-4 block"></i>
                <p className="mb-4 text-gray-600 dark:text-gray-400">
                  Você ainda não tem nenhum endereço cadastrado
                </p>
                <Button
                  onClick={() => handleOpenAddressModal()}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <i className="ph-bold ph-plus"></i>
                  Cadastrar Endereço
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {addresses.map(address => (
                  <div
                    key={address.id}
                    onClick={() => setSelectedAddressId(address.id)}
                    className={`cursor-pointer rounded-lg border-2 p-4 transition-all ${
                      selectedAddressId === address.id
                        ? 'border-green-500 bg-green-50 dark:bg-green-500/10'
                        : 'border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 hover:border-gray-300 dark:hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="mb-1 flex items-center gap-2">
                          <input
                            type="radio"
                            checked={selectedAddressId === address.id}
                            onChange={() => setSelectedAddressId(address.id)}
                            className="h-4 w-4 text-green-600 focus:ring-green-500"
                          />
                          <h3 className="font-semibold text-gray-900 dark:text-white">{address.name}</h3>
                          {address.isDefault && (
                            <Badge className="bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-500/20">
                              Padrão
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {address.street}, {address.number}
                          {address.complement && ` - ${address.complement}`}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {address.neighborhood && `${address.neighborhood} - `}
                          {address.city}, {address.state} - CEP: {address.zipCode}
                        </p>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleOpenAddressModal(address.id)
                          }}
                        >
                          <i className="ph ph-pencil-simple"></i>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteAddress(address.id)
                          }}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-500/10"
                        >
                          <i className="ph ph-trash"></i>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Confirmation Button */}
          <Button
            onClick={handleConfirmRedemption}
            disabled={!selectedAddressId || redeemMutation.isPending}
            size="lg"
            className="w-full bg-green-600 hover:bg-green-700 text-white text-lg font-semibold"
          >
            {redeemMutation.isPending ? (
              <>
                <i className="ph ph-circle-notch animate-spin"></i>
                Processando...
              </>
            ) : (
              <>
                <i className="ph-bold ph-check-circle"></i>
                Confirmar Resgate
              </>
            )}
          </Button>
        </div>
      </animated.div>

      {/* Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 dark:bg-black/50 p-4 backdrop-blur-sm">
          <animated.div
            style={modalSpring}
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#262626] p-6 backdrop-blur-xl"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {editingAddress ? 'Editar Endereço' : 'Novo Endereço'}
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCloseAddressModal}
              >
                <i className="ph ph-x text-xl"></i>
              </Button>
            </div>

            <AddressForm
              defaultValues={editingAddress ? (() => {
                const addr = addresses.find(a => a.id === editingAddress)
                return addr ? {
                  name: addr.name,
                  street: addr.street,
                  number: addr.number,
                  complement: addr.complement ?? '',
                  neighborhood: addr.neighborhood ?? '',
                  city: addr.city,
                  state: addr.state,
                  zipCode: addr.zipCode,
                  country: addr.country,
                  phone: addr.phone ?? '',
                } : undefined
              })() : undefined}
              onSubmit={handleSaveAddress}
              onCancel={handleCloseAddressModal}
              isSubmitting={createAddressMutation.isPending || updateAddressMutation.isPending}
              submitLabel={editingAddress ? 'Salvar alterações' : 'Salvar'}
            />
          </animated.div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 dark:bg-black/80 p-4 backdrop-blur-sm">
          <animated.div
            style={modalSpring}
            className="w-full max-w-md rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#262626] p-8 backdrop-blur-xl"
          >
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-500/20 mx-auto">
              <i className="ph-bold ph-check-circle text-green-600 dark:text-green-400 text-4xl"></i>
            </div>

            <h2 className="mb-4 text-center text-2xl font-bold text-gray-900 dark:text-white">
              Prêmio Resgatado!
            </h2>

            <p className="mb-6 text-center text-gray-600 dark:text-gray-400">
              Seu prêmio foi resgatado com sucesso. Acompanhe o status na página de resgates.
            </p>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => navigate({ to: '/prizes' })}
                className="flex-1"
              >
                <i className="ph ph-storefront"></i>
                Voltar para a Loja
              </Button>
              <Button
                onClick={() => navigate({ to: '/resgates' })}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              >
                <i className="ph-bold ph-package"></i>
                Ver Resgates
              </Button>
            </div>
          </animated.div>
        </div>
      )}
    </PageLayout>
  )
}

