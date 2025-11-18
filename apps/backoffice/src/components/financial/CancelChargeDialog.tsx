import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useToast } from '@/hooks/useToast'
import { useCancelCharge } from '@/hooks/useChargeMutations'

interface CancelChargeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  chargeId: string
  chargeDescription: string
}

export function CancelChargeDialog({
  open,
  onOpenChange,
  chargeId,
  chargeDescription,
}: CancelChargeDialogProps) {
  const { toast } = useToast()
  const cancelChargeMutation = useCancelCharge()

  const handleCancel = async () => {
    try {
      const result = await cancelChargeMutation.mutateAsync(chargeId)

      if (!result.success) {
        throw new Error(result.error || 'Erro ao cancelar cobrança')
      }

      toast({
        title: 'Sucesso!',
        description: 'Cobrança cancelada com sucesso!',
        variant: 'default',
      })

      onOpenChange(false)
    } catch (error) {
      toast({
        title: 'Erro ao cancelar cobrança',
        description: error instanceof Error ? error.message : 'Ocorreu um erro desconhecido.',
        variant: 'destructive',
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <i className="ph ph-warning text-orange-600" style={{ fontSize: '1.5rem' }} />
            Cancelar Cobrança
          </DialogTitle>
          <DialogDescription>
            Tem certeza que deseja cancelar esta cobrança? Esta ação não pode ser desfeita.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-lg bg-muted p-4 space-y-2">
          <p className="text-sm font-medium">Cobrança:</p>
          <p className="text-sm text-muted-foreground">{chargeDescription}</p>
        </div>

        <div className="rounded-lg bg-yellow-50 dark:bg-yellow-900/20 p-4 border border-yellow-200 dark:border-yellow-800">
          <div className="flex gap-3">
            <i className="ph ph-info text-yellow-600 mt-0.5" style={{ fontSize: '1.25rem' }} />
            <div className="text-sm text-yellow-800 dark:text-yellow-200">
              <p className="font-medium mb-1">Atenção:</p>
              <p>
                Só é possível cancelar cobranças com status PENDENTE ou VENCIDO e que não possuem
                pagamentos registrados.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={cancelChargeMutation.isPending}
          >
            Voltar
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleCancel}
            disabled={cancelChargeMutation.isPending}
          >
            {cancelChargeMutation.isPending ? (
              <>
                <i className="ph ph-spinner animate-spin mr-2" />
                Cancelando...
              </>
            ) : (
              <>
                <i className="ph ph-x-circle mr-2" />
                Cancelar Cobrança
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
