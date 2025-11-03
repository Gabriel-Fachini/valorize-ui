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
  onAddUser?: (userId: string) => Promise<void> | void
  isRemoving?: boolean
}

export const RoleUsersSection: FC<RoleUsersSectionProps> = ({
  users,
  isLoading = false,
  onRemoveUser,
  onAddUser,
  isRemoving = false,
}) => {
  const [userToRemove, setUserToRemove] = useState<RoleUser | null>(null)
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false)
  const [searchUsers, setSearchUsers] = useState('')

  const handleRemoveClick = (user: RoleUser) => {
    setUserToRemove(user)
    setIsConfirmDialogOpen(true)
  }

  const handleConfirmRemove = async () => {
    if (!userToRemove || !onRemoveUser) return

    try {
      await onRemoveUser(userToRemove.id)
      toast.success(`${userToRemove.name} removido do cargo com sucesso`)
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
          <CardTitle>Usuários com este Cargo</CardTitle>
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
        <CardTitle className="flex items-center justify-between">
          <span>Usuários com este Cargo ({users.length})</span>
          {onAddUser && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAddUserDialogOpen(true)}
            >
              <i className="ph ph-plus mr-2" />
              Adicionar Usuário
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {users.length === 0 ? (
          <div className="rounded-lg bg-gray-50 dark:bg-gray-900 p-6 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Nenhum usuário atribuído a este cargo ainda
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
                    disabled={isRemoving}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
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
            <DialogTitle>Remover usuário do cargo?</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja remover <strong>{userToRemove?.name}</strong> deste cargo?
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

      {/* Add User Modal */}
      <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Adicionar Usuário ao Cargo</DialogTitle>
            <DialogDescription>
              Pesquise e selecione um usuário para adicionar a este cargo
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="relative">
              <i className="ph ph-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Pesquisar usuários..."
                value={searchUsers}
                onChange={(e) => setSearchUsers(e.currentTarget.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-sm"
              />
            </div>

            {/* Não temos a lista de usuários disponíveis ainda */}
            <div className="rounded-lg bg-gray-50 dark:bg-gray-900 p-4 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Selecione um usuário da lista
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsAddUserDialogOpen(false)
                setSearchUsers('')
              }}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              disabled={true}
            >
              Adicionar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
