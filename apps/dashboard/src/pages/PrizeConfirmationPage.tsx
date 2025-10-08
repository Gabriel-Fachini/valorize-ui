import { useState, useEffect } from 'react'
import { useParams, useNavigate, useSearch } from '@tanstack/react-router'
import { usePrizeById, useRedeemPrize } from '@/hooks/usePrizes'
import { useAddresses, useCreateAddress, useUpdateAddress, useDeleteAddress } from '@/hooks/useAddresses'
import { useUser } from '@/hooks/useUser'
import { useSpring, animated } from '@react-spring/web'
import { PageLayout } from '@/components/layout/PageLayout'
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

  const [addressForm, setAddressForm] = useState<AddressInput>({
    name: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'BR',
    phone: '',
  })

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
    if (addressId) {
      const address = addresses.find(a => a.id === addressId)
      if (address) {
        setEditingAddress(addressId)
        setAddressForm({
          name: address.name,
          street: address.street,
          number: address.number,
          complement: address.complement ?? '',
          neighborhood: address.neighborhood ?? '',
          city: address.city,
          state: address.state,
          zipCode: address.zipCode,
          country: address.country,
          phone: address.phone ?? '',
        })
      }
    } else {
      setEditingAddress(null)
      setAddressForm({
        name: '',
        street: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'BR',
        phone: '',
      })
    }
    setShowAddressModal(true)
  }

  const handleCloseAddressModal = () => {
    setShowAddressModal(false)
    setEditingAddress(null)
  }

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (editingAddress) {
        await updateAddressMutation.mutateAsync({ id: editingAddress, input: addressForm })
      } else {
        const newAddress = await createAddressMutation.mutateAsync(addressForm)
        setSelectedAddressId(newAddress.id)
      }
      handleCloseAddressModal()
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error saving address:', error)
      setErrorMessage('Erro ao salvar endereço. Tente novamente.')
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

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      eletronicos: 'from-blue-500/20 to-cyan-500/20',
      electronics: 'from-blue-500/20 to-cyan-500/20',
      casa: 'from-amber-500/20 to-orange-500/20',
      'home-office': 'from-amber-500/20 to-orange-500/20',
      esporte: 'from-green-500/20 to-emerald-500/20',
      livros: 'from-purple-500/20 to-pink-500/20',
      'vale-compras': 'from-red-500/20 to-rose-500/20',
      'gift-cards': 'from-red-500/20 to-rose-500/20',
      experiencias: 'from-indigo-500/20 to-purple-500/20',
      experiences: 'from-indigo-500/20 to-purple-500/20',
    }
    return colors[category] ?? 'from-gray-500/20 to-gray-600/20'
  }

  if (prizeLoading || addressesLoading) {
    return (
      <PageLayout maxWidth="4xl">
        <div className="relative">
          <animated.div style={fadeIn} className="space-y-6">
            {/* Back button skeleton */}
            <div className="h-10 w-24 rounded-lg bg-gray-200 dark:bg-gray-800 animate-pulse" />

            {/* Title skeleton */}
            <div className="h-9 w-64 rounded-lg bg-gray-200 dark:bg-gray-800 animate-pulse" />

            {/* Prize Summary skeleton */}
            <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 p-6 backdrop-blur-xl">
              <div className="mb-4 h-7 w-48 rounded-lg bg-gray-200 dark:bg-gray-800 animate-pulse" />
              <div className="flex gap-4">
                <div className="h-24 w-24 rounded-lg bg-gray-200 dark:bg-gray-800 animate-pulse" />
                <div className="flex-1 space-y-3">
                  <div className="h-6 w-3/4 rounded-lg bg-gray-200 dark:bg-gray-800 animate-pulse" />
                  <div className="h-5 w-1/2 rounded-full bg-gray-200 dark:bg-gray-800 animate-pulse" />
                  <div className="h-8 w-32 rounded-lg bg-gray-200 dark:bg-gray-800 animate-pulse" />
                </div>
              </div>
            </div>

            {/* Address Selection skeleton */}
            <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 p-6 backdrop-blur-xl">
              <div className="mb-4 flex items-center justify-between">
                <div className="h-7 w-56 rounded-lg bg-gray-200 dark:bg-gray-800 animate-pulse" />
                <div className="h-10 w-40 rounded-lg bg-gray-200 dark:bg-gray-800 animate-pulse" />
              </div>
              <div className="space-y-3">
                <div className="h-32 rounded-lg bg-gray-200 dark:bg-gray-800 animate-pulse" />
                <div className="h-32 rounded-lg bg-gray-200 dark:bg-gray-800 animate-pulse" />
              </div>
            </div>

            {/* Confirmation Button skeleton */}
            <div className="h-14 w-full rounded-xl bg-gray-200 dark:bg-gray-800 animate-pulse" />
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
            <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">Prêmio não encontrado</h2>
            <button
              onClick={() => navigate({ to: '/prizes' })}
              className="mt-4 rounded-lg bg-purple-600 px-4 py-2 text-white hover:bg-purple-700"
            >
              Voltar para a loja
            </button>
          </div>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout maxWidth="4xl">
      <animated.div style={fadeIn} className="relative">
        <button
          onClick={() => navigate({ to: `/prizes/${prizeId}` })}
          className="mb-6 flex items-center gap-2 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 px-4 py-2 text-sm text-gray-700 dark:text-white backdrop-blur-xl transition-all hover:border-gray-300 dark:hover:border-white/20 hover:bg-gray-50 dark:hover:bg-white/10"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Voltar
        </button>

        <h1 className="mb-8 text-3xl font-bold text-gray-900 dark:text-white">
          Confirmar Resgate
        </h1>

        {errorMessage && (
          <div className="mb-6 rounded-2xl border border-red-200 dark:border-red-500/20 bg-red-50 dark:bg-red-500/10 p-4 backdrop-blur-xl">
            <p className="text-red-600 dark:text-red-400">{errorMessage}</p>
            <button
              onClick={() => setErrorMessage(null)}
              className="mt-2 text-sm text-red-600 dark:text-red-400 underline"
            >
              Fechar
            </button>
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
                  <span className={`rounded-full bg-gradient-to-r ${getCategoryColor(prize.category)} px-3 py-1 text-xs font-medium text-white`}>
                    {prize.category}
                  </span>
                  {selectedVariant && (
                    <span className="rounded-full bg-gray-100 dark:bg-white/10 px-3 py-1 text-xs font-medium text-gray-700 dark:text-gray-300">
                      {selectedVariant.name}: {selectedVariant.value}
                    </span>
                  )}
                </div>
                
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
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
              <button
                onClick={() => handleOpenAddressModal()}
                className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-purple-700"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Novo Endereço
              </button>
            </div>

            {addresses.length === 0 ? (
              <div className="py-8 text-center">
                <p className="mb-4 text-gray-600 dark:text-gray-400">
                  Você ainda não tem nenhum endereço cadastrado
                </p>
                <button
                  onClick={() => handleOpenAddressModal()}
                  className="rounded-lg bg-purple-600 px-6 py-2 font-medium text-white transition-all hover:bg-purple-700"
                >
                  Cadastrar Endereço
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {addresses.map(address => (
                  <div
                    key={address.id}
                    onClick={() => setSelectedAddressId(address.id)}
                    className={`cursor-pointer rounded-lg border-2 p-4 transition-all ${
                      selectedAddressId === address.id
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-500/10'
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
                            className="h-4 w-4 text-purple-600"
                          />
                          <h3 className="font-semibold text-gray-900 dark:text-white">{address.name}</h3>
                          {address.isDefault && (
                            <span className="rounded-full bg-green-100 dark:bg-green-500/20 px-2 py-0.5 text-xs font-medium text-green-700 dark:text-green-300">
                              Padrão
                            </span>
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
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleOpenAddressModal(address.id)
                          }}
                          className="rounded-lg p-2 text-gray-600 dark:text-gray-400 transition-colors hover:bg-gray-100 dark:hover:bg-white/10"
                        >
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteAddress(address.id)
                          }}
                          className="rounded-lg p-2 text-red-600 dark:text-red-400 transition-colors hover:bg-red-100 dark:hover:bg-red-500/10"
                        >
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Confirmation Button */}
          <button
            onClick={handleConfirmRedemption}
            disabled={!selectedAddressId || redeemMutation.isPending}
            className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 py-4 text-lg font-semibold text-white transition-all hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {redeemMutation.isPending ? 'Processando...' : 'Confirmar Resgate'}
          </button>
        </div>
      </animated.div>

      {/* Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 dark:bg-black/80 p-4 backdrop-blur-sm">
          <animated.div
            style={modalSpring}
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900/95 p-6 backdrop-blur-xl"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {editingAddress ? 'Editar Endereço' : 'Novo Endereço'}
              </h2>
              <button
                onClick={handleCloseAddressModal}
                className="rounded-lg p-2 text-gray-600 dark:text-gray-400 transition-colors hover:bg-gray-100 dark:hover:bg-white/10"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSaveAddress} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Nome do Endereço *
                </label>
                <input
                  type="text"
                  required
                  value={addressForm.name}
                  onChange={(e) => setAddressForm({ ...addressForm, name: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 px-3 py-2 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 backdrop-blur-xl focus:border-purple-500 focus:outline-none"
                  placeholder="Ex: Casa, Trabalho"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    CEP *
                  </label>
                  <input
                    type="text"
                    required
                    value={addressForm.zipCode}
                    onChange={(e) => setAddressForm({ ...addressForm, zipCode: e.target.value })}
                    className="w-full rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 px-3 py-2 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 backdrop-blur-xl focus:border-purple-500 focus:outline-none"
                    placeholder="00000-000"
                  />
                </div>
                
                <div className="col-span-2">
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Rua *
                  </label>
                  <input
                    type="text"
                    required
                    value={addressForm.street}
                    onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                    className="w-full rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 px-3 py-2 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 backdrop-blur-xl focus:border-purple-500 focus:outline-none"
                    placeholder="Nome da rua"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Número *
                  </label>
                  <input
                    type="text"
                    required
                    value={addressForm.number}
                    onChange={(e) => setAddressForm({ ...addressForm, number: e.target.value })}
                    className="w-full rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 px-3 py-2 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 backdrop-blur-xl focus:border-purple-500 focus:outline-none"
                    placeholder="123"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Complemento
                  </label>
                  <input
                    type="text"
                    value={addressForm.complement}
                    onChange={(e) => setAddressForm({ ...addressForm, complement: e.target.value })}
                    className="w-full rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 px-3 py-2 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 backdrop-blur-xl focus:border-purple-500 focus:outline-none"
                    placeholder="Apto, Bloco, etc"
                  />
                </div>

                <div className="col-span-2">
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Bairro *
                  </label>
                  <input
                    type="text"
                    required
                    value={addressForm.neighborhood}
                    onChange={(e) => setAddressForm({ ...addressForm, neighborhood: e.target.value })}
                    className="w-full rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 px-3 py-2 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 backdrop-blur-xl focus:border-purple-500 focus:outline-none"
                    placeholder="Nome do bairro"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Cidade *
                  </label>
                  <input
                    type="text"
                    required
                    value={addressForm.city}
                    onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                    className="w-full rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 px-3 py-2 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 backdrop-blur-xl focus:border-purple-500 focus:outline-none"
                    placeholder="Nome da cidade"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Estado *
                  </label>
                  <input
                    type="text"
                    required
                    value={addressForm.state}
                    onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                    className="w-full rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 px-3 py-2 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 backdrop-blur-xl focus:border-purple-500 focus:outline-none"
                    placeholder="SP"
                    maxLength={2}
                  />
                </div>

                <div className="col-span-2">
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Telefone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={addressForm.phone}
                    onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                    className="w-full rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 px-3 py-2 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 backdrop-blur-xl focus:border-purple-500 focus:outline-none"
                    placeholder="(00) 00000-0000"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseAddressModal}
                  className="flex-1 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 py-3 font-semibold text-gray-700 dark:text-white backdrop-blur-xl transition-all hover:bg-gray-50 dark:hover:bg-white/10"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={createAddressMutation.isPending || updateAddressMutation.isPending}
                  className="flex-1 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 py-3 font-semibold text-white transition-all hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50"
                >
                  {createAddressMutation.isPending || updateAddressMutation.isPending ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </form>
          </animated.div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 dark:bg-black/80 p-4 backdrop-blur-sm">
          <animated.div
            style={modalSpring}
            className="w-full max-w-md rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900/95 p-8 backdrop-blur-xl"
          >
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-emerald-500 mx-auto">
              <svg
                className="h-8 w-8 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <h2 className="mb-4 text-center text-2xl font-bold text-gray-900 dark:text-white">
              Prêmio Resgatado!
            </h2>

            <p className="mb-6 text-center text-gray-600 dark:text-gray-400">
              Seu prêmio foi resgatado com sucesso. Acompanhe o status na página de resgates.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => navigate({ to: '/prizes' })}
                className="flex-1 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 py-3 font-semibold text-gray-700 dark:text-white backdrop-blur-xl transition-all hover:bg-gray-50 dark:hover:bg-white/10"
              >
                Voltar para a Loja
              </button>
              <button
                onClick={() => navigate({ to: '/resgates' })}
                className="flex-1 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 py-3 font-semibold text-white transition-all hover:from-purple-700 hover:to-indigo-700"
              >
                Ver Resgates
              </button>
            </div>
          </animated.div>
        </div>
      )}
    </PageLayout>
  )
}

