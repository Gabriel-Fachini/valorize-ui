import { type FC, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { toast } from '@/lib/toast'
import type { RoleUser } from '@/types/roles'

interface RoleUsersSectionProps {
  users: RoleUser[]
  isLoading?: boolean
  onRemoveUser?: (userId: string) => Promise<void> | void
  isRemoving?: boolean
  disabled?: boolean
}

export const RoleUsersSection: FC<RoleUsersSectionProps> = ({
  users,
  isLoading = false,
  onRemoveUser,
  isRemoving = false,
  disabled = false,
}) => {
  const [userToRemove, setUserToRemove] = useState<RoleUser | null>(null)
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)

  const handleRemoveClick = (user: RoleUser) => {
    setUserToRemove(user)
    setIsConfirmDialogOpen(true)
  }

  const handleConfirmRemove = async () => {
    if (!userToRemove || !onRemoveUser) return

    try {
      await onRemoveUser(userToRemove.id)
      toast.success(`${userToRemove.name} removido do role com sucesso`)
      setIsConfirmDialogOpen(false)
      setUserToRemove(null)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao remover usuário'
      toast.error(`Erro: ${errorMessage}`)
    }
  }

  const handleDialogOpenChange = (open: boolean) => {
    setIsConfirmDialogOpen(open)
    if (!open) {
      setUserToRemove(null)
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Usuários com este Role</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-12 animate-pulse rounded bg-gray-200" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Usuários com este Role ({users.length})</CardTitle>
      </CardHeader>
      <CardContent>
        {users.length === 0 ? (
          <div className="rounded-lg bg-gray-50 dark:bg-gray-900 p-6 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Nenhum usuário atribuído a este role ainda
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {users.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-3"
              >
                <div className="flex items-center gap-3 flex-1">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                      {user.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .slice(0, 2)
                        .toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="font-medium text-sm">{user.name}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{user.email}</p>
                  </div>
                </div>
                {onRemoveUser && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveClick(user)}
                    disabled={isRemoving || disabled}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    title={disabled ? 'Você não tem permissão para remover usuários' : undefined}
                  >
                    Remover
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>

      {/* Confirmation Dialog */}
      <Dialog open={isConfirmDialogOpen} onOpenChange={handleDialogOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remover usuário do role?</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja remover <strong>{userToRemove?.name}</strong> deste role?
              Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleDialogOpenChange(false)}
              disabled={isRemoving}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleConfirmRemove}
              disabled={isRemoving}
            >
              {isRemoving ? 'Removendo...' : 'Remover'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
