import { createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router'
import LoginPage from '@pages/LoginPage'
import HomePage from '@pages/HomePage'

const rootRoute = createRootRoute({
  component: () => (
    <div id="app">
      <Outlet />
    </div>
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
  getParentRoute: () => rootRoute,
  path: '/home',
  component: HomePage,
})

const routeTree = rootRoute.addChildren([indexRoute, loginRoute, homeRoute])

export const router = createRouter({ routeTree })