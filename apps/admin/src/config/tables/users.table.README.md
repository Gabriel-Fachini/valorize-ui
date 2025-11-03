# Users Table Configuration

## 📋 Visão Geral

Configuração declarativa completa da tabela de gerenciamento de usuários. Esta configuração define todas as colunas, filtros, ações e comportamentos da tabela sem precisar escrever componentes repetitivos.

## 📦 Arquivo

**Localização**: `src/config/tables/users.table.config.ts`

## 🎯 Estrutura da Configuração

### Colunas (7 colunas)

1. **Avatar** (`avatar`)
   - Tipo: `avatar`
   - Exibe foto do usuário ou iniciais
   - Tamanho: médio (10x10)
   - Não ordenável

2. **Nome** (`name`)
   - Tipo: `link`
   - Link para página de detalhes (`/users/{id}`)
   - Display: negrito
   - Ordenável: ✅

3. **Email** (`email`)
   - Tipo: `string`
   - Display: texto secundário (muted)
   - Ordenável: ✅

4. **Departamento** (`department`)
   - Tipo: `relation`
   - Acessa: `department.name`
   - Fallback: `-` (quando não há departamento)
   - Não ordenável

5. **Cargo** (`position`)
   - Tipo: `relation`
   - Acessa: `position.name`
   - Fallback: `-` (quando não há cargo)
   - Não ordenável

6. **Status** (`isActive`)
   - Tipo: `badge`
   - Variantes:
     - `default` (verde) para ativo
     - `destructive` (vermelho) para inativo
   - Labels: "Ativo" / "Inativo"
   - Ordenável: ✅

7. **Ações** (`actions`)
   - Tipo: `actions`
   - Dropdown menu com ações por linha
   - Não ordenável

### Filtros (4 filtros)

1. **Busca** (`search`)
   - Tipo: `search`
   - Placeholder: "Buscar por nome ou email..."
   - Ícone: lupa (ph-magnifying-glass)
   - Botão clear: ✅

2. **Status** (`status`)
   - Tipo: `select`
   - Opções:
     - Todos os status
     - Ativos
     - Inativos
   - Largura: 180px

3. **Departamento** (`departmentId`)
   - Tipo: `select` (dinâmico)
   - Ícone: buildings (ph-buildings)
   - Carregado via API (hook: `useDepartments`)
   - Largura: 200px

4. **Cargo** (`jobTitleId`)
   - Tipo: `select` (dinâmico)
   - Ícone: briefcase (ph-briefcase)
   - Carregado via API (hook: `useJobTitles`)
   - Largura: 200px

### Ações em Lote (3 ações)

1. **Ativar** (`activate`)
   - Ícone: ph-check-circle
   - Ativa usuários selecionados

2. **Desativar** (`deactivate`)
   - Ícone: ph-x-circle
   - Desativa usuários selecionados

3. **Exportar** (`export`)
   - Ícone: ph-download-simple
   - Exporta usuários selecionados para CSV

### Ações por Linha (4 ações)

1. **Ver detalhes** (`view`)
   - Ícone: ph-eye
   - Navega para página de detalhes

2. **Editar** (`edit`)
   - Ícone: ph-pencil-simple
   - Abre modal de edição

3. **Redefinir Senha** (`resetPassword`)
   - Ícone: ph-key
   - Gera link de redefinição
   - Separador: ✅ (linha antes da ação)

4. **Deletar** (`delete`)
   - Ícone: ph-trash
   - Variante: destructive (vermelho)
   - Separador: ✅ (linha antes da ação)

### Paginação

- **Opções de tamanho**: 20, 50, 100 linhas por página
- **Tamanho padrão**: 20
- **Info da página**: ✅ (mostra "Página X de Y")
- **Selector de tamanho**: ✅

### Empty State

- **Ícone**: ph-users
- **Título**: "Nenhum usuário encontrado"
- **Descrição**: "Tente ajustar os filtros ou adicione novos usuários"

### Features Habilitadas

- ✅ Seleção múltipla de linhas
- ✅ Animações de entrada

## 🚀 Como Usar

### 1. Importar a configuração

```typescript
import { usersTableConfig } from '@/config/tables/users.table.config'
import { DataTable } from '@/components/ui/data-table'
```

### 2. Usar no componente

```tsx
<DataTable
  config={usersTableConfig}
  data={users}
  isLoading={isLoading}
  isFetching={isFetching}
  totalCount={totalCount}
  pageCount={pageCount}
  currentPage={currentPage}
  pageSize={pageSize}
  onPageChange={setPage}
  onPageSizeChange={setPageSize}
  filters={filters}
  onFiltersChange={setFilters}
  onRowAction={handleRowAction}
  onBulkAction={handleBulkAction}
  getRowId={(row) => row.id}
  dynamicFilterOptions={dynamicFilterOptions}
/>
```

### 3. Implementar handlers

```typescript
// Handler para ações por linha
const handleRowAction = async (actionId: string, user: User) => {
  switch (actionId) {
    case 'view':
      // Navegação automática pelo link
      break
    case 'edit':
      openEditDialog(user)
      break
    case 'resetPassword':
      await resetPassword(user.id)
      break
    case 'delete':
      openDeleteDialog(user)
      break
  }
}

// Handler para ações em lote
const handleBulkAction = async (actionId: string, userIds: string[]) => {
  await performBulkAction({ userIds, action: actionId })
}
```

### 4. Preparar filtros dinâmicos

```typescript
const { data: departments } = useDepartments()
const { data: jobTitles } = useJobTitles()

const dynamicFilterOptions = {
  departmentId: [
    { value: 'all', label: 'Todos departamentos' },
    ...departments.map(d => ({ value: d.id, label: d.name }))
  ],
  jobTitleId: [
    { value: 'all', label: 'Todos os cargos' },
    ...jobTitles.map(j => ({ value: j.id, label: j.name }))
  ]
}
```

## 📝 Exemplo Completo

Veja o arquivo `users.table.example.tsx` na mesma pasta para um exemplo completo de uso.

## 🔧 Customização

Para modificar a tabela, basta editar o arquivo `users.table.config.ts`:

- **Adicionar coluna**: Adicione um novo objeto no array `columns`
- **Modificar filtro**: Edite o objeto correspondente em `filters`
- **Adicionar ação**: Adicione em `actions.bulk` ou `actions.row`
- **Alterar paginação**: Modifique `pagination.pageSizeOptions`

## ✅ Vantagens

- ✅ **Declarativo**: Toda configuração em um só lugar
- ✅ **Type-safe**: TypeScript garante tipos corretos
- ✅ **Reutilizável**: Mesmo padrão para todas as tabelas
- ✅ **Manutenível**: Mudanças centralizadas
- ✅ **Testável**: Configuração pode ser testada isoladamente

## 🔗 Arquivos Relacionados

- **Tipos**: `src/types/users.ts`
- **Hooks**: `src/hooks/useUsers.ts`, `src/hooks/useUserMutations.ts`
- **Componente**: `src/components/ui/data-table/DataTable.tsx`
- **Página**: `src/pages/UsersPage.tsx` (será migrada na Fase 4)
