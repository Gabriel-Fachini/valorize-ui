import { UseFormReturn } from 'react-hook-form'
import { EmailInput } from '@/components/ui'
import { ForgotPasswordFormData } from '@/types'
import { AnimatedFormError } from './AnimatedFormError'

interface ForgotPasswordFormProps {
  formMethods: UseFormReturn<ForgotPasswordFormData>
  isLoading: boolean
  successEmail: string | null
  onSubmit: (data: ForgotPasswordFormData) => void
  onBackToLogin: () => void
  onTryAgain: () => void
}

export const ForgotPasswordForm = ({
  formMethods,
  isLoading,
  successEmail,
  onSubmit,
  onBackToLogin,
  onTryAgain,
}: ForgotPasswordFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = formMethods

  if (successEmail) {
    return (
      <div className="rounded-3xl border border-green-200 bg-green-50/80 p-6 dark:border-green-500/20 dark:bg-green-500/10">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-green-700 dark:text-green-300">
          Email enviado
        </p>
        <h2 className="mt-3 text-2xl font-semibold text-gray-900 dark:text-white">
          Confira sua caixa de entrada
        </h2>
        <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-300">
          Enviamos um link para redefinir a senha para <span className="font-semibold text-gray-900 dark:text-white">{successEmail}</span>.
          Se não encontrar o e-mail, verifique sua pasta de spam ou solicite um novo envio.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onTryAgain}
          className="inline-flex items-center justify-center rounded-full border border-green-300 bg-white px-5 py-3 text-sm font-semibold text-green-700 transition-colors hover:bg-green-100 dark:border-green-400/30 dark:bg-transparent dark:text-green-300 dark:hover:bg-green-500/10"
          >
            Enviar para outro e-mail
          </button>
          <button
            type="button"
            onClick={onBackToLogin}
            className="inline-flex items-center justify-center rounded-full bg-green-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-green-700"
          >
            Voltar para login
          </button>
        </div>
      </div>
    )
  }

  return (
    <form className="auth-form space-y-3.5 sm:space-y-4.5 xl:space-y-5" onSubmit={handleSubmit(onSubmit)}>
      <EmailInput
        {...register('email')}
        name="email"
        label="Email cadastrado"
        placeholder="seu@email.com"
        error={errors.email?.message}
        showDomainSuggestions={true}
        autoFocus
        disabled={isLoading}
        required
      />

      <AnimatedFormError message={errors.root?.message} />

      <button
        type="submit"
        disabled={isSubmitting || isLoading}
        className="auth-primary-button flex w-full items-center justify-center rounded-lg bg-primary px-6 py-2.5 text-base font-semibold text-white transition-colors hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-white disabled:cursor-not-allowed disabled:opacity-60 dark:focus:ring-offset-gray-950 cursor-pointer"
      >
        {isSubmitting || isLoading ? 'Enviando link...' : 'Enviar link de redefinição'}
      </button>

      <button
        type="button"
        onClick={onBackToLogin}
        className="auth-inline-link w-full text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
      >
        Voltar para login
      </button>
    </form>
  )
}
