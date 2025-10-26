import { createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router'
// import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { DashboardOverview } from '@components/dashboard/DashboardOverview'
import { RootComponent } from '@components/RootComponent'
import { ProtectedRoute } from '@components/ProtectedRoute'

// Create a root route
const rootRoute = createRootRoute({
  component: RootComponent,
})

// Protected layout route that persists across protected pages
const protectedLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'protected',
  component: () => (
    <ProtectedRoute>
      <Outlet />
    </ProtectedRoute>
  ),
})

// Create an index route (dashboard)
const indexRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: '/',
  component: DashboardOverview,
})

// Create the route tree
const routeTree = rootRoute.addChildren([
  protectedLayoutRoute.addChildren([
    indexRoute,
  ]),
])

// Create a new router instance
export const router = createRouter({ routeTree })

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
