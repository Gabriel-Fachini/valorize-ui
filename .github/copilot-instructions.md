# Valorize UI - AI Coding Agent Instructions

## Project Architecture

**Monorepo Structure (Turborepo + PNPM):**
- `apps/dashboard/` - React 19 + Vite dashboard application (main product)
- `apps/landing/` - Astro-based marketing landing page
- Projects are **completely isolated** - no shared packages, separate dependencies
- Use `pnpm dev:dashboard` or `pnpm dev:landing` to run specific apps

**Dashboard Tech Stack:**
- React 19 + TypeScript 5.8 + Vite 7 (with SWC for 3-10x faster compilation)
- TailwindCSS v4 (utility-first, JIT mode)
- TanStack Router (type-safe routing) + TanStack Query (server state)
- Animations: **react-spring ONLY** (never use CSS transitions - see rule below)

**Landing Tech Stack:**
- Astro 4 (SSG for performance + SEO)
- React islands for interactive components only
- TailwindCSS v4 + react-hook-form + Zod validation

## Critical Development Rules

### Animations Rule (Dashboard)
**NEVER use CSS transition properties** (transition, transition-all, etc.) in TailwindCSS for animations.
- **Only use react-spring** (`@react-spring/web`) for animations
- Custom hooks available: `usePageEntrance`, `useCardTrail`, `useModalTransition`, `useSuccessTransition` (see `hooks/useAnimations.ts`)
- Exception: Simple hover effects are acceptable (hover:bg-blue-600)

### Code Style
- **No semicolons** - ESLint enforces semicolon-free style
- **Single quotes** for strings
- **English only** for all code, comments, and documentation
- Use `eslint . --fix` to auto-fix linting errors quickly

### Documentation
- **Do NOT create docs unless explicitly requested**
- Documentation goes in `docs/` folder when needed
- Memory bank exists in `memory-bank/` for project context

## Path Aliases (Dashboard)

Always use these for imports:
```typescript
@/           → ./src/
@components/ → ./src/components/
@pages/      → ./src/pages/
@hooks/      → ./src/hooks/
@services/   → ./src/services/
@contexts/   → ./src/contexts/
@types       → ./src/types/
@helpers/    → ./src/helpers/
@assets/     → ./src/assets/
```

Example: `import { useAuth } from '@hooks/useAuth'`

## Authentication Pattern

**Token Management:** Uses custom `TokenManager` class (in `lib/tokenManager.ts`)
- Access token + refresh token stored in localStorage
- Axios interceptor auto-refreshes expired tokens
- `checkAndRefreshToken()` validates session on app init

**Auth Flow:**
1. `AuthContext` wraps entire app providing `{ user, isLoading, login, logout, checkAuth }`
2. Access via `useAuth()` hook (NOT direct context import)
3. Protected routes use `<ProtectedRoute>` component wrapper
4. API requests auto-include `Bearer ${token}` via axios interceptor

**Key Files:**
- `contexts/AuthContext.tsx` - Provider with token validation
- `services/auth.ts` - Login, verify, refresh functions
- `lib/tokenManager.ts` - Token storage utilities

## State Management Patterns

**Local State:** `useState` for component-specific state

**Global State:** React Context API
- `AuthContext` - User authentication state
- `ThemeContext` - Light/dark mode (check with `useTheme()`)
- `SidebarContext` - Sidebar open/closed state
- `AccessibilityContext` - Accessibility preferences

**Server State:** TanStack Query (React Query v5)
```typescript
// Queries
const { data, isLoading, error } = useQuery({
  queryKey: ['praises'],
  queryFn: fetchPraises,
  staleTime: 5 * 60 * 1000, // 5 minutes
})

// Mutations with cache invalidation
const { mutate } = useMutation({
  mutationFn: sendPraise,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['praises'] })
  },
})
```

## Component Patterns

**Functional Components with TypeScript:**
```typescript
interface Props {
  title: string
  isActive?: boolean
  onClick?: () => void
  children?: React.ReactNode
}

export const Component = ({ title, isActive = false, onClick }: Props) => {
  // 1. Hooks always at top
  const [state, setState] = useState('')
  const { user } = useAuth()
  
  // 2. Effects after hooks
  useEffect(() => { /* logic */ }, [dependency])
  
  // 3. Handlers before return
  const handleClick = () => { onClick?.() }
  
  // 4. Early returns for loading/error states
  if (!user) return <LoadingSpinner />
  
  return <div>{/* JSX */}</div>
}
```

