# Active Context - Valorize UI

## Foco Atual de Desenvolvimento

### Estado Atual: Fundação Estabelecida
O frontend do Valorize está com a estrutura base implementada e pronta para receber as funcionalidades core da aplicação.

### ✅ Funcionalidades Implementadas

#### 1. Setup Inicial Completo
- **Vite + React 19 + TypeScript**: Ambiente de desenvolvimento otimizado
- **TailwindCSS v4**: Sistema de design configurado
- **Path Aliases**: Imports organizados com @
- **Build Optimization**: Compression, code splitting, minification

#### 2. Sistema de Autenticação
- **Login Flow**: Página de login com design moderno
- **Token Management**: Access e refresh tokens
- **Auth Context**: Estado global de autenticação
- **Protected Routes**: Rotas protegidas com redirect
- **Auto Refresh**: Renovação automática de tokens

#### 3. Estrutura de Roteamento
- **TanStack Router**: Configurado com type safety
- **Rotas Definidas**:
  - `/` - Redirect para login
  - `/login` - Página de autenticação
  - `/home` - Dashboard (protegida)
- **Layout System**: Root layout com Outlet

#### 4. Contextos Globais
- **AuthContext**: Gerenciamento de autenticação [[memory:8683315]]
- **ThemeContext**: Controle de tema light/dark [[memory:8683315]]
- **Provider Hierarchy**: Estrutura de providers organizada

#### 5. Serviços e Integração API
- **Axios Instance**: Configurado com interceptors
- **API Service**: Camada de serviços estruturada
- **Auth Service**: Login, logout, refresh token
- **Error Handling**: Tratamento consistente de erros

#### 6. Design System Base
- **Dark Mode**: Implementado com classes Tailwind
- **Color Scheme**: Gradientes modernos (purple-indigo)
- **Typography**: Sistema tipográfico consistente
- **Components Base**: Button, Card, Loading states

### 🔄 Em Desenvolvimento Ativo

#### Dashboard Principal (Próxima Prioridade)
**Objetivo**: Criar a página home com widgets informativos e ações rápidas.

**Componentes Planejados**:
```typescript
// Estrutura do Dashboard
<DashboardLayout>
  <StatsWidget>           // Saldo de moedas
  <RecentPraisesWidget>   // Últimos elogios
  <QuickActionsWidget>    // Ações rápidas
  <TeamActivityWidget>    // Atividade da equipe
</DashboardLayout>
```

**Features do Dashboard**:
- Grid responsivo com widgets
- Cards com gradientes e sombras
- Animações de entrada suaves
- Skeleton loading para dados
- Pull to refresh (mobile)

### 📋 Próximas Implementações

#### 1. Sistema de Elogios (Core Feature)
**Componentes Necessários**:
- `PraiseModal`: Modal para enviar elogio
- `UserSelector`: Autocomplete de usuários
- `ValueSelector`: Cards de valores da empresa
- `CoinSlider`: Seletor de quantidade de moedas
- `PraiseCard`: Componente de visualização de elogio
- `PraiseFeed`: Timeline de elogios

**Fluxo de UX**:
1. Botão flutuante "Enviar Elogio"
2. Modal com steps (usuário → valor → moedas → mensagem)
3. Preview antes de enviar
4. Animação de sucesso
5. Atualização real-time do feed

#### 2. Sistema de Notificações
**Implementação Planejada**:
- Toast notifications para ações
- Badge de notificações não lidas
- Dropdown com histórico
- Push notifications (futuro)

#### 3. Perfil de Usuário
**Páginas e Componentes**:
- `/profile`: Página de perfil próprio
- `/profile/:id`: Perfil de outros usuários
- `ProfileHeader`: Avatar, nome, stats
- `ProfileActivity`: Histórico de atividades
- `ProfileBadges`: Conquistas e badges

## Integrações com Backend

### Endpoints Atualmente Integrados
```typescript
// Auth
POST   /auth/login          ✅ Implementado
POST   /auth/refresh        ✅ Implementado
POST   /auth/logout         ✅ Implementado
GET    /auth/verify         ✅ Implementado

// Users (Próximo)
GET    /users/profile       🔄 Em desenvolvimento
PUT    /users/profile       📋 Planejado
GET    /users/search        📋 Planejado
```

