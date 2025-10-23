/**
 * TransactionFeedHeader Component
 * Header section for transaction feed
 */

import { cn } from '@/lib/utils'

interface TransactionFeedHeaderProps {
  title?: string
  className?: string
}

export const TransactionFeedHeader = ({
  className,
}: TransactionFeedHeaderProps) => {
  return (
    <div className={cn('flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0', className)}>
        
    </div>
  )
}