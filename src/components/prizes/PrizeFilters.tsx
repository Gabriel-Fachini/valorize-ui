import React from 'react'
import { Prize, PrizeFilters as Filters } from '@/types/prize.types'
import { useSpring, animated } from '@react-spring/web'

interface PrizeFiltersProps {
  filters: Filters
  onFiltersChange: (filters: Filters) => void
  totalResults?: number
}

export const PrizeFilters: React.FC<PrizeFiltersProps> = ({ filters, onFiltersChange, totalResults }) => {
  const [isOpen, setIsOpen] = React.useState(false)

  const springProps = useSpring({
    maxHeight: isOpen ? '600px' : '0px',
    opacity: isOpen ? 1 : 0,
    marginTop: isOpen ? '16px' : '0px',
    config: { tension: 260, friction: 30 },
  })

  const categories: Array<{ value: Prize['category'], label: string, icon: string }> = [
    { value: 'eletronicos', label: 'Eletrônicos', icon: '📱' },
    { value: 'casa', label: 'Casa', icon: '🏠' },
    { value: 'esporte', label: 'Esporte', icon: '⚽' },
    { value: 'livros', label: 'Livros', icon: '📚' },
    { value: 'vale-compras', label: 'Vale Compras', icon: '🛍️' },
    { value: 'experiencias', label: 'Experiências', icon: '✨' },
  ]

  const sortOptions = [
    { value: 'popular', label: 'Mais populares' },
    { value: 'price_asc', label: 'Menor preço' },
    { value: 'price_desc', label: 'Maior preço' },
    { value: 'newest', label: 'Mais recentes' },
  ]

  const priceRanges = [
    { label: 'Até 500 moedas', min: 0, max: 500 },
    { label: '500 - 1000 moedas', min: 500, max: 1000 },
    { label: '1000 - 2000 moedas', min: 1000, max: 2000 },
    { label: '2000 - 3000 moedas', min: 2000, max: 3000 },
    { label: 'Acima de 3000 moedas', min: 3000, max: 999999 },
  ]

  const handleCategoryChange = (category: Prize['category']) => {
    onFiltersChange({
      ...filters,
      category: filters.category === category ? undefined : category,
    })
  }

  const handleSortChange = (sortBy: Filters['sortBy']) => {
    onFiltersChange({
      ...filters,
      sortBy,
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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({
      ...filters,
      search: e.target.value,
    })
  }

  const clearFilters = () => {
    onFiltersChange({})
  }

  const hasActiveFilters = !!(filters.category || filters.priceRange || filters.search)

  return (
    <div className="mb-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-white backdrop-blur-xl transition-all hover:border-gray-300 dark:hover:border-white/20 hover:bg-gray-50 dark:hover:bg-white/10"
          >
            <svg
              className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
              />
            </svg>
            Filtros
            {hasActiveFilters && (
              <span className="ml-1 rounded-full bg-purple-100 dark:bg-purple-500/20 px-2 py-0.5 text-xs text-purple-600 dark:text-purple-400">
                {Object.keys(filters).filter(k => filters[k as keyof Filters]).length}
              </span>
            )}
          </button>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="rounded-xl border border-red-200 dark:border-red-500/20 bg-red-50 dark:bg-red-500/10 px-3 py-2 text-xs font-medium text-red-600 dark:text-red-400 backdrop-blur-xl transition-all hover:border-red-300 dark:hover:border-red-500/30 hover:bg-red-100 dark:hover:bg-red-500/20"
            >
              Limpar filtros
            </button>
          )}

          {totalResults !== undefined && (
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {totalResults} {totalResults === 1 ? 'prêmio' : 'prêmios'}
            </span>
          )}
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Buscar prêmios..."
            value={filters.search || ''}
            onChange={handleSearchChange}
            className="w-full rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 px-4 py-2.5 pl-10 text-sm text-gray-700 dark:text-white placeholder-gray-400 backdrop-blur-xl transition-all focus:border-purple-500 dark:focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20 sm:w-64"
          />
          <svg
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      <animated.div
        style={springProps}
        className="overflow-hidden"
      >
        <div className="space-y-6 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 p-6 backdrop-blur-xl">
          <div>
            <h3 className="mb-3 text-sm font-semibold text-gray-700 dark:text-white">Categorias</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat.value}
                  onClick={() => handleCategoryChange(cat.value)}
                  className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-all ${
                    filters.category === cat.value
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300'
                      : 'border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-gray-600 dark:text-gray-300 hover:border-gray-300 dark:hover:border-white/20 hover:bg-gray-50 dark:hover:bg-white/10'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-gray-700 dark:text-white">Faixa de Preço</h3>
            <div className="flex flex-wrap gap-2">
              {priceRanges.map(range => (
                <button
                  key={range.label}
                  onClick={() => handlePriceRangeChange(range.min, range.max)}
                  className={`rounded-lg border px-3 py-2 text-sm font-medium transition-all ${
                    filters.priceRange?.min === range.min && filters.priceRange?.max === range.max
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300'
                      : 'border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-gray-600 dark:text-gray-300 hover:border-gray-300 dark:hover:border-white/20 hover:bg-gray-50 dark:hover:bg-white/10'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-gray-700 dark:text-white">Ordenar por</h3>
            <div className="flex flex-wrap gap-2">
              {sortOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => handleSortChange(option.value as Filters['sortBy'])}
                  className={`rounded-lg border px-3 py-2 text-sm font-medium transition-all ${
                    filters.sortBy === option.value
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300'
                      : 'border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-gray-600 dark:text-gray-300 hover:border-gray-300 dark:hover:border-white/20 hover:bg-gray-50 dark:hover:bg-white/10'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </animated.div>
    </div>
  )
}