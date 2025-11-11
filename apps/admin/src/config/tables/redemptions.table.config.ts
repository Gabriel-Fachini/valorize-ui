/**
 * Redemptions Table Configuration
 * Configuração declarativa da tabela de gerenciamento de resgates
 */

import React from 'react'
import type { Redemption, RedemptionStatus } from '@/types/redemptions'
import type { TableConfig } from './types'

export const redemptionsTableConfig: TableConfig<Redemption> = {
  // Habilita seleção múltipla de linhas
  selectable: true,

  // Habilita animações de entrada
  animation: true,

  // ============================================================================
  // Configuração de Colunas
  // ============================================================================
  columns: [
    // Prêmio (com imagem)
    {
      id: 'prizeId',
      type: 'custom',
      header: 'Prêmio',
      width: 200,
      enableSorting: false,
      cell: () => null, // Renderizado no renderColumn.tsx através do componente PrizeImageCell
    },

    // Usuário (card com avatar, nome e email)
    {
      id: 'userId',
      type: 'custom',
      header: 'Usuário',
      width: 280,
      enableSorting: false,
      cell: () => null, // Renderizado no renderColumn.tsx através do componente UserCardCell
    },

    // Tipo de resgate
    {
      id: 'prizeType',
      type: 'badge',
      accessor: 'prizeType',
      header: 'Tipo',
      badgeVariant: (value) => {
        const type = String(value).toLowerCase()
        switch (type) {
          case 'voucher':
            return 'default'
          case 'product':
          case 'physical':
            return 'secondary'
          default:
            return 'outline'
        }
      },
      badgeLabel: (value) => {
        const type = String(value).toLowerCase()
        const labels: Record<string, string> = {
          voucher: 'Voucher',
          product: 'Produto',
          physical: 'Físico',
        }
        return labels[type] || type
      },
      enableSorting: true,
    },

    // Status
    {
      id: 'status',
      type: 'badge',
      accessor: 'status',
      header: 'Status',
      badgeVariant: (value) => {
        const status = value as RedemptionStatus | undefined
        switch (status) {
          case 'pending':
            return 'outline'
          case 'processing':
            return 'secondary'
          case 'completed':
          case 'sent':
          case 'shipped':
          case 'delivered':
            return 'default'
          case 'failed':
          case 'cancelled':
            return 'destructive'
          default:
            return 'outline'
        }
      },
      badgeLabel: (value) => {
        const labels: Record<string, string> = {
          pending: 'Pendente',
          processing: 'Processando',
          completed: 'Concluído',
          sent: 'Enviado',
          shipped: 'Enviado para Entrega',
          delivered: 'Entregue',
          failed: 'Falha',
          cancelled: 'Cancelado',
        }
        return labels[String(value)] || String(value)
      },
      enableSorting: true,
    },

    // Moedas gastas
    {
      id: 'coinsSpent',
      type: 'custom',
      header: 'Moedas',
      width: 120,
      enableSorting: false,
      cell: (row) => {
        return React.createElement(
          'div',
          { className: 'flex items-center gap-1' },
          React.createElement('i', { className: 'ph ph-coin text-yellow-500' }),
          React.createElement(
            'span',
            { className: 'font-medium' },
            row.coinsSpent.toLocaleString('pt-BR')
          )
        )
      },
    },

    // Data de resgate
    {
      id: 'redeemedAt',
      type: 'custom',
      header: 'Data',
      width: 160,
      enableSorting: false,
      cell: (row) => {
        if (!row.redeemedAt) return '-'
        const date = new Date(row.redeemedAt)
        return new Intl.DateTimeFormat('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }).format(date)
      },
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
    // Busca por ID, usuário ou prêmio
    {
      id: 'search',
      type: 'search',
      placeholder: 'Buscar por ID, usuário ou prêmio...',
      icon: 'ph-magnifying-glass',
      clearable: true,
    },

    // Filtro por status
    {
      id: 'status',
      type: 'select',
      placeholder: 'Filtrar por status',
      icon: 'ph-funnel',
      allowEmpty: true,
      emptyLabel: 'Todos os status',
      options: [
        { label: 'Pendente', value: 'pending' },
        { label: 'Processando', value: 'processing' },
        { label: 'Concluído', value: 'completed' },
        { label: 'Enviado', value: 'sent' },
        { label: 'Enviado para Entrega', value: 'shipped' },
        { label: 'Entregue', value: 'delivered' },
        { label: 'Falha', value: 'failed' },
        { label: 'Cancelado', value: 'cancelled' },
      ],
    },

    // Filtro por tipo
    {
      id: 'prizeType',
      type: 'select',
      placeholder: 'Filtrar por tipo',
      icon: 'ph-funnel',
      allowEmpty: true,
      emptyLabel: 'Todos os tipos',
      options: [
        { label: 'Voucher', value: 'voucher' },
        { label: 'Físico', value: 'physical' },
      ],
    },
  ],

  // ============================================================================
  // Configuração de Ações
  // ============================================================================
  actions: {
    // Ações em lote (bulk actions)
    bulk: [
      {
        id: 'bulk-export',
        label: 'Exportar',
        icon: 'ph-download',
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
      {
        id: 'cancel',
        label: 'Cancelar resgate',
        icon: 'ph-x-circle',
        variant: 'destructive',
        condition: (row) => {
          const redemption = row as Redemption
          return (redemption.prizeType || redemption.prize?.type) !== 'voucher'
        },
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
    icon: 'ph-receipt',
    title: 'Nenhum resgate encontrado',
    description: 'Tente ajustar os filtros ou volte mais tarde',
  },
}
