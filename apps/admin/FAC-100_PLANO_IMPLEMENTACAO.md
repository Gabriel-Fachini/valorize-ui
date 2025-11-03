# 📋 FAC-100: Sistema Completo de Gerenciamento de Roles e Permissões (RBAC)

## 🎯 OBJETIVO

Completar a implementação do sistema de gerenciamento de Roles e Permissões no frontend, corrigindo inconsistências identificadas e adicionando funcionalidades faltantes para proporcionar uma experiência completa de CRUD e gerenciamento de RBAC.

---

## 📊 ANÁLISE DA SITUAÇÃO ATUAL

### ✅ PONTOS POSITIVOS (Já Implementado)

1. **Estrutura de Componentes**
   - ✅ `RolesTable` - Tabela de listagem de roles
   - ✅ `RoleTableToolbar` - Barra de ferramentas com filtros
   - ✅ `RoleFormDialog` - Dialog para criar/editar roles
   - ✅ `RoleDeleteDialog` - Dialog de confirmação de exclusão
   - ✅ `RoleDetailCard` - Card com detalhes do role
   - ✅ `PermissionsManager` - Gerenciador completo de permissões
   - ✅ `RoleUsersSection` - Componente para lista de usuários (não usado)

2. **Hooks e Services**
   - ✅ `useRoles` - Lista roles com paginação
   - ✅ `useRoleDetail` - Detalhes de um role
   - ✅ `useRoleMutations` - Criar, atualizar, deletar roles
   - ✅ `usePermissions` - Lista permissões do sistema
   - ✅ `useRolePermissions` - Gerencia permissões de um role
   - ✅ `useUserRoles` - Gerencia roles de um usuário
   - ✅ Services: `roles.ts`, `permissions.ts`, `userRoles.ts`

3. **Tipos e Validações**
   - ✅ Types bem definidos em `src/types/roles.ts`
   - ✅ Schemas de validação com Zod

### ❌ INCONSISTÊNCIAS E FUNCIONALIDADES FALTANTES

#### 1. **NAVEGAÇÃO E ROTEAMENTO** 🔴 (CRÍTICO)
- ❌ **NÃO existe rota** para `RoleDetailPage` no `router.tsx`
- ❌ `RoleDetailPage` usa `roleId = '__temp_role_id__'` (hardcoded)
- ❌ `handleViewDetails` em `RolesPage` apenas faz `console.log`
- ❌ Não há navegação funcional entre lista e detalhes de role

**Impacto:** Página de detalhes completamente inacessível

#### 2. **SEÇÃO DE USUÁRIOS (RoleDetailPage)** 🔴 (CRÍTICO)
- ❌ `RoleUsersSection` existe mas **não está sendo usado**
- ❌ Placeholder genérico exibido no lugar
- ❌ Não carrega os usuários que possuem o role
- ❌ Falta hook `useRoleUsers` (service existe mas sem hook)
- ❌ Não permite remover usuários do role na interface

**Impacto:** Funcionalidade de gerenciamento de usuários não funciona

#### 3. **PERMISSÕES NO FORMULÁRIO DE CRIAÇÃO** 🟡 (IMPORTANTE)
- ❌ `RoleFormDialog` não permite selecionar permissões na **CRIAÇÃO**
- ❌ Backend espera `permissionNames: []` no `POST /admin/roles`
- ❌ Fluxo UX ruim: criar role vazio → salvar → editar → adicionar permissões

**Impacto:** UX inconsistente, força usuário a realizar duas etapas

#### 4. **FEEDBACK E TRATAMENTO DE ERROS** 🟡 (IMPORTANTE)
- ❌ Sem toasts/notificações de sucesso
- ❌ Mensagens de erro não são exibidas aos usuários
- ❌ Estados de carregamento incompletos

**Impacto:** Usuário não sabe se ações foram concluídas com sucesso

