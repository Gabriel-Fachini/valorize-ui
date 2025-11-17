/**
 * Changes Diff Viewer Component
 * Exibe as mudanças realizadas em uma ação de auditoria
 */

import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import type { AuditChanges } from '@/types/audit'

interface ChangesDiffViewerProps {
  changes?: AuditChanges
}

/**
 * Formata um valor para exibição
 */
function formatValue(value: unknown): string {
  if (value === null || value === undefined) {
    return '-'
  }
  if (typeof value === 'boolean') {
    return value ? 'Sim' : 'Não'
  }
  if (typeof value === 'object') {
    return JSON.stringify(value, null, 2)
  }
  return String(value)
}

/**
 * Renderiza uma única mudança de campo
 */
function FieldChange({
  field,
  before,
  after,
}: {
  field: string
  before: unknown
  after: unknown
}) {
  return (
    <div className="border rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-sm capitalize">
          {field.replace(/([A-Z])/g, ' $1').trim()}
        </h4>
        <Badge variant="secondary" className="text-xs">
          Alterado
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground font-medium">Antes</p>
          <div className="bg-destructive/10 text-destructive rounded-md p-3 text-sm font-mono break-all">
            {formatValue(before)}
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-xs text-muted-foreground font-medium">Depois</p>
          <div className="bg-primary/10 text-primary rounded-md p-3 text-sm font-mono break-all">
            {formatValue(after)}
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Componente principal para exibir diferenças
 */
export function ChangesDiffViewer({ changes }: ChangesDiffViewerProps) {
  // Sem mudanças
  if (!changes || Object.keys(changes).length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Nenhuma alteração registrada</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const changeEntries = Object.entries(changes)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">
          {changeEntries.length} campo{changeEntries.length > 1 ? 's' : ''} alterado
          {changeEntries.length > 1 ? 's' : ''}
        </h3>
      </div>

      <div className="space-y-3">
        {changeEntries.map(([field, { before, after }]) => (
          <FieldChange key={field} field={field} before={before} after={after} />
        ))}
      </div>
    </div>
  )
}
