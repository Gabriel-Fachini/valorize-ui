import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { AuthProvider } from '@/contexts/AuthContext'
import { SidebarProvider } from '@/contexts/SidebarContext'
import { ThemeWrapper } from '@/components/ThemeWrapper'
import { Toaster } from '@/components/ui/sonner'

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

interface AppProvidersProps {
  children: React.ReactNode
}

export const AppProviders = ({ children }: AppProvidersProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SidebarProvider>
          <ThemeProvider>
            <ThemeWrapper>
              {children}
              <Toaster
                position="top-right"
                richColors
                theme="dark"
              />
            </ThemeWrapper>
          </ThemeProvider>
        </SidebarProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}
