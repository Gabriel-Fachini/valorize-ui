import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface FilterContainerProps {
  title?: string
  children: React.ReactNode
  className?: string
}

export const FilterContainer = ({
  title = 'Filtros de Busca',
  children,
  className,
}: FilterContainerProps) => {
  return (
    <Card 
      className={cn(
        'p-6 bg-white dark:bg-neutral-800 border-gray-200 dark:border-neutral-700',
        className,
      )}
    >
      <h2 className="mb-6 text-xl font-semibold text-gray-900 dark:text-white">
        {title}
      </h2>
      <div className="space-y-6">
        {children}
      </div>
    </Card>
  )
}