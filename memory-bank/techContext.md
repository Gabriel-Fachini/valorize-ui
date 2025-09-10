# Tech Context - Valorize UI

## Stack Tecnológico Principal

### Build Tool & Dev Server
**Vite v7.0.4**
- **Escolha**: Performance superior ao Webpack/CRA
- **Hot Module Replacement**: Updates instantâneos durante desenvolvimento
- **ESBuild**: Transpilação 10-100x mais rápida
- **Bundle Splitting**: Otimização automática de chunks
- **Development Speed**: Cold start < 500ms

### UI Framework
**React v19.1.0**
- **Versão**: Latest stable (React 19)
- **Rendering**: Client-side com SSR preparado
- **Concurrent Features**: Suspense, Transitions
- **Hooks**: Estado e efeitos modernos
- **TypeScript**: Suporte first-class

### Linguagem & Type System
**TypeScript v5.8.3**
- **Strict Mode**: Type safety máximo
- **Path Aliases**: Imports limpos com @
- **Type Inference**: Minimal type annotations
- **Generics**: Componentes fortemente tipados

### Estilização
**TailwindCSS v4.1.11**
- **Nova versão**: v4 com performance melhorada
- **JIT Mode**: Apenas CSS usado é gerado
- **Dark Mode**: Suporte nativo com classes
- **Custom Design System**: Tokens personalizados
- **Vite Integration**: Plugin oficial @tailwindcss/vite

### Roteamento
**TanStack Router v1.130.12**
- **Type-Safe**: Rotas 100% type-safe
- **File-Based**: Suporte a rotas baseadas em arquivos
- **Code Splitting**: Lazy loading automático
- **Search Params**: Type-safe query strings
- **Nested Routes**: Layouts compartilhados

### Estado & Data Fetching
**TanStack Query v5.84.1** (React Query)
- **Server State**: Cache inteligente
- **Background Refetch**: Dados sempre frescos
- **Optimistic Updates**: UI responsiva
- **Infinite Queries**: Scroll infinito
- **Mutations**: Gerenciamento de side effects

### HTTP Client
**Axios v1.11.0**
- **Interceptors**: Auth headers automáticos
- **Retry Logic**: Tentativas em falhas
- **Request/Response Transform**: Serialização
- **Cancel Tokens**: Cancelamento de requests
- **Progress Tracking**: Upload/download progress

## Dependências Detalhadas

### Dependencies (Produção)
```json
{
  "@tailwindcss/vite": "^4.1.11",      // TailwindCSS Vite plugin
  "@tanstack/react-query": "^5.84.1",   // Server state management
  "@tanstack/react-router": "^1.130.12", // Type-safe routing
  "axios": "^1.11.0",                   // HTTP client
  "react": "^19.1.0",                   // UI library
  "react-dom": "^19.1.0",               // React DOM renderer
  "tailwindcss": "^4.1.11"              // Utility-first CSS
}
```

### DevDependencies (Desenvolvimento)
```json
{
  "@eslint/js": "^9.32.0",              // ESLint core
  "@types/node": "^24.2.0",             // Node.js types
  "@types/react": "^19.1.8",            // React types
  "@types/react-dom": "^19.1.6",        // React DOM types
  "@vitejs/plugin-react-swc": "^3.10.2", // React plugin with SWC
  "eslint": "^9.32.0",                  // Linting
  "eslint-plugin-react": "^7.37.5",     // React linting rules
  "eslint-plugin-react-hooks": "^5.2.0", // Hooks linting
  "eslint-plugin-react-refresh": "^0.4.20", // HMR linting
  "globals": "^16.3.0",                 // Global variables
  "jiti": "^2.5.1",                     // Just-in-time TS compiler
  "typescript": "~5.8.3",               // TypeScript compiler
  "typescript-eslint": "^8.39.0",       // TS ESLint
  "vite": "^7.0.4",                     // Build tool
  "vite-plugin-compression": "^0.5.1"   // Gzip/Brotli compression
}
```

## Configuração de Desenvolvimento

### TypeScript Configuration
```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    
    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    
    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    
    /* Path aliases */
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@components/*": ["./src/components/*"],
      "@pages/*": ["./src/pages/*"],
      "@hooks/*": ["./src/hooks/*"],
      "@services/*": ["./src/services/*"],
      "@helpers/*": ["./src/helpers/*"],
      "@assets/*": ["./src/assets/*"],
      "@types": ["./src/types"],
      "@contexts/*": ["./src/contexts/*"]
    }
  }
}
```

### Vite Configuration
```typescript
// vite.config.ts - Configuração detalhada
export default defineConfig({
  plugins: [
    react(),                // SWC para compilação 3-10x mais rápida
    tailwindcss(),         // TailwindCSS v4 plugin
    compression({          // Gzip compression
      algorithm: 'gzip',
      threshold: 1024,
    }),
    compression({          // Brotli compression (melhor ratio)
      algorithm: 'brotliCompress',
      ext: '.br',
    }),
  ],
  
  server: {
    port: 3000,            // Porta padrão React
    open: true,            // Abrir browser automaticamente
    cors: true,            // Habilitar CORS
    proxy: {               // Proxy para API backend
      '/api': {
        target: process.env.VITE_API_URL,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  
  build: {
    target: 'esnext',      // Browsers modernos
    minify: 'esbuild',     // Minificação rápida
    sourcemap: false,      // Sem sourcemaps em produção
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'query-vendor': ['@tanstack/react-query'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      '@tanstack/react-query',
      '@tanstack/react-router',
    ],
  },
})
```

