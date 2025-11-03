/**
 * Table Filter Helpers
 * Helpers para criar configurações de filtros comuns
 */

import type { SearchFilterConfig, SelectFilterConfig, SelectOption } from '@/config/tables/types'

/**
 * Helper para criar filtro de busca padrão
 */
export const createSearchFilter = (config: {
  id?: string
  placeholder?: string
  icon?: string
}): SearchFilterConfig => ({
  id: config.id || 'search',
  type: 'search',
  placeholder: config.placeholder || 'Buscar...',
  icon: config.icon || 'ph-magnifying-glass',
  clearable: true,
})

/**
 * Helper para criar filtro de status ativo/inativo
 */
export const createStatusFilter = (config?: {
  id?: string
  activeLabel?: string
  inactiveLabel?: string
}): SelectFilterConfig => ({
  id: config?.id || 'status',
  type: 'select',
  placeholder: 'Status',
  width: 'w-[180px]',
  options: [
    { value: 'all', label: 'Todos os status' },
    { value: 'active', label: config?.activeLabel || 'Ativos' },
    { value: 'inactive', label: config?.inactiveLabel || 'Inativos' },
  ],
})

/**
 * Helper para criar filtro dinâmico (carregado via API)
 */
export const createDynamicFilter = (config: {
  id: string
  placeholder: string
  icon?: string
  hook?: string
  allLabel?: string
  width?: string
}): SelectFilterConfig => ({
  id: config.id,
  type: 'select',
  placeholder: config.placeholder,
  icon: config.icon,
  width: config.width || 'w-[200px]',
  dynamic: true,
  hook: config.hook,
  options: [{ value: 'all', label: config.allLabel || `Todos ${config.placeholder.toLowerCase()}` }],
})

/**
 * Helper para criar options de select a partir de array
 */
export const createSelectOptions = <T extends { id: string; name: string }>(
  items: T[] | undefined,
  config?: {
    allLabel?: string
    includeAll?: boolean
  },
): SelectOption[] => {
  const options: SelectOption[] = []

  if (config?.includeAll !== false) {
    options.push({ value: 'all', label: config?.allLabel || 'Todos' })
  }

  if (items) {
    options.push(...items.map((item) => ({ value: item.id, label: item.name })))
  }

  return options
}
