import { UseFormReturn } from 'react-hook-form'
import { ArrowLeft } from 'lucide-react'
import { Input, EmailInput } from '@/components/ui'
import { RegisterFormData } from '@/types'
import { AnimatedFormError } from './AnimatedFormError'

interface RegisterFormProps {
  formMethods: UseFormReturn<RegisterFormData>
  isLoading: boolean
  onSubmit: (data: RegisterFormData) => void
  onBackToLogin: () => void
}

export const RegisterForm = ({ formMethods, isLoading, onSubmit, onBackToLogin }: RegisterFormProps) => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = formMethods

  return (
    <form className="auth-form space-y-3.5 sm:space-y-4.5 xl:space-y-5" onSubmit={handleSubmit(onSubmit)}>
      <button
        type="button"
        onClick={onBackToLogin}
        className="auth-inline-link auth-back-link inline-flex h-10 w-fit items-center justify-center gap-2 rounded-full border border-gray-200 bg-white/80 px-4 text-sm font-semibold leading-none text-gray-700 shadow-sm transition-all duration-200 hover:cursor-pointer hover:border-gray-300 hover:bg-gray-50 hover:text-gray-950 dark:border-white/10 dark:bg-white/5 dark:text-gray-300 dark:hover:border-white/20 dark:hover:bg-white/10 dark:hover:text-white"
      >
        <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span className="flex items-center leading-none">Voltar para login</span>
      </button>

      <Input
        {...register('name')}
        name="name"
        label="Nome"
        placeholder="Digite seu nome"
        error={errors.name?.message}
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
