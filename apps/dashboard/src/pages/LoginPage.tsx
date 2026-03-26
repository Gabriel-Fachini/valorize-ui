import { useEffect, useState } from 'react'
import { useLoginForm } from '@/hooks/useLoginForm'
import { useRegisterForm } from '@/hooks/useRegisterForm'
import { LoginFormPanel, LoginIllustrationPanel } from '@/components/login'
import { LoadingOverlay } from '@/components/ui/LoadingOverlay'

const OAUTH_ERROR_MESSAGES: Record<string, string> = {
  access_denied: 'Acesso negado. Você recusou a permissão do Google.',
  unauthorized_client: 'Este cliente não está autorizado para login com Google.',
  server_error: 'Erro no servidor de autenticação. Tente novamente.',
}

export const LoginPage = () => {
  const [isRegisterMode, setIsRegisterMode] = useState(false)
  
  const loginForm = useLoginForm()
  const registerForm = useRegisterForm()

  // Detect OAuth errors returned as URL hash params after redirect
  useEffect(() => {
    const hash = window.location.hash
    if (!hash) return

    const params = new URLSearchParams(hash.replace(/^#/, ''))
    const error = params.get('error')
    const description = params.get('error_description')

    if (error) {
      const message =
        OAUTH_ERROR_MESSAGES[error] ??
        (description ? decodeURIComponent(description.replace(/\+/g, ' ')) : 'Erro ao fazer login com Google.')
      
      loginForm.formMethods.setError('root', { message })
      // Clean the URL so the error doesn't persist on refresh
      window.history.replaceState(null, '', window.location.pathname)
    }
  }, [loginForm.formMethods])

  const handleToggleMode = () => {
    setIsRegisterMode(!isRegisterMode)
    loginForm.formMethods.clearErrors()
    registerForm.formMethods.clearErrors()
  }

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      <LoginFormPanel
        formMethods={loginForm.formMethods}
        registerFormMethods={registerForm.formMethods}
        isLoading={loginForm.states.isLoading || registerForm.states.isLoading}
        isRegisterMode={isRegisterMode}
        onSubmit={loginForm.handlers.onSubmit}
        onRegisterSubmit={registerForm.handlers.onSubmit}
        onToggleMode={handleToggleMode}
      />
      
      <LoginIllustrationPanel />
      
      {(loginForm.states.isLoading || registerForm.states.isLoading) && (
        <LoadingOverlay />
      )}
    </div>
  )
}