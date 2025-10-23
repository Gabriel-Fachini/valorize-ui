import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface LoadMoreButtonProps {
  hasMore: boolean
  loading: boolean
  onLoadMore: () => void
  loadingText?: string
  buttonText?: string
  className?: string
}

export const LoadMoreButton = ({
  hasMore, 
  loading, 
  onLoadMore, 
  loadingText = 'Carregando...',
  buttonText = 'Carregar mais',
  className,
}: LoadMoreButtonProps) => {
  if (!hasMore && !loading) return null

  return (
    <div className={cn('flex justify-center pt-8', className)}>
      <Button
        onClick={onLoadMore}
        disabled={loading}
        variant="outline"
        size="lg"
        className="flex items-center gap-3 min-w-[200px] border-green-300 dark:border-green-700 text-green-700 dark:text-green-300 hover:bg-green-50 dark:hover:bg-green-950"
      >
        {loading ? (
          <>
            <i className="ph-bold ph-spinner text-base animate-spin" />
            {loadingText}
          </>
        ) : (
          <>
            <i className="ph-bold ph-caret-down text-base" />
            {buttonText}
          </>
        )}
      </Button>
    </div>
  )
}