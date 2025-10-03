import { RouterProvider } from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from '@/contexts/AuthContext'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { SidebarProvider } from '@/contexts/SidebarContext'
import { AccessibilityProvider } from '@/contexts/AccessibilityContext'
import { OnboardingProvider } from '@/contexts/OnboardingContext'
import { router } from '@/router'

// Create a client with cache configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AccessibilityProvider>
          <SidebarProvider>
            <AuthProvider>
              <OnboardingProvider>
                <RouterProvider router={router} />
              </OnboardingProvider>
            </AuthProvider>
          </SidebarProvider>
        </AccessibilityProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App
