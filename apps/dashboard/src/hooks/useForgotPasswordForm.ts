import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { supabase } from '@/lib/supabase'
import { ForgotPasswordFormData, forgotPasswordFormSchema } from '@/types'

export const useForgotPasswordForm = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [successEmail, setSuccessEmail] = useState<string | null>(null)

  const formMethods = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordFormSchema),
    mode: 'onBlur',
  })

  const { setError, clearErrors, reset } = formMethods

  const onSubmit = async (data: ForgotPasswordFormData) => {
    clearErrors()
    setIsLoading(true)

    try {
      const redirectTo = new URL('/reset-password', window.location.origin).toString()
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo,
      })

      if (error) {
        throw error
      }

      setSuccessEmail(data.email)
      reset({ email: data.email })
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : 'Nao foi possivel enviar o email de redefinicao. Tente novamente.'

      setError('root', {
        type: 'manual',
        message,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const resetState = () => {
    setSuccessEmail(null)
    clearErrors()
    reset({ email: '' })
  }

  return {
    formMethods,
    states: { isLoading, successEmail },
    handlers: { onSubmit, resetState },
  }
}
