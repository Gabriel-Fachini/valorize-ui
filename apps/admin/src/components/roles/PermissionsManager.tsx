import { type FC, useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { usePermissionCategories } from '@/hooks/usePermissions'
import type { PermissionCategory } from '@/types/roles'

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

  const handleSelectAllInCategory = (categoryPermissions: string[], checked: boolean) => {
    const newSelected = new Set(selectedPermissions)
    categoryPermissions.forEach((perm) => {
      if (checked) {
        newSelected.add(perm)
      } else {
        newSelected.delete(perm)
      }
    })
    setSelectedPermissions(newSelected)
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await onSave(Array.from(selectedPermissions))
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
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-8 animate-pulse rounded bg-gray-200" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gerenciador de Permissões</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {categories.map((category: PermissionCategory) => {
            const categoryPerms = category.permissions.map((p) => p.name)
            const allSelected = categoryPerms.every((p) => selectedPermissions.has(p))

            return (
              <div key={category.name} className="rounded border border-gray-200 p-4">
                <div className="mb-3 flex items-center gap-2">
                  <Checkbox
                    id={`category-${category.name}`}
                    checked={allSelected}
                    onCheckedChange={(checked) =>
                      handleSelectAllInCategory(categoryPerms, Boolean(checked))
                    }
                    disabled={isLoading || isSaving}
                  />
                  <Label
                    htmlFor={`category-${category.name}`}
                    className="cursor-pointer font-semibold"
                  >
                    {category.name}
                  </Label>
                  <span className="ml-auto text-sm text-gray-600">
                    {categoryPerms.filter((p) => selectedPermissions.has(p)).length}/
                    {categoryPerms.length}
                  </span>
                </div>

                <div className="space-y-2 pl-6">
                  {category.permissions.map((permission) => (
                    <div key={permission.id} className="flex items-start gap-2">
                      <Checkbox
                        id={`permission-${permission.id}`}
                        checked={selectedPermissions.has(permission.name)}
                        onCheckedChange={() => handleTogglePermission(permission.name)}
                        disabled={isLoading || isSaving}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <Label
                          htmlFor={`permission-${permission.id}`}
                          className="cursor-pointer font-medium"
                        >
                          {permission.name}
                        </Label>
                        {permission.description && (
                          <p className="text-sm text-gray-600">
                            {permission.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}

          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              disabled={isLoading || isSaving || disabled}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              disabled={isLoading || isSaving || disabled}
              title={disabled ? 'Você não tem permissão para gerenciar permissões' : undefined}
            >
              {isSaving ? 'Salvando...' : 'Salvar Permissões'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
