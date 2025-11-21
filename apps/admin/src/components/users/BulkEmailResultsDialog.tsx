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
import { Badge } from '@/components/ui/badge'
import type { BulkSendWelcomeEmailsResponse } from '@/types/users'

interface BulkEmailResultsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  results?: BulkSendWelcomeEmailsResponse
}

export const BulkEmailResultsDialog: FC<BulkEmailResultsDialogProps> = ({
  open,
  onOpenChange,
  results,
}) => {
  const [showFailures, setShowFailures] = useState(true)

  if (!results) return null

  const { summary, results: detailedResults } = results
  const failures = detailedResults.filter((r) => !r.success)
  const hasFailures = failures.length > 0

  const successRate = Math.round((summary.sent / summary.total) * 100)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Resultados do Envio em Lote</DialogTitle>
          <DialogDescription>
            {summary.sent === summary.total
              ? 'Todos os emails foram enviados com sucesso!'
              : `${summary.sent} de ${summary.total} emails foram enviados`}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          {/* Summary Cards */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-xs text-green-700 mb-1">Enviados</p>
              <p className="text-2xl font-bold text-green-700">{summary.sent}</p>
            </div>
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-xs text-red-700 mb-1">Falharam</p>
              <p className="text-2xl font-bold text-red-700">{summary.failed}</p>
            </div>
            <div className="p-4 bg-muted border rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Taxa de Sucesso</p>
              <p className="text-2xl font-bold">{successRate}%</p>
            </div>
          </div>

          {/* Success message or failures */}
          {!hasFailures ? (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2">
                <i className="ph ph-check-circle text-green-600 text-xl" />
                <p className="text-sm font-medium text-green-700">
                  Todos os emails foram enviados com sucesso!
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Toggle button */}
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-destructive">
                  {failures.length} {failures.length === 1 ? 'falha encontrada' : 'falhas encontradas'}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFailures(!showFailures)}
                  className="text-xs"
                >
                  {showFailures ? 'Ocultar' : 'Mostrar'} detalhes
                  <i className={`ph ${showFailures ? 'ph-caret-up' : 'ph-caret-down'} ml-1`} />
                </Button>
              </div>

              {/* Failures list */}
              {showFailures && (
                <div className="h-[200px] rounded-lg border p-3 overflow-y-auto">
                  <div className="space-y-2">
                    {failures.map((failure, index) => (
                      <div
                        key={failure.userId || index}
                        className="p-3 bg-red-50 border border-red-200 rounded text-sm"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="font-mono text-xs text-muted-foreground truncate">
                              ID: {failure.userId}
                            </p>
                            <p className="text-destructive font-medium mt-1">{failure.error}</p>
                          </div>
                          <Badge variant="destructive" className="flex-shrink-0">
                            Erro
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Copy failed IDs button */}
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => {
                  const ids = failures.map((f) => f.userId).join(', ')
                  navigator.clipboard.writeText(ids)
                }}
              >
                <i className="ph ph-copy mr-2" />
                Copiar IDs que falharam
              </Button>
            </>
          )}
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
