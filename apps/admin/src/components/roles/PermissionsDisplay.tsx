import { type FC, useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { usePermissionsInfo } from '@/hooks/usePermissionsInfo'
import { useRolePermissions } from '@/hooks/useRolePermissions'
import type { PermissionInfoByCategory, PermissionCategory } from '@/types/roles'

interface PermissionsDisplayProps {
  roleId: string
  currentPermissions: string[]
  isLoading?: boolean
  editable?: boolean
  categories?: PermissionCategory[]
}

export const PermissionsDisplay: FC<PermissionsDisplayProps> = ({
  roleId,
  currentPermissions,
  isLoading = false,
  editable = false,
  categories,
}) => {
  const { permissionsInfo, isLoading: isLoadingInfo } = usePermissionsInfo()
  const {
    addPermissions,
    removePermissions,
    isAddingPermissions,
    isRemovingPermissions,
  } = useRolePermissions(roleId)

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [selectedPermissionsToAdd, setSelectedPermissionsToAdd] = useState<string[]>([])
  const [permissionToRemove, setPermissionToRemove] = useState<{
    name: string
    displayName: string
  } | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all')

  const loading = isLoading || isLoadingInfo

  // Filter permissions based on search query
  const filteredPermissionsInfo = useMemo(() => {
    if (!searchQuery.trim()) {
      return permissionsInfo
    }

    const query = searchQuery.toLowerCase()
    return permissionsInfo
      .map((category) => ({
        ...category,
        permissions: category.permissions.filter((p) =>
          p.name.toLowerCase().includes(query) || p.description?.toLowerCase().includes(query)
        ),
      }))
      .filter((category) => category.permissions.length > 0)
  }, [permissionsInfo, searchQuery])

  // Get available permissions that are not already assigned to the role
  const availablePermissions = permissionsInfo
    .map((category) => ({
      ...category,
      permissions: category.permissions.filter(
        (p) => !currentPermissions.includes(p.name)
      ),
    }))
    .filter((category) => category.permissions.length > 0)

  const handleOpenAddModal = () => {
    setSelectedPermissionsToAdd([])
    setSelectedCategoryFilter('all')
    setIsAddModalOpen(true)
  }

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false)
    setSelectedPermissionsToAdd([])
    setSelectedCategoryFilter('all')
  }

  const handleTogglePermissionToAdd = (permissionName: string) => {
    setSelectedPermissionsToAdd((prev) =>
      prev.includes(permissionName)
        ? prev.filter((p) => p !== permissionName)
        : [...prev, permissionName]
    )
  }

  const handleAddPermissions = async () => {
    if (selectedPermissionsToAdd.length === 0) return

    try {
      await addPermissions(selectedPermissionsToAdd)
      handleCloseAddModal()
    } catch (error) {
      // Error handling is done in the hook
      console.error('Error adding permissions:', error)
    }
  }

  const handleOpenRemoveDialog = (permissionName: string, displayName: string) => {
    setPermissionToRemove({ name: permissionName, displayName })
  }

  const handleCloseRemoveDialog = () => {
    setPermissionToRemove(null)
  }

  const handleRemovePermission = async () => {
    if (!permissionToRemove) return

    try {
      await removePermissions([permissionToRemove.name])
      handleCloseRemoveDialog()
    } catch (error) {
      // Error handling is done in the hook
      console.error('Error removing permission:', error)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Permissões do Cargo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-16 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (permissionsInfo.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Permissões do Cargo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg bg-gray-50 dark:bg-gray-900 p-6 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Nenhuma permissão disponível no sistema
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Permissões do Cargo ({currentPermissions.length})</span>
          {editable && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleOpenAddModal}
              disabled={availablePermissions.length === 0}
            >
              <i className="ph ph-plus mr-2" />
              Adicionar Permissões
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <i className="ph ph-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Pesquisar permissões..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.currentTarget.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-sm"
            />
          </div>

          {/* Permissions List */}
          <div className="space-y-2">
            {/* Show categories from API */}
            {categories && categories.length > 0 ? (
              categories
                .map((categoryGroup: PermissionCategory) => {
                  // Filter to show only permissions that are in the current role
                  let categoryPermissions = categoryGroup.permissions.filter((p) =>
                    currentPermissions.includes(p.name)
                  )

                  // Apply search filter if there's a search query
                  if (searchQuery.trim()) {
                    const query = searchQuery.toLowerCase()
                    categoryPermissions = categoryPermissions.filter((p) =>
                      p.name.toLowerCase().includes(query) || p.description?.toLowerCase().includes(query)
                    )
                  }

                  if (categoryPermissions.length === 0) {
                    return null
                  }

                  return (
                    <div key={categoryGroup.category} className="space-y-3">
                      <div className="flex items-center gap-3">
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                          {categoryGroup.category}
                        </h4>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 pl-2">
                        {categoryPermissions.map((permission) => (
                          <div
                            key={permission.id}
                            className="group flex flex-col gap-1 rounded-lg border border-blue-200 bg-blue-50/50
dark:border-blue-900/30 dark:bg-blue-950/30 px-3 py-2 hover:bg-blue-100
dark:hover:bg-blue-900/50 transition-colors duration-200 w-full relative"
                          >
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full flex-shrink-0 bg-blue-500" />
                              <div className="flex-1 min-w-0">
                                <span className="text-sm font-medium text-blue-900 dark:text-blue-100 truncate block">
                                  {permission.name}
                                </span>
                              </div>
                              {editable && (
                                <button
                                  type="button"
                                  onClick={() => handleOpenRemoveDialog(permission.name, permission.name)}
                                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 
                                    p-1 hover:bg-red-100 dark:hover:bg-red-900/50 rounded flex-shrink-0"
                                  title="Remover permissão"
                                >
                                  <i className="ph ph-trash text-red-600 dark:text-red-400 text-base" />
                                </button>
                              )}
                            </div>
                            {permission.description && (
                              <p className="text-xs text-blue-700 dark:text-blue-300 pl-4">
                                {permission.description}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })
                .filter(Boolean)
            ) : (
              /* Fallback if categories not provided */
              filteredPermissionsInfo.map((category: PermissionInfoByCategory) => {
                const categoryPermissions = category.permissions.filter((p) =>
                  currentPermissions.includes(p.name)
                )

                if (categoryPermissions.length === 0) {
                  return null
                }

                return (
                  <div key={category.category} className="space-y-3">
                    <div className="flex items-center gap-3">
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {category.category}
                      </h4>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 pl-2">
                      {categoryPermissions.map((permission) => (
                        <div
                          key={permission.name}
                          className="group flex flex-col gap-1 rounded-lg border border-blue-200 bg-blue-50/50
dark:border-blue-900/30 dark:bg-blue-950/30 px-3 py-2 hover:bg-blue-100
dark:hover:bg-blue-900/50 transition-colors duration-200 w-full relative"
                        >
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full flex-shrink-0 bg-blue-500" />
                            <div className="flex-1 min-w-0">
                              <span className="text-sm font-medium text-blue-900 dark:text-blue-100 truncate block">
                                {permission.name}
                              </span>
                            </div>
                            {editable && (
                              <button
                                type="button"
                                onClick={() => handleOpenRemoveDialog(permission.name, permission.name)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 
                                  p-1 hover:bg-red-100 dark:hover:bg-red-900/50 rounded flex-shrink-0"
                                title="Remover permissão"
                              >
                                <i className="ph ph-trash text-red-600 dark:text-red-400 text-base" />
                              </button>
                            )}
                          </div>
                          {permission.description && (
                            <p className="text-xs text-blue-700 dark:text-blue-300 pl-4">
                              {permission.description}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })
            )}

            {/* Show message if no permissions are assigned */}
            {currentPermissions.length === 0 && (
              <div className="rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900/50 p-4">
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  Este cargo não possui permissões atribuídas
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>

      {/* Add Permissions Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Adicionar Permissões</DialogTitle>
            <DialogDescription>
              Selecione as permissões que deseja adicionar a este cargo
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Category Filter */}
            {availablePermissions.length > 0 && (
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategoryFilter('all')}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    selectedCategoryFilter === 'all'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  Todas
                </button>
                {availablePermissions.map((category) => (
                  <button
                    key={category.category}
                    onClick={() => setSelectedCategoryFilter(category.category)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      selectedCategoryFilter === category.category
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    {category.category}
                  </button>
                ))}
              </div>
            )}

            {availablePermissions.length === 0 ? (
              <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900/50 p-4">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Todas as permissões disponíveis já foram atribuídas a este cargo
                </p>
              </div>
            ) : (
              availablePermissions
                .filter((category) => selectedCategoryFilter === 'all' || category.category === selectedCategoryFilter)
                .map((category) => (
                <div key={category.category} className="space-y-3">
                  <div className="flex items-center gap-3">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {category.category}
                    </h4>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-2">
                    {category.permissions.map((permission) => (
                      <div
                        key={permission.name}
                        className={`flex items-start gap-3 rounded-lg border p-3 transition-colors ${
                          selectedPermissionsToAdd.includes(permission.name)
                            ? 'border-primary-200 bg-primary-50 dark:border-primary-700 dark:bg-primary-900'
                            : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                        }`}
                      >
                        <Checkbox
                          id={`add-${permission.name}`}
                          checked={selectedPermissionsToAdd.includes(permission.name)}
                          onCheckedChange={() => handleTogglePermissionToAdd(permission.name)}
                        />
                        <label
                          htmlFor={`add-${permission.name}`}
                          className="flex-1 cursor-pointer"
                        >
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {permission.name}
                          </div>
                          {permission.description && (
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {permission.description}
                            </div>
                          )}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseAddModal}>
              Cancelar
            </Button>
            <Button
              onClick={handleAddPermissions}
              disabled={selectedPermissionsToAdd.length === 0 || isAddingPermissions}
            >
              {isAddingPermissions ? (
                <>
                  <i className="ph ph-circle-notch animate-spin mr-2" />
                  Adicionando...
                </>
              ) : (
                <>
                  <i className="ph ph-plus mr-2" />
                  Adicionar {selectedPermissionsToAdd.length > 0 && `(${selectedPermissionsToAdd.length})`}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Remove Permission Confirmation Dialog */}
      <Dialog open={!!permissionToRemove} onOpenChange={() => handleCloseRemoveDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remover Permissão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja remover a permissão{' '}
              <span className="font-semibold text-gray-900 dark:text-gray-100">
                {permissionToRemove?.displayName}
              </span>{' '}
              deste cargo?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseRemoveDialog}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleRemovePermission}
              disabled={isRemovingPermissions}
            >
              {isRemovingPermissions ? (
                <>
                  <i className="ph ph-circle-notch animate-spin mr-2" />
                  Removendo...
                </>
              ) : (
                <>
                  <i className="ph ph-trash mr-2" />
                  Remover
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
