# 🎯 Sistema de Gerenciamento de Roles e Permissões (RBAC Admin)

## 📋 Visão Geral

Implementação completa de um sistema de gerenciamento de Roles (cargos/funções) e Permissões baseado em RBAC (Role-Based Access Control) para a interface administrativa.

## 📁 Estrutura Implementada - Fase 1 (Core)

### Types & Interfaces (`src/types/roles.ts`)
- `Role` - Role básico
- `RoleWithCounts` - Role com contadores de usuários e permissões
- `RoleDetail` - Role com detalhes completos incluindo permissões
- `Permission` - Interface de permissão
- `PermissionCategory` - Categoria de permissões agrupadas
- `UserRole` - Relação user-role
- Response types para todos os endpoints
- Zod schemas para validação de formulários

### Services

#### `src/services/roles.ts`
- `list()` - GET `/admin/roles` com paginação
- `get()` - GET `/admin/roles/:roleId`
- `create()` - POST `/admin/roles`
- `update()` - PATCH `/admin/roles/:roleId`
- `delete()` - DELETE `/admin/roles/:roleId`

#### `src/services/permissions.ts`
- `listAll()` - GET `/admin/roles/system/permissions`
- `listCategories()` - GET `/admin/roles/system/permissions/categories`
- `getRolePermissions()` - GET `/admin/roles/:roleId/permissions`
- `setRolePermissions()` - PUT `/admin/roles/:roleId/permissions`
- `addRolePermissions()` - POST `/admin/roles/:roleId/permissions`
- `removeRolePermissions()` - DELETE `/admin/roles/:roleId/permissions`

#### `src/services/userRoles.ts`
- `getUserRoles()` - GET `/admin/roles/users/:userId/roles`
- `assignRoleToUser()` - POST `/admin/roles/users/:userId/roles`
- `removeRoleFromUser()` - DELETE `/admin/roles/users/:userId/roles/:roleId`
- `getRoleUsers()` - GET `/admin/roles/:roleId/users` (com paginação)

### Hooks

#### `src/hooks/useRoles.ts`
- Fetch com paginação usando React Query
- Invalidação de cache automática
- Placeholder data para transições suaves

#### `src/hooks/useRoleMutations.ts`
- Mutations para create, update, delete
- Invalidação automática de cache
- Error handling

#### `src/hooks/useRoleDetail.ts`
- Fetch de role específico
- Habilitado condicionalmente

#### `src/hooks/usePermissions.ts`
- Listagem de todas as permissões
- Cache de longa duração

#### `src/hooks/usePermissionCategories.ts`
- Listagem de categorias de permissões
- Cache de 1 hora

#### `src/hooks/useRolePermissions.ts`
- Gerenciamento de permissões de um role
- Mutations para add, remove, replace
- Optimistic updates

#### `src/hooks/useUserRoles.ts`
- Listagem de roles de um usuário
- Mutations para assign/remove roles

### Componentes (`src/components/roles/`)

#### Tabela & Listagem
- **`RolesTable.tsx`** - Tabela principal com TanStack Table
  - Animações react-spring para rows
  - Paginação server-side
  - Loading skeleton states
  
- **`RoleTableColumns.tsx`** - Definição de colunas
  - Colunas: name, description, usersCount, permissionsCount, createdAt, actions
  - Action dropdown menu
  
- **`RoleTableToolbar.tsx`** - Toolbar com filtros
  - Input de busca com debounce
  - Botão "Novo Role"

#### Dialogs & Formulários
- **`RoleFormDialog.tsx`** - Dialog para criar/editar role
  - React Hook Form com Zod
  - Validação real-time
  - Modo create/edit automático
  
- **`RoleDeleteDialog.tsx`** - Dialog de confirmação de exclusão
  - Aviso se role tiver usuários atribuídos
  - Bloqueia deleção se houver usuários

#### Detalhes & Permissões
- **`RoleDetailCard.tsx`** - Card com informações do role
  - Info básica, timestamps, permissões
  
- **`PermissionsManager.tsx`** - Gerenciador de permissões
  - Agrupamento por categoria
  - Checkboxes para seleção
  - Select all/none por categoria
  - Visualização de progresso (X/Y permissões)

- **`RoleUsersSection.tsx`** - Seção mostrando usuários com o role
  - Mini lista com avatar, nome e email
  - Botão para remover role do usuário

### Pages

#### `src/pages/RolesPage.tsx` (Fase 1)
- Listagem principal de roles com paginação
- Busca com debounce
- Criação de novo role
- Edição de role
- Deleção de role
- Dialogs modais

#### `src/pages/RoleDetailPage.tsx` (Fase 2)
- Página de detalhes de um role
- Edição de informações
- Gerenciamento de permissões
- Visualização de usuários (placeholder)
- Deletar role

### Router (`src/router.tsx`)
- Rota `/roles` - RolesPage (listagem)
- Rota `/roles/:roleId` - RoleDetailPage (detalhes) - **Ainda precisa de ajuste de route parameter**

## 🚀 Status de Implementação

