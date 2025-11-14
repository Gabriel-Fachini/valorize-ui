/**
 * Top Users Section
 * Displays top users in 3 categories: senders, receivers, and balanced
 */

import type { FC } from 'react'
import { animated, useSpring } from '@react-spring/web'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import type { TopUsers, TopSenderUser, TopReceiverUser, BalancedUser } from '@/types/compliments'

interface TopUsersSectionProps {
  data?: TopUsers
  isLoading?: boolean
}

interface SenderCardProps {
  user: TopSenderUser
  rank: number
}

interface ReceiverCardProps {
  user: TopReceiverUser
  rank: number
}

interface BalancedCardProps {
  user: BalancedUser
  rank: number
}

const getRankEmoji = (rank: number) => {
  if (rank === 0) return '🥇'
  if (rank === 1) return '🥈'
  if (rank === 2) return '🥉'
  return `${rank + 1}º`
}

const SenderCard: FC<SenderCardProps> = ({ user, rank }) => {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
      <div className="text-lg font-semibold text-muted-foreground w-8 text-center">
        {getRankEmoji(rank)}
      </div>

      <div className="flex-shrink-0">
        {user.avatar ? (
          <img
            src={user.avatar}
            alt={user.name}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <i className="ph ph-user text-primary text-xl" />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{user.name}</p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {user.department && <span className="truncate">{user.department}</span>}
          {user.jobTitle && (
            <>
              <span>•</span>
              <span className="truncate">{user.jobTitle}</span>
            </>
          )}
        </div>
      </div>

      <div className="flex flex-col items-end gap-1">
        <Badge variant="secondary" className="text-xs whitespace-nowrap">
          {user.sentCount} enviados
        </Badge>
        <span className="text-xs text-muted-foreground">
          {user.totalCoinsSent.toLocaleString('pt-BR')} moedas
        </span>
      </div>
    </div>
  )
}

const ReceiverCard: FC<ReceiverCardProps> = ({ user, rank }) => {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
      <div className="text-lg font-semibold text-muted-foreground w-8 text-center">
        {getRankEmoji(rank)}
      </div>

      <div className="flex-shrink-0">
        {user.avatar ? (
          <img
            src={user.avatar}
            alt={user.name}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <i className="ph ph-user text-primary text-xl" />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{user.name}</p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {user.department && <span className="truncate">{user.department}</span>}
          {user.jobTitle && (
            <>
              <span>•</span>
              <span className="truncate">{user.jobTitle}</span>
            </>
          )}
        </div>
      </div>

      <div className="flex flex-col items-end gap-1">
        <Badge variant="secondary" className="text-xs whitespace-nowrap">
          {user.receivedCount} recebidos
        </Badge>
        <span className="text-xs text-muted-foreground">
          {user.totalCoinsReceived.toLocaleString('pt-BR')} moedas
        </span>
      </div>
    </div>
  )
}

const BalancedCard: FC<BalancedCardProps> = ({ user, rank }) => {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
      <div className="text-lg font-semibold text-muted-foreground w-8 text-center">
        {getRankEmoji(rank)}
      </div>

      <div className="flex-shrink-0">
        {user.avatar ? (
          <img
            src={user.avatar}
            alt={user.name}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <i className="ph ph-user text-primary text-xl" />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{user.name}</p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {user.department && <span className="truncate">{user.department}</span>}
          {user.jobTitle && (
            <>
              <span>•</span>
              <span className="truncate">{user.jobTitle}</span>
            </>
          )}
        </div>
      </div>

      <div className="flex flex-col items-end gap-1">
        <Badge variant="secondary" className="text-xs whitespace-nowrap">
          Score: {user.balanceScore.toFixed(1)}
        </Badge>
        <span className="text-xs text-muted-foreground">
          {user.sentCount} enviados / {user.receivedCount} recebidos
        </span>
      </div>
    </div>
  )
}

const UserListSkeleton: FC = () => {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-3 rounded-lg border bg-card">
          <div className="w-8 h-5 bg-muted animate-pulse rounded" />
          <div className="w-10 h-10 rounded-full bg-muted animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-32 bg-muted animate-pulse rounded" />
            <div className="h-3 w-24 bg-muted/60 animate-pulse rounded" />
          </div>
          <div className="space-y-1">
            <div className="h-5 w-20 bg-muted animate-pulse rounded" />
            <div className="h-3 w-16 bg-muted/60 animate-pulse rounded" />
          </div>
        </div>
      ))}
    </div>
  )
}

export const TopUsersSection: FC<TopUsersSectionProps> = ({ data, isLoading = false }) => {
  const cardAnimation = useSpring({
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0px)' },
    delay: 300,
  })

  return (
    <animated.div
      style={cardAnimation as any}
      className="rounded-3xl border bg-card p-6 shadow-sm"
    >
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">Top Colaboradores</h3>
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
                  Ranking dos colaboradores mais ativos na plataforma de reconhecimento
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <p className="text-sm text-muted-foreground">
          Colaboradores mais engajados no reconhecimento
        </p>
      </div>

      <Tabs defaultValue="senders" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="senders">
            <i className="ph ph-paper-plane-tilt mr-2" />
            Mais Enviam
          </TabsTrigger>
          <TabsTrigger value="receivers">
            <i className="ph ph-trophy mr-2" />
            Mais Recebem
          </TabsTrigger>
          <TabsTrigger value="balanced">
            <i className="ph ph-scales mr-2" />
            Equilibrados
          </TabsTrigger>
        </TabsList>

        <TabsContent value="senders" className="mt-4">
          {isLoading ? (
            <UserListSkeleton />
          ) : data?.senders && data.senders.length > 0 ? (
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
              {data.senders.map((user, index) => (
                <SenderCard key={user.userId} user={user} rank={index} />
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-40 text-muted-foreground">
              <p>Nenhum dado disponível</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="receivers" className="mt-4">
          {isLoading ? (
            <UserListSkeleton />
          ) : data?.receivers && data.receivers.length > 0 ? (
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
              {data.receivers.map((user, index) => (
                <ReceiverCard key={user.userId} user={user} rank={index} />
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-40 text-muted-foreground">
              <p>Nenhum dado disponível</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="balanced" className="mt-4">
          {isLoading ? (
            <UserListSkeleton />
          ) : data?.balanced && data.balanced.length > 0 ? (
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
              {data.balanced.map((user, index) => (
                <BalancedCard key={user.userId} user={user} rank={index} />
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-40 text-muted-foreground">
              <p>Nenhum dado disponível</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </animated.div>
  )
}
