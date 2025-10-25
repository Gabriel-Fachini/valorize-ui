import { createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router'
// import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { AdminLayout } from '@components/layout/AdminLayout'
import { DashboardOverview } from '@components/dashboard/DashboardOverview'

// Create a root route
const rootRoute = createRootRoute({
  component: () => (
    <>
      <div className="min-h-screen bg-background">
        <AdminLayout>
          <Outlet />
        </AdminLayout>
      </div>
      {/* <TanStackRouterDevtools /> */}
    </>
  ),
})

// Create an index route
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: DashboardOverview,
})

// Create the route tree
const routeTree = rootRoute.addChildren([indexRoute])

// Create a new router instance
export const router = createRouter({ routeTree })

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
