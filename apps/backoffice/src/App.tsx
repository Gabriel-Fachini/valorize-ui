import { RouterProvider } from '@tanstack/react-router'
import { router } from './router'
import { AppProviders } from './contexts/AppProviders'

function App() {
  return (
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  )
}

export default App
