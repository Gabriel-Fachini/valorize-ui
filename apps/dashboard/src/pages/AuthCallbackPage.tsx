import { useEffect, useRef, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { supabase } from '@/lib/supabase'
import { loginWithGoogleToken } from '@/services/auth'
import { useAuth } from '@/hooks/useAuth'
import { LoadingOverlay } from '@/components/ui/LoadingOverlay'

const waitForSupabaseSession = async () => {
  for (let attempt = 0; attempt < 10; attempt += 1) {
    const { data, error } = await supabase.auth.getSession()

    if (error) {
      throw error
    }

    if (data.session) {
      return data.session
    }

    await new Promise((resolve) => window.setTimeout(resolve, 250))
  }

  throw new Error('Sessão do Supabase não encontrada')
}

export const AuthCallbackPage = () => {
  const navigate = useNavigate()
  const { finishLogin } = useAuth()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const hasStartedRef = useRef(false)

  useEffect(() => {
    if (hasStartedRef.current) return
    hasStartedRef.current = true

    const run = async () => {
      try {
        const session = await waitForSupabaseSession()
        const response = await loginWithGoogleToken(session.access_token, session.refresh_token)

        if (!response.success) {
          throw new Error(response.message || 'Falha ao autenticar no backend')
        }

        finishLogin(response.data)
        navigate({ to: '/home', replace: true })
      } catch (error) {
        const message = error instanceof Error ? error.message : ''
        const isUnauthorized = /403|forbidden|not allowed|não autorizad|nao autorizad/i.test(message)

        setErrorMessage(
          isUnauthorized
            ? 'Sua conta Google foi autenticada, mas não está habilitada para acessar o Valorize.'
            : 'Não foi possível concluir o login com Google.',
        )

        await supabase.auth.signOut()
        navigate({
          to: '/login',
          search: { error: isUnauthorized ? 'google_not_allowed' : 'google_login_failed' },
          replace: true,
        })
      }
    }

    void run()
  }, [finishLogin, navigate])

  return (
    <div className="relative flex min-h-dvh items-center justify-center bg-white dark:bg-[#1a1a1a]">
      <LoadingOverlay />
      {errorMessage && (
        <p className="absolute bottom-12 left-1/2 w-full max-w-md -translate-x-1/2 px-6 text-center text-sm text-red-600 dark:text-red-400">
          {errorMessage}
        </p>
      )}
    </div>
  )
}
