import { type FC } from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { RolesFilters } from '@/types/roles'

interface RoleTableToolbarProps {
  filters: RolesFilters
  onFiltersChange: (filters: RolesFilters) => void
  onCreateRole: () => void
  isLoading?: boolean
  canCreateRole?: boolean
}

const sortOptions = [
  { value: 'name', label: 'Nome (A-Z)', order: 'asc' as const },
  { value: 'name', label: 'Nome (Z-A)', order: 'desc' as const },
  { value: 'createdAt', label: 'Mais Recentes', order: 'desc' as const },
  { value: 'createdAt', label: 'Mais Antigos', order: 'asc' as const },
  { value: 'usersCount', label: 'Mais Usuários', order: 'desc' as const },
  { value: 'usersCount', label: 'Menos Usuários', order: 'asc' as const },
  { value: 'permissionsCount', label: 'Mais Permissões', order: 'desc' as const },
  { value: 'permissionsCount', label: 'Menos Permissões', order: 'asc' as const },
]

const currentSortLabel = (filters: RolesFilters) => {
  if (!filters.sortBy) return 'Ordenar'
  const option = sortOptions.find(
    (opt) => opt.value === filters.sortBy && opt.order === filters.sortOrder,
  )
  return option?.label || 'Ordenar'
}

export const RoleTableToolbar: FC<RoleTableToolbarProps> = ({
  filters,
  onFiltersChange,
  onCreateRole,
  isLoading = false,
  canCreateRole = true,
}) => {
  return (
    <div className="flex items-center gap-3">
      <input
        type="text"
        placeholder="Buscar cargos por nome..."
        value={filters.search}
        onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
        className="flex-1 rounded border border-gray-300 px-3 py-2 text-sm"
        disabled={isLoading}
      />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" disabled={isLoading}>
            {currentSortLabel(filters)}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {sortOptions.map((option) => (
            <DropdownMenuItem
              key={`${option.value}-${option.order}`}
              onClick={() =>
                onFiltersChange({
                  ...filters,
                  sortBy: option.value as RolesFilters['sortBy'],
                  sortOrder: option.order,
                })
              }
              className={
                filters.sortBy === option.value && filters.sortOrder === option.order
                  ? 'bg-gray-100'
                  : ''
              }
            >
              {option.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Button
        onClick={onCreateRole}
        disabled={isLoading || !canCreateRole}
        className="whitespace-nowrap"
        title={!canCreateRole ? 'Você não tem permissão para criar cargos' : undefined}
      >
        + Novo Cargo
      </Button>
    </div>
  )
}
