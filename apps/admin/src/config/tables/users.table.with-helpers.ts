/**
 * Users Table Configuration (Alternative with Helpers)
 * Exemplo de configuração usando helpers para código mais limpo
 */

import type { User } from '@/types/users'
import type { TableConfig } from './types'
import {
  createAvatarColumn,
  createLinkColumn,
  createStringColumn,
  createRelationColumn,
  createActiveStatusBadge,
  createSearchFilter,
  createStatusFilter,
  createDynamicFilter,
} from '@/lib'

/**
 * Configuração alternativa usando helpers
 * Muito mais concisa e legível
 */
export const usersTableConfigWithHelpers: TableConfig<User> = {
  selectable: true,
  animation: true,

  columns: [
    // Avatar - 1 linha ao invés de 7
    createAvatarColumn<User>({
      imageAccessor: 'avatar',
      nameAccessor: 'name',
      size: 'md',
    }),

    // Nome com link - 1 linha ao invés de 8
    createLinkColumn<User>({
      id: 'name',
      accessor: 'name',
      header: 'Nome',
      linkPath: (row) => `/users/${row.id}`,
      display: 'string-bold',
    }),

    // Email - 1 linha ao invés de 7
    createStringColumn<User>({
      id: 'email',
      accessor: 'email',
      header: 'Email',
      display: 'string-secondary',
    }),

    // Departamento - 1 linha ao invés de 8
    createRelationColumn<User>({
      id: 'department',
      accessor: (row) => row.department?.name,
      header: 'Departamento',
    }),

    // Cargo - 1 linha ao invés de 8
    createRelationColumn<User>({
      id: 'position',
      accessor: (row) => row.position?.name,
      header: 'Cargo',
    }),

    // Status - 1 linha ao invés de 9
    createActiveStatusBadge<User>({
      id: 'isActive',
      accessor: 'isActive',
    }),

    // Ações
    {
      id: 'actions',
      type: 'actions',
      header: 'Ações',
      enableSorting: false,
      enableHiding: false,
      width: 80,
    },
  ],

  filters: [
    // Busca - 1 linha ao invés de 6
    createSearchFilter({
      placeholder: 'Buscar por nome ou email...',
    }),

    // Status - 1 linha ao invés de 10
    createStatusFilter(),

    // Departamento dinâmico - 1 linha ao invés de 9
    createDynamicFilter({
      id: 'departmentId',
      placeholder: 'Departamento',
      icon: 'ph-buildings',
      hook: 'useDepartments',
    }),

    // Cargo dinâmico - 1 linha ao invés de 9
    createDynamicFilter({
      id: 'jobTitleId',
      placeholder: 'Cargo',
      icon: 'ph-briefcase',
      hook: 'useJobTitles',
    }),
  ],

  actions: {
    bulk: [
      { id: 'activate', label: 'Ativar', icon: 'ph-check-circle', variant: 'outline' },
      { id: 'deactivate', label: 'Desativar', icon: 'ph-x-circle', variant: 'outline' },
      { id: 'export', label: 'Exportar', icon: 'ph-download-simple', variant: 'outline' },
    ],
    row: [
      { id: 'view', label: 'Ver detalhes', icon: 'ph-eye' },
      { id: 'edit', label: 'Editar', icon: 'ph-pencil-simple' },
      { id: 'resetPassword', label: 'Redefinir Senha', icon: 'ph-key', separator: true },
      { id: 'delete', label: 'Deletar', icon: 'ph-trash', variant: 'destructive', separator: true },
    ],
  },

  pagination: {
    pageSizeOptions: [20, 50, 100],
    defaultPageSize: 20,
    showPageInfo: true,
    showPageSizeSelector: true,
  },

  emptyState: {
    icon: 'ph-users',
    title: 'Nenhum usuário encontrado',
    description: 'Tente ajustar os filtros ou adicione novos usuários',
  },
}

/**
 * Comparação:
 * 
 * SEM helpers: ~210 linhas de código
 * COM helpers: ~120 linhas de código
 * 
 * Redução de ~43% do código!
 */
