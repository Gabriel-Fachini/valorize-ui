import { RouterProvider } from '@tanstack/react-router'
import { AppProviders } from '@/contexts/AppProviders'
import { router } from '@/router'

function App() {
  return (
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  )
}

export default App
