import React from 'react'
import { Prize, PrizeFilters as Filters } from '@/types/prize.types'
import { useSpring, animated } from '@react-spring/web'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { SearchInput } from '@/components/ui'

interface PrizeFiltersProps {
  filters: Filters
  onFiltersChange: (filters: Filters) => void
  totalResults?: number
}

export const PrizeFilters: React.FC<PrizeFiltersProps> = ({ filters, onFiltersChange, totalResults }) => {
  const [isMoreFiltersOpen, setIsMoreFiltersOpen] = React.useState(false)

  const springProps = useSpring({
    maxHeight: isMoreFiltersOpen ? '400px' : '0px',
    opacity: isMoreFiltersOpen ? 1 : 0,
    marginTop: isMoreFiltersOpen ? '16px' : '0px',
    config: { tension: 260, friction: 30 },
  })

  const categories: Array<{ value: Prize['category'], label: string, icon: string }> = [
    { value: 'eletronicos', label: 'Eletrônicos', icon: 'ph-device-mobile' },
    { value: 'casa', label: 'Casa', icon: 'ph-house' },
    { value: 'esporte', label: 'Esporte', icon: 'ph-soccer-ball' },
    { value: 'livros', label: 'Livros', icon: 'ph-book' },
    { value: 'vale-compras', label: 'Vale Compras', icon: 'ph-shopping-bag' },
    { value: 'experiencias', label: 'Experiências', icon: 'ph-star' },
  ]

  const sortOptions = [
    { value: 'popular', label: 'Mais populares' },
    { value: 'price_asc', label: 'Menor preço' },
    { value: 'price_desc', label: 'Maior preço' },
    { value: 'newest', label: 'Mais recentes' },
  ]

  const priceRanges = [
    { label: 'Até 500', min: 0, max: 500 },
    { label: '500 - 1000', min: 500, max: 1000 },
    { label: '1000 - 2000', min: 1000, max: 2000 },
    { label: '2000 - 3000', min: 2000, max: 3000 },
    { label: 'Acima de 3000', min: 3000, max: 999999 },
  ]

  const handleCategoryChange = (category: Prize['category']) => {
    onFiltersChange({
      ...filters,
      category: filters.category === category ? undefined : category,
    })
  }

  const handleSortChange = (sortBy: string) => {
    onFiltersChange({
      ...filters,
      sortBy: sortBy as Filters['sortBy'],
    })
  }

  const handlePriceRangeChange = (min: number, max: number) => {
    const newRange = filters.priceRange?.min === min && filters.priceRange?.max === max
      ? undefined
      : { min, max }

    onFiltersChange({
      ...filters,
      priceRange: newRange,
    })
  }

  const handleSearchChange = (value: string) => {
    onFiltersChange({
      ...filters,
      search: value,
    })
  }

  const clearFilters = () => {
    onFiltersChange({})
  }

  const removeFilter = (filterKey: keyof Filters) => {
    const newFilters = { ...filters }
    delete newFilters[filterKey]
    onFiltersChange(newFilters)
  }

  const hasActiveFilters = !!(filters.category ?? filters.priceRange ?? filters.search)
  const activeFilterCount = Object.keys(filters).filter(k => filters[k as keyof Filters] && k !== 'sortBy').length

  const getActiveCategoryLabel = () => {
    const cat = categories.find(c => c.value === filters.category)
    return cat ? cat.label : filters.category
  }

  const getActiveCategoryIcon = () => {
    const cat = categories.find(c => c.value === filters.category)
    return cat?.icon
  }

  const getActivePriceRangeLabel = () => {
    if (!filters.priceRange) return ''
    const range = priceRanges.find(r => r.min === filters.priceRange?.min && r.max === filters.priceRange?.max)
    return range ? `${range.label} moedas` : `${filters.priceRange.min} - ${filters.priceRange.max} moedas`
  }

  return (
    <div className="mb-8 space-y-4">
      {/* Top bar: Search + Sort + Results count */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Search Input */}
        <SearchInput
          id="prizes-search-input"
          value={filters.search ?? ''}
          onChange={handleSearchChange}
          placeholder="Buscar prêmios..."
          className="flex-1 max-w-md"
          debounceMs={300}
        />

        <div className="flex items-center gap-3">
          {/* Sort Select */}
          <Select value={filters.sortBy ?? 'popular'} onValueChange={handleSortChange}>
            <SelectTrigger className="w-[180px] rounded-xl border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 backdrop-blur-xl focus:border-green-500 focus:ring-green-500/20">
              <i className="ph ph-sort-ascending mr-2 text-base"></i>
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Results count */}
          {totalResults !== undefined && (
            <span className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
              {totalResults} {totalResults === 1 ? 'prêmio' : 'prêmios'}
            </span>
          )}
        </div>
      </div>

      {/* Active Filters Chips */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Filtros ativos:</span>
          
          {filters.category && (
            <Badge 
              variant="secondary" 
              className="gap-1.5 bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-500/20 hover:bg-green-100 dark:hover:bg-green-500/20 cursor-pointer"
              onClick={() => removeFilter('category')}
            >
              {getActiveCategoryIcon() && <i className={`ph ${getActiveCategoryIcon()} text-sm`}></i>}
              {getActiveCategoryLabel()}
              <i className="ph ph-x text-sm"></i>
            </Badge>
          )}

          {filters.priceRange && (
            <Badge 
              variant="secondary" 
              className="gap-1.5 bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-500/20 hover:bg-green-100 dark:hover:bg-green-500/20 cursor-pointer"
              onClick={() => removeFilter('priceRange')}
            >
              {getActivePriceRangeLabel()}
              <i className="ph ph-x text-sm"></i>
            </Badge>
          )}

          {filters.search && (
            <Badge 
              variant="secondary" 
              className="gap-1.5 bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-500/20 hover:bg-green-100 dark:hover:bg-green-500/20 cursor-pointer"
              onClick={() => removeFilter('search')}
            >
              Busca: "{filters.search}"
              <i className="ph ph-x text-sm"></i>
            </Badge>
          )}

          <button
            onClick={clearFilters}
            className="ml-2 text-xs text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium transition-colors"
          >
            Limpar todos
          </button>
        </div>
      )}

      {/* Categories (Always Visible) */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-gray-700 dark:text-white flex items-center gap-2">
          <i className="ph ph-squares-four text-base"></i>
          Categorias
        </h3>
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat.value}
              onClick={() => handleCategoryChange(cat.value)}
              className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-all ${
                filters.category === cat.value
                  ? 'border-green-500 bg-green-50 dark:bg-green-500/20 text-green-700 dark:text-green-300 shadow-sm'
                  : 'border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-gray-600 dark:text-gray-300 hover:border-gray-300 dark:hover:border-white/20 hover:bg-gray-50 dark:hover:bg-white/10'
              }`}
            >
              <i className={`ph ${cat.icon} text-base`}></i>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* More Filters Toggle */}
      <div>
        <button
          onClick={() => setIsMoreFiltersOpen(!isMoreFiltersOpen)}
          className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-white transition-colors hover:text-green-600 dark:hover:text-green-400"
        >
          <i className={`ph ${isMoreFiltersOpen ? 'ph-caret-up' : 'ph-caret-down'} text-base transition-transform`}></i>
          Mais filtros
          {activeFilterCount > 0 && !hasActiveFilters && (
            <Badge variant="secondary" className="ml-1 bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 border-green-200 dark:border-green-500/20">
              {activeFilterCount}
            </Badge>
          )}
        </button>

        {/* Collapsible More Filters */}
        <animated.div
          style={springProps}
          className="overflow-hidden"
        >
          <div className="space-y-4 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 p-6 backdrop-blur-xl">
            <div>
              <h3 className="mb-3 text-sm font-semibold text-gray-700 dark:text-white flex items-center gap-2">
                <i className="ph ph-coins text-base"></i>
                Faixa de Preço
              </h3>
              <div className="flex flex-wrap gap-2">
                {priceRanges.map(range => (
                  <button
                    key={range.label}
                    onClick={() => handlePriceRangeChange(range.min, range.max)}
                    className={`rounded-lg border px-3 py-2 text-sm font-medium transition-all ${
                      filters.priceRange?.min === range.min && filters.priceRange?.max === range.max
                        ? 'border-green-500 bg-green-50 dark:bg-green-500/20 text-green-700 dark:text-green-300 shadow-sm'
                        : 'border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-gray-600 dark:text-gray-300 hover:border-gray-300 dark:hover:border-white/20 hover:bg-gray-50 dark:hover:bg-white/10'
                    }`}
                  >
                    {range.label} moedas
                  </button>
                ))}
              </div>
            </div>
          </div>
        </animated.div>
      </div>
    </div>
  )
}
