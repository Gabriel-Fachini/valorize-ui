/**
 * Recent Activity Feed
 * Displays the most recent compliments activity
 */

import type { FC } from 'react'
import { animated, useSpring } from '@react-spring/web'
import { Badge } from '@/components/ui/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import type { RecentActivityItem } from '@/types/compliments'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface RecentActivityFeedProps {
  data?: RecentActivityItem[]
  isLoading?: boolean
}

const ActivityItemSkeleton: FC = () => {
  return (
    <div className="p-3 rounded-lg border bg-card space-y-3">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
        <div className="w-4 h-4 text-muted-foreground">→</div>
        <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
      </div>
      <div className="space-y-2">
        <div className="h-3.5 w-48 bg-muted animate-pulse rounded" />
        <div className="h-3 w-full bg-muted/60 animate-pulse rounded" />
        <div className="h-3 w-32 bg-muted/40 animate-pulse rounded" />
      </div>
    </div>
  )
}

const ActivityItem: FC<{ activity: RecentActivityItem }> = ({ activity }) => {
  const timeAgo = formatDistanceToNow(new Date(activity.createdAt), {
    addSuffix: true,
    locale: ptBR,
  })

  const truncateMessage = (message: string, maxLength: number = 100) => {
    if (message.length <= maxLength) return message
    return `${message.substring(0, maxLength)}...`
  }

  return (
    <div className="group p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors space-y-3">
      {/* Avatars no topo */}
      <div className="flex items-center gap-2">
        {/* Sender Avatar */}
        {activity.sender.avatar ? (
          <img
            src={activity.sender.avatar}
            alt={activity.sender.name}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <i className="ph ph-user text-primary" />
          </div>
        )}

        {/* Arrow */}
        <i className="ph ph-arrow-right text-muted-foreground text-lg" />

        {/* Receiver Avatar */}
        {activity.receiver.avatar ? (
          <img
            src={activity.receiver.avatar}
            alt={activity.receiver.name}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <i className="ph ph-user text-primary" />
          </div>
        )}
      </div>

      {/* Informações */}
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm">
            <span className="font-medium">{activity.sender.name}</span>
            <span className="text-muted-foreground"> reconheceu </span>
            <span className="font-medium">{activity.receiver.name}</span>
          </p>
          <Badge
            variant="outline"
            className="flex-shrink-0 text-xs flex items-center gap-1"
            style={{
              backgroundColor: activity.companyValue.iconColor
                ? `${activity.companyValue.iconColor}20`
                : 'transparent',
              borderColor: activity.companyValue.iconColor || 'currentColor',
            }}
          >
            {activity.companyValue.iconName && (
              <i
                className={`ph ph-${activity.companyValue.iconName}`}
                style={{ color: activity.companyValue.iconColor || 'currentColor' }}
              />
            )}
            {activity.companyValue.title}
          </Badge>
        </div>

        <TooltipProvider>
          <Tooltip delayDuration={300}>
            <TooltipTrigger asChild>
              <p className="text-xs text-muted-foreground italic line-clamp-2 cursor-help">
                "{truncateMessage(activity.message)}"
              </p>
            </TooltipTrigger>
            <TooltipContent className="max-w-sm" side="bottom" align="start">
              <p className="text-sm whitespace-pre-wrap">{activity.message}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <i className="ph ph-coins text-primary" />
            {activity.coins} moedas
          </span>
          <span>•</span>
          <span>{timeAgo}</span>
        </div>
      </div>
    </div>
  )
}

export const RecentActivityFeed: FC<RecentActivityFeedProps> = ({ data, isLoading = false }) => {
  const cardAnimation = useSpring({
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0px)' },
    delay: 600,
  })

  return (
    <animated.div
      style={cardAnimation as any}
      className="rounded-3xl border bg-card p-6 shadow-sm"
    >
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">Atividade Recente</h3>
          <TooltipProvider>
            <Tooltip delayDuration={200}>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className="inline-flex items-center justify-center hover:text-foreground transition-colors"
                >
                  <i className="ph ph-info text-xl text-muted-foreground/70 hover:text-muted-foreground" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs" side="right" align="start">
                <p className="text-sm">
                  Feed dos elogios mais recentes enviados na plataforma
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <p className="text-sm text-muted-foreground">Últimos reconhecimentos enviados</p>
      </div>

      <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
        {isLoading ? (
          <>
            {Array.from({ length: 5 }).map((_, i) => (
              <ActivityItemSkeleton key={i} />
            ))}
          </>
        ) : data && data.length > 0 ? (
          data.map((activity) => <ActivityItem key={activity.id} activity={activity} />)
        ) : (
          <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
            <i className="ph ph-chat-circle-dots text-4xl mb-2 opacity-50" />
            <p>Nenhuma atividade recente</p>
          </div>
        )}
      </div>
    </animated.div>
  )
}
