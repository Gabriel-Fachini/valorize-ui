/* eslint-disable react-refresh/only-export-components */
import { Suspense, lazy } from 'react'
import {
  createRouter,
  createRoute,
  createRootRoute,
  Outlet,
} from '@tanstack/react-router'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { DevErrorBoundary } from '@/components/DevErrorBoundary'
import { useTheme } from '@hooks/useTheme'
import { z } from 'zod'

const LoginPage = lazy(() => import('@/pages/LoginPage').then((module) => ({ default: module.LoginPage })))
const HomePage = lazy(() => import('@/pages/HomePage').then((module) => ({ default: module.HomePage })))
const PraisesPage = lazy(() => import('@/pages/PraisesPage').then((module) => ({ default: module.PraisesPage })))
const NewPraisePage = lazy(() => import('@/pages/NewPraisePage').then((module) => ({ default: module.NewPraisePage })))
const PrizesPage = lazy(() => import('@/pages/PrizesPage').then((module) => ({ default: module.PrizesPage })))
const PrizeDetailsPage = lazy(() => import('@/pages/PrizeDetailsPage').then((module) => ({ default: module.PrizeDetailsPage })))
const PrizeConfirmationPage = lazy(() => import('@/pages/PrizeConfirmationPage').then((module) => ({ default: module.PrizeConfirmationPage })))
const RedemptionsPage = lazy(() => import('@/pages/RedemptionsPage').then((module) => ({ default: module.RedemptionsPage })))
const RedemptionDetailsPage = lazy(() => import('@/pages/RedemptionDetailsPage').then((module) => ({ default: module.RedemptionDetailsPage })))
const SettingsPage = lazy(() => import('@/pages/SettingsPage').then((module) => ({ default: module.SettingsPage })))
const TransactionsPage = lazy(() => import('@/pages/TransactionsPage').then((module) => ({ default: module.TransactionsPage })))
const NewsPage = lazy(() => import('@/pages/NewsPage').then((module) => ({ default: module.NewsPage })))
const EventsPage = lazy(() => import('@/pages/EventsPage').then((module) => ({ default: module.EventsPage })))
const TrainingPage = lazy(() => import('@/pages/TrainingPage').then((module) => ({ default: module.TrainingPage })))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage').then((module) => ({ default: module.NotFoundPage })))
const ResetPasswordPage = lazy(() => import('@/pages/ResetPasswordPage').then((module) => ({ default: module.ResetPasswordPage })))
const AuthCallbackPage = lazy(() => import('@/pages/AuthCallbackPage').then((module) => ({ default: module.AuthCallbackPage })))

const routeFallback = (
  <div className="min-h-dvh bg-background" />
)

const withSuspense = (Component: React.ComponentType) => () => (
  <Suspense fallback={routeFallback}>
    <Component />
  </Suspense>
)

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
  notFoundComponent: withSuspense(NotFoundPage),
  errorComponent: import.meta.env.DEV ? DevErrorBoundary : undefined,
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
  component: withSuspense(LoginPage),
})

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: withSuspense(LoginPage),
})

const resetPasswordRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/reset-password',
  component: withSuspense(ResetPasswordPage),
})

const authCallbackRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/auth/callback',
  component: withSuspense(AuthCallbackPage),
})

const homeRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: '/home',
  component: withSuspense(HomePage),
})

const praisesRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: '/elogios',
  component: withSuspense(PraisesPage),
})

const newPraiseRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: '/elogios/novo',
  component: withSuspense(NewPraisePage),
  validateSearch: (search: Record<string, unknown>) => {
    return z.object({
      userId: z.string().optional(),
    }).parse(search)
  },
})

const prizesRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: '/prizes',
  component: withSuspense(PrizesPage),
})

const prizeDetailsRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: '/prizes/$prizeId',
  component: withSuspense(PrizeDetailsPage),
  parseParams: (params: { prizeId: string }) => ({
    prizeId: z.string().parse(params.prizeId),
  }),
})

const prizeConfirmationRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: '/prizes/$prizeId/confirm',
  component: withSuspense(PrizeConfirmationPage),
  parseParams: (params: { prizeId: string }) => ({
    prizeId: z.string().parse(params.prizeId),
  }),
  validateSearch: (search: Record<string, unknown>) => {
    return z.object({
      variantId: z.string().optional(),
    }).parse(search)
  },
})

const redemptionsRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: '/resgates',
  component: withSuspense(RedemptionsPage),
})

const redemptionDetailsRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: '/resgates/$redemptionId',
  component: withSuspense(RedemptionDetailsPage),
  parseParams: (params: { redemptionId: string }) => ({
    redemptionId: z.string().parse(params.redemptionId),
  }),
})

const settingsRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: '/settings',
  component: withSuspense(SettingsPage),
})

const transactionsRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: '/transacoes',
  component: withSuspense(TransactionsPage),
})

const newsRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: '/noticias',
  component: withSuspense(NewsPage),
})

const eventsRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: '/eventos',
  component: withSuspense(EventsPage),
})

const trainingRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: '/treinamentos',
  component: withSuspense(TrainingPage),
})

const notFoundRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/404',
  component: withSuspense(NotFoundPage),
})

// Create route tree with nested protected routes
const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  resetPasswordRoute,
  authCallbackRoute,
  notFoundRoute,
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
    newsRoute,
    eventsRoute,
    trainingRoute,
  ]),
])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
