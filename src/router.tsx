import {
  createRouter,
  createRoute,
  createRootRoute,
  Outlet,
  AnyRoute,
} from '@tanstack/react-router'
import { LoginPage } from '@/pages/LoginPage'
import { HomePage } from '@/pages/HomePage'
import PlaygroundPage from '@pages/PlaygroundPage'
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

// Playground route - only available in development
const playgroundRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/playground',
  component: PlaygroundPage,
})

// Create route tree based on environment
const routes: AnyRoute[] = [indexRoute, loginRoute, homeRoute]

// Add playground route only in development
if (import.meta.env.DEV) {
  routes.push(playgroundRoute)
}

const routeTree = rootRoute.addChildren(routes)

export const router = createRouter({ routeTree })