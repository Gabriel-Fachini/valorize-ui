import { type FC } from 'react'
import { Badge } from '@/components/ui/badge'
import { MarkdownContent } from '@/components/ui/MarkdownContent'

interface PrizeHeaderProps {
  name: string
  category: string
  brand?: string
  description: string
}

export const PrizeHeader: FC<PrizeHeaderProps> = ({
  name,
  category,
  brand,
  description,
}) => {
  return (
    <div>
      <div className="mb-3 flex items-start justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{name}</h1>
      </div>

      <div className="mb-4 flex items-center gap-3">
        <Badge 
          variant="outline" 
          className="rounded-full bg-gray-100/50 dark:bg-gray-800/30 border-gray-200/60 dark:border-gray-700/50 text-gray-700 dark:text-gray-300 px-4 py-1.5 text-sm font-medium backdrop-blur-sm"
        >
          {category}
        </Badge>
        {brand && (
          <span className="text-sm text-gray-600 dark:text-gray-400">por {brand}</span>
        )}
      </div>

      <MarkdownContent
        content={description}
        className="text-gray-700 dark:text-gray-300"
      />
    </div>
  )
}
