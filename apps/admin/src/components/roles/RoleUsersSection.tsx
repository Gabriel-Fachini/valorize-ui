import { type FC, useState, useMemo } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
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
import { SkeletonBase, SkeletonAvatar, SkeletonText } from '@/components/ui/Skeleton'
import { toast } from '@/lib/toast'
import userRolesService from '@/services/userRoles'
import type { RoleUser } from '@/types/roles'

interface RoleUsersSectionProps {
  users: RoleUser[]
  isLoading?: boolean
  onRemoveUser?: (userId: string) => Promise<void> | void
  onAddUser?: (userId: string) => Promise<void> | void
  isRemoving?: boolean
  onAddUserSuccess?: () => void | Promise<void>
}

export const RoleUsersSection: FC<RoleUsersSectionProps> = ({
  users,
  isLoading = false,
  onRemoveUser,
  onAddUser,
  isRemoving = false,
  onAddUserSuccess,
}) => {
  const queryClient = useQueryClient()
  const [userToRemove, setUserToRemove] = useState<RoleUser | null>(null)
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false)
  const [searchUsers, setSearchUsers] = useState('')
  const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(new Set())
  const [isAddingUsers, setIsAddingUsers] = useState(false)

  // Fetch available users
  const { data: availableUsersResponse, isLoading: isLoadingUsers } = useQuery({
    queryKey: ['available-users'],
    queryFn: () => userRolesService.listAvailableUsers(),
    staleTime: 5 * 60 * 1000,
  })

  const availableUsers = useMemo(() => availableUsersResponse?.data || [], [availableUsersResponse?.data])

  // Filter users based on search and exclude already assigned users
  const filteredUsers = useMemo(() => {
    const currentUserIds = users.map((u: RoleUser) => u.id)
    return availableUsers.filter((user: RoleUser) => {
      const isAlreadyAssigned = currentUserIds.includes(user.id)
      if (isAlreadyAssigned) return false
      
      if (!searchUsers.trim()) return true
      
      const query = searchUsers.toLowerCase()
      return (
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query)
      )
    })
  }, [availableUsers, users, searchUsers])

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

  const handleAddUser = async () => {
    if (selectedUserIds.size === 0 || !onAddUser) return

    const selectedUsers = Array.from(selectedUserIds)
      .map((id) => availableUsers.find((u: RoleUser) => u.id === id))
      .filter((u): u is RoleUser => u !== undefined)

    if (selectedUsers.length === 0) return

    try {
      setIsAddingUsers(true)
      
      // Use onAddUser callback if provided (original behavior)
      // This allows the component to be flexible for both single and bulk operations
      for (const user of selectedUsers) {
        await onAddUser(user.id)
      }
      
      // Call success callback to trigger data refresh in parent component
      // This must be awaited to ensure data is refetched before closing the modal
      if (onAddUserSuccess) {
        await onAddUserSuccess()
      }
      
      // Invalidate the available users query AFTER parent data is refreshed
      await queryClient.invalidateQueries({ queryKey: ['available-users'] })
      
      const userNames = selectedUsers.map(u => u.name).join(', ')
      toast.success(`${userNames} ${selectedUsers.length === 1 ? 'foi' : 'foram'} adicionado(s) ao cargo com sucesso`)
      setIsAddUserDialogOpen(false)
      setSearchUsers('')
      setSelectedUserIds(new Set())
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao adicionar usuário(s)'
      toast.error(`Erro: ${errorMessage}`)
    } finally {
      setIsAddingUsers(false)
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Usuários com este Cargo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-3"
              >
                <div className="flex items-center gap-3 flex-1">
                  <SkeletonAvatar size="sm" />
                  <div className="flex-1 space-y-2">
                    <SkeletonText width="md" height="md" />
                    <SkeletonText width="lg" height="sm" />
                  </div>
                </div>
                <SkeletonBase>
                  <div className="h-10 w-20 bg-neutral-300 dark:bg-neutral-600 rounded" />
                </SkeletonBase>
              </div>
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
          <div className="rounded-lg bg-white hover:bg-gray-50 dark:bg-gray-900 p-6 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Nenhum usuário atribuído a este cargo ainda
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {users.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between rounded-lg border bg-white hover:bg-gray-50 border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800 p-3 transition"
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
                    className="text-red-600 hover:text-red-700 hover:bg-red-100"
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Adicionar Usuário ao Cargo</DialogTitle>
            <DialogDescription>
              Pesquise e selecione um usuário para adicionar a este cargo
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Search Input */}
            <div className="relative">
              <i className="ph ph-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Pesquisar por nome ou email..."
                value={searchUsers}
                onChange={(e) => setSearchUsers(e.currentTarget.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-sm"
              />
            </div>

            {/* Selected Users Section */}
            {selectedUserIds.size > 0 && (
              <div className="rounded-lg border border-primary-200 bg-primary-50 dark:border-primary-700 dark:bg-primary-900/20 p-4">
                <p className="text-sm font-medium text-primary-900 dark:text-primary-100 mb-3">
                  {selectedUserIds.size} usuário{selectedUserIds.size !== 1 ? 's' : ''} selecionado{selectedUserIds.size !== 1 ? 's' : ''}
                </p>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {Array.from(selectedUserIds)
                    .map((id) => availableUsers.find((u: RoleUser) => u.id === id))
                    .filter((u): u is RoleUser => u !== undefined)
                    .map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center justify-between rounded bg-white dark:bg-gray-800 px-3 py-2 text-sm"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          {user.avatar ? (
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className="h-6 w-6 rounded-full object-cover flex-shrink-0"
                            />
                          ) : (
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary flex-shrink-0">
                              {user.name
                                .split(' ')
                                .map((n: string) => n[0])
                                .join('')
                                .slice(0, 2)
                                .toUpperCase()}
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate text-gray-900 dark:text-gray-100">
                              {user.name}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            const newSelected = new Set(selectedUserIds)
                            newSelected.delete(user.id)
                            setSelectedUserIds(newSelected)
                          }}
                          className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 ml-2"
                          title="Remover seleção"
                        >
                          <i className="ph ph-x text-lg" />
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Users Dropdown */}
            {isLoadingUsers ? (
              <div className="rounded-lg bg-gray-50 dark:bg-gray-900 p-4 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Carregando usuários...
                </p>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="rounded-lg bg-gray-50 dark:bg-gray-900 p-4 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {searchUsers.trim() ? 'Nenhum usuário encontrado' : 'Nenhum usuário disponível'}
                </p>
              </div>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {filteredUsers.map((user: RoleUser) => {
                  const isSelected = selectedUserIds.has(user.id)
                  return (
                    <button
                      key={user.id}
                      onClick={() => {
                        const newSelected = new Set(selectedUserIds)
                        if (newSelected.has(user.id)) {
                          newSelected.delete(user.id)
                        } else {
                          newSelected.add(user.id)
                        }
                        setSelectedUserIds(newSelected)
                      }}
                      className={`w-full flex items-center gap-3 rounded-lg border p-3 text-left transition-colors ${
                        isSelected
                          ? 'border-primary-200 bg-primary-50 dark:border-primary-700 dark:bg-primary-900'
                          : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                    >
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="h-8 w-8 rounded-full object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary flex-shrink-0">
                          {user.name
                            .split(' ')
                            .map((n: string) => n[0])
                            .join('')
                            .slice(0, 2)
                            .toUpperCase()}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-gray-900 dark:text-gray-100 truncate">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                          {user.email}
                        </p>
                      </div>
                      {isSelected && (
                        <i className="ph ph-check text-primary-600 dark:text-primary-400" />
                      )}
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsAddUserDialogOpen(false)
                setSearchUsers('')
                setSelectedUserIds(new Set())
              }}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={handleAddUser}
              disabled={selectedUserIds.size === 0 || isAddingUsers}
            >
              {isAddingUsers ? (
                <>
                  <i className="ph ph-circle-notch animate-spin mr-2" />
                  Adicionando...
                </>
              ) : (
                <>
                  <i className="ph ph-plus mr-2" />
                  Adicionar {selectedUserIds.size > 0 ? `(${selectedUserIds.size})` : ''}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
