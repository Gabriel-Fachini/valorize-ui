/**
 * Vouchers Table Configuration
 * Declarative configuration for voucher products data table
 */

import type { VoucherProduct } from '@/types/voucher'
import type { TableConfig } from './types'

export const vouchersTableConfig: TableConfig<VoucherProduct> = {
  // Enable row selection
  selectable: false,

  // Enable animations
  animation: true,

  // ============================================================================
  // Column Configuration
  // ============================================================================
  columns: [
    // Product image (rectangular)
    {
      id: 'image',
      type: 'image',
      header: '',
      imageAccessor: (row) => row.images?.[0] || '',
      altAccessor: 'name',
      width: 100,
      height: 60,
      objectFit: 'cover',
      enableSorting: false,
    },

    // Voucher name
    {
      id: 'name',
      type: 'string',
      accessor: 'name',
      header: 'Nome',
      display: 'string-bold',
      enableSorting: true,
    },

    // Brand
    {
      id: 'brand',
      type: 'custom',
      header: 'Marca',
      enableSorting: true,
      cell: (row) => (
        <span className="text-sm text-muted-foreground">
          {row.brand || '-'}
        </span>
      ),
    },

    // Category
    {
      id: 'category',
      type: 'string',
      accessor: 'category',
      header: 'Categoria',
      display: 'string-secondary',
      enableSorting: true,
    },

    // Value range
    {
      id: 'value',
      type: 'custom',
      header: 'Valor',
      enableSorting: false,
      width: 150,
      cell: (row) => {
        const { minValue, maxValue, currency } = row
        const formatter = new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: currency || 'BRL',
        })

        if (minValue === maxValue) {
          return <span className="text-sm">{formatter.format(minValue)}</span>
        }

        return (
          <span className="text-sm">
            {formatter.format(minValue)} - {formatter.format(maxValue)}
          </span>
        )
      },
    },

    // Currency
    {
      id: 'currency',
      type: 'badge',
      accessor: 'currency',
      header: 'Moeda',
      badgeVariant: () => 'outline',
      badgeLabel: (value) => String(value),
      enableSorting: true,
    },

    // Countries
    {
      id: 'countries',
      type: 'custom',
      header: 'Países',
      enableSorting: false,
      cell: (row) => {
        const countries = row.countries || []
        if (countries.length === 0) return '-'
        return (
          <span className="text-sm text-muted-foreground">
            {countries.join(', ')}
          </span>
        )
      },
    },

    // Status (active/inactive)
    {
      id: 'isActive',
      type: 'badge',
      accessor: 'isActive',
      header: 'Status',
      badgeVariant: (value) => (value ? 'default' : 'destructive'),
      badgeLabel: (value) => (value ? 'Ativo' : 'Inativo'),
      enableSorting: true,
    },

    // Actions (dropdown menu)
    {
      id: 'actions',
      type: 'actions',
      header: 'Ações',
      enableSorting: false,
      enableHiding: false,
      width: 80,
    },
  ],

  // ============================================================================
  // Filter Configuration
  // ============================================================================
  filters: [
    // Search by name, brand, or category
    {
      id: 'search',
      type: 'search',
      placeholder: 'Buscar por nome, marca ou categoria...',
      icon: 'ph-magnifying-glass',
      clearable: true,
    },
  ],

  // ============================================================================
  // Actions Configuration
  // ============================================================================
  actions: {
    // Row actions (dropdown menu)
    row: [
      {
        id: 'view',
        label: 'Ver detalhes',
        icon: 'ph-eye',
        variant: 'default',
      },
    ],
  },

  // ============================================================================
  // Pagination Configuration
  // ============================================================================
  pagination: {
    pageSizeOptions: [20, 50, 100],
    defaultPageSize: 20,
    showPageInfo: true,
    showPageSizeSelector: true,
  },

  // ============================================================================
  // Empty State
  // ============================================================================
  emptyState: {
    icon: 'ph-ticket',
    title: 'Nenhum voucher encontrado',
    description: 'Clique em "Sincronizar Catálogo" para importar produtos da API',
  },
}
