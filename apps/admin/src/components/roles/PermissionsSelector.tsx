import { type FC, useState, useEffect } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { usePermissionCategories } from '@/hooks/usePermissions'
import type { PermissionCategory } from '@/types/roles'

interface PermissionsSelectorProps {
  value: string[]
  onChange: (permissionNames: string[]) => void
  isLoading?: boolean
}

/**
 * PermissionsSelector - Componente compacto para seleção de permissões
 * Similar ao PermissionsManager mas sem botões de ação e wrapper de card
 * Usado principalmente em formulários de criação/edição
 */
export const PermissionsSelector: FC<PermissionsSelectorProps> = ({
  value,
  onChange,
  isLoading = false,
}) => {
  const { categories, isLoading: isLoadingCategories } = usePermissionCategories()
  const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(
    new Set(value),
  )

  useEffect(() => {
    setSelectedPermissions(new Set(value))
  }, [value])

  const handleTogglePermission = (permissionName: string) => {
    const newSelected = new Set(selectedPermissions)
    if (newSelected.has(permissionName)) {
      newSelected.delete(permissionName)
    } else {
      newSelected.add(permissionName)
    }
    setSelectedPermissions(newSelected)
    onChange(Array.from(newSelected))
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
    onChange(Array.from(newSelected))
  }

  if (isLoadingCategories) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-8 animate-pulse rounded bg-gray-200" />
        ))}
      </div>
    )
  }

  return (
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
                disabled={isLoading || isLoadingCategories}
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
                    disabled={isLoading || isLoadingCategories}
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
    </div>
  )
}
