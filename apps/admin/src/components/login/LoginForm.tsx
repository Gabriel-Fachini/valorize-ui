import { UseFormReturn } from 'react-hook-form'
import { EmailInput, PasswordInput } from '@/components/ui/Input'
import { LoginFormData } from '@/types'

interface LoginFormProps {
  formMethods: UseFormReturn<LoginFormData>
  isLoading: boolean
  onSubmit: (data: LoginFormData) => void
}

export const LoginForm = ({ formMethods, isLoading, onSubmit }: LoginFormProps) => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = formMethods

  return (
    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-4">
        <EmailInput
          {...register('email')}
          name="email"
          label="Email Administrativo"
          placeholder="admin@valorize.com"
          error={errors.email?.message}
          showDomainSuggestions={true}
          autoFocus
          disabled={isLoading}
        />

        <PasswordInput
          {...register('password')}
          name="password"
          label="Senha de Acesso"
          placeholder="••••••••"
          error={errors.password?.message}
          showToggleVisibility={true}
          showCapsLockWarning={true}
          disabled={isLoading}
        />
      </div>

      {errors.root && (
        <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-300 px-4 py-3 text-sm">
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>{errors.root.message}</span>
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting || isLoading}
        className="w-full flex items-center justify-center bg-primary-500 text-black py-3 px-6 rounded-lg font-semibold text-base hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200"
      >
        {isSubmitting || isLoading ? (
          <span className="flex items-center space-x-2">
            <i className="ph-bold ph-spinner-gap" />
            <span>Autenticando...</span>
          </span>
        ) : (
          <span className="flex items-center space-x-2">
            <span>Entrar</span>
            <i className="ph-bold ph-arrow-right" />
          </span>
        )}
      </button>
    </form>
  )
}
