import { UseFormReturn } from 'react-hook-form'
import { LoginFormData } from '@/types'
import { LoginHeader } from './LoginHeader'
import { LoginForm } from './LoginForm'
import { LoginFooter } from './LoginFooter'

interface LoginFormPanelProps {
  formMethods: UseFormReturn<LoginFormData>
  isLoading: boolean
  onSubmit: (data: LoginFormData) => void
}

export const LoginFormPanel = ({ formMethods, isLoading, onSubmit }: LoginFormPanelProps) => {
  return (
    <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-[#1a1a1a] relative">
      <div className="max-w-md w-full space-y-8">
        <LoginHeader />
        
        <LoginForm 
          formMethods={formMethods}
          isLoading={isLoading}
          onSubmit={onSubmit}
        />
        
        <LoginFooter />
      </div>
    </div>
  )
}
