/**
 * Sync Catalog Dialog
 * Confirmation dialog for synchronizing voucher catalog with Tremendous API
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
import { useSyncCatalog } from '@/hooks/useVoucherMutations'

interface SyncCatalogDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SyncCatalogDialog({
  open,
  onOpenChange,
}: SyncCatalogDialogProps) {
  const syncCatalogMutation = useSyncCatalog()

  const handleSync = async () => {
    try {
      await syncCatalogMutation.mutateAsync()
      // Close dialog on success (toast is handled by the mutation hook)
      onOpenChange(false)
    } catch (error) {
      // Error toast is handled by the mutation hook
      // Keep dialog open so user can try again
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <i className="ph ph-arrows-clockwise text-blue-600" style={{ fontSize: '1.5rem' }} />
            Sincronizar Catálogo
          </DialogTitle>
          <DialogDescription>
            Sincronizar o catálogo de vouchers com a API da Tremendous
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Info about what will happen */}
          <div className="rounded-lg bg-muted p-4 space-y-2">
            <p className="text-sm font-medium">Esta operação irá:</p>
            <ul className="text-sm text-muted-foreground space-y-1 ml-4 list-disc">
              <li>Buscar os produtos mais recentes da API Tremendous</li>
              <li>Criar ou atualizar produtos no banco de dados</li>
              <li>Criar ou atualizar prêmios associados</li>
              <li>Desativar produtos que não estão mais disponíveis</li>
            </ul>
          </div>

          {/* Warning about duration */}
          <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 p-4 border border-blue-200 dark:border-blue-800">
            <div className="flex gap-3">
              <i className="ph ph-info text-blue-600 mt-0.5" style={{ fontSize: '1.25rem' }} />
              <div className="text-sm text-blue-800 dark:text-blue-200">
                <p className="font-medium mb-1">Informação:</p>
                <p>
                  Esta operação pode levar alguns segundos para ser concluída.
                  O catálogo será atualizado automaticamente após a sincronização.
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
            disabled={syncCatalogMutation.isPending}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            variant="default"
            onClick={handleSync}
            disabled={syncCatalogMutation.isPending}
          >
            {syncCatalogMutation.isPending ? (
              <>
                <i className="ph ph-spinner animate-spin mr-2" />
                Sincronizando...
              </>
            ) : (
              <>
                <i className="ph ph-arrows-clockwise mr-2" />
                Sincronizar Agora
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
