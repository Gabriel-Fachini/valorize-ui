import { useParams, useSearch, useNavigate } from '@tanstack/react-router'
import { usePageEntrance } from '@/hooks/useAnimations'
import { usePrizeConfirmation } from '@/hooks/usePrizeConfirmation'
import { PageLayout } from '@/components/layout/PageLayout'
import { Button } from '@/components/ui/button'
import { BackButton } from '@/components/ui/BackButton'
import { Modal, ModalHeader, ModalTitle, ModalContent } from '@/components/ui/modal'
import { useAlertDialog } from '@/components/ui/alert-dialog'
import { ErrorState } from '@/components/ui/ErrorState'
import { PrizeSummaryCard } from '@/components/prizes/PrizeSummaryCard'
import { AddressSelector } from '@/components/prizes/AddressSelector'
import { ConfirmationPageSkeleton } from '@/components/prizes/ConfirmationPageSkeleton'
import { AddressForm } from '@/components/ui/AddressForm'
import { animated } from '@react-spring/web'

export const PrizeConfirmationPage = () => {
  const { prizeId } = useParams({ strict: false })
  const search = useSearch({ strict: false })
  const variantId = (search as { variantId?: string }).variantId
  const navigate = useNavigate()
  
  const fadeIn = usePageEntrance()
  const { showAlert, AlertDialog: AlertDialogComponent } = useAlertDialog()
  
  const {
    prize,
    selectedVariant,
    addresses,
    selectedAddressId,
    isLoading,
    isRedeeming,
    isCreatingAddress,
    isUpdatingAddress,
    isDeletingAddress: _isDeletingAddress,
    errorMessage,
    showAddressModal,
    showSuccessModal,
    editingAddress,
    setSelectedAddressId,
    handleOpenAddressModal,
    handleCloseAddressModal,
    handleSaveAddress,
    handleDeleteAddress,
    handleConfirmRedemption,
    handleCloseSuccessModal,
    setErrorMessage,
  } = usePrizeConfirmation({ prizeId, variantId })

  const handleDeleteWithConfirmation = (addressId: string) => {
    showAlert({
      title: 'Excluir Endereço',
      description: 'Tem certeza que deseja excluir este endereço? Esta ação não pode ser desfeita.',
      confirmText: 'Excluir',
      cancelText: 'Cancelar',
      variant: 'destructive',
      onConfirm: () => handleDeleteAddress(addressId),
    })
  }

  if (isLoading) {
    return <ConfirmationPageSkeleton />
  }

  if (!prize) {
    return (
      <PageLayout maxWidth="4xl">
        <ErrorState
          title="Prêmio não encontrado"
          message="O prêmio que você está tentando resgatar não foi encontrado ou não está mais disponível."
          onRetry={() => window.location.reload()}
          retryLabel="Tentar novamente"
        />
      </PageLayout>
    )
  }

  return (
    <PageLayout maxWidth="4xl">
      <animated.div style={fadeIn} className="relative">
        <BackButton onClick={() => navigate({ to: `/prizes/${prizeId}` })} />

        <h1 className="mb-8 text-3xl font-bold text-gray-900 dark:text-white">
          Confirmar Resgate
        </h1>

        {errorMessage && (
          <div className="mb-6 rounded-2xl border border-red-200 dark:border-red-500/20 bg-red-50 dark:bg-red-500/10 p-4 backdrop-blur-xl">
            <div className="flex items-start gap-3">
              <i className="ph-bold ph-warning-circle text-red-600 dark:text-red-400 text-xl flex-shrink-0" />
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
          <PrizeSummaryCard 
            prize={prize} 
            selectedVariant={selectedVariant} 
          />

          <AddressSelector
            addresses={addresses}
            selectedAddressId={selectedAddressId}
            onSelectAddress={setSelectedAddressId}
            onAddAddress={() => handleOpenAddressModal()}
            onEditAddress={handleOpenAddressModal}
            onDeleteAddress={handleDeleteWithConfirmation}
          />

          <Button
            onClick={handleConfirmRedemption}
            disabled={!selectedAddressId || isRedeeming}
            size="lg"
            className="w-full bg-green-600 hover:bg-green-700 text-white text-lg font-semibold"
          >
            {isRedeeming ? (
              <>
                <i className="ph ph-circle-notch animate-spin" />
                Processando...
              </>
            ) : (
              <>
                <i className="ph-bold ph-check-circle" />
                Confirmar Resgate
              </>
            )}
          </Button>
        </div>
      </animated.div>

      {/* Address Modal */}
      <Modal
        isOpen={showAddressModal}
        onClose={handleCloseAddressModal}
        size="xl"
      >
        <ModalHeader>
          <ModalTitle>
            {editingAddress ? 'Editar Endereço' : 'Novo Endereço'}
          </ModalTitle>
        </ModalHeader>

        <ModalContent>
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
            isSubmitting={isCreatingAddress || isUpdatingAddress}
            submitLabel={editingAddress ? 'Salvar alterações' : 'Salvar'}
          />
        </ModalContent>
      </Modal>

      {/* Success Modal */}
      <Modal
        isOpen={showSuccessModal}
        onClose={handleCloseSuccessModal}
        size="md"
        showCloseButton={false}
      >
        <div className="text-center">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-500/20 mx-auto">
            <i className="ph-bold ph-check-circle text-green-600 dark:text-green-400 text-4xl" />
          </div>

          <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
            Prêmio Resgatado!
          </h2>

          <p className="mb-6 text-gray-600 dark:text-gray-400">
            Seu prêmio foi resgatado com sucesso. Acompanhe o status na página de resgates.
          </p>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => window.location.href = '/prizes'}
              className="flex-1"
            >
              <i className="ph ph-storefront" />
              Voltar para a Loja
            </Button>
            <Button
              onClick={handleCloseSuccessModal}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            >
              <i className="ph-bold ph-package" />
              Ver Resgates
            </Button>
          </div>
        </div>
      </Modal>

      {/* Alert Dialog */}
      {AlertDialogComponent}
    </PageLayout>
  )
}

