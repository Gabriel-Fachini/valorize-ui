/**
 * Companies Table Configuration
 * Configuração declarativa para a tabela de empresas/clientes
 */

import type { TableConfig } from './types'
import type { CompanyListItem } from '@/types/company'
import { CompanyPlanBadge } from '@/components/companies/CompanyPlanBadge'
import { CompanyStatusBadge } from '@/components/companies/CompanyStatusBadge'

export const companiesTableConfig: TableConfig<CompanyListItem> = {
  // Features
  selectable: false,
  animation: true,

  // Columns
  columns: [
    {
      id: 'logo',
      type: 'image',
      header: '',
      imageAccessor: 'logoUrl',
      altAccessor: 'name',
      width: 40,
      height: 40,
      aspectRatio: 'square',
      objectFit: 'cover',
      enableSorting: false,
    },
    {
      id: 'name',
      type: 'link',
      accessor: 'name',
      header: 'Nome',
      display: 'string-bold',
      linkPath: (row) => `/clients/${row.id}`,
      enableSorting: true,
    },
    {
      id: 'domain',
      type: 'string',
      accessor: 'domain',
      header: 'Domínio',
      display: 'string-secondary',
      enableSorting: false,
    },
    {
      id: 'planType',
      type: 'custom',
      accessor: 'planType',
      header: 'Plano',
      cell: (row) => <CompanyPlanBadge planType={row.planType} />,
      enableSorting: false,
    },
    {
      id: 'users',
      type: 'custom',
      header: 'Usuários',
      cell: (row) => (
        <div className="flex flex-col text-sm text-right">
          <span className="font-medium">{row.activeUsers}</span>
          <span className="text-xs text-muted-foreground">de {row.totalUsers}</span>
        </div>
      ),
      enableSorting: false,
    },
    {
      id: 'currentMRR',
      type: 'number',
      accessor: 'currentMRR',
      header: 'MRR',
      format: 'currency',
      currency: 'BRL',
      decimals: 2,
      enableSorting: true,
    },
    {
      id: 'status',
      type: 'custom',
      accessor: 'isActive',
      header: 'Status',
      cell: (row) => <CompanyStatusBadge status={row.isActive} />,
      enableSorting: false,
    },
    {
      id: 'createdAt',
      type: 'date',
      accessor: 'createdAt',
      header: 'Criado em',
      enableSorting: true,
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
      placeholder: 'Buscar por nome ou domínio...',
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
        { value: 'ACTIVE', label: 'Ativas' },
        { value: 'INACTIVE', label: 'Inativas' },
      ],
    },
    {
      id: 'planType',
      type: 'select',
      placeholder: 'Plano',
      width: 'w-[180px]',
      options: [
        { value: 'all', label: 'Todos os planos' },
        { value: 'ESSENTIAL', label: 'Essential' },
        { value: 'PROFESSIONAL', label: 'Professional' },
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
        id: 'toggle-status',
        label: 'Ativar/Desativar',
        icon: 'ph-power',
        variant: 'outline',
        separator: true,
      },
    ],
  },

  // Pagination
  pagination: {
    pageSizeOptions: [10, 20, 50],
    defaultPageSize: 20,
    showPageInfo: true,
    showPageSizeSelector: true,
  },

  // Empty state
  emptyState: {
    icon: 'ph-buildings',
    title: 'Nenhuma empresa encontrada',
    description: 'Não há empresas correspondentes aos filtros selecionados.',
  },
}
