/**
 * Data Table Toolbar
 * Barra de ferramentas com filtros e ações
 */

import type { FC, ReactNode } from 'react'
import { SimpleInput } from '@/components/ui/simple-input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { FilterConfig, SelectOption } from '@/config/tables/types'

interface DataTableToolbarProps {
  filters?: FilterConfig[]
  filterValues: Record<string, unknown>
  onFiltersChange: (filters: Record<string, unknown>) => void
  toolbarActions?: ReactNode
  dynamicFilterOptions?: Record<string, SelectOption[]>
}

export const DataTableToolbar: FC<DataTableToolbarProps> = ({
  filters = [],
  filterValues,
  onFiltersChange,
  toolbarActions,
  dynamicFilterOptions = {},
}) => {
  const handleFilterChange = (filterId: string, value: unknown) => {
    onFiltersChange({
      ...filterValues,
      [filterId]: value,
    })
  }

  const renderFilter = (filter: FilterConfig) => {
    switch (filter.type) {
      case 'search':
        return (
          <div className="relative w-full max-w-sm" key={filter.id}>
            {filter.icon && (
              <i
                className={`ph ${filter.icon} absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground`}
              />
            )}
            <SimpleInput
              placeholder={filter.placeholder}
              value={String(filterValues[filter.id] || '')}
              onChange={(e) => handleFilterChange(filter.id, e.target.value)}
              className={`${filter.icon ? 'pl-10' : ''} pr-10`}
            />
            {filter.clearable && filterValues[filter.id] ? (
              <button
                onClick={() => handleFilterChange(filter.id, '')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Limpar busca"
              >
                <i className="ph ph-x" />
              </button>
            ) : null}
          </div>
        )

      case 'select': {
        const selectFilter = filter
        const options = selectFilter.dynamic
          ? dynamicFilterOptions[filter.id] || []
          : selectFilter.options

        return (
          <Select
            key={filter.id}
            value={String(filterValues[filter.id] || 'all')}
            onValueChange={(value) => handleFilterChange(filter.id, value === 'all' ? '' : value)}
          >
            <SelectTrigger className={filter.width || 'w-[180px]'}>
              {filter.icon && <i className={`ph ${filter.icon} mr-2 h-4 w-4`} />}
              <SelectValue placeholder={filter.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.icon && <i className={`ph ${option.icon} mr-2`} />}
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      }

      // TODO: Implementar date-range e multi-select quando necessário
      default:
        return null
    }
  }

  if (filters.length === 0 && !toolbarActions) {
    return null
  }

  return (
    <div className="flex items-center justify-between gap-4">
      {/* Filtros */}
      {filters.length > 0 && (
        <div className="flex flex-1 items-center gap-2">{filters.map(renderFilter)}</div>
      )}

      {/* Ações customizadas da toolbar */}
      {toolbarActions && <div className="flex items-center gap-2">{toolbarActions}</div>}
    </div>
  )
}
