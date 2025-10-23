import { Button } from '@/components/ui/button'
import { 
  FilterContainer, 
  FilterButtonGroup, 
  SearchInput,
} from '@/components/ui'

const STATUS_OPTIONS: Array<{ label: string; value: string }> = [
  { label: 'Todos', value: 'ALL' },
  { label: 'Pendente', value: 'pending' },
  { label: 'Processando', value: 'processing' },
  { label: 'Enviado', value: 'shipped' },
  { label: 'Concluído', value: 'completed' },
  { label: 'Cancelado', value: 'cancelled' },
]

const PERIOD_OPTIONS: Array<{ label: string; value: string; days?: number }> = [
  { label: 'Últimos 30 dias', value: '30', days: 30 },
  { label: 'Últimos 90 dias', value: '90', days: 90 },
  { label: 'Todos', value: 'ALL' },
]

interface RedemptionFiltersProps {
  search: string
  status: string
  period: string
  onSearchChange: (value: string) => void
  onStatusChange: (value: string) => void
  onPeriodChange: (value: string) => void
  onClearFilters: () => void
  hasActiveFilters?: boolean
}

/**
 * Redemption filters component
 * Encapsulates all filter UI and logic for redemptions page
 */
export const RedemptionFilters = ({
  search,
  status,
  period,
  onSearchChange,
  onStatusChange,
  onPeriodChange,
  onClearFilters,
  hasActiveFilters = false,
}: RedemptionFiltersProps) => {
  return (
    <FilterContainer title="Filtros de Busca">
      {/* Search Input */}
      <SearchInput
        value={search}
        onChange={onSearchChange}
        label="Buscar por prêmio"
        placeholder="Digite o nome do prêmio..."
        debounceMs={300}
        aria-describedby="search-hint"
      />

      {/* Status Filter */}
      <FilterButtonGroup
        label="Status do Resgate"
        options={STATUS_OPTIONS}
        value={status}
        onChange={onStatusChange}
      />

      {/* Period Filter */}
      <FilterButtonGroup
        label="Período"
        options={PERIOD_OPTIONS}
        value={period}
        onChange={onPeriodChange}
      />

      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <div className="flex justify-end pt-2 border-t border-gray-200 dark:border-neutral-700">
          <Button
            onClick={onClearFilters}
            variant="outline"
            size="sm"
            className="flex items-center gap-2 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-neutral-600 hover:bg-gray-100 dark:hover:bg-neutral-700"
            aria-label="Limpar todos os filtros"
          >
            <i className="ph-bold ph-arrow-clockwise text-base" aria-hidden="true" />
            Limpar filtros
          </Button>
        </div>
      )}
    </FilterContainer>
  )
}