#### 5. **FILTROS E ORDENAÇÃO** 🟢 (DESEJÁVEL)
- ❌ `RolesTable` não implementa `sortBy`/`sortOrder`
- ❌ Backend suporta ordenação mas frontend não usa
- ❌ Falta ordenação por nome, data de criação, etc.

**Impacto:** Experiência de navegação limitada em listas grandes

#### 6. **VALIDAÇÕES E MENSAGENS** 🟡 (IMPORTANTE)
- ❌ Não valida se role tem usuários antes de tentar deletar
- ❌ Mensagem genérica, deveria avisar quantos usuários seriam afetados
- ❌ Botão "Deletar" desabilitado sem explicação clara

**Impacto:** Feedback inadequado ao usuário

#### 7. **RBAC - CONTROLE DE ACESSO** 🟡 (IMPORTANTE)
- ❌ Não valida permissões do usuário logado nos componentes
- ❌ Botões sempre visíveis independente de permissão
- ❌ Deveria usar `usePermissions()` para verificar acesso

**Impacto:** Segurança e experiência inadequadas

---

## 🏗️ FASES DE IMPLEMENTAÇÃO

### **FASE 0: Infraestrutura e Preparação** ⚙️
**Prioridade:** CRÍTICA  
**Estimativa:** 1h

#### Objetivo
Preparar a base para as próximas fases, criando hooks e rotas necessárias.

#### Tarefas

1. ✅ **Criar hook `useRoleUsers`**
   - Arquivo: `src/hooks/useRoleUsers.ts`
   - Consumir `userRolesService.getRoleUsers()`
   - Query + mutations para remover usuário do role
   - Invalidar cache apropriadamente

2. ✅ **Adicionar rota de detalhes no router**
   - Arquivo: `src/router.tsx`
   - Criar `roleDetailRoute` com path `/roles/$roleId`
   - Adicionar ao routeTree

3. ✅ **Instalar e configurar Sonner (shadcn/ui)**
   - Executar: `npx shadcn@latest add sonner`
   - Adicionar `<Toaster />` no `App.tsx` ou `RootComponent.tsx`
   - Criar helper `src/lib/toast.ts` para facilitar uso
   - Funções: `toast.success()`, `toast.error()`, `toast.loading()`, `toast.promise()`

#### Critérios de Aceitação

- [ ] Hook `useRoleUsers` criado e funcional
- [ ] Rota `/roles/$roleId` registrada no router
- [ ] Sonner instalado e `<Toaster />` configurado no app
- [ ] Helper de toast criado e testado

---

### **FASE 1: Navegação e Acesso à Página de Detalhes** 🔗
**Prioridade:** CRÍTICA  
**Estimativa:** 2h

#### Objetivo
Tornar a página de detalhes de role acessível e funcional.

#### Tarefas
1. ✅ **Atualizar `RolesPage.tsx`**
   - Implementar navegação real em `handleViewDetails`
   - Usar `navigate({ to: '/roles/$roleId', params: { roleId: role.id } })`
   - Remover `console.log`

2. ✅ **Atualizar `RoleDetailPage.tsx`**
   - Remover `const roleId = '__temp_role_id__'`
   - Obter `roleId` dos parâmetros da rota
   - Usar `useParams()` do TanStack Router
   - Atualizar imports necessários

3. ✅ **Atualizar `RolesTable.tsx`**
   - Garantir que coluna de ações tenha botão "Ver Detalhes"
   - Click no nome do role também deve navegar para detalhes

#### Critérios de Aceitação
- [ ] Clicar em "Ver Detalhes" navega para página correta
- [ ] Página de detalhes carrega dados reais do role
- [ ] Navegação "Voltar" funciona corretamente

---

### **FASE 2: Seção de Usuários na Página de Detalhes** 👥
**Prioridade:** CRÍTICA  
**Estimativa:** 2h

#### Objetivo
Implementar completamente a seção de usuários que possuem o role.

