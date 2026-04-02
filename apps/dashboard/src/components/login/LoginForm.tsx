import { animated, useSpring } from '@react-spring/web'
import { useCallback, useEffect, useRef, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { EmailInput, PasswordInput } from '@/components/ui'
import { LoginFormData } from '@/types'
import { AnimatedFormError } from './AnimatedFormError'
import { GoogleLoginButton } from './GoogleLoginButton'

interface LoginFormProps {
  formMethods: UseFormReturn<LoginFormData>
  isLoading: boolean
  onSubmit: (data: LoginFormData) => void
  onForgotPasswordClick: () => void
}

export const LoginForm = ({ formMethods, isLoading, onSubmit, onForgotPasswordClick }: LoginFormProps) => {
  const { register, handleSubmit, getValues, formState: { errors, isSubmitting } } = formMethods
  const [isForgotPasswordActive, setIsForgotPasswordActive] = useState(false)
  const emailInputRef = useRef<HTMLInputElement>(null)
  const emailField = register('email')

  const handleEnterSubmit = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return

    const email = getValues('email')?.trim() ?? ''
    const password = getValues('password')?.trim() ?? ''

    if (!email || !password || isSubmitting || isLoading) {
      e.preventDefault()
      return
    }

    e.preventDefault()
    void handleSubmit(onSubmit)()
  }, [getValues, handleSubmit, isLoading, isSubmitting, onSubmit])

  const forgotPasswordUnderlineSpring = useSpring({
    transform: isForgotPasswordActive ? 'scaleX(1)' : 'scaleX(0)',
    opacity: isForgotPasswordActive ? 1 : 0.7,
    config: {
      tension: 180,
      friction: 28,
      clamp: true,
    },
  })

  useEffect(() => {
    if (document.activeElement === emailInputRef.current) {
      emailInputRef.current?.blur()
    }
  }, [])

  return (
    <form className="login-form login-form--compact" onSubmit={handleSubmit(onSubmit)}>
      <EmailInput
        {...emailField}
        ref={(element) => {
          emailField.ref(element)
          emailInputRef.current = element
        }}
        name="email"
        label="Email"
        placeholder="seu@email.com"
        error={errors.email?.message}
        showDomainSuggestions={true}
        disabled={isLoading}
        onKeyDown={handleEnterSubmit}
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
        onKeyDown={handleEnterSubmit}
      />

      <div className="-mt-2 pt-1 flex justify-end">
        <button
          type="button"
          onClick={onForgotPasswordClick}
          disabled={isSubmitting || isLoading}
          onMouseEnter={() => setIsForgotPasswordActive(true)}
          onMouseLeave={() => setIsForgotPasswordActive(false)}
          onFocus={() => setIsForgotPasswordActive(true)}
          onBlur={() => setIsForgotPasswordActive(false)}
          className="login-inline-link"
        >
          Esqueci a senha
          <animated.span
            aria-hidden="true"
            className="pointer-events-none absolute bottom-0 left-0 h-0.5 w-full origin-left rounded-full bg-current"
            style={forgotPasswordUnderlineSpring}
          />
        </button>
      </div>

      <AnimatedFormError message={errors.root?.message} />

      <button
        type="submit"
        disabled={isSubmitting || isLoading}
        className="login-primary-button"
      >
        {isSubmitting || isLoading ? 'Entrando...' : 'Entrar'}
      </button>

      {/* Divider */}
      <div className="relative flex items-center">
        <div className="flex-grow border-t border-gray-200 dark:border-gray-700" />
        <span className="mx-2.5 flex-shrink text-xs uppercase tracking-[0.18em] text-gray-400 dark:text-gray-500">ou</span>
        <div className="flex-grow border-t border-gray-200 dark:border-gray-700" />
      </div>

      <GoogleLoginButton disabled={isSubmitting || isLoading} />
    </form>
  )
}
