/**
 * Voucher Assign Result Dialog Component
 * Shows detailed results after bulk voucher assignment
 */

import { type FC } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { BulkAssignResponse } from '@/types/vouchers'

interface VoucherAssignResultDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  result: BulkAssignResponse | null
}

export const VoucherAssignResultDialog: FC<VoucherAssignResultDialogProps> = ({
  open,
  onOpenChange,
  result,
}) => {
  if (!result) return null

  const { summary, results } = result
  const successRate = Math.round((summary.successful / summary.total) * 100)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Resultado do Envio</DialogTitle>
          <DialogDescription>
            Detalhes do envio em lote de vouchers
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Summary */}
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-lg border p-4 text-center">
              <p className="text-2xl font-bold">{summary.total}</p>
              <p className="text-sm text-muted-foreground">Total</p>
            </div>
            <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-center dark:border-green-800 dark:bg-green-950">
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {summary.successful}
              </p>
              <p className="text-sm text-green-600 dark:text-green-400">Sucesso</p>
            </div>
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-center dark:border-red-800 dark:bg-red-950">
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                {summary.failed}
              </p>
              <p className="text-sm text-red-600 dark:text-red-400">Falhas</p>
            </div>
          </div>

          {/* Success Rate */}
          <div className="rounded-lg border p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium">Taxa de Sucesso</span>
              <span className="text-sm font-bold">{successRate}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-green-500 transition-all"
                style={{ width: `${successRate}%` }}
              />
            </div>
          </div>

          {/* Results List */}
          <div className="space-y-2">
            <h4 className="font-medium">Detalhes por Usuário</h4>
            <div className="h-[300px] overflow-y-auto rounded-lg border">
              <div className="p-4 space-y-2">
                {results.map((item, index) => (
                  <div
                    key={index}
                    className={`rounded-lg border p-3 ${
                      item.success
                        ? 'border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/50'
                        : 'border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-950/50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <i
                            className={`ph ${item.success ? 'ph-check-circle text-green-600' : 'ph-x-circle text-red-600'}`}
                          />
                          <span className="font-medium text-sm">
                            {item.email}
                          </span>
                          <Badge
                            variant={item.success ? 'default' : 'destructive'}
                            className="text-xs"
                          >
                            {item.success ? 'Sucesso' : 'Falha'}
                          </Badge>
                        </div>

                        {item.success && item.voucherLink && (
                          <div className="text-sm">
                            <a
                              href={item.voucherLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline inline-flex items-center gap-1"
                            >
                              <i className="ph ph-link-simple" />
                              Acessar voucher
                            </a>
                          </div>
                        )}

                        {!item.success && item.error && (
                          <div className="text-sm text-red-600 dark:text-red-400">
                            <i className="ph ph-warning mr-1" />
                            {item.error}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Info Message */}
          {summary.failed > 0 && (
            <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-4 dark:bg-yellow-950 dark:border-yellow-800">
              <div className="flex gap-3">
                <i className="ph ph-warning-circle text-yellow-600 dark:text-yellow-400 text-lg" />
                <div className="flex-1 text-sm text-yellow-800 dark:text-yellow-200">
                  <p className="font-medium mb-1">Algumas falhas ocorreram</p>
                  <p className="text-yellow-700 dark:text-yellow-300">
                    Revise os detalhes acima e tente reenviar para os usuários que falharam, se
                    necessário.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
