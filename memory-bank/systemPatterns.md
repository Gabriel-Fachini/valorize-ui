# System Patterns - Valorize UI

## Arquitetura Geral

### Component-Based Architecture
O Valorize UI segue uma arquitetura baseada em componentes React com TypeScript, otimizada para manutenibilidade e reutilização.

#### Estrutura de Diretórios [[memory:8683315]]
```
src/
├── components/          # Componentes reutilizáveis de UI
│   ├── common/         # Componentes genéricos (Button, Card, Modal)
│   ├── layout/         # Componentes de layout (Header, Sidebar, Footer)
│   └── features/       # Componentes específicos de features
├── pages/              # Componentes de página (roteamento)
├── hooks/              # Custom React hooks [[memory:8683315]]
├── contexts/           # React Context providers [[memory:8683315]]
├── services/           # Camada de serviços (API, auth)
├── helpers/            # Funções utilitárias puras
├── types/              # TypeScript type definitions
├── assets/             # Imagens, fontes, etc.
└── translations/       # Arquivos i18n (futuro)
```

### Padrões de Componentes

#### 1. Functional Components com TypeScript
```typescript
// Padrão para componentes
interface ComponentProps {
  title: string
  isActive?: boolean
  onClick?: () => void
  children?: React.ReactNode
}

export const Component = ({ title, isActive = false, onClick, children }: ComponentProps) => {
  // Hooks sempre no topo
  const [state, setState] = useState<string>('')
  const { user } = useAuth()
  
  // Effects após hooks
  useEffect(() => {
    // Logic here
  }, [dependency])
  
  // Handlers antes do return
  const handleClick = () => {
    onClick?.()
  }
  
  // Renderização condicional clara
  if (!user) return <LoadingSpinner />
  
  return (
    <div className="component-class">
      {children}
    </div>
  )
}
```

#### 2. Composição de Componentes
```typescript
// Parent/Child pattern
<Card>
  <Card.Header>
    <Card.Title>Título</Card.Title>
  </Card.Header>
  <Card.Body>
    Conteúdo
  </Card.Body>
  <Card.Footer>
    <Button>Ação</Button>
  </Card.Footer>
</Card>
```

### Padrões de Estado

#### 1. Local State (useState)
```typescript
// Para estado local do componente
const [isOpen, setIsOpen] = useState(false)
const [formData, setFormData] = useState<FormData>(initialData)
```

#### 2. Context API (Global State)
```typescript
// contexts/ThemeContext.tsx
export const ThemeContext = createContext<ThemeContextType>({} as ThemeContextType)

export const ThemeProvider = ({ children }: ProviderProps) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

// hooks/useTheme.ts
export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used within ThemeProvider')
  return context
}
```

#### 3. Server State (React Query)
```typescript
// hooks/usePraises.ts
export const usePraises = () => {
  return useQuery({
    queryKey: ['praises'],
    queryFn: fetchPraises,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000,   // 10 minutos
  })
}

// Mutations
export const useSendPraise = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: sendPraise,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['praises'] })
    },
  })
}
```

### Padrões de Roteamento

#### TanStack Router Configuration
```typescript
// router.tsx
const rootRoute = createRootRoute({
  component: RootLayout,
})

const publicRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
})

const protectedRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: DashboardPage,
  beforeLoad: async ({ context }) => {
    if (!context.auth.user) {
      throw redirect({ to: '/login' })
    }
  },
})
```

### Padrões de Estilização

#### 1. TailwindCSS com Utility-First
```tsx
// Classes utilitárias diretas
<button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">
  Click me
</button>

// Componentização com classes
const buttonStyles = {
  base: 'px-4 py-2 rounded-lg transition-colors font-medium',
  variants: {
    primary: 'bg-blue-500 hover:bg-blue-600 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
    danger: 'bg-red-500 hover:bg-red-600 text-white',
  },
  sizes: {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  },
}
```

#### 2. Dark Mode Pattern
```tsx
// Uso de classes dark: do Tailwind
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
  <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
    Título
  </h1>
</div>
```

### Padrões de Performance

#### 1. Code Splitting
```typescript
// Lazy loading de páginas
const DashboardPage = lazy(() => import('@pages/DashboardPage'))
const ProfilePage = lazy(() => import('@pages/ProfilePage'))

// Suspense boundary
<Suspense fallback={<LoadingSpinner />}>
  <Routes>
    <Route path="/dashboard" element={<DashboardPage />} />
    <Route path="/profile" element={<ProfilePage />} />
  </Routes>
</Suspense>
```

