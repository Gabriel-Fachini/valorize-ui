import {
  createRouter,
  createRoute,
  createRootRoute,
  Outlet,
  AnyRoute,
} from '@tanstack/react-router'
import AnimatedLoginPage from '@pages/AnimatedLoginPage'
import AnimatedHomePage from '@pages/AnimatedHomePage'
import PlaygroundPage from '@pages/PlaygroundPage'
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
  component: AnimatedLoginPage,
})

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: AnimatedLoginPage,
})

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/home',
  component: AnimatedHomePage,
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