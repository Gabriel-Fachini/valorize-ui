/**
 * Table Configuration Types
 * Tipos para configuração declarativa de tabelas reutilizáveis
 */

import type { ReactNode } from 'react'

// ============================================================================
// Column Types
// ============================================================================

export type ColumnType =
  | 'selection' // Checkbox de seleção
  | 'avatar' // Avatar com imagem ou iniciais
  | 'image' // Imagem retangular
  | 'string' // Texto simples
  | 'link' // Link clicável
  | 'relation' // Dados de relação (ex: department.name)
  | 'badge' // Badge de status
  | 'date' // Data formatada
  | 'number' // Número formatado
  | 'actions' // Menu de ações
  | 'custom' // Renderização customizada

export type DisplayVariant =
  | 'string-bold' // Texto em negrito
  | 'string-secondary' // Texto secundário (muted)
  | 'string-muted' // Texto mais suave
  | 'string' // Texto normal

// ============================================================================
// Column Configuration
// ============================================================================

export interface BaseColumnConfig<T = unknown> {
  id: string
  type: ColumnType
  header: string | ReactNode
  accessor?: keyof T | ((row: T) => unknown)
  enableSorting?: boolean
  enableHiding?: boolean
  className?: string
  width?: string | number
}

export interface SelectionColumnConfig<T = unknown> extends BaseColumnConfig<T> {
  type: 'selection'
}

export interface StringColumnConfig<T = unknown> extends BaseColumnConfig<T> {
  type: 'string'
  display?: DisplayVariant
  truncate?: boolean
  maxLength?: number
  onClick?: (row: T) => void
}

export interface LinkColumnConfig<T = unknown> extends BaseColumnConfig<T> {
  type: 'link'
  display?: DisplayVariant
  linkPath: string | ((row: T) => string)
  linkTarget?: '_blank' | '_self'
}

export interface AvatarColumnConfig<T = unknown> extends BaseColumnConfig<T> {
  type: 'avatar'
  fallbackToInitials?: boolean
  size?: 'sm' | 'md' | 'lg'
  imageAccessor?: keyof T | ((row: T) => string | undefined)
  nameAccessor?: keyof T | ((row: T) => string)
}

export interface ImageColumnConfig<T = unknown> extends BaseColumnConfig<T> {
  type: 'image'
  imageAccessor: keyof T | ((row: T) => string | undefined)
  altAccessor?: keyof T | ((row: T) => string)
  width?: number
  height?: number
  aspectRatio?: 'square' | 'video' | 'portrait' | 'custom'
  objectFit?: 'cover' | 'contain'
  onClick?: (row: T) => void
}

export interface RelationColumnConfig<T = unknown> extends BaseColumnConfig<T> {
  type: 'relation'
  display?: DisplayVariant
  fallback?: string
}

export interface BadgeColumnConfig<T = unknown> extends BaseColumnConfig<T> {
  type: 'badge'
  badgeVariant?: (value: unknown, row: T) => 'default' | 'secondary' | 'destructive' | 'outline'
  badgeLabel?: (value: unknown, row: T) => string
}

export interface DateColumnConfig<T = unknown> extends BaseColumnConfig<T> {
  type: 'date'
  format?: string // formato date-fns
  relative?: boolean // mostrar "há 2 dias"
}

export interface NumberColumnConfig<T = unknown> extends BaseColumnConfig<T> {
  type: 'number'
  format?: 'decimal' | 'currency' | 'percent'
  currency?: string
  decimals?: number
}

export interface ActionsColumnConfig<T = unknown> extends BaseColumnConfig<T> {
  type: 'actions'
  // Ações são definidas em TableConfig.actions.row
}

export interface CustomColumnConfig<T = unknown> extends BaseColumnConfig<T> {
  type: 'custom'
  cell: (row: T) => ReactNode
}

