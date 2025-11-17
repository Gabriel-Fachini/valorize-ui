import { createRouter, createRoute, createRootRoute, redirect } from '@tanstack/react-router'
import { LoginPage } from '@/pages/LoginPage'
import { HomePage } from '@/pages/HomePage'
import { CompaniesPage } from '@/pages/CompaniesPage'
import { CreateCompanyPage } from '@/pages/CreateCompanyPage'
import { CompanyDetailsPage } from '@/pages/CompanyDetailsPage'
import { AuditLogsPage } from '@/pages/AuditLogsPage'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { DevErrorBoundary } from '@/components/DevErrorBoundary'

// Root route
const rootRoute = createRootRoute()

// Login route
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
})

// Home route (protected)
const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/home',
  component: () => (
    <ProtectedRoute>
      <HomePage />
    </ProtectedRoute>
  ),
})

// Index route (redirect to home)
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  beforeLoad: () => {
    throw redirect({ to: '/home' })
  },
})

// Companies routes
const clientsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/clients',
  component: () => (
    <ProtectedRoute>
      <CompaniesPage />
    </ProtectedRoute>
  ),
})

const createClientRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/clients/new',
  component: () => (
    <ProtectedRoute>
      <CreateCompanyPage />
    </ProtectedRoute>
  ),
})

const clientDetailsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/clients/$id',
  component: () => (
    <ProtectedRoute>
      <CompanyDetailsPage />
    </ProtectedRoute>
  ),
})

const contractsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/contracts',
  component: () => (
    <ProtectedRoute>
      <div className="p-8">
        <h1 className="text-2xl font-bold">Contratos</h1>
        <p className="mt-2 text-muted-foreground">Página em desenvolvimento</p>
      </div>
    </ProtectedRoute>
  ),
})

const vouchersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/vouchers',
  component: () => (
    <ProtectedRoute>
      <div className="p-8">
        <h1 className="text-2xl font-bold">Vouchers</h1>
        <p className="mt-2 text-muted-foreground">Página em desenvolvimento</p>
      </div>
    </ProtectedRoute>
  ),
})

const metricsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/metrics',
  component: () => (
    <ProtectedRoute>
      <div className="p-8">
        <h1 className="text-2xl font-bold">Métricas</h1>
        <p className="mt-2 text-muted-foreground">Página em desenvolvimento</p>
      </div>
    </ProtectedRoute>
  ),
})

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/settings',
  component: () => (
    <ProtectedRoute>
      <div className="p-8">
        <h1 className="text-2xl font-bold">Configurações</h1>
        <p className="mt-2 text-muted-foreground">Página em desenvolvimento</p>
      </div>
    </ProtectedRoute>
  ),
})

const auditLogsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/audit-logs',
  component: () => (
    <ProtectedRoute>
      <AuditLogsPage />
    </ProtectedRoute>
  ),
})

// Create route tree
const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  homeRoute,
  clientsRoute,
  createClientRoute,
  clientDetailsRoute,
  contractsRoute,
  vouchersRoute,
  metricsRoute,
  settingsRoute,
  auditLogsRoute,
])

// Create and export router
export const router = createRouter({
  routeTree,
  // Show detailed error component in development for easier debugging
  defaultErrorComponent: import.meta.env.DEV ? DevErrorBoundary : undefined,
})

// Register router for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
