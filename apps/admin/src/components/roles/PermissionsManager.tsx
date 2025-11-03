import { type FC, useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from '@/lib/toast'
import { usePermissionCategories } from '@/hooks/usePermissions'
import type { PermissionCategory, Permission } from '@/types/roles'

interface PermissionsManagerProps {
  currentPermissions: string[]
  onSave: (permissionNames: string[]) => Promise<void>
  isLoading?: boolean
  disabled?: boolean
}

export const PermissionsManager: FC<PermissionsManagerProps> = ({
  currentPermissions,
  onSave,
  isLoading = false,
  disabled = false,
}) => {
  const { categories, isLoading: isLoadingCategories } = usePermissionCategories()
  const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(
    new Set(currentPermissions),
  )
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    setSelectedPermissions(new Set(currentPermissions))
  }, [currentPermissions])

  const handleTogglePermission = (permissionName: string) => {
    const newSelected = new Set(selectedPermissions)
    if (newSelected.has(permissionName)) {
      newSelected.delete(permissionName)
    } else {
      newSelected.add(permissionName)
    }
    setSelectedPermissions(newSelected)
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await onSave(Array.from(selectedPermissions))
      toast.success('Permissões atualizadas com sucesso')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao salvar permissões'
      toast.error(message)
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoadingCategories) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Gerenciador de Permissões</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-24 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (categories.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Gerenciador de Permissões</CardTitle>
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
          <span>Gerenciador de Permissões</span>
          <Badge variant="secondary">{selectedPermissions.size} selecionadas</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {categories.map((category: PermissionCategory) => (
            <div key={category.category}>
              <h3 className="text-sm font-semibold mb-3 text-gray-900 dark:text-gray-100">
                {category.category}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {category.permissions.map((permission: Permission) => {
                  const isSelected = selectedPermissions.has(permission.name)

                  return (
                    <button
                      key={permission.id}
                      onClick={() => {
                        if (!disabled && !isLoading && !isSaving) {
                          handleTogglePermission(permission.name)
                        }
                      }}
                      disabled={disabled || isLoading || isSaving}
                      className={`
                        rounded-lg border-2 p-3 text-left transition-all duration-200
                        ${
                          isSelected
                            ? 'border-primary bg-primary/5 dark:bg-primary/10'
                            : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-gray-300 dark:hover:border-gray-600'
                        }
                        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                        disabled:cursor-not-allowed
                      `}
                      title={disabled ? 'Você não tem permissão para gerenciar permissões' : undefined}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p className={`font-medium text-sm ${isSelected ? 'text-primary' : 'text-gray-900 dark:text-gray-100'}`}>
                            {permission.name}
                          </p>
                          {permission.description && (
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                              {permission.description}
                            </p>
                          )}
                        </div>
                        {isSelected && (
                          <div className="flex-shrink-0 mt-1">
                            <i className="ph ph-check-circle text-primary text-lg" />
                          </div>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          ))}

          <div className="flex justify-end gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              variant="outline"
              disabled={isLoading || isSaving || disabled}
              onClick={() => setSelectedPermissions(new Set(currentPermissions))}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              disabled={isLoading || isSaving || disabled || selectedPermissions.size === 0}
              title={disabled ? 'Você não tem permissão para gerenciar permissões' : undefined}
            >
              {isSaving ? 'Salvando...' : `Salvar ${selectedPermissions.size} Permissão${selectedPermissions.size !== 1 ? 's' : ''}`}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