## API Integration

**Axios Instance:** Pre-configured in `services/api.ts`
- Base URL from `VITE_API_BASE_URL` env var
- Auto-includes auth tokens
- Auto-refreshes on 401 errors
- Redirects to /login on auth failure

**Service Layer Pattern:**
```typescript
// services/praise.service.ts
export const praiseService = {
  async getAll(): Promise<Praise[]> {
    const { data } = await api.get('/praises')
    return data
  },
  
  async create(dto: CreatePraiseDto): Promise<Praise> {
    const { data } = await api.post('/praises', dto)
    return data
  },
}
```

## Styling with TailwindCSS v4

**Dark Mode Pattern:**
```tsx
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
  <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
    Title
  </h1>
</div>
```

**Gradient Buttons (Common Pattern):**
```tsx
<button className="rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-3 font-medium text-white hover:from-purple-700 hover:to-indigo-700">
  Click me
</button>
```

## Build & Development Commands

**Development:**
```bash
pnpm dev                  # Run all apps in parallel
pnpm dev:dashboard        # Dashboard only (port 3000)
pnpm dev:landing          # Landing only (port 3001)
```

**Build:**
```bash
pnpm build                # Build all apps
pnpm build:dashboard      # Dashboard only
pnpm build:landing        # Landing only
```

**Linting:**
```bash
pnpm lint                 # Lint all apps
pnpm lint:fix             # Auto-fix linting errors
pnpm type-check           # TypeScript type checking
```

**Other:**
```bash
pnpm clean                # Clean all dist + node_modules
```

## Performance Optimizations

**Code Splitting (Vite):**
- Manual chunks: `react-vendor`, `query-vendor` (see `vite.config.ts`)
- Lazy loading: Use `React.lazy()` + `<Suspense>` for heavy pages

**Memoization:**
```typescript
// React.memo for pure components
export const ExpensiveComponent = React.memo(({ data }: Props) => {
  return <ComplexVisualization data={data} />
})

// useMemo for expensive computations
const processedData = useMemo(() => {
  return heavyDataProcessing(rawData)
}, [rawData])

// useCallback for stable function references
const handleSubmit = useCallback((data: FormData) => {
  submitForm(data)
}, [submitForm])
```

**Image Optimization:**
```tsx
<img 
  src={image} 
  loading="lazy"           // Native lazy loading
  alt="Description"
  className="w-full h-auto"
/>
```

## Common Gotchas

1. **Never import contexts directly** - Always use the custom hook:
   - ❌ `import { AuthContext } from '@contexts/auth'`
   - ✅ `import { useAuth } from '@hooks/useAuth'`

2. **Animations:** Remember to use react-spring, not CSS transitions

3. **Type Safety:** TanStack Router provides type-safe routing - use it:
   ```typescript
   router.navigate({ to: '/prizes/$prizeId', params: { prizeId: '123' } })
   ```

4. **Environment Variables:** Prefix with `VITE_` for client access:
   - `VITE_API_BASE_URL` - Required for API communication
   - Access via `import.meta.env.VITE_API_BASE_URL`

5. **ESLint Config:** Uses flat config format (`eslint.config.ts`) - not legacy `.eslintrc`

## Key Files to Reference

- `memory-bank/systemPatterns.md` - Detailed architecture patterns
- `memory-bank/techContext.md` - Full tech stack details
- `memory-bank/productContext.md` - Product vision and UX goals
- `apps/dashboard/src/router.tsx` - Route configuration
- `apps/dashboard/src/services/api.ts` - API client setup
- `apps/dashboard/vite.config.ts` - Build configuration (heavily commented)
- `eslint.config.ts` - Linting rules (heavily commented)

## Testing (Future)

Testing infrastructure is planned but not yet implemented:
- Vitest for unit/integration tests
- React Testing Library for component tests
- Playwright for E2E tests

## Support & Resources

- Memory Bank: Comprehensive docs in `memory-bank/` folder
- API Docs: `docs/API_ROUTES_DOCUMENTATION.md`
- Project Brief: `memory-bank/projectbrief.md`
- Progress Tracking: `memory-bank/progress.md`