#### Tarefas
1. ✅ **Atualizar `RoleDetailPage.tsx`**
   - Substituir placeholder azul por `<RoleUsersSection />`
   - Usar hook `useRoleUsers(roleId)` criado na Fase 0
   - Passar props: `users`, `isLoading`, `onRemoveUser`, `isRemoving`
   - Implementar `handleRemoveUser`

2. ✅ **Atualizar `RoleUsersSection.tsx`**
   - Adicionar estado de loading adequado
   - Exibir mensagem quando não há usuários
   - Dialog de confirmação antes de remover
   - Mostrar toast de sucesso/erro

3. ✅ **Invalidar cache correto**
   - Ao remover usuário, invalidar:
     - `['roles', roleId, 'users']`
     - `['users', userId, 'roles']`
     - `['roles', roleId]` (atualizar contagem)

#### Critérios de Aceitação
- [ ] Lista de usuários é carregada e exibida
- [ ] Botão "Remover" funciona corretamente
- [ ] Confirmação é solicitada antes de remover
- [ ] Toast de sucesso/erro é exibido
- [ ] Contagem de usuários atualiza automaticamente

---

### **FASE 3: Permissões no Formulário de Criação** 🎨
**Prioridade:** IMPORTANTE  
**Estimativa:** 3h

#### Objetivo
Permitir que usuário selecione permissões ao criar um role (UX melhorada).

#### Tarefas
1. ✅ **Criar componente `PermissionsSelector`**
   - Arquivo: `src/components/roles/PermissionsSelector.tsx`
   - Similar ao `PermissionsManager` mas sem botões de ação
   - Modo compacto, sem card wrapper
   - Props: `value: string[]`, `onChange: (perms: string[]) => void`

2. ✅ **Atualizar `RoleFormDialog.tsx`**
   - Adicionar campo opcional `permissionNames` ao schema
   - Incluir `<PermissionsSelector />` no formulário
   - Mostrar permissões apenas se não for edição básica
   - Accordion ou tabs: "Informações Básicas" | "Permissões"

3. ✅ **Atualizar types `RoleFormData`**
   - Arquivo: `src/types/roles.ts`
   - Adicionar `permissionNames?: string[]`
   - Atualizar schema Zod `roleFormSchema`

4. ✅ **Atualizar mutations**
   - `createRole` deve enviar `permissionNames` se fornecido
   - Backend já aceita esse campo no POST

#### Critérios de Aceitação
- [ ] Ao criar role, usuário pode selecionar permissões
- [ ] Permissões são salvas junto com o role
- [ ] Continua possível criar role sem permissões
- [ ] Dialog mantém boa UX com scroll se necessário

---

### **FASE 4: Sistema de Notificações (Toasts)** 🔔

**Prioridade:** IMPORTANTE  
**Estimativa:** 1h *(reduzida - Sonner já instalado na Fase 0)*

#### Objetivo

Adicionar feedback visual claro para todas as ações usando toasts do Sonner.

#### Tarefas

1. ✅ **Atualizar hooks de mutations**
   - `useRoleMutations`: adicionar toasts em `onSuccess` e `onError`
   - `useRolePermissions`: adicionar toasts
   - `useUserRoles`: adicionar toasts
   - `useRoleUsers`: adicionar toasts (criado na Fase 0)

2. ✅ **Mensagens amigáveis e contextuais**
   - Sucesso: "Role criado com sucesso!", "Permissões atualizadas!"
   - Erro: Exibir mensagem do backend ou genérica amigável
   - Loading: Usar `toast.promise()` para ações assíncronas
   - Incluir ações (undo, view) quando relevante

#### Critérios de Aceitação
- [ ] Todas as ações exibem toast de sucesso
- [ ] Erros exibem toast com mensagem clara
- [ ] Toasts desaparecem automaticamente
- [ ] Múltiplos toasts são gerenciados corretamente

---

### **FASE 5: Validações e Mensagens Melhoradas** ✅
**Prioridade:** IMPORTANTE  
**Estimativa:** 2h

#### Objetivo
Melhorar validações e fornecer feedback contextual.

