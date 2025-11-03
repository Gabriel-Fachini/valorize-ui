import { type FC } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { RoleDetail } from '@/types/roles'

interface RoleDetailCardProps {
  role: RoleDetail
  isLoading?: boolean
}

export const RoleDetailCard: FC<RoleDetailCardProps> = ({
  role,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="h-8 w-32 animate-pulse rounded bg-gray-200" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="h-4 w-64 animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-48 animate-pulse rounded bg-gray-200" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{role.name}</span>
          <div className="flex gap-2">
            <Badge variant="outline">
              {role.usersCount} usuário{role.usersCount !== 1 ? 's' : ''}
            </Badge>
            <Badge variant="secondary">
              {role.permissionsCount} permissão{role.permissionsCount !== 1 ? 's' : ''}
            </Badge>
          </div>
        </CardTitle>
        {role.description && (
          <CardDescription>
            {role.description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="mb-2 text-sm font-semibold">Informações</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">ID:</span>
                <code className="rounded bg-gray-100 dark:bg-gray-800 px-2 py-1 font-mono text-gray-900 dark:text-gray-100">
                  {role.id.slice(0, 8)}...
                </code>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Criado em:</span>
                <span>{new Date(role.createdAt).toLocaleString('pt-BR', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                })}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Atualizado em:</span>
                <span>{new Date(role.updatedAt).toLocaleString('pt-BR', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                })}</span>
              </div>
            </div>
          </div>

          {role.permissions && role.permissions.length > 0 && (
            <div>
              <h4 className="mb-2 text-sm font-semibold">Permissões Atribuídas</h4>
              <div className="flex flex-wrap gap-2">
                {role.permissions.map((permission) => (
                  <Badge key={permission.id} variant="outline">
                    {permission.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
