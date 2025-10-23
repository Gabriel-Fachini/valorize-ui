import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  icon?: string
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
    icon?: string
  }
  className?: string
}

export const EmptyState = ({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) => {
  return (
    <Card 
      className={cn(
        'p-12 text-center border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800',
        className,
      )}
    >
      <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-2xl bg-green-50 dark:bg-green-950">
        {icon ? (
          <i className={cn('text-6xl text-green-600 dark:text-green-400', icon)} />
        ) : (
          <i className="ph-bold ph-folder-open text-6xl text-green-600 dark:text-green-400" />
        )}
      </div>
      
      <h3 className="mb-3 text-2xl font-bold text-gray-900 dark:text-white">
        {title}
      </h3>
      
      <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed max-w-md mx-auto mb-8">
        {description}
      </p>
      
      {action && (
        <Button
          onClick={action.onClick}
          variant="outline"
          className="border-green-300 dark:border-green-700 text-green-700 dark:text-green-300 hover:bg-green-50 dark:hover:bg-green-950"
        >
          {action.icon && (
            <i className={cn('text-base mr-2', action.icon)} />
          )}
          {action.label}
        </Button>
      )}
    </Card>
  )
}