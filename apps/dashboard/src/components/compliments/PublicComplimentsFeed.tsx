import { useTrail } from '@react-spring/web'
import { PublicComplimentCard } from './PublicComplimentCard'
import { useComplimentsFeed } from '@/hooks/useComplimentsFeed'

// Skeleton component for loading state
const SkeletonCard = () => (
  <div className="bg-white/70 dark:bg-[#2a2a2a]/80 backdrop-blur-xl border border-white/30 dark:border-neutral-700/30 rounded-2xl p-4 shadow-lg">
    <div className="flex items-start gap-3">
      {/* Avatars Skeleton */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <div className="w-10 h-10 bg-neutral-300 dark:bg-neutral-700 rounded-full animate-pulse" />
        <div className="w-4 h-4 bg-neutral-300 dark:bg-neutral-700 rounded animate-pulse" />
        <div className="w-10 h-10 bg-neutral-300 dark:bg-neutral-700 rounded-full animate-pulse" />
      </div>

      {/* Content Skeleton */}
      <div className="flex-1 min-w-0 space-y-3">
        <div className="space-y-1">
          <div className="h-4 bg-neutral-300 dark:bg-neutral-700 rounded w-3/4 animate-pulse" />
          <div className="h-3 bg-neutral-300 dark:bg-neutral-700 rounded w-20 animate-pulse" />
        </div>
        <div className="space-y-2">
          <div className="h-3 bg-neutral-300 dark:bg-neutral-700 rounded animate-pulse" />
          <div className="h-3 bg-neutral-300 dark:bg-neutral-700 rounded w-2/3 animate-pulse" />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-6 bg-neutral-300 dark:bg-neutral-700 rounded-full w-20 animate-pulse" />
          <div className="h-6 bg-neutral-300 dark:bg-neutral-700 rounded-full w-14 animate-pulse" />
        </div>
      </div>
    </div>
  </div>
)

// Empty state component
const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
    <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mb-4">
      <i className="ph-duotone ph-sparkle text-primary-600 dark:text-primary-400 text-3xl" />
    </div>
    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
      Nenhum elogio ainda
    </h3>
    <p className="text-sm text-gray-600 dark:text-gray-400 max-w-sm">
      Seja o primeiro a reconhecer um colega! Envie um elogio e veja aparecer aqui.
    </p>
  </div>
)

export const PublicComplimentsFeed = () => {
  const { data, isLoading, isError } = useComplimentsFeed()

  // Animation trail for cards
  const trail = useTrail(data.length, {
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0px)' },
    config: { tension: 280, friction: 20 },
  })

  if (isLoading) {
    return (
      <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-primary-500 scrollbar-track-transparent">
        {[...Array(3)].map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6 text-center">
        <i className="ph-duotone ph-warning-circle text-red-600 dark:text-red-400 text-3xl mb-2" />
        <p className="text-sm text-red-700 dark:text-red-300">
          Erro ao carregar o feed de elogios. Tente novamente mais tarde.
        </p>
      </div>
    )
  }

  if (data.length === 0) {
    return <EmptyState />
  }

  return (
    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-primary-500 scrollbar-track-transparent">
      {trail.map((style, index) => (
        <PublicComplimentCard
          key={data[index].id}
          item={data[index]}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          style={style as any}
        />
      ))}
    </div>
  )
}
