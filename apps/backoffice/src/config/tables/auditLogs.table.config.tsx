/**
 * Audit Logs Table Configuration
 * Configuração declarativa para a tabela de logs de auditoria
 */

import type { TableConfig } from './types'
import type { AuditLogItem, AuditAction, AuditEntityType } from '@/types/audit'
import { Badge } from '@/components/ui/badge'

// Helper: Badge para ações de auditoria
function AuditActionBadge({ action }: { action: AuditAction }) {
  const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    CREATE: 'default',
    UPDATE: 'secondary',
    DELETE: 'destructive',
    ACTIVATE: 'default',
    DEACTIVATE: 'outline',
    WALLET_CREDIT: 'default',
    WALLET_DEBIT: 'destructive',
    WALLET_FREEZE: 'destructive',
    WALLET_UNFREEZE: 'default',
    CONTACT_ADD: 'default',
    CONTACT_UPDATE: 'secondary',
    CONTACT_DELETE: 'destructive',
    DOMAIN_ADD: 'default',
    DOMAIN_DELETE: 'destructive',
    PLAN_CHANGE: 'secondary',
  }

  const labels: Record<string, string> = {
    CREATE: 'Criação',
    UPDATE: 'Atualização',
    DELETE: 'Exclusão',
    ACTIVATE: 'Ativação',
    DEACTIVATE: 'Desativação',
    WALLET_CREDIT: 'Crédito',
    WALLET_DEBIT: 'Débito',
    WALLET_FREEZE: 'Congelamento',
    WALLET_UNFREEZE: 'Descongelamento',
    CONTACT_ADD: 'Adicionar Contato',
    CONTACT_UPDATE: 'Atualizar Contato',
    CONTACT_DELETE: 'Remover Contato',
    DOMAIN_ADD: 'Adicionar Domínio',
    DOMAIN_DELETE: 'Remover Domínio',
    PLAN_CHANGE: 'Mudança de Plano',
  }

  return (
    <Badge variant={variants[action] || 'secondary'}>
      {labels[action] || action}
    </Badge>
  )
}

// Helper: Badge para tipos de entidade
function AuditEntityTypeBadge({ entityType }: { entityType: AuditEntityType }) {
  const variants: Record<string, 'default' | 'secondary' | 'outline'> = {
    Company: 'default',
    User: 'secondary',
    Wallet: 'outline',
    CompanyWallet: 'outline',
    CompanyContact: 'secondary',
    CompanyPlan: 'default',
    AllowedDomain: 'secondary',
  }

  const labels: Record<string, string> = {
    Company: 'Empresa',
    User: 'Usuário',
    Wallet: 'Carteira',
    CompanyWallet: 'Carteira',
    CompanyContact: 'Contato',
    CompanyPlan: 'Plano',
    AllowedDomain: 'Domínio',
  }

  return (
    <Badge variant={variants[entityType] || 'secondary'}>
      {labels[entityType] || entityType}
    </Badge>
  )
}

// Helper: Renderizar mudanças de forma simplificada
function ChangesPreview({ changes }: { changes?: Record<string, { before: unknown; after: unknown }> }) {
  if (!changes || Object.keys(changes).length === 0) {
    return <span className="text-muted-foreground text-sm">Sem alterações</span>
  }

  const changeCount = Object.keys(changes).length
  const firstField = Object.keys(changes)[0]

  return (
    <div className="flex flex-col gap-1 text-sm">
      <span className="font-medium">{changeCount} campo{changeCount > 1 ? 's' : ''} alterado{changeCount > 1 ? 's' : ''}</span>
      <span className="text-xs text-muted-foreground truncate max-w-[200px]">
        {firstField}{changeCount > 1 ? `, +${changeCount - 1} mais` : ''}
      </span>
    </div>
  )
}

