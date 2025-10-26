import { UseFormReturn } from 'react-hook-form'
import { LoginForm } from './LoginForm'
import { LoginHeader } from './LoginHeader'
import { LoginFormData } from '@/types'

interface LoginFormPanelProps {
  formMethods: UseFormReturn<LoginFormData>
  isLoading: boolean
  onSubmit: (data: LoginFormData) => void
}

export const LoginFormPanel = ({ formMethods, isLoading, onSubmit }: LoginFormPanelProps) => {
  return (
    <div className="w-full max-w-md">
      {/* Admin Login Card */}
      <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-8 sm:p-10">
        
        <LoginHeader />
        
        <div className="mt-8">
          <LoginForm 
            formMethods={formMethods}
            isLoading={isLoading}
            onSubmit={onSubmit}
          />
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200/50 dark:border-gray-700/50">
          <p className="text-center text-xs text-gray-500 dark:text-gray-400">
            Acesso restrito a administradores autorizados
          </p>
        </div>
      </div>
    </div>
  )
}
