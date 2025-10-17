import { Badge } from '@/components/ui/badge'
import type { NewsItem } from '@/types/dashboard.types'

interface NewsCardProps {
  news: NewsItem
  className?: string
}

const categoryColors = {
  announcement: 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20',
  update: 'bg-green-500/10 text-green-700 dark:text-green-300 border-green-500/20',
  achievement: 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20',
  general: 'bg-gray-500/10 text-gray-700 dark:text-gray-300 border-gray-500/20',
}

export const NewsCard = ({ news, className = '' }: NewsCardProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
    })
  }

  return (
    <div className={`bg-white/70 dark:bg-[#2a2a2a]/90 backdrop-blur-sm border border-gray-200/50 dark:border-neutral-700/50 rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-200 h-full flex flex-col ${className}`}>
      <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
        <Badge variant="outline" className={categoryColors[news.category]}>
          {news.category === 'announcement' && 'Anúncio'}
          {news.category === 'update' && 'Atualização'}
          {news.category === 'achievement' && 'Conquista'}
          {news.category === 'general' && 'Geral'}
        </Badge>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {formatDate(news.publishedAt)}
        </span>
      </div>
      
      <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg mb-3 leading-tight">
        {news.title}
      </h3>
      
      <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-4 flex-grow">
        {news.summary}
      </p>
      
      <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-200 dark:border-neutral-700">
        {news.tags && news.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {news.tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs px-2 py-0.5">
                {tag}
              </Badge>
            ))}
            {news.tags.length > 2 && (
              <Badge variant="secondary" className="text-xs px-2 py-0.5">
                +{news.tags.length - 2}
              </Badge>
            )}
          </div>
        )}
        
        <button className="ml-auto text-sm font-semibold text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white transition-colors flex items-center gap-1 group">
          Ler mais
          <i className="ph-bold ph-arrow-right group-hover:translate-x-1 transition-transform" style={{ fontSize: '14px' }}></i>
        </button>
      </div>
    </div>
  )
}

