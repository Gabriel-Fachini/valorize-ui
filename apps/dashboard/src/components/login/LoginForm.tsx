import { UseFormReturn } from 'react-hook-form'
import { EmailInput, PasswordInput } from '@/components/ui'
import { LoginFormData } from '@/types'

interface LoginFormProps {
  formMethods: UseFormReturn<LoginFormData>
  isLoading: boolean
  onSubmit: (data: LoginFormData) => void
}

export const LoginForm = ({ formMethods, isLoading, onSubmit }: LoginFormProps) => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = formMethods

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <EmailInput
        {...register('email')}
        name="email"
        label="Email"
        placeholder="seu@email.com"
        error={errors.email?.message}
        showDomainSuggestions={true}
        autoFocus
        disabled={isLoading}
      />

      <PasswordInput
        {...register('password')}
        name="password"
        label="Senha"
        placeholder="••••••••"
        error={errors.password?.message}
        showToggleVisibility={true}
        showCapsLockWarning={true}
        disabled={isLoading}
      />

      {errors.root && (
        <div className="rounded-xl bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700/50 text-red-700 dark:text-red-300 px-4 py-3">
          {errors.root.message}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting || isLoading}
        className="w-full flex items-center justify-center bg-primary text-white py-3 px-6 rounded-lg font-semibold text-lg hover:bg-primary-600 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-950 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
      >
        {isSubmitting || isLoading ? 'Entrando...' : 'Entrar'}
      </button>
    </form>
  )
}
