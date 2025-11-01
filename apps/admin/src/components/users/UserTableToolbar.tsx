import { type FC } from 'react'
import { Button } from '@/components/ui/button'
import { SimpleInput } from '@/components/ui/simple-input'
import type { UserFilters } from '@/types/users'

interface UserTableToolbarProps {
  filters: UserFilters
  onFiltersChange: (filters: UserFilters) => void
  onImportCSV: () => void
  isLoading?: boolean
}

export const UserTableToolbar: FC<UserTableToolbarProps> = ({
  filters,
  onFiltersChange,
  onImportCSV,
  isLoading,
}) => {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex flex-1 items-center gap-2">
        <div className="relative w-full max-w-sm">
          <i className="ph ph-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <SimpleInput
            placeholder="Buscar por nome ou email..."
            value={filters.search}
            onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
            className="pl-10"
          />
        </div>
        <select
          value={filters.status}
          onChange={(e) =>
            onFiltersChange({
              ...filters,
              status: e.target.value as 'all' | 'active' | 'inactive',
            })
          }
          className="h-10 rounded-md border px-3 text-sm"
        >
          <option value="all">Todos os status</option>
          <option value="active">Ativos</option>
          <option value="inactive">Inativos</option>
        </select>
      </div>
      <Button onClick={onImportCSV} disabled={isLoading}>
        <i className="ph ph-upload-simple mr-2" />
        Importar CSV
      </Button>
    </div>
  )
}
