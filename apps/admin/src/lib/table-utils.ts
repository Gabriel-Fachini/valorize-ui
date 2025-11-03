/**
 * Table Utilities
 * Funções auxiliares para trabalhar com tabelas
 */

/**
 * Converte UserFilters para Record<string, unknown> de forma segura
 */
export const filtersToRecord = <T extends Record<string, unknown>>(
  filters: T,
): Record<string, unknown> => {
  return filters as unknown as Record<string, unknown>
}

/**
 * Converte Record<string, unknown> de volta para tipo específico
 */
export const recordToFilters = <T extends Record<string, unknown>>(
  record: Record<string, unknown>,
): T => {
  return record as unknown as T
}

/**
 * Helper para criar handlers de filtro type-safe
 */
export const createFilterHandler = <T extends Record<string, unknown>>(
  setFilters: (filters: T) => void,
) => {
  return (newFilters: Record<string, unknown>) => {
    setFilters(recordToFilters<T>(newFilters))
  }
}
