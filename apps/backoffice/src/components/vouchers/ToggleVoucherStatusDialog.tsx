/**
 * Toggle Voucher Status Dialog
 * Confirmation dialog for activating/deactivating a voucher product
 */

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useToggleVoucherStatus } from '@/hooks/useVoucherMutations'
import type { VoucherProduct } from '@/types/voucher'

interface ToggleVoucherStatusDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  voucher: VoucherProduct
}

export function ToggleVoucherStatusDialog({
  open,
  onOpenChange,
  voucher,
}: ToggleVoucherStatusDialogProps) {
  const toggleStatusMutation = useToggleVoucherStatus()

  const handleToggle = async () => {
    try {
      await toggleStatusMutation.mutateAsync({
        id: voucher.id,
        isActive: !voucher.isActive,
      })
      onOpenChange(false)
    } catch (error) {
      // Error is handled by the mutation hook
    }
  }

  const isActive = voucher.isActive
  const actionText = isActive ? 'desativar' : 'ativar'
  const actionTextCaps = isActive ? 'Desativar' : 'Ativar'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <i
              className={isActive ? 'ph ph-x-circle text-orange-600' : 'ph ph-check-circle text-green-600'}
              style={{ fontSize: '1.5rem' }}
            />
            {actionTextCaps} Voucher
          </DialogTitle>
          <DialogDescription>
            Tem certeza que deseja {actionText} este voucher?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Voucher info */}
          <div className="rounded-lg bg-muted p-4 space-y-2">
            <div className="flex items-start gap-3">
              {voucher.images?.[0] && (
                <img
                  src={voucher.images[0]}
                  alt={voucher.name}
                  className="h-12 w-20 rounded object-cover"
                />
              )}
              <div className="flex-1">
                <p className="text-sm font-medium">{voucher.name}</p>
                <p className="text-xs text-muted-foreground">{voucher.category}</p>
              </div>
            </div>
          </div>

          {/* Warning/Info box */}
          <div
            className={
              isActive
                ? 'rounded-lg bg-orange-50 dark:bg-orange-900/20 p-4 border border-orange-200 dark:border-orange-800'
                : 'rounded-lg bg-green-50 dark:bg-green-900/20 p-4 border border-green-200 dark:border-green-800'
            }
          >
            <div className="flex gap-3">
              <i
                className={isActive ? 'ph ph-warning text-orange-600 mt-0.5' : 'ph ph-info text-green-600 mt-0.5'}
                style={{ fontSize: '1.25rem' }}
              />
              <div className={`text-sm ${isActive ? 'text-orange-800 dark:text-orange-200' : 'text-green-800 dark:text-green-200'}`}>
                <p className="font-medium mb-1">
                  {isActive ? 'Atenção:' : 'Informação:'}
                </p>
                <p>
                  {isActive
                    ? 'Ao desativar este voucher, ele não estará mais disponível para ser utilizado pelos usuários.'
                    : 'Ao ativar este voucher, ele ficará disponível para ser utilizado pelos usuários.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={toggleStatusMutation.isPending}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            variant={isActive ? 'destructive' : 'default'}
            onClick={handleToggle}
            disabled={toggleStatusMutation.isPending}
          >
            {toggleStatusMutation.isPending ? (
              <>
                <i className="ph ph-spinner animate-spin mr-2" />
                {isActive ? 'Desativando...' : 'Ativando...'}
              </>
            ) : (
              <>
                <i className={isActive ? 'ph ph-x-circle mr-2' : 'ph ph-check-circle mr-2'} />
                {actionTextCaps} Voucher
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
