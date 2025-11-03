/**
 * Roles Table Configuration
 * Configuração declarativa da tabela de gerenciamento de roles
 */

import type { RoleWithCounts } from '@/types/roles'
import type { TableConfig } from './types'

export const rolesTableConfig: TableConfig<RoleWithCounts> = {
  // Habilita seleção múltipla de linhas
  selectable: true,

  // Habilita animações de entrada
  animation: true,

  // ============================================================================
  // Configuração de Colunas
  // ============================================================================
  columns: [
    // Nome (com link para detalhes)
    {
      id: 'name',
      type: 'link',
      accessor: 'name',
      header: 'Nome',
      display: 'string-bold',
      linkPath: (row) => `/roles/${row.id}`,
      enableSorting: true,
    },

    // Descrição
    {
      id: 'description',
      type: 'string',
      accessor: 'description',
      header: 'Descrição',
      display: 'string-secondary',
      enableSorting: false,
    },

    // Contagem de usuários
    {
      id: 'usersCount',
      type: 'number',
      accessor: 'usersCount',
      header: 'Usuários',
      enableSorting: false,
      width: 100,
    },

    // Contagem de permissões
    {
      id: 'permissionsCount',
      type: 'number',
      accessor: 'permissionsCount',
      header: 'Permissões',
      enableSorting: false,
      width: 120,
    },

    // Data de criação
    {
      id: 'createdAt',
      type: 'date',
      accessor: 'createdAt',
      header: 'Criado em',
      enableSorting: true,
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
    // Busca por nome ou descrição
    {
      id: 'search',
      type: 'search',
      placeholder: 'Buscar por nome ou descrição...',
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
        id: 'export',
        label: 'Exportar',
        icon: 'ph-download-simple',
        variant: 'outline',
      },
      {
        id: 'delete',
        label: 'Deletar',
        icon: 'ph-trash',
        variant: 'destructive',
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
        id: 'edit',
        label: 'Editar',
        icon: 'ph-pencil-simple',
        variant: 'default',
      },
      {
        id: 'delete',
        label: 'Deletar',
        icon: 'ph-trash',
        variant: 'destructive',
        separator: true,
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
    icon: 'ph-lock',
    title: 'Nenhum cargo encontrado',
    description: 'Crie um novo cargo para começar a gerenciar permissões',
  },
}
