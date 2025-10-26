import { Outlet } from '@tanstack/react-router'
import { AppProviders } from '@/contexts/AppProviders'

export function RootComponent() {
  return (
    <AppProviders>
      <div id="app">
        <Outlet />
      </div>
    </AppProviders>
  )
}