#### Tarefas
1. ✅ **Atualizar `RoleDeleteDialog.tsx`**
   - Exibir aviso se role tem usuários: "Este role está atribuído a X usuários"
   - Botão "Deletar" desabilitado com tooltip explicativo
   - Sugerir remover usuários primeiro

2. ✅ **Atualizar `RoleDetailPage.tsx`**
   - Tooltip no botão "Deletar" quando desabilitado
   - Link rápido para seção de usuários se role tem usuários

3. ✅ **Validações no formulário**
   - Nome do role não pode ser vazio
   - Validar caracteres especiais se necessário
   - Feedback em tempo real (debounced)

#### Critérios de Aceitação
- [ ] Não é possível deletar role com usuários
- [ ] Mensagem clara explica por que não pode deletar
- [ ] Formulários validam dados antes de enviar
- [ ] Tooltips explicativos nos botões desabilitados

---

### **FASE 6: Filtros e Ordenação** 🔍
**Prioridade:** DESEJÁVEL  
**Estimativa:** 2h

#### Objetivo
Implementar ordenação e filtros avançados na listagem de roles.

#### Tarefas
1. ✅ **Atualizar types e filters**
   - Adicionar `sortBy` e `sortOrder` em `RolesFilters`
   - Opções: `name`, `createdAt`, `usersCount`, `permissionsCount`

2. ✅ **Atualizar `RoleTableToolbar.tsx`**
   - Adicionar dropdown de ordenação
   - Labels claros: "Nome (A-Z)", "Mais recentes", etc.

3. ✅ **Atualizar `RolesTable.tsx`**
   - Headers de coluna clicáveis para ordenar
   - Indicador visual de coluna ordenada (↑↓)
   - Atualizar `queryParams` para incluir sort

#### Critérios de Aceitação
- [ ] Usuário pode ordenar por nome, data, contagens
- [ ] Indicador visual mostra ordenação atual
- [ ] Ordenação é salva no estado e na URL
- [ ] Performance adequada com muitos roles

---

### **FASE 7: Controle de Acesso (RBAC no Frontend)** 🔐

**Prioridade:** IMPORTANTE  
**Estimativa:** 2h *(reduzida - endpoint `GET /admin/roles/me` já existe no backend)*

#### Objetivo

Validar permissões do usuário logado e exibir/ocultar ações adequadamente usando endpoint existente.

#### Tarefas

1. ✅ **Criar service para obter permissões do usuário**
   - Arquivo: `src/services/userPermissions.ts`
   - Chamar `GET /admin/roles/me`
   - Retornar array de permissões do usuário logado

2. ✅ **Criar hook `useUserPermissions`**
   - Arquivo: `src/hooks/useUserPermissions.ts`
   - Query do React Query para cachear permissões
   - Chamar service criado acima
   - Cache: 1 hora (permissões raramente mudam)

3. ✅ **Criar helpers de validação de permissões**
   - Arquivo: `src/lib/permissions.ts`
   - `hasPermission(userPerms: string[], required: string): boolean`
   - `hasAnyPermission(userPerms: string[], required: string[]): boolean`
   - `hasAllPermissions(userPerms: string[], required: string[]): boolean`

4. ✅ **Atualizar componentes com controle de acesso**
   - `RolesPage`: botão "Criar Role" → `ROLES_CREATE`
   - `RoleTableColumns`: editar → `ROLES_UPDATE`, deletar → `ROLES_DELETE`
   - `RoleDetailPage`: editar → `ROLES_UPDATE`, deletar → `ROLES_DELETE`
   - `PermissionsManager`: salvar → `ROLES_MANAGE_PERMISSIONS`
   - `RoleUsersSection`: remover usuário → `USERS_MANAGE_ROLES`

5. ✅ **Feedback visual adequado**
   - Ocultar botões se usuário não tem permissão (preferível)
   - OU desabilitar com Tooltip explicativo
   - Mensagens claras: "Você não tem permissão para realizar esta ação"

#### Critérios de Aceitação

