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
      </CardContent>
    </Card>
  )
}