### ✅ Concluído (Fase 1)
- [x] Types e interfaces
- [x] Services (CRUD de roles e permissions)
- [x] Hooks de data fetching
- [x] Componentes de tabela
- [x] Componentes de dialog
- [x] Página de listagem (RolesPage)
- [x] Página de detalhes (RoleDetailPage) - estrutura básica
- [x] Router setup

### 📝 Próximos Passos

#### Fase 2 - Permissões Avançadas
- [ ] Implementar funcionalidades completas do PermissionsManager
- [ ] Testar fluxo de add/remove permissões
- [ ] Adicionar filtros e busca de permissões

#### Fase 3 - Integração com Usuários
- [ ] Criar componente de atribuição de roles a usuários
- [ ] Implementar RemoveRoleDialog
- [ ] Adicionar integração na página de detalhes de usuário
- [ ] Criar UserRolesBadge para listagem de users

#### Fase 4 - Polimento
- [ ] Adicionar animações react-spring completas
- [ ] Implementar toasts de notificação
- [ ] Error handling mais detalhado
- [ ] Loading states otimizados
- [ ] Validações server-side

## 🔌 Dependências Utilizadas

- **React Query** - Data fetching e state management
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de schemas
- **TanStack React Table** - Tabelas avançadas
- **TanStack Router** - Roteamento
- **react-spring** - Animações
- **shadcn/ui** - Componentes UI
- **Tailwind CSS** - Estilos

## 🔧 Como Usar

### Listar Roles
```tsx
import { RolesPage } from '@/pages/RolesPage'

// Renderizar a página
<RolesPage />
```

### Hook para Roles
```tsx
import { useRoles } from '@/hooks/useRoles'

const { roles, isLoading, totalCount, pageCount } = useRoles({
  page: 1,
  limit: 20,
  search: 'gerente'
})
```

### Criar Role
```tsx
import { useRoleMutations } from '@/hooks/useRoleMutations'

const { createRole, isCreating } = useRoleMutations()

await createRole({
  name: 'Gerente de RH',
  description: 'Responsável pelo RH'
})
```

## 🎯 Notas Importantes

1. **Route Parameters**: A rota `/roles/:roleId` precisa de ajuste em `router.tsx` para passar o `roleId` corretamente (TanStack Router v1 requer setup especial para route params)

2. **API Base URL**: Todos os endpoints usam o padrão `/admin/roles` configurado no serviço `api.ts`

3. **Cache Strategy**: 
   - Roles: 2 minutos stale time
   - Permissions: 1 hora stale time (nunca mudam)
   - User Roles: 2 minutos stale time

4. **Validações**: O frontend valida com Zod, mas o backend também deve validar (padrão estabelecido)

5. **Multi-tenancy**: Todos os endpoints automaticamente isolam por empresa do usuário logado (backend responsibility)

## 📊 Estrutura de Dados

### Role Completo (Response)
```json
{
  "id": "uuid",
  "name": "HR Manager",
  "description": "HR Department Manager",
  "companyId": "uuid",
  "usersCount": 5,
  "permissionsCount": 12,
  "permissions": ["users:read", "users:create"],
  "createdAt": "2025-11-03T10:00:00Z",
  "updatedAt": "2025-11-03T10:00:00Z"
}
```

### Permission (Response)
```json
{
  "id": "uuid",
  "name": "users:read",
  "description": "View user information",
  "category": "User Management",
  "inUse": true
}
```

## 🚦 Fluxos Principais

### Criar Role
1. Clica em "+ Novo Role"
2. Dialog abre com formulário vazio
3. Preenche nome e descrição (opcional)
4. Clica em "Salvar"
5. API cria e cache é invalidado
6. Tabela atualiza automaticamente
7. Opcionalmente redirecionado para página de detalhes

### Editar Role
1. Clica no ícone de editar na tabela
2. Dialog abre com dados preenchidos
3. Modifica os dados desejados
4. Clica em "Salvar"
5. API atualiza e cache é invalidado
6. Tabela atualiza automaticamente

### Gerenciar Permissões
1. Na página de detalhes do role
2. Seção "Gerenciador de Permissões" mostra todas
3. Verifica/desverifica permissões por categoria
4. Clica em "Salvar Permissões"
5. API atualiza permissões do role

### Deletar Role
1. Clica no ícone de delete
2. Dialog de confirmação abre
3. Se houver usuários, aviso é exibido e deleção é desabilitada
4. Se sem usuários, confirma
5. API deleta e cache é invalidado
6. Retorna à listagem

## 🔐 Permissões Necessárias (Backend)

- `ROLES_READ` - Listar e visualizar roles
- `ROLES_CREATE` - Criar novo role
- `ROLES_UPDATE` - Editar role
- `ROLES_DELETE` - Deletar role
- `ROLES_MANAGE_PERMISSIONS` - Gerenciar permissões de role
- `USERS_READ` - Listar usuários
- `USERS_MANAGE_ROLES` - Atribuir/remover roles de usuários

## 📖 Referências

- Specification: FAC-100 no Linear
- API Guide: `/FRONTEND_IMPLEMENTATION_GUIDE_RESUMIDO.md`
- Componentes: shadcn/ui
- Icons: @phosphor-icons/web
- Animations: @react-spring/web
