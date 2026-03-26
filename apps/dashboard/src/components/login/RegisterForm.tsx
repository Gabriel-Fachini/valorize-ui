import { UseFormReturn } from 'react-hook-form'
import { Input, EmailInput } from '@/components/ui'
import { RegisterFormData } from '@/types'
import { AnimatedFormError } from './AnimatedFormError'

interface RegisterFormProps {
  formMethods: UseFormReturn<RegisterFormData>
  isLoading: boolean
  onSubmit: (data: RegisterFormData) => void
}

export const RegisterForm = ({ formMethods, isLoading, onSubmit }: RegisterFormProps) => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = formMethods

  return (
    <form className="auth-form space-y-3.5 sm:space-y-4.5 xl:space-y-5" onSubmit={handleSubmit(onSubmit)}>
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

      <AnimatedFormError message={errors.root?.message} />

      <button
        type="submit"
        disabled={isSubmitting || isLoading}
        className="auth-primary-button flex w-full items-center justify-center rounded-lg bg-primary px-6 py-2.5 text-base font-semibold text-white transition-colors hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-white disabled:cursor-not-allowed disabled:opacity-60 dark:focus:ring-offset-gray-950 cursor-pointer"
      >
        {isSubmitting || isLoading ? 'Cadastrando...' : 'Cadastrar'}
      </button>
    </form>
  )
}
