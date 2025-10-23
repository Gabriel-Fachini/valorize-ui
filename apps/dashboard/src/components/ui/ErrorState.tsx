import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface ErrorStateProps {
  title?: string
  message: string
  onRetry?: () => void
  retryLabel?: string
  icon?: string
  className?: string
}

export const ErrorState = ({
  title = 'Erro ao carregar dados',
  message,
  onRetry,
  retryLabel = 'Tentar novamente',
  icon = 'ph-bold ph-warning',
  className,
}: ErrorStateProps) => {
  return (
    <Card 
      className={cn(
        'p-12 text-center border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950',
        className,
      )}
    >
      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-xl bg-red-100 dark:bg-red-900">
        <i className={cn('text-5xl text-red-600 dark:text-red-400', icon)} />
      </div>
      
      <h2 className="mb-3 text-2xl font-bold text-red-900 dark:text-red-100">
        {title}
      </h2>
      
      <p className="mb-8 text-gray-700 dark:text-gray-300 text-lg leading-relaxed max-w-md mx-auto">
        {message}
      </p>
      
      {onRetry && (
        <Button
          onClick={onRetry}
          className="bg-red-600 hover:bg-red-700 text-white"
          aria-label={retryLabel}
        >
          <i className="ph-bold ph-arrow-clockwise text-base mr-2" />
          {retryLabel}
        </Button>
      )}
    </Card>
  )
}