### Environment Variables
```env
# .env.local
VITE_API_BASE_URL=http://localhost:3001/api
VITE_API_URL=http://localhost:3001
VITE_AUTH0_DOMAIN=your-domain.auth0.com
VITE_AUTH0_CLIENT_ID=your-client-id
VITE_AUTH0_AUDIENCE=your-api-identifier
VITE_ENVIRONMENT=development
```

### Scripts de Desenvolvimento
```json
{
  "dev": "vite",                    // Dev server com HMR
  "build": "tsc -b && vite build",  // Type check + build
  "lint": "eslint . && tsc --noEmit", // Lint + type check
  "lint:fix": "eslint . --fix",     // Auto-fix linting [[memory:use-eslint]]
  "preview": "vite preview"         // Preview build local
}
```

## Arquitetura de Componentes

### Component Library Strategy
- **Headless Components**: Lógica separada da apresentação
- **Compound Components**: Componentes compostos para flexibilidade
- **Render Props**: Quando necessário controle fino
- **Custom Hooks**: Reutilização de lógica

### Design System
```typescript
// Tokens de design centralizados
const theme = {
  colors: {
    primary: {
      50: '#eff6ff',
      500: '#3b82f6',
      900: '#1e3a8a',
    },
    // ... outras cores
  },
  spacing: {
    xs: '0.5rem',
    sm: '1rem',
    md: '1.5rem',
    lg: '2rem',
    xl: '3rem',
  },
  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      mono: ['Fira Code', 'monospace'],
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
    },
  },
}
```

## Performance Optimizations

### Bundle Optimization
1. **Code Splitting**: Rotas e componentes pesados
2. **Tree Shaking**: Eliminação de código morto
3. **Minification**: esbuild para minificação rápida
4. **Compression**: Gzip + Brotli para assets
5. **Asset Optimization**: Imagens otimizadas e lazy loaded

### Runtime Performance
1. **React 19 Features**: Concurrent rendering
2. **Memo & Callbacks**: Prevenção de re-renders
3. **Virtual Scrolling**: Para listas grandes
4. **Debouncing**: Para inputs e searches
5. **Suspense**: Loading states granulares

### Network Optimization
1. **HTTP/2 Push**: Server push para assets críticos
2. **Prefetching**: Links prefetched on hover
3. **Service Worker**: Cache offline (futuro)
4. **CDN**: Assets servidos via CDN
5. **API Caching**: React Query cache strategy

## Browser Support

### Target Browsers
```
Chrome >= 90
Firefox >= 88
Safari >= 14
Edge >= 90
```

### Polyfills
- Nenhum polyfill necessário para browsers-alvo
- Features modernas usadas nativamente

## Security

### Content Security Policy
```typescript
// Headers de segurança
{
  "Content-Security-Policy": "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';",
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin"
}
```

### Authentication & Authorization
- **JWT Tokens**: Stored em localStorage (com refresh strategy)
- **HTTPS Only**: Todas as comunicações encriptadas
- **CORS**: Configurado para domínios específicos
- **Input Sanitization**: XSS prevention

## Testing Infrastructure (Planejado)

### Testing Stack
- **Vitest**: Test runner (mais rápido que Jest)
- **React Testing Library**: Component testing
- **MSW**: API mocking
- **Playwright**: E2E testing

### Coverage Goals
- **Unit Tests**: 80% coverage
- **Integration Tests**: Critical paths
- **E2E Tests**: Main user flows

## Monitoring & Analytics (Futuro)

### Performance Monitoring
- **Web Vitals**: Core Web Vitals tracking
- **Sentry**: Error tracking
- **LogRocket**: Session replay

### Analytics
- **Google Analytics 4**: User behavior
- **Mixpanel**: Product analytics
- **Custom Events**: Business metrics

## CI/CD Pipeline (Planejado)

### Build Pipeline
```yaml
# GitHub Actions
- Type checking (TypeScript)
- Linting (ESLint)
- Testing (Vitest)
- Build (Vite)
- Deploy (Vercel/Netlify)
```

### Deployment
- **Preview**: Branch previews automáticos
- **Staging**: Ambiente de homologação
- **Production**: Deploy com rollback automático

## Decisões Técnicas Importantes

### Por que Vite?
1. **Speed**: 10-100x mais rápido que Webpack
2. **DX**: Hot Module Replacement instantâneo
3. **Modern**: ES modules nativos
4. **Ecosystem**: Plugins maduros

### Por que TanStack (React Query + Router)?
1. **Type Safety**: 100% type-safe
2. **Performance**: Bundle size otimizado
3. **DX**: APIs modernas e intuitivas
4. **Community**: Mantido ativamente

### Por que TailwindCSS v4?
1. **Performance**: 10x mais rápido que v3
2. **DX**: Melhor intellisense
3. **Flexibility**: Custom design system fácil
4. **Maintenance**: Menos CSS customizado

### Por que React 19?
1. **Concurrent Features**: Better UX
2. **Server Components**: Ready for future
3. **Performance**: Automatic batching
4. **Hooks**: Novos hooks úteis

## Evolução Técnica

### Próximas Adições
1. **PWA Support**: Offline capabilities
2. **i18n**: Internacionalização
3. **Web Components**: Componentes compartilháveis
4. **Micro-frontends**: Preparação para scale
5. **WebAssembly**: Para features pesadas

### Considerações Futuras
- **Next.js Migration**: Se SSR/SSG necessário
- **React Native**: App mobile
- **Electron**: App desktop
- **GraphQL**: Se API crescer muito