/**
 * Redemption Detail Page
 * Page for viewing and managing a single redemption
 */

import { type FC, useState } from 'react'
import { useParams, Link } from '@tanstack/react-router'
import { PageLayout } from '@/components/layout/PageLayout'
import { Button } from '@/components/ui/button'
import { BackButton } from '@/components/ui/BackButton'
import { SkeletonText, SkeletonCard } from '@/components/ui/Skeleton'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useRedemptionDetail } from '@/hooks/useRedemptionDetail'
import { useRedemptionMutations } from '@/hooks/useRedemptionMutations'
import { RedemptionDetailCard } from '@/components/redemptions/RedemptionDetailCard'
import { RedemptionStatusBadge } from '@/components/redemptions/RedemptionStatusBadge'
import { RedemptionUpdateStatusDialog } from '@/components/redemptions/RedemptionUpdateStatusDialog'
import { toast } from 'sonner'

export const RedemptionDetailPage: FC = () => {
  const params = useParams({ strict: false })
  const redemptionId = String(params?.redemptionId || '')

  // Fetch redemption details
  const { redemption, isLoading, isError, error, refetch } = useRedemptionDetail(redemptionId)

  // Mutations
  const { updateStatus, addTracking, addNote, cancel } = useRedemptionMutations()

  // Dialog states
  const [isUpdateStatusDialogOpen, setIsUpdateStatusDialogOpen] = useState(false)
  const [isAddTrackingDialogOpen, setIsAddTrackingDialogOpen] = useState(false)
  const [isAddNoteDialogOpen, setIsAddNoteDialogOpen] = useState(false)
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false)

  // Form state
  const [trackingCode, setTrackingCode] = useState('')
  const [trackingCarrier, setTrackingCarrier] = useState('')
  const [noteText, setNoteText] = useState('')
  const [cancelReason, setCancelReason] = useState('')

  // Loading state
  if (isLoading) {
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

  // Check if redemption ID is missing
  if (!redemptionId) {
    return (
      <PageLayout maxWidth="5xl">
        <div className="flex flex-col items-center justify-center py-12">
          <i className="ph ph-warning text-6xl text-muted-foreground" />
          <h2 className="mt-4 text-2xl font-bold">ID do Resgate Inválido</h2>
          <p className="mt-2 text-muted-foreground">
            Nenhum ID de resgate foi fornecido. Retorne à lista e tente novamente.
          </p>
          <Button asChild className="mt-6">
            <Link to="/redemptions">
              <i className="ph ph-arrow-left mr-2" />
              Voltar para lista
            </Link>
          </Button>
        </div>
      </PageLayout>
    )
  }

  // Not found state
  if (isError || !redemption) {
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'

    return (
      <PageLayout maxWidth="5xl">
        <div className="flex flex-col items-center justify-center py-12">
          <i className="ph ph-receipt text-6xl text-muted-foreground" />
          <h2 className="mt-4 text-2xl font-bold">Resgate não encontrado</h2>
          <p className="mt-2 text-muted-foreground">
            O resgate que você está procurando não existe ou foi removido.
          </p>
          <div className="mt-4 rounded-lg bg-gray-100 p-4 dark:bg-gray-900">
            <p className="font-mono text-xs text-gray-600 dark:text-gray-400">
              ID: <span className="text-gray-900 dark:text-gray-100">{redemptionId}</span>
            </p>
            <p className="mt-2 font-mono text-xs text-gray-600 dark:text-gray-400">
              Erro: <span className="text-red-600 dark:text-red-400">{errorMessage}</span>
            </p>
          </div>
          <Button asChild className="mt-6">
            <Link to="/redemptions">
              <i className="ph ph-arrow-left mr-2" />
              Voltar para lista
            </Link>
          </Button>
        </div>
      </PageLayout>
    )
  }

  // Handlers for tracking
  const handleAddTracking = async () => {
    if (!trackingCode.trim()) {
      toast.error('Código de rastreamento é obrigatório')
      return
    }

    try {
      await addTracking.mutateAsync({
        id: redemption.id,
        payload: {
          trackingCode: trackingCode.trim(),
          carrier: trackingCarrier || undefined,
        },
      })
      setTrackingCode('')
      setTrackingCarrier('')
      setIsAddTrackingDialogOpen(false)
      refetch()
    } catch (error) {
      // Error toast is handled in the mutation
    }
  }

  // Handler for adding note
  const handleAddNote = async () => {
    if (!noteText.trim()) {
      toast.error('Nota não pode estar vazia')
      return
    }

    try {
      await addNote.mutateAsync({
        id: redemption.id,
        payload: {
          note: noteText.trim(),
        },
      })
      setNoteText('')
      setIsAddNoteDialogOpen(false)
      refetch()
    } catch (error) {
      // Error toast is handled in the mutation
    }
  }

  // Handler for cancel
  const handleCancelRedemption = async () => {
    try {
      await cancel.mutateAsync({
        id: redemption.id,
        payload: {
          reason: cancelReason || undefined,
        },
      })
      setCancelReason('')
      setIsCancelDialogOpen(false)
      refetch()
    } catch (error) {
      // Error toast is handled in the mutation
    }
  }

  return (
    <PageLayout maxWidth="5xl">
      <div className="space-y-6">
        {/* Back Button */}
        <BackButton to="/redemptions" />

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">{redemption.id}</h1>
              <RedemptionStatusBadge status={redemption.status} />
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Resgate de {redemption.user?.name || 'Usuário desconhecido'} • {(redemption.prize?.type || 'tipo').toUpperCase()}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {redemption.status !== 'cancelled' && redemption.status !== 'delivered' && redemption.type !== 'voucher' && (
              <>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => setIsUpdateStatusDialogOpen(true)}
                >
                  <i className="ph ph-pencil mr-2" />
                  Atualizar Status
                </Button>

                {redemption.type === 'physical' && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setIsAddTrackingDialogOpen(true)}
                  >
                    <i className="ph ph-map-pin mr-2" />
                    Rastreamento
                  </Button>
                )}

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setIsAddNoteDialogOpen(true)}
                >
                  <i className="ph ph-note-pencil mr-2" />
                  Adicionar Nota
                </Button>

                {(redemption.prizeType || redemption.prize?.type) !== 'voucher' && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setIsCancelDialogOpen(true)}
                  >
                    <i className="ph ph-x-circle mr-2" />
                    Cancelar
                  </Button>
                )}
              </>
            )}
          </div>
        </div>

        {/* Voucher Information Alert */}
        {redemption.type === 'voucher' && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/40 dark:bg-amber-950/20">
            <div className="flex items-start gap-3">
              <i className="ph ph-info text-lg text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-semibold text-amber-900 dark:text-amber-100">
                  Resgate por Voucher
                </h3>
                <p className="mt-1 text-sm text-amber-800 dark:text-amber-200">
                  Resgates por voucher não podem ser cancelados após a emissão. O voucher foi enviado para o usuário e é imediatamente válido. Para questões relacionadas, entre em contato com o suporte.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Detail Card */}
        <RedemptionDetailCard redemption={redemption} />

        {/* Update Status Dialog */}
        <RedemptionUpdateStatusDialog
          isOpen={isUpdateStatusDialogOpen}
          onClose={() => setIsUpdateStatusDialogOpen(false)}
          onConfirm={async (payload) => {
            await updateStatus.mutateAsync({
              id: redemption.id,
              payload,
            })
            setIsUpdateStatusDialogOpen(false)
            refetch()
          }}
          isPending={updateStatus.isPending}
          currentStatus={redemption.status}
        />

        {/* Add Tracking Dialog */}
        <Dialog open={isAddTrackingDialogOpen} onOpenChange={setIsAddTrackingDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Adicionar Rastreamento</DialogTitle>
              <DialogDescription>
                Adicione o código de rastreamento e a transportadora (opcional)
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="trackingCode">Código de Rastreamento *</Label>
                <input
                  id="trackingCode"
                  placeholder="Ex: SS123456789BR"
                  value={trackingCode}
                  onChange={(e) => setTrackingCode(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="trackingCarrier">Transportadora (Opcional)</Label>
                <Select value={trackingCarrier} onValueChange={setTrackingCarrier}>
                  <SelectTrigger id="trackingCarrier">
                    <SelectValue placeholder="Selecione a transportadora..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sedex">Sedex</SelectItem>
                    <SelectItem value="Correios">Correios PAC</SelectItem>
                    <SelectItem value="Loggi">Loggi</SelectItem>
                    <SelectItem value="Shein">Shein</SelectItem>
                    <SelectItem value="Aliexpress">Aliexpress</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsAddTrackingDialogOpen(false)
                  setTrackingCode('')
                  setTrackingCarrier('')
                }}
                disabled={addTracking.isPending}
              >
                Cancelar
              </Button>
              <Button onClick={handleAddTracking} disabled={!trackingCode.trim() || addTracking.isPending} className="gap-2">
                {addTracking.isPending && <i className="ph ph-spinner animate-spin" />}
                {addTracking.isPending ? 'Adicionando...' : 'Adicionar'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add Note Dialog */}
        <Dialog open={isAddNoteDialogOpen} onOpenChange={setIsAddNoteDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Adicionar Nota</DialogTitle>
              <DialogDescription>Adicione uma nota ao histórico deste resgate</DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="noteText">Nota *</Label>
                <Textarea
                  id="noteText"
                  placeholder="Digite sua nota aqui..."
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  rows={4}
                  className="resize-none"
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsAddNoteDialogOpen(false)
                  setNoteText('')
                }}
                disabled={addNote.isPending}
              >
                Cancelar
              </Button>
              <Button onClick={handleAddNote} disabled={!noteText.trim() || addNote.isPending} className="gap-2">
                {addNote.isPending && <i className="ph ph-spinner animate-spin" />}
                {addNote.isPending ? 'Adicionando...' : 'Adicionar Nota'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Cancel Dialog */}
        {(redemption.prizeType || redemption.prize?.type) !== 'voucher' && (
          <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Cancelar Resgate</DialogTitle>
                <DialogDescription>
                  Esta ação não pode ser desfeita. Os usuários serão reembolsados automaticamente.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium">Resgate ID</p>
                  <p className="mt-1 font-mono text-sm text-gray-600">{redemption.id}</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cancelReason">Motivo (Opcional)</Label>
                  <Textarea
                    id="cancelReason"
                    placeholder="Descreva o motivo do cancelamento..."
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    rows={3}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsCancelDialogOpen(false)
                    setCancelReason('')
                  }}
                  disabled={cancel.isPending}
                >
                  Manter
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleCancelRedemption}
                  disabled={cancel.isPending}
                  className="gap-2"
                >
                  {cancel.isPending && <i className="ph ph-spinner animate-spin" />}
                  {cancel.isPending ? 'Cancelando...' : 'Cancelar Resgate'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </PageLayout>
  )
}