export type ColumnConfig<T = unknown> =
  | SelectionColumnConfig<T>
  | StringColumnConfig<T>
  | LinkColumnConfig<T>
  | AvatarColumnConfig<T>
  | ImageColumnConfig<T>
  | RelationColumnConfig<T>
  | BadgeColumnConfig<T>
  | DateColumnConfig<T>
  | NumberColumnConfig<T>
  | ActionsColumnConfig<T>
  | CustomColumnConfig<T>

// ============================================================================
// Filter Configuration
// ============================================================================

export type FilterType = 'search' | 'select' | 'date-range' | 'multi-select'

export interface SelectOption {
  value: string
  label: string
  icon?: string
}

export interface BaseFilterConfig {
  id: string
  type: FilterType
  label?: string
  placeholder?: string
  icon?: string
  className?: string
  width?: string
}

export interface SearchFilterConfig extends BaseFilterConfig {
  type: 'search'
  clearable?: boolean
}

export interface SelectFilterConfig extends BaseFilterConfig {
  type: 'select'
  options: SelectOption[]
  dynamic?: boolean // Se true, options são carregadas via hook
  hook?: string // Nome do hook para carregar options dinamicamente
  allowEmpty?: boolean // Permite valor vazio/nulo como opção válida
  emptyLabel?: string // Label para a opção de valor vazio (ex: "Selecione...")
}

export interface DateRangeFilterConfig extends BaseFilterConfig {
  type: 'date-range'
  format?: string
}

export interface MultiSelectFilterConfig extends BaseFilterConfig {
  type: 'multi-select'
  options: SelectOption[]
  maxSelections?: number
}

export type FilterConfig =
  | SearchFilterConfig
  | SelectFilterConfig
  | DateRangeFilterConfig
  | MultiSelectFilterConfig

// ============================================================================
// Action Configuration
// ============================================================================

export interface ActionConfig {
  id: string
  label: string
  icon?: string
  variant?: 'default' | 'destructive' | 'outline' | 'ghost'
  separator?: boolean // Adiciona separador antes da ação
  condition?: (row: unknown) => boolean // Mostra ação condicionalmente
}

export interface BulkActionConfig {
  id: string
  label: string
  icon?: string
  variant?: 'default' | 'destructive' | 'outline'
  confirmation?: boolean // Requer confirmação
  disabled?: boolean
}

// ============================================================================
// Pagination Configuration
// ============================================================================

export interface PaginationConfig {
  pageSizeOptions: number[]
  defaultPageSize: number
  showPageInfo?: boolean
  showPageSizeSelector?: boolean
}

// ============================================================================
// Empty State Configuration
// ============================================================================

export interface EmptyStateConfig {
  icon?: string
  title?: string
  description?: string
  action?: ReactNode
}

// ============================================================================
// Table Configuration
// ============================================================================

export interface TableConfig<T = unknown> {
  columns: ColumnConfig<T>[]
  filters?: FilterConfig[]
  actions?: {
    bulk?: BulkActionConfig[]
    row?: ActionConfig[]
    toolbar?: ReactNode // Ações customizadas na toolbar (ex: Importar CSV)
  }
  pagination?: PaginationConfig
  selectable?: boolean // Habilita checkbox de seleção
  emptyState?: EmptyStateConfig
  animation?: boolean // Habilita animações de entrada
}

// ============================================================================
// Data Table Props
// ============================================================================

export type SortOrder = 'asc' | 'desc' | null

export interface SortState {
  columnId: string
  order: SortOrder
}

export interface DataTableProps<T = unknown> {
  config: TableConfig<T>
  data: T[]
  isLoading?: boolean
  isFetching?: boolean

  // Pagination
  totalCount: number
  pageCount: number
  currentPage: number
  pageSize: number
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void

  // Initial sorting (optional - for setting default sort)
  sortState?: SortState

  // Filters
  filters?: Record<string, unknown>
  onFiltersChange?: (filters: Record<string, unknown>) => void

  // Actions
  onRowAction?: (actionId: string, row: T) => void
  onBulkAction?: (actionId: string, rowIds: string[]) => Promise<void>

  // Row key
  getRowId: (row: T) => string

  // Optional dynamic filter options
  dynamicFilterOptions?: Record<string, SelectOption[]>
}
