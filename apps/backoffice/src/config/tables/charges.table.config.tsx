/**
 * Charges Table Configuration
 * Configuração declarativa para a tabela de cobranças
 */

import type { TableConfig } from './types'
import type { ChargeListItem } from '@/types/financial'
import { ChargeStatusBadge } from '@/components/financial/ChargeStatusBadge'
import { PaymentMethodBadge } from '@/components/financial/PaymentMethodBadge'

export const chargesTableConfig: TableConfig<ChargeListItem> = {
  // Features
  selectable: false,
  animation: true,

  // Columns
  columns: [
    {
      id: 'issueDate',
      type: 'date',
      accessor: 'issueDate',
      header: 'Data Emissão',
      enableSorting: true,
    },
    {
      id: 'dueDate',
      type: 'date',
      accessor: 'dueDate',
      header: 'Vencimento',
      enableSorting: true,
    },
    {
      id: 'company',
      type: 'link',
      header: 'Empresa',
      accessor: (row) => row.company.name,
      display: 'string-bold',
      linkPath: (row) => `/clients/${row.companyId}`,
      enableSorting: false,
    },
    {
      id: 'description',
      type: 'string',
      accessor: 'description',
      header: 'Descrição',
      display: 'string-secondary',
      enableSorting: false,
    },
    {
      id: 'amount',
      type: 'number',
      accessor: 'amount',
      header: 'Valor',
      format: 'currency',
      currency: 'BRL',
      decimals: 2,
      enableSorting: true,
    },
    {
      id: 'status',
      type: 'custom',
      accessor: 'status',
      header: 'Status',
      cell: (row) => <ChargeStatusBadge status={row.status} />,
      enableSorting: false,
    },
    {
      id: 'paymentMethod',
      type: 'custom',
      accessor: 'paymentMethod',
      header: 'Método',
      cell: (row) => <PaymentMethodBadge paymentMethod={row.paymentMethod} />,
      enableSorting: false,
    },
    {
      id: 'actions',
      type: 'actions',
      header: 'Ações',
    },
  ],

  // Filters
  filters: [
    {
      id: 'search',
      type: 'search',
      placeholder: 'Buscar por descrição, empresa...',
      icon: 'ph-magnifying-glass',
      clearable: true,
    },
    {
      id: 'status',
      type: 'select',
      placeholder: 'Status',
      width: 'w-[180px]',
      options: [
        { value: 'all', label: 'Todos os status' },
        { value: 'PENDING', label: 'Pendente' },
        { value: 'PAID', label: 'Pago' },
        { value: 'OVERDUE', label: 'Vencido' },
        { value: 'CANCELED', label: 'Cancelado' },
        { value: 'PARTIAL', label: 'Parcial' },
      ],
    },
  ],

  // Actions
  actions: {
    row: [
      {
        id: 'view',
        label: 'Ver Detalhes',
        icon: 'ph-eye',
        variant: 'default',
      },
      {
        id: 'edit',
        label: 'Editar',
        icon: 'ph-pencil-simple',
        variant: 'default',
      },
      {
        id: 'register-payment',
        label: 'Registrar Pagamento',
        icon: 'ph-money',
        variant: 'default',
        separator: true,
      },
      {
        id: 'upload-attachment',
        label: 'Anexar Arquivo',
        icon: 'ph-paperclip',
        variant: 'outline',
      },
      {
        id: 'cancel',
        label: 'Cancelar Cobrança',
        icon: 'ph-x-circle',
        variant: 'outline',
        separator: true,
      },
      {
        id: 'delete',
        label: 'Excluir',
        icon: 'ph-trash',
        variant: 'destructive',
      },
    ],
  },

  // Pagination
  pagination: {
    pageSizeOptions: [10, 20, 50, 100],
    defaultPageSize: 20,
    showPageInfo: true,
    showPageSizeSelector: true,
  },

  // Empty state
  emptyState: {
    icon: 'ph-currency-dollar',
    title: 'Nenhuma cobrança encontrada',
    description: 'Não há cobranças correspondentes aos filtros selecionados.',
  },
}
