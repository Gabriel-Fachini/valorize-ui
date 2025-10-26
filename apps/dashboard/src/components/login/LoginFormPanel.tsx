import { UseFormReturn } from 'react-hook-form'
import { LoginFormData, RegisterFormData } from '@/types'
import { LoginHeader } from './LoginHeader'
import { LoginForm } from './LoginForm'
import { RegisterForm } from './RegisterForm'

interface LoginFormPanelProps {
  formMethods: UseFormReturn<LoginFormData>
  registerFormMethods: UseFormReturn<RegisterFormData>
  isLoading: boolean
  isRegisterMode: boolean
  onSubmit: (data: LoginFormData) => void
  onRegisterSubmit: (data: RegisterFormData) => void
  onToggleMode: () => void
}

export const LoginFormPanel = ({ 
  formMethods, 
  registerFormMethods,
  isLoading, 
  isRegisterMode,
  onSubmit, 
  onRegisterSubmit,
  onToggleMode, 
}: LoginFormPanelProps) => {
  return (
    <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-white dark:bg-[#1a1a1a] relative">
      <div className="max-w-md w-full space-y-8">
        <LoginHeader isRegisterMode={isRegisterMode} />
        
        {isRegisterMode ? (
          <RegisterForm 
            formMethods={registerFormMethods}
            isLoading={isLoading}
            onSubmit={onRegisterSubmit}
          />
        ) : (
          <LoginForm 
            formMethods={formMethods}
            isLoading={isLoading}
            onSubmit={onSubmit}
          />
        )}

        {/* Toggle between login and register */}
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">
            {isRegisterMode ? 'Já tem uma conta?' : 'Não tem uma conta?'}
            <button
              type="button"
              onClick={onToggleMode}
              className="ml-2 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-semibold transition-colors"
            >
              {isRegisterMode ? 'Fazer login' : 'Cadastrar-se'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
