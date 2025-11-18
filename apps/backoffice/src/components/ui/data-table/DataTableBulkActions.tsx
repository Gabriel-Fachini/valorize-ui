/**
 * Data Table Bulk Actions
 * Barra de ações em lote quando há linhas selecionadas
 */

import { type FC, useState } from 'react'
import { animated, useSpring } from '@react-spring/web'
import { Button } from '@/components/ui/button'
import type { BulkActionConfig } from '@/config/tables/types'

interface DataTableBulkActionsProps {
  selectedCount: number
  selectedRowIds: string[]
  actions: BulkActionConfig[]
  onBulkAction: (actionId: string, rowIds: string[]) => Promise<void>
  onClearSelection: () => void
}

export const DataTableBulkActions: FC<DataTableBulkActionsProps> = ({
  selectedCount,
  selectedRowIds,
  actions,
  onBulkAction,
  onClearSelection,
}) => {
  const [loadingAction, setLoadingAction] = useState<string | null>(null)

  const animation = useSpring({
    from: { opacity: 0, transform: 'translateY(-10px)' },
    to: { opacity: 1, transform: 'translateY(0px)' },
  })

  const handleBulkAction = async (actionId: string) => {
    setLoadingAction(actionId)
    try {
      await onBulkAction(actionId, selectedRowIds)
      onClearSelection()
    } catch (error) {
      console.error('Bulk action error:', error)
    } finally {
      setLoadingAction(null)
    }
  }

  return (
    // @ts-expect-error - animated component typing issue with react-spring
    <animated.div
      style={animation as any}
      className="flex items-center justify-between rounded-lg border bg-muted/50 p-4"
    >
      <div className="flex items-center gap-2">
        <i className="ph ph-check-circle text-lg text-primary" />
        <span className="font-medium">{selectedCount} item(s) selecionado(s)</span>
      </div>

      <div className="flex items-center gap-2">
        {actions.map((action) => (
          <Button
            key={action.id}
            variant={action.variant || 'outline'}
            size="sm"
            onClick={() => handleBulkAction(action.id)}
            disabled={loadingAction !== null || action.disabled}
          >
            {action.icon && <i className={`ph ${action.icon} mr-2`} />}
            {action.label}
          </Button>
        ))}

        <Button
          variant="ghost"
          size="sm"
          onClick={onClearSelection}
          disabled={loadingAction !== null}
        >
          <i className="ph ph-x mr-2" />
          Limpar seleção
        </Button>
      </div>
    </animated.div>
  )
}
