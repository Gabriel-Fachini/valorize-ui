import { type FC } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { User } from '@/types/users'

interface UserDetailCardProps {
  user: User
}

export const UserDetailCard: FC<UserDetailCardProps> = ({ user }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <i className="ph ph-user-circle text-2xl text-primary" />
          Informações do Usuário
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          {user.avatar ? (
            <img src={user.avatar} alt={user.name} className="h-20 w-20 rounded-full object-cover" />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-2xl font-semibold text-primary">
              {user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)}
            </div>
          )}
          <div className="flex-1">
            <h3 className="text-2xl font-bold">{user.name}</h3>
            <p className="text-muted-foreground">{user.email}</p>
          </div>
          <Badge variant={user.isActive ? 'default' : 'secondary'}>
            {user.isActive ? 'Ativo' : 'Inativo'}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4">
          <div>
            <p className="text-sm text-muted-foreground">Departamento</p>
            <p className="font-medium">{user.department?.name || '-'}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Cargo</p>
            <p className="font-medium">{user.position?.name || '-'}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Data de criação</p>
            <p className="font-medium">{new Date(user.createdAt).toLocaleDateString('pt-BR')}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Último acesso</p>
            <p className="font-medium">
              {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString('pt-BR') : 'Nunca'}
            </p>
          </div>
        </div>

        {/* Seção de Histórico de Emails */}
        <div className="border-t pt-4 mt-4">
          <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <i className="ph ph-envelope-simple text-primary" />
            Histórico de Emails
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Emails enviados</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge
                  variant={
                    (user.welcomeEmailSendCount || 0) >= 3
                      ? 'destructive'
                      : (user.welcomeEmailSendCount || 0) > 0
                        ? 'secondary'
                        : 'outline'
                  }
                >
                  {user.welcomeEmailSendCount || 0}/3
                </Badge>
                {(user.welcomeEmailSendCount || 0) >= 3 && (
                  <span className="text-xs text-destructive">Limite atingido</span>
                )}
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Último envio</p>
              <p className="font-medium">
                {user.lastWelcomeEmailSentAt
                  ? new Date(user.lastWelcomeEmailSentAt).toLocaleString('pt-BR')
                  : 'Nenhum envio'}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
