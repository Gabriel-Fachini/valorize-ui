import { UseFormReturn } from 'react-hook-form'
import { ArrowLeft } from 'lucide-react'
import { Input, EmailInput } from '@/components/ui'
import { RegisterFormData } from '@/types'
import { AnimatedFormError } from './AnimatedFormError'
import { loginBackButtonClassName, loginFormVariants, loginPrimaryButtonClassName } from './loginStyles'

interface RegisterFormProps {
  formMethods: UseFormReturn<RegisterFormData>
  isLoading: boolean
  onSubmit: (data: RegisterFormData) => void
  onBackToLogin: () => void
}

export const RegisterForm = ({ formMethods, isLoading, onSubmit, onBackToLogin }: RegisterFormProps) => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = formMethods

  return (
    <form className={loginFormVariants()} onSubmit={handleSubmit(onSubmit)}>
      <button
        type="button"
        onClick={onBackToLogin}
        className={loginBackButtonClassName}
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
        className={loginPrimaryButtonClassName}
      >
        {isSubmitting || isLoading ? 'Cadastrando...' : 'Cadastrar'}
      </button>
    </form>
  )
}