- [ ] Service `userPermissions.ts` criado e funcional
- [ ] Hook `useUserPermissions` retorna permissões do usuário
- [ ] Helpers de validação criados e testados
- [ ] Botões condicionais baseados em permissões
- [ ] Tooltips explicativos quando ação não permitida
- [ ] Experiência consistente com permissões do backend

---

### **FASE 8: Melhorias de UX e Polimento** ✨
**Prioridade:** DESEJÁVEL  
**Estimativa:** 2h

#### Objetivo
Refinar a experiência do usuário com micro-interações e melhorias visuais.

#### Tarefas
1. ✅ **Loading states aprimorados**
   - Skeletons mais realistas
   - Loading inline em botões de ação
   - Desabilitar formulários durante loading

2. ✅ **Empty states**
   - Mensagem amigável quando não há roles: "Crie seu primeiro role!"
   - Ilustração ou ícone
   - Botão de ação direto no empty state

3. ✅ **Confirmações e dialogs**
   - Animações suaves
   - Focus trap correto
   - Escape para fechar

4. ✅ **Responsividade**
   - Tabela adaptável em mobile
   - Dialogs full-screen em telas pequenas
   - Toolbar responsivo

#### Critérios de Aceitação
- [ ] Interface fluida e responsiva
- [ ] Estados vazios são informativos
- [ ] Animações suaves sem travar UI
- [ ] Funciona bem em dispositivos móveis

---

## 📝 PROGRESSO

### Status das Fases

- [ ] **Fase 0:** Infraestrutura e Preparação
- [ ] **Fase 1:** Navegação e Acesso à Página de Detalhes
- [ ] **Fase 2:** Seção de Usuários na Página de Detalhes
- [ ] **Fase 3:** Permissões no Formulário de Criação
- [ ] **Fase 4:** Sistema de Notificações (Toasts)
- [ ] **Fase 5:** Validações e Mensagens Melhoradas
- [ ] **Fase 6:** Filtros e Ordenação
- [ ] **Fase 7:** Controle de Acesso (RBAC no Frontend)
- [ ] **Fase 8:** Melhorias de UX e Polimento

### Estimativa Total

**~16 horas** de desenvolvimento

**Distribuição:**
- Fase 0: 1h (infraestrutura)
- Fase 1: 2h (navegação)
- Fase 2: 2h (usuários)
- Fase 3: 3h (permissões no form)
- Fase 4: 1h (toasts)
- Fase 5: 2h (validações)
- Fase 6: 2h (ordenação) - *Opcional*
- Fase 7: 2h (RBAC frontend) ✅ *Reduzida - endpoint já existe*
- Fase 8: 2h (polimento) - *Opcional*

**Foco Inicial (Fases 0-5):** ~11 horas (funcionalidades críticas e importantes)

---

## ❓ QUESTÕES PARA ESCLARECIMENTO

### 1. Sistema de Notificações
**Pergunta:** Já existe uma biblioteca de toasts configurada no projeto (sonner, react-hot-toast, shadcn toast)?  
**Resposta:** ❌ Não existe. Usar **sonner do shadcn/ui**  
**Impacto:** Fase 4 - Precisa instalar `sonner` e configurar  
**Status:** ✅ Resolvido

### 2. Controle de Acesso
**Pergunta:** O hook `useAuth()` ou `usePermissions()` já retorna as permissões do usuário logado?  
**Resposta:** ❌ **Não retorna permissões no contexto**. Endpoint **`GET /admin/roles/me`** já existe no backend  
**Impacto:** Fase 7 - Usar endpoint existente para obter permissões  
**Status:** ✅ Resolvido

### 3. Design System
**Pergunta:** Existem componentes de Tooltip e Skeleton já definidos no design system?  
**Resposta:** ✅ **Sim, ambos existem**
- `Tooltip`: `/src/components/ui/tooltip.tsx` (Radix UI)
- `Skeleton`: `/src/components/ui/Skeleton.tsx` (Custom com react-spring)  
**Impacto:** Fases 5 e 8 - Pode usar diretamente  
**Status:** ✅ Resolvido