export const auditLogsTableConfig: TableConfig<AuditLogItem> = {
  // Features
  selectable: false,
  animation: true,

  // Columns
  columns: [
    {
      id: 'createdAt',
      type: 'date',
      accessor: 'createdAt',
      header: 'Data/Hora',
      format: 'datetime',
      enableSorting: true,
    },
    {
      id: 'user',
      type: 'custom',
      header: 'Usuário',
      cell: (row) => (
        <div className="flex flex-col">
          <span className="font-medium text-sm">{row.user.name}</span>
          <span className="text-xs text-muted-foreground">{row.user.email}</span>
        </div>
      ),
      enableSorting: false,
    },
    {
      id: 'action',
      type: 'custom',
      accessor: 'action',
      header: 'Ação',
      cell: (row) => <AuditActionBadge action={row.action} />,
      enableSorting: false,
    },
    {
      id: 'entityType',
      type: 'custom',
      accessor: 'entityType',
      header: 'Tipo',
      cell: (row) => <AuditEntityTypeBadge entityType={row.entityType} />,
      enableSorting: false,
    },
    {
      id: 'entityId',
      type: 'string',
      accessor: 'entityId',
      header: 'ID da Entidade',
      display: 'string-secondary',
      enableSorting: false,
    },
    {
      id: 'changes',
      type: 'custom',
      header: 'Alterações',
      cell: (row) => <ChangesPreview changes={row.changes} />,
      enableSorting: false,
    },
    {
      id: 'ip',
      type: 'custom',
      header: 'IP',
      cell: (row) => (
        <span className="text-sm text-muted-foreground font-mono">
          {row.metadata?.ip || '-'}
        </span>
      ),
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
      placeholder: 'Buscar por usuário ou entidade...',
      icon: 'ph-magnifying-glass',
      clearable: true,
    },
    {
      id: 'action',
      type: 'select',
      placeholder: 'Ação',
      width: 'w-[200px]',
      options: [
        { value: 'all', label: 'Todas as ações' },
        { value: 'CREATE', label: 'Criação' },
        { value: 'UPDATE', label: 'Atualização' },
        { value: 'DELETE', label: 'Exclusão' },
        { value: 'ACTIVATE', label: 'Ativação' },
        { value: 'DEACTIVATE', label: 'Desativação' },
        { value: 'WALLET_CREDIT', label: 'Crédito' },
        { value: 'WALLET_DEBIT', label: 'Débito' },
        { value: 'WALLET_FREEZE', label: 'Congelamento' },
        { value: 'WALLET_UNFREEZE', label: 'Descongelamento' },
        { value: 'CONTACT_ADD', label: 'Adicionar Contato' },
        { value: 'CONTACT_UPDATE', label: 'Atualizar Contato' },
        { value: 'CONTACT_DELETE', label: 'Remover Contato' },
        { value: 'DOMAIN_ADD', label: 'Adicionar Domínio' },
        { value: 'DOMAIN_DELETE', label: 'Remover Domínio' },
        { value: 'PLAN_CHANGE', label: 'Mudança de Plano' },
      ],
    },
    {
      id: 'entityType',
      type: 'select',
      placeholder: 'Tipo de Entidade',
      width: 'w-[200px]',
      options: [
        { value: 'all', label: 'Todos os tipos' },
        { value: 'Company', label: 'Empresa' },
        { value: 'User', label: 'Usuário' },
        { value: 'Wallet', label: 'Carteira' },
        { value: 'CompanyWallet', label: 'Carteira da Empresa' },
        { value: 'CompanyContact', label: 'Contato' },
        { value: 'CompanyPlan', label: 'Plano' },
        { value: 'AllowedDomain', label: 'Domínio' },
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
    ],
  },

  // Pagination
  pagination: {
    pageSizeOptions: [20, 50, 100],
    defaultPageSize: 50,
    showPageInfo: true,
    showPageSizeSelector: true,
  },

  // Empty state
  emptyState: {
    icon: 'ph-clipboard-text',
    title: 'Nenhum log encontrado',
    description: 'Não há logs de auditoria correspondentes aos filtros selecionados.',
  },
}
