import {
  createRouter,
  createRoute,
  createRootRoute,
  Outlet,
} from '@tanstack/react-router'
import { LoginPage } from '@/pages/LoginPage'
import { HomePage } from '@/pages/HomePage'
import { PraisesPage } from '@/pages/PraisesPage'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { useTheme } from '@hooks/useTheme'

function RootComponent() {
  const { isDark } = useTheme()

  return (
    <div
      id="app"
      className={`min-h-screen ${isDark ? 'dark' : ''} bg-white dark:bg-gray-900`}
    >
      <Outlet />
    </div>
  )
}

const rootRoute = createRootRoute({
  component: RootComponent,
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: LoginPage,
})

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
})

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/home',
  component: () => (
    <ProtectedRoute>
      <HomePage />
    </ProtectedRoute>
  ),
})

const praisesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/elogios',
  component: () => (
    <ProtectedRoute>
      <PraisesPage />
    </ProtectedRoute>
  ),
})

// Create route tree
const routeTree = rootRoute.addChildren([indexRoute, loginRoute, homeRoute, praisesRoute])

export const router = createRouter({ routeTree })