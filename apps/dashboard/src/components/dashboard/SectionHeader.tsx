import { Button } from '@/components/ui/button'

interface SectionHeaderProps {
  title: string
  icon?: React.ReactNode
  actionLabel?: string
  onActionClick?: () => void
  onViewAll?: () => void
}

export const SectionHeader = ({
  title,
  icon,
  actionLabel,
  onActionClick,
  onViewAll,
}: SectionHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        {icon && (
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/10 dark:bg-neutral-800/50">
            {icon}
          </div>
        )}
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
          {title}
        </h2>
      </div>

      {(actionLabel && onActionClick) || onViewAll ? (
        <Button
          variant="outline"
          size="sm"
          onClick={onViewAll ?? onActionClick}
          className="text-sm font-medium"
        >
          {actionLabel ?? 'Ver todos'}
        </Button>
      ) : null}
    </div>
  )
}

