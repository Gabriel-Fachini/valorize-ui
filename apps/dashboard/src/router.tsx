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
import { NewPraisePage } from '@/pages/NewPraisePage'
import { PrizesPage } from '@/pages/PrizesPage'
import { PrizeDetailsPage } from '@/pages/PrizeDetailsPage'
import { PrizeConfirmationPage } from '@/pages/PrizeConfirmationPage'
import { RedemptionsPage } from '@/pages/RedemptionsPage'
import { RedemptionDetailsPage } from '@/pages/RedemptionDetailsPage'
import { SettingsPage } from '@/pages/SettingsPage'
import { TransactionsPage } from '@/pages/TransactionsPage'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { OnboardingRouteListener } from '@/components/OnboardingRouteListener'
import { useTheme } from '@hooks/useTheme'

function RootComponent() {
  const { isDark } = useTheme()

  return (
    <div
      id="app"
      className={`min-h-screen ${isDark ? 'dark' : ''} bg-white dark:bg-gray-900`}
    >
      <OnboardingRouteListener />
      <Outlet />
    </div>
  )
}

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
  getParentRoute: () => protectedLayoutRoute,
  path: '/home',
  component: HomePage,
})

const praisesRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: '/elogios',
  component: PraisesPage,
})

const newPraiseRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: '/elogios/novo',
  component: NewPraisePage,
})

const prizesRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: '/prizes',
  component: PrizesPage,
})

const prizeDetailsRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: '/prizes/$prizeId',
  component: PrizeDetailsPage,
})

const prizeConfirmationRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: '/prizes/$prizeId/confirm',
  component: PrizeConfirmationPage,
})

const redemptionsRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: '/resgates',
  component: RedemptionsPage,
})

const redemptionDetailsRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: '/resgates/$redemptionId',
  component: RedemptionDetailsPage,
})

const settingsRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: '/settings',
  component: SettingsPage,
})

const transactionsRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: '/transacoes',
  component: TransactionsPage,
})

// Create route tree with nested protected routes
const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  protectedLayoutRoute.addChildren([
    homeRoute,
    praisesRoute,
    newPraiseRoute,
    prizesRoute,
    prizeDetailsRoute,
    prizeConfirmationRoute,
    redemptionsRoute,
    redemptionDetailsRoute,
    settingsRoute,
    transactionsRoute,
  ]),
])

export const router = createRouter({ routeTree })