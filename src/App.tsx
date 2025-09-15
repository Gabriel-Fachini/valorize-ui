import { RouterProvider } from '@tanstack/react-router'
import { AuthProvider } from '@/contexts/AuthContext'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { router } from '@/router'
import DevTools from '@components/DevTools'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <RouterProvider router={router} />
        <DevTools />
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
