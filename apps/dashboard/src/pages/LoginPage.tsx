import { useEffect, useState } from 'react'
import { useLoginForm } from '@/hooks/useLoginForm'
import { useRegisterForm } from '@/hooks/useRegisterForm'
import { useForgotPasswordForm } from '@/hooks/useForgotPasswordForm'
import { LoginFormPanel, LoginIllustrationPanel } from '@/components/login'
import { LoadingOverlay } from '@/components/ui/LoadingOverlay'

const OAUTH_ERROR_MESSAGES: Record<string, string> = {
  access_denied: 'Acesso negado. Você recusou a permissão do Google.',
  unauthorized_client: 'Este cliente não está autorizado para login com Google.',
  server_error: 'Erro no servidor de autenticação. Tente novamente.',
}

export const LoginPage = () => {
  const [mode, setMode] = useState<'login' | 'register' | 'forgotPassword'>('login')
  
  const loginForm = useLoginForm()
  const registerForm = useRegisterForm()
  const forgotPasswordForm = useForgotPasswordForm()

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
    setMode((current) => (current === 'register' ? 'login' : 'register'))
    loginForm.formMethods.clearErrors()
    registerForm.formMethods.clearErrors()
    forgotPasswordForm.handlers.resetState()
  }

  const handleShowForgotPassword = () => {
    setMode('forgotPassword')
    loginForm.formMethods.clearErrors()
    registerForm.formMethods.clearErrors()
    forgotPasswordForm.formMethods.clearErrors()
  }

  const handleBackToLogin = () => {
    setMode('login')
    loginForm.formMethods.clearErrors()
    registerForm.formMethods.clearErrors()
    forgotPasswordForm.handlers.resetState()
  }

  return (
    <div className="flex min-h-dvh overflow-hidden relative">
      <LoginFormPanel
        formMethods={loginForm.formMethods}
        registerFormMethods={registerForm.formMethods}
        forgotPasswordFormMethods={forgotPasswordForm.formMethods}
        isLoading={loginForm.states.isLoading || registerForm.states.isLoading || forgotPasswordForm.states.isLoading}
        forgotPasswordSuccessEmail={forgotPasswordForm.states.successEmail}
        mode={mode}
        onSubmit={loginForm.handlers.onSubmit}
        onRegisterSubmit={registerForm.handlers.onSubmit}
        onForgotPasswordSubmit={forgotPasswordForm.handlers.onSubmit}
        onToggleRegisterMode={handleToggleMode}
        onShowForgotPassword={handleShowForgotPassword}
        onBackToLogin={handleBackToLogin}
        onForgotPasswordTryAgain={forgotPasswordForm.handlers.resetState}
      />
      
      <LoginIllustrationPanel />
      
      {(loginForm.states.isLoading || registerForm.states.isLoading || forgotPasswordForm.states.isLoading) && (
        <LoadingOverlay />
      )}
    </div>
  )
}
