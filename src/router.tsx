/* eslint-disable react-refresh/only-export-components */
import {
  createRouter,
  createRoute,
  createRootRoute,
  Outlet,
} from '@tanstack/react-router'
import { LoginPage } from '@/pages/LoginPage'
import { HomePage } from '@/pages/HomePage'
import { PraisesPage } from '@/pages/PraisesPage'
import { PrizesPage } from '@/pages/PrizesPage'
import { PrizeDetailsPage } from '@/pages/PrizeDetailsPage'
import { RedemptionsPage } from '@/pages/RedemptionsPage'
import { RedemptionDetailsPage } from '@/pages/RedemptionDetailsPage'
import { SettingsPage } from '@/pages/SettingsPage'
import { TransactionsPage } from '@/pages/TransactionsPage'
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

const prizesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/prizes',
  component: () => (
    <ProtectedRoute>
      <PrizesPage />
    </ProtectedRoute>
  ),
})

const prizeDetailsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/prizes/$prizeId',
  component: () => (
    <ProtectedRoute>
      <PrizeDetailsPage />
    </ProtectedRoute>
  ),
})

const redemptionsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/resgates',
  component: () => (
    <ProtectedRoute>
      <RedemptionsPage />
    </ProtectedRoute>
  ),
})

const redemptionDetailsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/resgates/$redemptionId',
  component: () => (
    <ProtectedRoute>
      <RedemptionDetailsPage />
    </ProtectedRoute>
  ),
})

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/settings',
  component: () => (
    <ProtectedRoute>
      <SettingsPage />
    </ProtectedRoute>
  ),
})

const transactionsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/transacoes',
  component: () => (
    <ProtectedRoute>
      <TransactionsPage />
    </ProtectedRoute>
  ),
})

// Create route tree
const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  homeRoute,
  praisesRoute,
  prizesRoute,
  prizeDetailsRoute,
  redemptionsRoute,
  redemptionDetailsRoute,
  settingsRoute,
  transactionsRoute,
])

export const router = createRouter({ routeTree })