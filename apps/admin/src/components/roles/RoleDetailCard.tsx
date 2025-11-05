import { type FC } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { SimpleInput } from '@/components/ui/simple-input'
import { Label } from '@/components/ui/label'
import type { RoleDetail } from '@/types/roles'

interface RoleDetailCardProps {
  role: RoleDetail
  isLoading?: boolean
  isEditing?: boolean
  editedName?: string
  editedDescription?: string
  onNameChange?: (value: string) => void
  onDescriptionChange?: (value: string) => void
}

export const RoleDetailCard: FC<RoleDetailCardProps> = ({
  role,
  isLoading = false,
  isEditing = false,
  editedName = '',
  editedDescription = '',
  onNameChange,
  onDescriptionChange,
}) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="h-8 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="h-4 w-64 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-4 w-48 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{isEditing ? 'Editar Cargo' : role.name}</span>
          <div className="flex gap-2">
            <Badge className='bg-gray-50 dark:bg-gray-800' variant="outline">
              {role.usersCount} usuário{role.usersCount !== 1 ? 's' : ''}
            </Badge>
            <Badge className='bg-gray-50 dark:bg-gray-800' variant="outline">
              {role.permissionsCount} permissão{role.permissionsCount !== 1 ? 's' : ''}
            </Badge>
          </div>
        </CardTitle>
        {!isEditing && role.description && (
          <CardDescription>
            {role.description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isEditing ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="role-name">Nome do Cargo</Label>
                <SimpleInput
                  id="role-name"
                  value={editedName}
                  onChange={(e) => onNameChange?.(e.target.value)}
                  placeholder="Digite o nome do cargo"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role-description">Descrição</Label>
                <textarea
                  id="role-description"
                  value={editedDescription}
                  onChange={(e) => onDescriptionChange?.(e.target.value)}
                  placeholder="Digite a descrição do cargo (opcional)"
                  rows={3}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
            </>
          ) : null}

          <div>
            <h4 className="mb-2 text-sm font-semibold">Datas</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Criado em:</span>
                <span className="text-gray-900 dark:text-gray-100">{role.createdAt ? new Date(role.createdAt).toLocaleDateString('pt-BR') : '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Atualizado em:</span>
                <span className="text-gray-900 dark:text-gray-100">{role.updatedAt ? new Date(role.updatedAt).toLocaleDateString('pt-BR') : '-'}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
