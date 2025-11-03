# DataTable - Sistema de Tabelas Reutilizáveis

## 📋 Visão Geral

Sistema completo de tabelas genéricas e reutilizáveis baseado em configuração declarativa. Permite criar tabelas complexas apenas definindo uma configuração em TypeScript, sem precisar escrever componentes repetitivos.

## 🎯 Componentes Criados

### Fase 1: Estrutura de Tipos ✅

- ✅ `src/config/tables/types.ts` - Tipos TypeScript completos
- ✅ `src/config/tables/index.ts` - Exports centralizados
- ✅ `src/components/layout/PageHeader.tsx` - Atualizado com suporte a ícone

### Fase 2: Componentes Base ✅

- ✅ `src/components/ui/data-table/DataTable.tsx` - Componente principal
- ✅ `src/components/ui/data-table/DataTableColumnRenderers.tsx` - Renderizadores de coluna
- ✅ `src/components/ui/data-table/DataTablePagination.tsx` - Footer de paginação
- ✅ `src/components/ui/data-table/DataTableBulkActions.tsx` - Ações em lote
- ✅ `src/components/ui/data-table/DataTableToolbar.tsx` - Filtros e toolbar
- ✅ `src/components/ui/data-table/renderColumn.tsx` - Helper de renderização
- ✅ `src/components/ui/data-table/index.ts` - Exports

## 🚀 Como Usar

### 1. Criar Configuração da Tabela

```typescript
// src/config/tables/minha-tabela.config.ts
import type { TableConfig } from '@/config/tables'
import type { MeuTipo } from '@/types'

export const minhaTableConfig: TableConfig<MeuTipo> = {
  selectable: true,
  
  columns: [
    {
      id: 'name',
      type: 'string',
      accessor: 'name',
      header: 'Nome',
      display: 'string-bold',
      enableSorting: true,
    },
    {
      id: 'email',
      type: 'string',
      accessor: 'email',
      header: 'Email',
      display: 'string-secondary',
    },
    {
      id: 'status',
      type: 'badge',
      accessor: 'isActive',
      header: 'Status',
      badgeVariant: (value) => value ? 'default' : 'destructive',
      badgeLabel: (value) => value ? 'Ativo' : 'Inativo',
    },
    {
      id: 'actions',
      type: 'actions',
      header: 'Ações',
    },
  ],
  
  filters: [
    {
      id: 'search',
      type: 'search',
      placeholder: 'Buscar...',
      icon: 'ph-magnifying-glass',
      clearable: true,
    },
  ],
  
  actions: {
    bulk: [
      { id: 'delete', label: 'Deletar', icon: 'ph-trash', variant: 'destructive' },
    ],
    row: [
      { id: 'edit', label: 'Editar', icon: 'ph-pencil-simple' },
      { id: 'delete', label: 'Deletar', icon: 'ph-trash', variant: 'destructive' },
    ],
  },
  
  pagination: {
    pageSizeOptions: [20, 50, 100],
    defaultPageSize: 20,
  },
  
  emptyState: {
    icon: 'ph-database',
    title: 'Nenhum item encontrado',
  },
}
```

### 2. Usar na Página

```tsx
import { DataTable } from '@/components/ui/data-table'
import { minhaTableConfig } from '@/config/tables/minha-tabela.config'

export const MinhaPage = () => {
  const { data, isLoading, totalCount, ... } = useMeusDados()
  
  return (
    <DataTable
      config={minhaTableConfig}
      data={data}
      isLoading={isLoading}
      totalCount={totalCount}
      pageCount={pageCount}
      currentPage={page}
      pageSize={pageSize}
      onPageChange={setPage}
      onPageSizeChange={setPageSize}
      filters={filters}
      onFiltersChange={setFilters}
      onRowAction={handleRowAction}
      onBulkAction={handleBulkAction}
      getRowId={(row) => row.id}
    />
  )
}
```

### 3. Atualizar PageHeader

