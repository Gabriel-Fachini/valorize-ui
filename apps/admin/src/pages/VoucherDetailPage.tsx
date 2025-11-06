/**
 * Voucher Detail Page
 * Page for viewing and managing a voucher product and its associated prize
 */

import { type FC, useState } from 'react'
import { useParams, Link } from '@tanstack/react-router'
import { PageLayout } from '@/components/layout/PageLayout'
import { Button } from '@/components/ui/button'
import { BackButton } from '@/components/ui/BackButton'
import { SkeletonText, SkeletonCard } from '@/components/ui/Skeleton'
import { useVoucherDetail } from '@/hooks/useVoucherDetail'
import { usePrizeMutations } from '@/hooks/usePrizeMutations'
import { VoucherDetailCard } from '@/components/vouchers/VoucherDetailCard'
import { VoucherEditDialog } from '@/components/vouchers/VoucherEditDialog'
import { VoucherSendDirectDialog } from '@/components/vouchers/VoucherSendDirectDialog'

export const VoucherDetailPage: FC = () => {
  const params = useParams({ strict: false })
  const voucherId = String(params?.voucherId || '')

  // Fetch voucher product (includes linked prize if exists)
  const { voucher, isLoading: isLoadingVoucher, isError } = useVoucherDetail(voucherId)

  // Extract linked prize from voucher data
  const linkedPrize = (voucher as any)?.prize || null

  const { toggleActive } = usePrizeMutations()

  // Dialog states
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isSendDirectDialogOpen, setIsSendDirectDialogOpen] = useState(false)

  // Handle toggle active status
  const handleToggleActive = async () => {
    if (!linkedPrize) return
    await toggleActive.mutateAsync({
      id: linkedPrize.id,
      isActive: !linkedPrize.isActive,
    })
  }

  // Loading state
  if (isLoadingVoucher) {
    return (
      <PageLayout maxWidth="5xl">
        <div className="space-y-6">
          <SkeletonText width="sm" height="md" />
          <SkeletonCard>
            <div className="space-y-4">
              <SkeletonText width="lg" height="lg" />
              <SkeletonText width="full" height="md" />
              <SkeletonText width="full" height="md" />
            </div>
          </SkeletonCard>
        </div>
      </PageLayout>
    )
  }

  // Not found state
  if (isError || !voucher) {
    return (
      <PageLayout maxWidth="5xl">
        <div className="flex flex-col items-center justify-center py-12">
          <i className="ph ph-ticket text-6xl text-muted-foreground" />
          <h2 className="mt-4 text-2xl font-bold">Voucher não encontrado</h2>
          <p className="mt-2 text-muted-foreground">
            O voucher que você está procurando não existe ou foi removido.
          </p>
          <Button asChild className="mt-6">
            <Link to="/vouchers">
              <i className="ph ph-arrow-left mr-2" />
              Voltar para lista
            </Link>
          </Button>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout maxWidth="5xl">
      <div className="space-y-6">
        {/* Back Button */}
        <BackButton to="/vouchers" />

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{voucher.name}</h1>
            <p className="text-sm text-muted-foreground">{voucher.brand || voucher.category}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(true)}
            >
              <i className="ph ph-pencil mr-2" />
              {linkedPrize ? 'Editar Prêmio' : 'Criar Prêmio'}
            </Button>

            <Button
              variant="default"
              onClick={() => setIsSendDirectDialogOpen(true)}
            >
              <i className="ph ph-user mr-2" />
              Enviar Direto
            </Button>

            {linkedPrize && (
              <Button
                variant={linkedPrize.isActive ? 'outline' : 'default'}
                onClick={handleToggleActive}
                disabled={toggleActive.isPending}
              >
                <i className={`ph ${linkedPrize.isActive ? 'ph-x-circle' : 'ph-check-circle'} mr-2`} />
                {toggleActive.isPending
                  ? 'Processando...'
                  : linkedPrize.isActive
                    ? 'Desativar'
                    : 'Ativar'}
              </Button>
            )}
          </div>
        </div>

        {/* Detail Card */}
        <VoucherDetailCard voucher={voucher} prize={linkedPrize} />

        {/* Edit Dialog */}
        <VoucherEditDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          voucher={voucher}
          prize={linkedPrize}
        />

        {/* Send Direct Dialog */}
        <VoucherSendDirectDialog
          open={isSendDirectDialogOpen}
          onOpenChange={setIsSendDirectDialogOpen}
          voucher={voucher}
          prize={linkedPrize}
        />
      </div>
    </PageLayout>
  )
}
