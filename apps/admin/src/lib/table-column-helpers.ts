/**
 * Table Column Helpers
 * Helpers para criar configurações de coluna comuns
 */

import type {
  AvatarColumnConfig,
  StringColumnConfig,
  LinkColumnConfig,
  BadgeColumnConfig,
  RelationColumnConfig,
} from '@/config/tables/types'

/**
 * Helper para criar coluna de avatar padrão
 */
export const createAvatarColumn = <T>(config: {
  imageAccessor?: keyof T | ((row: T) => string | undefined)
  nameAccessor: keyof T | ((row: T) => string)
  size?: 'sm' | 'md' | 'lg'
}): AvatarColumnConfig<T> => ({
  id: 'avatar',
  type: 'avatar',
  header: '',
  imageAccessor: config.imageAccessor,
  nameAccessor: config.nameAccessor,
  size: config.size || 'md',
  fallbackToInitials: true,
  enableSorting: false,
  width: config.size === 'sm' ? 50 : config.size === 'lg' ? 70 : 60,
})

/**
 * Helper para criar coluna de link padrão
 */
export const createLinkColumn = <T>(config: {
  id: string
  accessor: keyof T | ((row: T) => unknown)
  header: string
  linkPath: string | ((row: T) => string)
  display?: 'string-bold' | 'string-secondary' | 'string-muted' | 'string'
}): LinkColumnConfig<T> => ({
  id: config.id,
  type: 'link',
  accessor: config.accessor,
  header: config.header,
  display: config.display || 'string-bold',
  linkPath: config.linkPath,
  enableSorting: true,
})

/**
 * Helper para criar coluna de texto simples
 */
export const createStringColumn = <T>(config: {
  id: string
  accessor: keyof T | ((row: T) => unknown)
  header: string
  display?: 'string-bold' | 'string-secondary' | 'string-muted' | 'string'
  enableSorting?: boolean
}): StringColumnConfig<T> => ({
  id: config.id,
  type: 'string',
  accessor: config.accessor,
  header: config.header,
  display: config.display || 'string',
  enableSorting: config.enableSorting ?? true,
})

/**
 * Helper para criar coluna de relação (dados aninhados)
 */
export const createRelationColumn = <T>(config: {
  id: string
  accessor: keyof T | ((row: T) => unknown)
  header: string
  fallback?: string
  enableSorting?: boolean
}): RelationColumnConfig<T> => ({
  id: config.id,
  type: 'relation',
  accessor: config.accessor,
  header: config.header,
  fallback: config.fallback || '-',
  enableSorting: config.enableSorting ?? false,
})

/**
 * Helper para criar coluna de badge de status ativo/inativo
 */
export const createActiveStatusBadge = <T>(config: {
  id: string
  accessor: keyof T | ((row: T) => unknown)
  header?: string
  activeLabel?: string
  inactiveLabel?: string
}): BadgeColumnConfig<T> => ({
  id: config.id,
  type: 'badge',
  accessor: config.accessor,
  header: config.header || 'Status',
  badgeVariant: (value) => (value ? 'default' : 'destructive'),
  badgeLabel: (value) => (value ? config.activeLabel || 'Ativo' : config.inactiveLabel || 'Inativo'),
  enableSorting: true,
})