#### 2. Memoization
```typescript
// React.memo para componentes puros
export const ExpensiveComponent = React.memo(({ data }: Props) => {
  return <ComplexVisualization data={data} />
})

// useMemo para cálculos pesados
const processedData = useMemo(() => {
  return heavyDataProcessing(rawData)
}, [rawData])

// useCallback para funções estáveis
const handleSubmit = useCallback((data: FormData) => {
  submitForm(data)
}, [submitForm])
```

#### 3. Image Optimization
```tsx
// Lazy loading de imagens
<img 
  src={thumbnail} 
  loading="lazy" 
  alt="Description"
  className="w-full h-auto"
/>

// Responsive images
<picture>
  <source srcSet={imageWebp} type="image/webp" />
  <source srcSet={imageJpg} type="image/jpeg" />
  <img src={imageJpg} alt="Description" />
</picture>
```

### Padrões de Formulários

#### Controlled Components
```typescript
const [formData, setFormData] = useState({
  email: '',
  password: '',
})

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target
  setFormData(prev => ({ ...prev, [name]: value }))
}

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  // Validation
  if (!formData.email || !formData.password) {
    setError('Preencha todos os campos')
    return
  }
  // Submit
  await submitForm(formData)
}
```

### Padrões de Error Handling

#### 1. Error Boundaries
```typescript
class ErrorBoundary extends React.Component<Props, State> {
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }
  
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Error caught:', error, info)
    // Log to service
  }
  
  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />
    }
    return this.props.children
  }
}
```

#### 2. Try-Catch Pattern
```typescript
const handleAction = async () => {
  try {
    setLoading(true)
    setError(null)
    const result = await apiCall()
    setData(result)
  } catch (error) {
    setError(error instanceof Error ? error.message : 'Erro desconhecido')
    console.error('Action failed:', error)
  } finally {
    setLoading(false)
  }
}
```

### Padrões de Integração com API

#### 1. Axios Instance Configuration
```typescript
// services/api.ts
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use((config) => {
  const token = TokenManager.getAccessToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await refreshToken()
      return api.request(error.config)
    }
    return Promise.reject(error)
  }
)
```

#### 2. Service Layer Pattern
```typescript
// services/praise.service.ts
export const praiseService = {
  async getAll(): Promise<Praise[]> {
    const { data } = await api.get('/praises')
    return data
  },
  
  async send(praiseData: CreatePraiseDto): Promise<Praise> {
    const { data } = await api.post('/praises', praiseData)
    return data
  },
  
  async delete(id: string): Promise<void> {
    await api.delete(`/praises/${id}`)
  },
}
```

### Padrões de Testing (Futuro)

#### 1. Component Testing
```typescript
// Component.test.tsx
describe('Component', () => {
  it('should render correctly', () => {
    render(<Component title="Test" />)
    expect(screen.getByText('Test')).toBeInTheDocument()
  })
  
  it('should handle click', async () => {
    const handleClick = vi.fn()
    render(<Component onClick={handleClick} />)
    
    await userEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledOnce()
  })
})
```

#### 2. Hook Testing
```typescript
// useCounter.test.ts
describe('useCounter', () => {
  it('should increment counter', () => {
    const { result } = renderHook(() => useCounter())
    
    act(() => {
      result.current.increment()
    })
    
    expect(result.current.count).toBe(1)
  })
})
```

## Build & Bundle Patterns

### Vite Configuration
```typescript
// vite.config.ts
export default defineConfig({
  plugins: [
    react(),              // React with SWC
    tailwindcss(),       // TailwindCSS v4
    compression(),       // Gzip/Brotli compression
  ],
  
  build: {
    target: 'esnext',
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'query-vendor': ['@tanstack/react-query'],
        },
      },
    },
  },
  
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      // ... outros aliases
    },
  },
})
```

## Princípios de Desenvolvimento

### SOLID no React
1. **Single Responsibility**: Componentes com uma única responsabilidade
2. **Open/Closed**: Componentes extensíveis via props/composition
3. **Liskov Substitution**: Componentes intercambiáveis
4. **Interface Segregation**: Props específicas, não genéricas
5. **Dependency Inversion**: Depender de abstrações (contexts, hooks)

### Best Practices
1. **Composition over Inheritance**: Sempre preferir composição
2. **Lift State Up**: Estado no menor ancestral comum necessário
3. **Keep Components Small**: Componentes focados e testáveis
4. **Use Custom Hooks**: Extrair lógica complexa para hooks
5. **Avoid Prop Drilling**: Usar Context API quando apropriado
6. **Memoize Expensive Operations**: Usar memo, useMemo, useCallback com parcimônia