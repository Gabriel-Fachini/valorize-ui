/**
 * Prize Delete Dialog Component
 * Confirmation dialog for deleting a prize (soft delete)
 */

import { type FC, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { usePrizeMutations } from '@/hooks/usePrizeMutations'
import { toast } from 'sonner'
import type { Prize } from '@/types/prizes'

interface PrizeDeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  prize: Prize
}

export const PrizeDeleteDialog: FC<PrizeDeleteDialogProps> = ({ open, onOpenChange, prize }) => {
  const navigate = useNavigate()
  const { deletePrize } = usePrizeMutations()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)

    try {
      await deletePrize.mutateAsync(prize.id)
      toast.success('Prêmio deletado com sucesso', {
        description: 'O prêmio foi marcado como inativo',
      })
      onOpenChange(false)
      // Navigate back to prizes list
      navigate({ to: '/prizes' })
    } catch (error: any) {
      console.error('Error deleting prize:', error)
      toast.error('Erro ao deletar prêmio', {
        description: error?.response?.data?.message || 'Tente novamente',
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const handleCancel = () => {
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Deletar Prêmio</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja deletar este prêmio? Esta ação irá marcar o prêmio como inativo.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Prize Info */}
          <div className="rounded-lg border bg-muted/50 p-4">
            <div className="flex items-center gap-3">
              {prize.images?.[0] && (
                <img
                  src={prize.images[0]}
                  alt={prize.name}
                  className="h-16 w-16 rounded object-cover"
                />
              )}
              <div className="flex-1">
                <p className="font-semibold">{prize.name}</p>
                <p className="text-sm text-muted-foreground">{prize.brand}</p>
              </div>
            </div>
          </div>

          {/* Warning */}
          <div className="flex items-start gap-3 rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-900 dark:bg-yellow-950">
            <i className="ph ph-warning text-xl text-yellow-600 dark:text-yellow-400" />
            <div className="flex-1 text-sm">
              <p className="font-medium text-yellow-800 dark:text-yellow-200">Atenção</p>
              <p className="mt-1 text-yellow-700 dark:text-yellow-300">
                {prize.stock > 0 && (
                  <>
                    Este prêmio possui <strong>{prize.stock} unidade(s)</strong> em estoque.{' '}
                  </>
                )}
                Ele será marcado como inativo e não estará mais disponível para resgate.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel} disabled={isDeleting}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? (
              <>
                <i className="ph ph-circle-notch animate-spin mr-2" />
                Deletando...
              </>
            ) : (
              <>
                <i className="ph ph-trash mr-2" />
                Deletar Prêmio
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
