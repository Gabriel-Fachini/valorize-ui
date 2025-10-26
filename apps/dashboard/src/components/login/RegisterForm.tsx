import { UseFormReturn } from 'react-hook-form'
import { Input, EmailInput } from '@/components/ui'
import { RegisterFormData } from '@/types'

interface RegisterFormProps {
  formMethods: UseFormReturn<RegisterFormData>
  isLoading: boolean
  onSubmit: (data: RegisterFormData) => void
}

export const RegisterForm = ({ formMethods, isLoading, onSubmit }: RegisterFormProps) => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = formMethods

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <Input
        {...register('name')}
        name="name"
        label="Nome"
        placeholder="Digite seu nome"
        error={errors.name?.message}
        autoFocus
        disabled={isLoading}
        required
      />

      <EmailInput
        {...register('email')}
        name="email"
        label="Email"
        placeholder="seu@email.com"
        error={errors.email?.message}
        showDomainSuggestions={true}
        disabled={isLoading}
        required
      />

      {errors.root && (
        <div className="rounded-xl bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700/50 text-red-700 dark:text-red-300 px-4 py-3">
          {errors.root.message}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting || isLoading}
        className="w-full flex items-center justify-center bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-[#1a1a1a] shadow-lg shadow-green-500/25 hover:shadow-xl hover:shadow-green-500/40 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isSubmitting || isLoading ? 'Cadastrando...' : 'Cadastrar'}
      </button>
    </form>
  )
}
