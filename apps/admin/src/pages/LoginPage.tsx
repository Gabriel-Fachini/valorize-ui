import { useLoginForm } from '@/hooks/useLoginForm'
import { LoginFormPanel } from '@/components/login'
import { LoadingOverlay } from '@/components/ui/LoadingOverlay'

export const LoginPage = () => {
  const { formMethods, states, handlers } = useLoginForm()

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 relative overflow-hidden">
      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <LoginFormPanel
          formMethods={formMethods}
          isLoading={states.isLoading}
          onSubmit={handlers.onSubmit}
        />
      </div>
      
      {states.isLoading && (
        <LoadingOverlay />
      )}
    </div>
  )
}
