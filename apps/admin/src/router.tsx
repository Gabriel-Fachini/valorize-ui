import { createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router'
// import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { RootComponent } from '@components/RootComponent'
import { ProtectedRoute } from '@components/ProtectedRoute'
import { LoginPage } from '@pages/LoginPage'
import { HomePage } from '@pages/HomePage'
import { ComplimentsAnalyticsPage } from '@pages/ComplimentsAnalyticsPage'

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

// Login route (not protected)
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
})

// Home route (dashboard) - protected
const homeRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: '/home',
  component: HomePage,
})

// Compliments analytics route - protected
const complimentsRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: '/compliments',
  component: ComplimentsAnalyticsPage,
})

// Create the route tree
const routeTree = rootRoute.addChildren([
  loginRoute,
  protectedLayoutRoute.addChildren([
    homeRoute,
    complimentsRoute,
  ]),
])

// Create the router
export const router = createRouter({ routeTree })

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
