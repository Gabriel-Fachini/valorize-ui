import { type FC, useState } from 'react'
import { animated, useSpring } from '@react-spring/web'
import { Button } from '@/components/ui/button'

interface UserBulkActionsBarProps {
  selectedCount: number
  selectedUserIds: string[]
  onBulkAction: (userIds: string[], action: string) => Promise<void>
  onClearSelection: () => void
}

export const UserBulkActionsBar: FC<UserBulkActionsBarProps> = ({
  selectedCount,
  selectedUserIds,
  onBulkAction,
  onClearSelection,
}) => {
  const [isLoading, setIsLoading] = useState(false)

  const animation = useSpring({
    from: { opacity: 0, transform: 'translateY(-10px)' },
    to: { opacity: 1, transform: 'translateY(0px)' },
  })

  const handleBulkAction = async (action: string) => {
    setIsLoading(true)
    try {
      await onBulkAction(selectedUserIds, action)
      onClearSelection()
    } catch (error) {
      console.error('Bulk action error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <animated.div
      style={animation}
      className="flex items-center justify-between rounded-lg border bg-muted/50 p-4"
    >
      <div className="flex items-center gap-2">
        <i className="ph ph-check-circle text-lg text-primary" />
        <span className="font-medium">{selectedCount} usuário(s) selecionado(s)</span>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleBulkAction('activate')}
          disabled={isLoading}
        >
          <i className="ph ph-check-circle mr-2" />
          Ativar
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleBulkAction('deactivate')}
          disabled={isLoading}
        >
          <i className="ph ph-x-circle mr-2" />
          Desativar
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleBulkAction('export')}
          disabled={isLoading}
        >
          <i className="ph ph-download-simple mr-2" />
          Exportar
        </Button>
        <Button variant="ghost" size="sm" onClick={onClearSelection} disabled={isLoading}>
          <i className="ph ph-x mr-2" />
          Limpar seleção
        </Button>
      </div>
    </animated.div>
  )
}
