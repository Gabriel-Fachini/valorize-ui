/**
 * Vouchers Table Configuration
 * Configuração declarativa da tabela de gerenciamento de vouchers
 */

import type { VoucherProduct } from '@/types/vouchers'
import type { TableConfig } from './types'

export const vouchersTableConfig: TableConfig<VoucherProduct> = {
  // Habilita seleção múltipla de linhas
  selectable: true,

  // Habilita animações de entrada
  animation: true,

  // ============================================================================
  // Configuração de Colunas
  // ============================================================================
  columns: [
    // Imagem do produto (retangular)
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

    // Nome do voucher
    {
      id: 'name',
      type: 'string',
      accessor: 'name',
      header: 'Nome',
      display: 'string-bold',
      enableSorting: true,
    },

    // Categoria
    {
      id: 'category',
      type: 'string',
      accessor: 'category',
      header: 'Categoria',
      display: 'string-secondary',
      enableSorting: true,
    },

    // Valor (range)
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
          return formatter.format(minValue)
        }

        return `${formatter.format(minValue)} - ${formatter.format(maxValue)}`
      },
    },

    // Moeda
    {
      id: 'currency',
      type: 'badge',
      accessor: 'currency',
      header: 'Moeda',
      badgeVariant: () => 'outline',
      badgeLabel: (value) => String(value),
      enableSorting: true,
    },

    // Status (ativo/inativo)
    {
      id: 'isActive',
      type: 'badge',
      accessor: 'isActive',
      header: 'Status',
      badgeVariant: (value) => (value ? 'default' : 'destructive'),
      badgeLabel: (value) => (value ? 'Ativo' : 'Inativo'),
      enableSorting: true,
    },

    // Botão de Enviar Direto (visível)
    {
      id: 'send-direct-btn',
      type: 'custom',
      header: '',
      enableSorting: false,
      enableHiding: false,
      width: 150,
      cell: (_row) => null, // Será renderizado no componente VouchersPage
    },

    // Ações (dropdown menu)
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
  // Configuração de Filtros
  // ============================================================================
  filters: [
    // Busca por nome ou marca
    {
      id: 'search',
      type: 'search',
      placeholder: 'Buscar vouchers...',
      icon: 'ph-magnifying-glass',
      clearable: true,
    },
  ],

  // ============================================================================
  // Configuração de Ações
  // ============================================================================
  actions: {
    // Ações em lote (bulk actions)
    bulk: [
      {
        id: 'bulk-assign',
        label: 'Enviar em Lote',
        icon: 'ph-paper-plane-tilt',
        variant: 'default',
      },
    ],

    // Ações por linha (row actions)
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
  // Configuração de Paginação
  // ============================================================================
  pagination: {
    pageSizeOptions: [20, 50, 100],
    defaultPageSize: 20,
    showPageInfo: true,
    showPageSizeSelector: true,
  },

  // ============================================================================
  // Estado Vazio (Empty State)
  // ============================================================================
  emptyState: {
    icon: 'ph-ticket',
    title: 'Nenhum voucher encontrado',
    description: 'Tente ajustar os filtros ou sincronize o catálogo',
  },
}