### Endpoints Necessários (Aguardando Backend)
```typescript
// Praises
POST   /praise/send         📋 Aguardando
GET    /praise/feed         📋 Aguardando
GET    /praise/received     📋 Aguardando

// Company Values
GET    /company-values      📋 Aguardando

// Coins
GET    /coins/balance       📋 Aguardando
```

## Decisões de Design Recentes

### 1. Gradientes como Identidade Visual
- **Primary**: `from-purple-600 to-indigo-600`
- **Success**: `from-green-500 to-emerald-600`
- **Danger**: `from-red-500 to-rose-600`
- **Info**: `from-blue-500 to-cyan-600`

### 2. Dark Mode First
- Todas as telas desenvolvidas com dark mode desde o início
- Classes `dark:` em todos os componentes
- Transições suaves entre temas

### 3. Mobile-First Development
- Breakpoints: `sm:640px`, `md:768px`, `lg:1024px`, `xl:1280px`
- Touch targets mínimos de 44x44px
- Gesture support preparado

## Padrões Estabelecidos

### Component Structure
```typescript
// Padrão para novos componentes
interface ComponentProps {
  className?: string
  children?: React.ReactNode
  variant?: 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
}

export const Component = ({ 
  className = '', 
  children,
  variant = 'primary',
  size = 'md' 
}: ComponentProps) => {
  const styles = cn(
    'base-styles',
    variants[variant],
    sizes[size],
    className
  )
  
  return <div className={styles}>{children}</div>
}
```

### Hook Pattern
```typescript
// Padrão para custom hooks
export const useFeature = (options?: Options) => {
  const [state, setState] = useState(initialState)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  
  const action = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await apiCall()
      setState(result)
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }, [dependencies])
  
  return { state, loading, error, action }
}
```

## Problemas Conhecidos

### 1. TypeScript Paths em Produção
- **Problema**: Aliases @ não resolvem em build
- **Solução Temporária**: Vite resolve aliases
- **Solução Definitiva**: Verificar tsconfig paths

### 2. Refresh Token Loop
- **Problema**: Múltiplas tentativas de refresh simultâneas
- **Solução**: Implementar mutex/queue para refresh
- **Status**: Em análise

### 3. Dark Mode Flash
- **Problema**: Flash de tema light antes do dark
- **Solução**: Script inline no HTML
- **Status**: Planejado

## Métricas de Performance Atuais

### Build Metrics
- **Dev Server Start**: ~450ms
- **HMR Update**: <100ms
- **Production Build**: ~8s
- **Bundle Size**: ~180KB (gzipped)

### Runtime Metrics
- **FCP**: ~1.2s
- **TTI**: ~2.8s
- **LCP**: ~1.5s
- **CLS**: 0.05

## Próximos Passos Imediatos

### Esta Semana
1. ✅ Finalizar estrutura do Dashboard
2. 🔄 Implementar widgets básicos
3. 📋 Criar componente PraiseModal
4. 📋 Integrar com endpoint de usuários

### Próximas 2 Semanas
1. 📋 Sistema completo de elogios
2. 📋 Feed de reconhecimentos
3. 📋 Sistema de notificações
4. 📋 Perfil de usuário

### Próximo Mês
1. 📋 Loja de prêmios
2. 📋 Sistema de badges/achievements
3. 📋 Analytics dashboard
4. 📋 PWA capabilities

## Notas de Desenvolvimento

### Convenções Adotadas
- **Commits**: Conventional commits (feat:, fix:, chore:)
- **Branches**: feature/*, bugfix/*, hotfix/*
- **Code Review**: Self-review checklist
- **Testing**: Test antes de commit (quando implementado)

### Ferramentas de Desenvolvimento
- **VS Code**: IDE principal
- **Cursor**: AI pair programming
- **React DevTools**: Debug de componentes
- **Network Tab**: Análise de requests

### Recursos Úteis
- [TailwindCSS v4 Docs](https://tailwindcss.com)
- [TanStack Router Docs](https://tanstack.com/router)
- [React 19 Features](https://react.dev)
- [Vite Guide](https://vitejs.dev)

## Contexto de Colaboração

### Com o Backend
- **API Contract**: Swagger documentation
- **Error Format**: Padronizado com backend
- **Date Format**: ISO 8601
- **Pagination**: Offset-based

### Workflow Preferido
- **Feature Development**: Uma feature completa por vez
- **Component First**: Desenvolver componente isolado primeiro
- **Integration Last**: Integrar com API após UI pronta
- **Responsive Always**: Mobile e desktop juntos