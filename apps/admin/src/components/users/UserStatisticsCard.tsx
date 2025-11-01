import { type FC } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { User } from '@/types/users'

interface UserStatisticsCardProps {
  user: User
}

export const UserStatisticsCard: FC<UserStatisticsCardProps> = ({ user }) => {
  const stats = user.statistics || {
    complimentsSent: 0,
    complimentsReceived: 0,
    totalCoins: 0,
    redeemptions: 0,
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <i className="ph ph-chart-line text-2xl text-primary" />
          Estatísticas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-6">
          <div className="flex items-center gap-3 rounded-lg border p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-950">
              <i className="ph ph-paper-plane-tilt text-2xl text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Elogios enviados</p>
              <p className="text-2xl font-bold">{stats.complimentsSent}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-lg border p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-950">
              <i className="ph ph-star text-2xl text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Elogios recebidos</p>
              <p className="text-2xl font-bold">{stats.complimentsReceived}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-lg border p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-950">
              <i className="ph ph-coins text-2xl text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Moedas totais</p>
              <p className="text-2xl font-bold">{stats.totalCoins}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-lg border p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-950">
              <i className="ph ph-gift text-2xl text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Prêmios resgatados</p>
              <p className="text-2xl font-bold">{stats.redeemptions}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
