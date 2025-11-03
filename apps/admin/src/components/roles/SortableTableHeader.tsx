import type { RolesFilters } from '@/types/roles'

interface SortableHeaderProps {
  label: string
  sortKey: RolesFilters['sortBy']
  currentSort?: { sortBy?: string; sortOrder?: 'asc' | 'desc' }
  onSort?: (sortBy: RolesFilters['sortBy'], sortOrder: 'asc' | 'desc') => void
}

export const SortableHeader = ({
  label,
  sortKey,
  currentSort,
  onSort,
}: SortableHeaderProps) => {
  const isActive = currentSort?.sortBy === sortKey
  const indicator = isActive ? (currentSort?.sortOrder === 'asc' ? ' ↑' : ' ↓') : ''

  return (
    <button
      onClick={() => {
        if (!onSort) return
        const newOrder = isActive && currentSort?.sortOrder === 'asc' ? 'desc' : 'asc'
        onSort(sortKey, newOrder)
      }}
      className={`text-left font-medium transition-colors ${
        onSort ? 'cursor-pointer hover:text-gray-900' : ''
      } ${isActive ? 'text-gray-900' : 'text-gray-600'}`}
    >
      {label}
      {indicator}
    </button>
  )
}
