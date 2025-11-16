import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CompanyStatus, PlanType, type CompanyFilters as FiltersType } from '@/types/company'

interface CompanyFiltersProps {
  filters: FiltersType
  onFiltersChange: (filters: FiltersType) => void
}

export function CompanyFilters({ filters, onFiltersChange }: CompanyFiltersProps) {
  const [search, setSearch] = useState(filters.search || '')

  const handleSearchChange = (value: string) => {
    setSearch(value)
    // Debounce search
    const timeoutId = setTimeout(() => {
      onFiltersChange({ ...filters, search: value || undefined })
    }, 500)
    return () => clearTimeout(timeoutId)
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row">
      <div className="relative flex-1">
        <i className="ph ph-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" style={{ fontSize: '1rem' }} />
        <Input
          placeholder="Buscar por nome, CNPJ ou domínio..."
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="flex gap-2">
        <Select
          value={filters.status || 'all'}
          onValueChange={(value: string) =>
            onFiltersChange({
              ...filters,
              status: value === 'all' ? undefined : (value as CompanyStatus),
            })
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Todos os status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            <SelectItem value={CompanyStatus.ACTIVE}>Ativas</SelectItem>
            <SelectItem value={CompanyStatus.INACTIVE}>Inativas</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.planType || 'all'}
          onValueChange={(value: string) =>
            onFiltersChange({
              ...filters,
              planType: value === 'all' ? undefined : (value as PlanType),
            })
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Todos os planos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os planos</SelectItem>
            <SelectItem value={PlanType.ESSENTIAL}>Essential</SelectItem>
            <SelectItem value={PlanType.PROFESSIONAL}>Professional</SelectItem>
          </SelectContent>
        </Select>

        {(filters.search || filters.status || filters.planType) && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setSearch('')
              onFiltersChange({})
            }}
          >
            <i className="ph ph-funnel" style={{ fontSize: '1rem' }} />
          </Button>
        )}
      </div>
    </div>
  )
}
