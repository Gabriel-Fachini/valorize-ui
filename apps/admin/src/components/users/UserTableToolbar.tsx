import { type FC } from 'react'
import { Button } from '@/components/ui/button'
import { SimpleInput } from '@/components/ui/simple-input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useDepartments, useJobTitles } from '@/hooks/useFilters'
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
  const { data: departments, isLoading: isLoadingDepartments } = useDepartments()
  const { data: jobTitles, isLoading: isLoadingJobTitles } = useJobTitles()

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

        <Select
          value={filters.status}
          onValueChange={(value) =>
            onFiltersChange({ ...filters, status: value as 'all' | 'active' | 'inactive' })
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            <SelectItem value="active">Ativos</SelectItem>
            <SelectItem value="inactive">Inativos</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.departmentId || 'all'}
          onValueChange={(value) =>
            onFiltersChange({ ...filters, departmentId: value === 'all' ? '' : value })
          }
          disabled={isLoadingDepartments}
        >
          <SelectTrigger className="w-[200px]">
            <i className="ph ph-buildings mr-2 h-4 w-4" />
            <SelectValue placeholder="Departamento" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos departamentos</SelectItem>
            {departments?.map((dept) => (
              <SelectItem key={dept.id} value={dept.id}>
                {dept.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.jobTitleId || 'all'}
          onValueChange={(value) =>
            onFiltersChange({ ...filters, jobTitleId: value === 'all' ? '' : value })
          }
          disabled={isLoadingJobTitles}
        >
          <SelectTrigger className="w-[200px]">
            <i className="ph ph-briefcase mr-2 h-4 w-4" />
            <SelectValue placeholder="Cargo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os cargos</SelectItem>
            {jobTitles?.map((job) => (
              <SelectItem key={job.id} value={job.id}>
                {job.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button onClick={onImportCSV} disabled={isLoading}>
        <i className="ph ph-upload-simple mr-2" />
        Importar CSV
      </Button>
    </div>
  )
}
