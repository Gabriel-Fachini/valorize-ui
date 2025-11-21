/**
 * Users Table Configuration
 * Configuração declarativa da tabela de gerenciamento de usuários
 */

import type { User } from '@/types/users'
import type { TableConfig } from './types'

export const usersTableConfig: TableConfig<User> = {
  // Habilita seleção múltipla de linhas
  selectable: true,

  // Habilita animações de entrada
  animation: true,

  // ============================================================================
  // Configuração de Colunas
  // ============================================================================
  columns: [
    // Avatar
    {
      id: 'avatar',
      type: 'avatar',
      header: '',
      imageAccessor: 'avatar',
      nameAccessor: 'name',
      size: 'md',
      fallbackToInitials: true,
      enableSorting: false,
      width: 60,
    },

    // Nome (com link para detalhes)
    {
      id: 'name',
      type: 'link',
      accessor: 'name',
      header: 'Nome',
      display: 'string-bold',
      linkPath: (row) => `/users/${row.id}`,
      enableSorting: true,
    },

    // Email
    {
      id: 'email',
      type: 'string',
      accessor: 'email',
      header: 'Email',
      display: 'string-secondary',
      enableSorting: true,
    },

    // Departamento (relação)
    {
      id: 'department',
      type: 'relation',
      accessor: (row) => row.department?.name,
      header: 'Departamento',
      display: 'string',
      fallback: '-',
      enableSorting: false,
    },

    // Cargo/Position (relação)
    {
      id: 'position',
      type: 'relation',
      accessor: (row) => row.position?.name,
      header: 'Cargo',
      display: 'string',
      fallback: '-',
      enableSorting: false,
    },

    // Emails Enviados (badge com contador)
    {
      id: 'emailCount',
      type: 'badge',
      accessor: 'welcomeEmailSendCount',
      header: 'Emails Enviados',
      enableSorting: true,
      badgeVariant: (value) => {
        const count = value || 0
        return count >= 3 ? 'destructive' : count > 0 ? 'secondary' : 'outline'
      },
      badgeLabel: (value) => `${value || 0}/3`,
    },

    // Status (badge)
    {
      id: 'isActive',
      type: 'badge',
      accessor: 'isActive',
      header: 'Status',
      badgeVariant: (value) => (value ? 'default' : 'destructive'),
      badgeLabel: (value) => (value ? 'Ativo' : 'Inativo'),
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
    // Busca por nome ou email
    {
      id: 'search',
      type: 'search',
      placeholder: 'Buscar por nome ou email...',
      icon: 'ph-magnifying-glass',
      clearable: true,
    },

    // Filtro de status
    {
      id: 'status',
      type: 'select',
      placeholder: 'Status',
      width: 'w-[180px]',
      options: [
        { value: 'all', label: 'Todos os status' },
        { value: 'active', label: 'Ativos' },
        { value: 'inactive', label: 'Inativos' },
      ],
    },

    // Filtro de departamento (dinâmico via API)
    {
      id: 'departmentId',
      type: 'select',
      placeholder: 'Departamento',
      icon: 'ph-buildings',
      width: 'w-[200px]',
      dynamic: true,
      hook: 'useDepartments',
      options: [{ value: 'all', label: 'Todos departamentos' }],
    },

    // Filtro de cargo (dinâmico via API)
    {
      id: 'jobTitleId',
      type: 'select',
      placeholder: 'Cargo',
      icon: 'ph-briefcase',
      width: 'w-[200px]',
      dynamic: true,
      hook: 'useJobTitles',
      options: [{ value: 'all', label: 'Todos os cargos' }],
    },
  ],

  // ============================================================================
  // Configuração de Ações
  // ============================================================================
  actions: {
    // Ações em lote (bulk actions)
    bulk: [
      {
        id: 'sendWelcomeEmails',
        label: 'Enviar Emails de Boas-Vindas',
        icon: 'ph-envelope-simple',
        variant: 'default',
      },
      {
        id: 'activate',
        label: 'Ativar',
        icon: 'ph-check-circle',
        variant: 'outline',
      },
      {
        id: 'deactivate',
        label: 'Desativar',
        icon: 'ph-x-circle',
        variant: 'outline',
      },
      {
        id: 'export',
        label: 'Exportar',
        icon: 'ph-download-simple',
        variant: 'outline',
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
        id: 'sendWelcomeEmail',
        label: 'Enviar Email de Boas-Vindas',
        icon: 'ph-envelope-simple',
        variant: 'default',
      },
      {
        id: 'resetPassword',
        label: 'Redefinir Senha',
        icon: 'ph-key',
        variant: 'default',
        separator: true, // Adiciona separador antes desta ação
      },
      {
        id: 'delete',
        label: 'Deletar',
        icon: 'ph-trash',
        variant: 'destructive',
        separator: true, // Adiciona separador antes desta ação
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
    icon: 'ph-users',
    title: 'Nenhum usuário encontrado',
    description: 'Tente ajustar os filtros ou adicione novos usuários',
  },
}
