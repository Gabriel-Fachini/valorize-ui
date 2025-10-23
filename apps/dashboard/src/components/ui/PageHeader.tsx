import { cn } from '@/lib/utils'

interface PageHeaderProps {
  title: string
  description?: string
  titleClassName?: string
  action?: React.ReactNode
  dataTour?: string
  className?: string
}

export const PageHeader = ({
  title,
  description,
  titleClassName,
  action,
  dataTour,
  className,
}: PageHeaderProps) => {
  return (
    <div className={cn('mb-8', className)}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
        <div>
          <h1 
            data-tour={dataTour}
            className={cn(
              'mb-2 text-4xl font-bold text-gray-900 dark:text-white',
              titleClassName,
            )}
          >
            {title}
          </h1>
          {description && (
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {description}
            </p>
          )}
        </div>
        
        {action && (
          <div className="flex-shrink-0">
            {action}
          </div>
        )}
      </div>
    </div>
  )
}