/**
 * Redemption Update Status Dialog Component
 * Dialog for updating redemption status with optional notes
 */

import { type FC, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { RedemptionStatus } from '@/types/redemptions'
import type { UpdateStatusPayload } from '@/types/redemptions'

interface RedemptionUpdateStatusDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (payload: UpdateStatusPayload) => void | Promise<void>
  isPending?: boolean
  currentStatus?: string
}

export const RedemptionUpdateStatusDialog: FC<RedemptionUpdateStatusDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isPending = false,
  currentStatus,
}) => {
  const [status, setStatus] = useState<string>(currentStatus || '')
  const [notes, setNotes] = useState<string>('')

  const statusOptions = [
    { value: RedemptionStatus.PENDING, label: 'Pendente' },
    { value: RedemptionStatus.PROCESSING, label: 'Processando' },
    { value: RedemptionStatus.COMPLETED, label: 'Concluído' },
    { value: RedemptionStatus.SENT, label: 'Enviado' },
    { value: RedemptionStatus.SHIPPED, label: 'Enviado para Entrega' },
    { value: RedemptionStatus.DELIVERED, label: 'Entregue' },
    { value: RedemptionStatus.FAILED, label: 'Falha' },
    { value: RedemptionStatus.CANCELLED, label: 'Cancelado' },
  ]

  const handleConfirm = async () => {
    if (!status) return

    const payload: UpdateStatusPayload = {
      status,
      ...(notes && { notes }),
    }

    await onConfirm(payload)
    resetForm()
    onClose()
  }

  const resetForm = () => {
    setStatus(currentStatus || '')
    setNotes('')
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Atualizar Status do Resgate</DialogTitle>
          <DialogDescription>Escolha um novo status e adicione notas se necessário</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status Selection */}
          <div className="space-y-2">
            <Label htmlFor="status">Novo Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger id="status">
                <SelectValue placeholder="Selecione um status..." />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notas (Opcional)</Label>
            <Textarea
              id="notes"
              placeholder="Adicione notas sobre esta mudança de status..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              As notas serão registradas no histórico do resgate
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isPending}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm} disabled={!status || isPending} className="gap-2">
            {isPending && <i className="ph ph-spinner animate-spin" />}
            {isPending ? 'Atualizando...' : 'Atualizar Status'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default RedemptionUpdateStatusDialog
