/**
 * Prize Delete Dialog Component
 * Confirmation dialog for toggling prize active status
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
import { usePrizeMutations } from '@/hooks/usePrizeMutations'
import { toast } from 'sonner'
import type { Prize } from '@/types/prizes'

interface PrizeDeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  prize: Prize
}

export const PrizeDeleteDialog: FC<PrizeDeleteDialogProps> = ({ open, onOpenChange, prize }) => {
  const { toggleActive } = usePrizeMutations()
  const [isLoading, setIsLoading] = useState(false)

  const handleToggle = async () => {
    setIsLoading(true)

    try {
      await toggleActive.mutateAsync({ id: prize.id, isActive: !prize.isActive })
      toast.success(`Prêmio ${!prize.isActive ? 'ativado' : 'desativado'} com sucesso`, {
        description: `O prêmio foi ${!prize.isActive ? 'ativado' : 'desativado'}`,
      })
      onOpenChange(false)
    } catch (error: any) {
      console.error('Error toggling prize status:', error)
      toast.error(`Erro ao ${!prize.isActive ? 'ativar' : 'desativar'} prêmio`, {
        description: error?.response?.data?.message || 'Tente novamente',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{prize.isActive ? 'Desativar' : 'Ativar'} Prêmio</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja {prize.isActive ? 'desativar' : 'ativar'} este prêmio?
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
          {prize.isActive && (
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
                  Ele não estará mais disponível para resgate após ser desativado.
                </p>
              </div>
            </div>
          )}

          {/* Info for activation */}
          {!prize.isActive && (
            <div className="flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950">
              <i className="ph ph-info text-xl text-blue-600 dark:text-blue-400" />
              <div className="flex-1 text-sm">
                <p className="font-medium text-blue-800 dark:text-blue-200">Informação</p>
                <p className="mt-1 text-blue-700 dark:text-blue-300">
                  O prêmio ficará disponível para resgate após ser ativado.
                </p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
            Cancelar
          </Button>
          <Button
            variant={prize.isActive ? "destructive" : "default"}
            onClick={handleToggle}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <i className="ph ph-circle-notch animate-spin mr-2" />
                {prize.isActive ? 'Desativando...' : 'Ativando...'}
              </>
            ) : (
              <>
                <i className={`ph ${prize.isActive ? 'ph-x-circle' : 'ph-check-circle'} mr-2`} />
                {prize.isActive ? 'Desativar' : 'Ativar'} Prêmio
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
