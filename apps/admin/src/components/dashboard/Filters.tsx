import type { FC } from 'react'
import { useState } from 'react'
import { Calendar } from '@/components/ui/calendar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import type { DashboardFilters } from '@/types/dashboard'
import { useDepartments, useRoles } from '@/hooks/useFilters'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface FiltersProps {
  filters: DashboardFilters
  onFiltersChange: (filters: DashboardFilters) => void
}

export const Filters: FC<FiltersProps> = ({
  filters,
  onFiltersChange,
}) => {
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined
    to: Date | undefined
  }>({
    from: filters.startDate ? new Date(filters.startDate) : undefined,
    to: filters.endDate ? new Date(filters.endDate) : undefined,
  })

  const { data: departments, isLoading: isLoadingDepartments } = useDepartments()
  const { data: roles, isLoading: isLoadingRoles } = useRoles()

  const handleDateSelect = (range: { from: Date | undefined; to: Date | undefined }) => {
    setDateRange(range)
    onFiltersChange({
      ...filters,
      startDate: range.from ? range.from.toISOString() : undefined,
      endDate: range.to ? range.to.toISOString() : undefined,
    })
  }

  const handleDepartmentChange = (departmentId: string) => {
    onFiltersChange({
      ...filters,
      departmentId: departmentId === 'all' ? undefined : departmentId,
    })
  }

  const handleRoleChange = (role: string) => {
    onFiltersChange({
      ...filters,
      role: role === 'all' ? undefined : role,
    })
  }

  const handleClearFilters = () => {
    setDateRange({ from: undefined, to: undefined })
    onFiltersChange({})
  }

  const formatDateRange = () => {
    if (!dateRange.from) return 'Selecionar período'
    if (!dateRange.to) return format(dateRange.from, 'dd/MM/yyyy', { locale: ptBR })
    return `${format(dateRange.from, 'dd/MM/yyyy', { locale: ptBR })} - ${format(dateRange.to, 'dd/MM/yyyy', { locale: ptBR })}`
  }

  const hasActiveFilters =
    filters.startDate || filters.endDate || filters.departmentId || filters.role

  return (
    <div className="flex flex-wrap w-fit items-center gap-3 rounded-lg border bg-card p-4">
      {/* Date Range Filter */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-[280px] justify-start text-left font-normal"
          >
            <i className="ph ph-calendar mr-2 h-4 w-4" />
            {formatDateRange()}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-4" align="start">
          <Calendar
            mode="range"
            selected={{ from: dateRange.from, to: dateRange.to }}
            onSelect={(range) =>
              handleDateSelect({
                from: range?.from,
                to: range?.to,
              })
            }
            numberOfMonths={2}
            locale={ptBR}
            showOutsideDays={false}
            className="[--cell-size:2.75rem]"
            classNames={{
              day: "h-11 w-11 p-0 font-normal aria-selected:opacity-100",
              day_range_start: "bg-primary text-primary-foreground rounded-md",
              day_range_end: "bg-primary text-primary-foreground rounded-md",
              day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground rounded-md",
              day_range_middle: "bg-primary/20 text-foreground rounded-none aria-selected:bg-primary/20 aria-selected:text-foreground",
              day_today: "bg-accent text-accent-foreground font-semibold",
            }}
          />
        </PopoverContent>
      </Popover>

      {/* Department Filter */}
      <Select
        value={filters.departmentId ?? 'all'}
        onValueChange={handleDepartmentChange}
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

      {/* Role Filter */}
      <Select
        value={filters.role ?? 'all'}
        onValueChange={handleRoleChange}
        disabled={isLoadingRoles}
      >
        <SelectTrigger className="w-[200px]">
          <i className="ph ph-user-circle mr-2 h-4 w-4" />
          <SelectValue placeholder="Cargo" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os cargos</SelectItem>
          {roles?.map((role) => (
            <SelectItem key={role.id} value={role.id}>
              {role.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClearFilters}
          className="ml-auto"
        >
          <i className="ph ph-x mr-2 h-4 w-4" />
          Limpar filtros
        </Button>
      )}
    </div>
  )
}