### 4. Priorização de Fases
**Pergunta:** Podemos implementar as fases 0-2 primeiro (navegação e usuários) e deixar fases 6-8 para depois?  
**Resposta:** ✅ **Sim, aprovado**  
**Impacto:** Foco inicial nas Fases 0-5 (funcionalidades críticas e importantes)  
**Status:** ✅ Resolvido

---

## 🎯 DECISÕES TÉCNICAS

### 1. Estrutura de Componentes
**Decisão:** Manter estrutura atual de componentes separados e reutilizáveis.  
**Justificativa:** Facilita manutenção e testes.

### 2. Biblioteca de Toasts

**Decisão:** Usar **Sonner do shadcn/ui** (instalar via `npx shadcn@latest add sonner`)  
**Justificativa:** 
- Leve e performático
- Acessível por padrão
- Integração perfeita com shadcn/ui
- API intuitiva com suporte a `toast.promise()`
- Já é padrão do shadcn

### 3. Navegação
**Decisão:** TanStack Router com parâmetros tipados.  
**Justificativa:** Já em uso no projeto, type-safe.

### 4. Permissões no Formulário

**Decisão:** Tabs (shadcn Tabs) para separar "Básico" e "Permissões" no dialog de criação.  
**Justificativa:**
- Melhor UX que accordion para esse caso
- Evita formulário muito longo
- Mantém foco do usuário
- Permite criar role sem permissões (tab opcional)

### 5. Ordenação

**Decisão:** Ordenação server-side (API).  
**Justificativa:** Escalável, consistente com paginação, não sobrecarrega frontend.

### 6. Controle de Permissões no Frontend

**Decisão:** Usar endpoint `GET /admin/roles/me` (já existe no backend).  
**Justificativa:**
- Endpoint já implementado, reduz esforço de desenvolvimento
- Separação de responsabilidades
- Facilita atualização de permissões sem re-login
- Permite cache granular no frontend com React Query

---

## 🚀 PRÓXIMOS PASSOS

### Implementação Aprovada - Fases 0-5 (Prioridade)

1. ✅ **Todas as questões respondidas**
2. ✅ **Priorização definida: Fases 0-5 primeiro**
3. ⏳ **Aguardando aprovação final para iniciar**

### Ordem de Execução Recomendada

**Sprint 1 (Foco: Navegação e Funcionalidades Críticas)**
- ✅ Fase 0: Infraestrutura (1h)
- ✅ Fase 1: Navegação (2h)
- ✅ Fase 2: Seção de Usuários (2h)

**Sprint 2 (Foco: UX e Feedback)**
- ✅ Fase 3: Permissões no Form (3h)
- ✅ Fase 4: Toasts (1h)
- ✅ Fase 5: Validações (2h)

**Sprint 3 (Foco: Segurança)**
- ✅ Fase 7: RBAC Frontend (2h) ✅ *Sem bloqueadores - endpoint já existe*

**Backlog (Opcional - Melhorias)**
- 🔵 Fase 6: Ordenação (2h)
- 🔵 Fase 8: Polimento UX (2h)

### Dependências Externas

**Backend (FAC-100 - Issue Linear):**
- ✅ Endpoint `GET /admin/roles/me` (já existe)

### Quando Começar?

Posso iniciar **imediatamente** com todas as fases (0-7)! Não há bloqueadores. A Fase 7 pode ser implementada junto com as demais, pois o endpoint `/admin/roles/me` já existe no backend.

---

## 📚 REFERÊNCIAS

- **Issue Linear:** FAC-100
- **Componentes:** `/src/components/roles/`
- **Hooks:** `/src/hooks/useRoles.ts`, `/src/hooks/usePermissions.ts`
- **Services:** `/src/services/roles.ts`, `/src/services/permissions.ts`, `/src/services/userRoles.ts`
- **Types:** `/src/types/roles.ts`
- **Router:** `/src/router.tsx`
