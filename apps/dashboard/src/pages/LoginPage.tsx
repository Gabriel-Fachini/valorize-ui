import { useLoginForm } from '@/hooks/useLoginForm'
import { LoginFormPanel, LoginIllustrationPanel } from '@/components/login'
import { LoadingOverlay } from '@/components/ui/LoadingOverlay'

export const LoginPage = () => {
  const { formMethods, states, handlers } = useLoginForm()

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      <LoginFormPanel
        formMethods={formMethods}
        isLoading={states.isLoading}
        onSubmit={handlers.onSubmit}
      />
      
      <LoginIllustrationPanel />
      
      {states.isLoading && (
        <LoadingOverlay message="Autenticando..." />
      )}
    </div>
  )
}