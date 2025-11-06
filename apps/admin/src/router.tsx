import { createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router'
// import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { RootComponent } from '@components/RootComponent'
import { ProtectedRoute } from '@components/ProtectedRoute'
import { LoginPage } from '@pages/LoginPage'
import { HomePage } from '@pages/HomePage'
import { ComplimentsAnalyticsPage } from '@pages/ComplimentsAnalyticsPage'
import { SettingsPage } from '@pages/SettingsPage'
import { UsersPage } from '@pages/UsersPage'
import { UserDetailPage } from '@pages/UserDetailPage'
import { EconomyPage } from '@pages/EconomyPage'
import { RolesPage } from '@pages/RolesPage'
import { RoleDetailPage } from '@pages/RoleDetailPage'
import { VouchersPage } from '@pages/VouchersPage'
import { VoucherDetailPage } from '@pages/VoucherDetailPage'
import { PrizesPage } from '@pages/PrizesPage'
import { PrizeNewPage } from '@pages/PrizeNewPage'
import { PrizeDetailPage } from '@pages/PrizeDetailPage'

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
const defaultRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: '/',
  component: HomePage,
})

// Compliments analytics route - protected
const complimentsRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: '/compliments',
  component: ComplimentsAnalyticsPage,
})

// Economy route - protected
const economyRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: '/economy',
  component: EconomyPage,
})

// Users routes - protected
const usersRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: '/users',
  component: UsersPage,
})

const userDetailRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: '/users/$userId',
  component: UserDetailPage,
})

// Roles routes - protected
const rolesRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: '/roles',
  component: RolesPage,
})

const roleDetailRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: '/roles/$roleId',
  component: RoleDetailPage,
})

// Vouchers routes - protected
const vouchersRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: '/vouchers',
  component: VouchersPage,
})

const voucherDetailRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: '/vouchers/$voucherId',
  component: VoucherDetailPage,
})

// Prizes routes - protected
const prizesRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: '/prizes',
  component: PrizesPage,
})

const prizeNewRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: '/prizes/new',
  component: PrizeNewPage,
})

const prizeDetailRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: '/prizes/$prizeId',
  component: PrizeDetailPage,
})

// Settings layout route - protected
const settingsLayoutRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: '/settings',
  component: SettingsPage,
})

// Settings routes - protected
// Note: Paths are relative to parent route (/settings)
const settingsBasicInfoRoute = createRoute({
  getParentRoute: () => settingsLayoutRoute,
  path: 'basic-info',
  component: SettingsPage,
})

const settingsValuesRoute = createRoute({
  getParentRoute: () => settingsLayoutRoute,
  path: 'values',
  component: SettingsPage,
})

const settingsDomainsRoute = createRoute({
  getParentRoute: () => settingsLayoutRoute,
  path: 'domains',
  component: SettingsPage,
})

const settingsCoinEconomyRoute = createRoute({
  getParentRoute: () => settingsLayoutRoute,
  path: 'coin-economy',
  component: SettingsPage,
})

// Create the route tree
const routeTree = rootRoute.addChildren([
  loginRoute,
  protectedLayoutRoute.addChildren([
    defaultRoute,
    homeRoute,
    complimentsRoute,
    economyRoute,
    usersRoute,
    userDetailRoute,
    rolesRoute,
    roleDetailRoute,
    vouchersRoute,
    voucherDetailRoute,
    prizesRoute,
    prizeNewRoute,
    prizeDetailRoute,
    settingsLayoutRoute.addChildren([
      settingsBasicInfoRoute,
      settingsValuesRoute,
      settingsDomainsRoute,
      settingsCoinEconomyRoute,
    ]),
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