```tsx
import { PageHeader } from '@/components/layout/PageHeader'

<PageHeader
  title="Minha Página"
  description="Descrição da página"
  icon="ph-users"
  right={
    <Button onClick={handleCreate}>
      <i className="ph ph-plus mr-2" />
      Novo
    </Button>
  }
/>
```

## 📦 Tipos de Colunas Suportados

### `selection`
Checkbox de seleção (automático quando `selectable: true`)

### `avatar`
Avatar com imagem ou iniciais
```typescript
{
  id: 'avatar',
  type: 'avatar',
  accessor: (row) => row.avatar || row.name,
  size: 'md',
  fallbackToInitials: true,
}
```

### `string`
Texto simples com variantes de display
```typescript
{
  id: 'name',
  type: 'string',
  accessor: 'name',
  header: 'Nome',
  display: 'string-bold', // 'string-bold' | 'string-secondary' | 'string-muted' | 'string'
}
```

### `link`
Link clicável (integrado com TanStack Router)
```typescript
{
  id: 'name',
  type: 'link',
  accessor: 'name',
  header: 'Nome',
  linkPath: (row) => `/users/${row.id}`,
}
```

### `relation`
Dados de relação com fallback
```typescript
{
  id: 'department',
  type: 'relation',
  accessor: 'department.name',
  header: 'Departamento',
  fallback: '-',
}
```

### `badge`
Badge customizável
```typescript
{
  id: 'status',
  type: 'badge',
  accessor: 'isActive',
  header: 'Status',
  badgeVariant: (value) => value ? 'default' : 'destructive',
  badgeLabel: (value) => value ? 'Ativo' : 'Inativo',
}
```

### `date`
Data formatada
```typescript
{
  id: 'createdAt',
  type: 'date',
  accessor: 'createdAt',
  header: 'Criado em',
  format: 'dd/MM/yyyy',
}
```

### `number`
Número formatado (decimal, moeda, porcentagem)
```typescript
{
  id: 'balance',
  type: 'number',
  accessor: 'balance',
  header: 'Saldo',
  format: 'currency',
  currency: 'BRL',
}
```

### `actions`
Menu dropdown de ações
```typescript
{
  id: 'actions',
  type: 'actions',
  header: 'Ações',
}
```

### `custom`
Renderização completamente customizada
```typescript
{
  id: 'custom',
  type: 'custom',
  header: 'Custom',
  cell: (row) => <MeuComponente data={row} />,
}
```

## 🎨 Filtros Suportados

### `search`
Campo de busca com ícone e botão clear
```typescript
{
  id: 'search',
  type: 'search',
  placeholder: 'Buscar...',
  icon: 'ph-magnifying-glass',
  clearable: true,
}
```

### `select`
Dropdown de seleção
```typescript
{
  id: 'status',
  type: 'select',
  placeholder: 'Status',
  options: [
    { value: 'all', label: 'Todos' },
    { value: 'active', label: 'Ativos' },
  ],
}
```

### `select` dinâmico
Select com options carregadas via hook
```typescript
{
  id: 'departmentId',
  type: 'select',
  placeholder: 'Departamento',
  dynamic: true,
  options: [], // Preenchido via dynamicFilterOptions prop
}
```

## ⚡ Features

- ✅ Type-safe com TypeScript
- ✅ Configuração declarativa
- ✅ Seleção múltipla de linhas
- ✅ Ações em lote
- ✅ Filtros flexíveis
- ✅ Paginação completa
- ✅ Loading states e skeletons
- ✅ Animações com react-spring
- ✅ Empty states customizáveis
- ✅ Ações condicionais por linha
- ✅ Suporte a relações aninhadas
- ✅ Integrado com TanStack Table e Router

## 🔄 Próximas Fases

### Fase 3: Configuração de Tabelas (A fazer)
- Criar `users.table.config.ts`
- Criar configs para outras tabelas

### Fase 4: Migração UsersPage (A fazer)
- Substituir componentes atuais
- Testar todas as funcionalidades

### Fase 5: Refinamento (A fazer)
- Adicionar mais tipos de filtros
- Melhorar animações
- Documentação completa
