import { useState } from 'react'
import { useLoginForm } from '@/hooks/useLoginForm'
import { useRegisterForm } from '@/hooks/useRegisterForm'
import { LoginFormPanel, LoginIllustrationPanel } from '@/components/login'
import { LoadingOverlay } from '@/components/ui/LoadingOverlay'

export const LoginPage = () => {
  const [isRegisterMode, setIsRegisterMode] = useState(false)
  
  const loginForm = useLoginForm()
  const registerForm = useRegisterForm()

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