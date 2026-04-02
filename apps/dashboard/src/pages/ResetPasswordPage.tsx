import { useEffect, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { CheckCircle, Loader2, XCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { PasswordInput } from '@/components/ui/Input'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { LoadingOverlay } from '@/components/ui/LoadingOverlay'
import { LoginHeader, LoginIllustrationPanel } from '@/components/login'
import { useAuth } from '@/hooks/useAuth'

type TokenValidationState =
  | { status: 'validating' }
  | { status: 'valid' }
  | { status: 'invalid'; reason: string }
  | { status: 'expired' }

export function ResetPasswordPage() {
  const navigate = useNavigate()
  const { logout } = useAuth()

  const [tokenValidation, setTokenValidation] = useState<TokenValidationState>({
    status: 'validating',
  })
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error'
    message: string
  } | null>(null)

  const passwordErrors = getPasswordErrors(password)
  const passwordsMatch = password === confirmPassword
  const isFormValid = password.length >= 8 && passwordsMatch && passwordErrors.length === 0

  useEffect(() => {
    const validateTokens = () => {
      const hashParams = new URLSearchParams(window.location.hash.substring(1))
      const accessToken = hashParams.get('access_token')
      const tokenType = hashParams.get('type')
      const expiresAt = hashParams.get('expires_at')
      const errorDescription = hashParams.get('error_description')

      if (errorDescription) {
        setTokenValidation({
          status: 'invalid',
          reason: decodeURIComponent(errorDescription),
        })
        return
      }

      if (!accessToken) {
        setTokenValidation({
          status: 'invalid',
          reason: 'Link invalido. Token nao encontrado.',
        })
        return
      }

      if (tokenType !== 'recovery') {
        setTokenValidation({
          status: 'invalid',
          reason: 'Este link nao e valido para redefinicao de senha.',
        })
        return
      }

      if (expiresAt) {
        const expirationTime = parseInt(expiresAt) * 1000
        if (Date.now() > expirationTime) {
          setTokenValidation({ status: 'expired' })
          return
        }
      }

      setTokenValidation({ status: 'valid' })
    }

    validateTokens()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isFormValid) return

    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      const { error } = await supabase.auth.updateUser({
        password,
      })

      if (error) throw error

      setSubmitStatus({
        type: 'success',
        message: 'Senha redefinida com sucesso. Voce sera redirecionado para o login.',
      })

      logout()

      setTimeout(() => {
        navigate({ to: '/login' })
      }, 3000)
    } catch (error: unknown) {
      if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.error('Reset password error:', error)
      }

      setSubmitStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Erro ao redefinir senha. Tente novamente.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      <div className="lg:w-2/5 flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-white dark:bg-[#1a1a1a] relative">
        <div className="max-w-md w-full space-y-8">
          <LoginHeader mode="forgotPassword" />

          {tokenValidation.status === 'validating' ? (
            <div className="rounded-3xl border border-gray-200 bg-gray-50/80 px-6 py-8 text-center dark:border-white/10 dark:bg-white/5">
              <Loader2 className="mx-auto h-8 w-8 animate-spin text-green-600 dark:text-green-400" />
              <p className="mt-4 text-base font-medium text-gray-900 dark:text-white">
                Validando seu link
              </p>
              <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400">
                Estamos conferindo se o link de redefinicao ainda e valido.
              </p>
            </div>
          ) : tokenValidation.status === 'invalid' || tokenValidation.status === 'expired' ? (
            <div className="rounded-3xl border border-red-200 bg-red-50/80 px-6 py-7 dark:border-red-500/20 dark:bg-red-500/10">
              <div className="flex items-start gap-4">
                <div className="mt-1 rounded-full bg-red-100 p-2 text-red-600 dark:bg-red-500/15 dark:text-red-300">
                  <XCircle className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {tokenValidation.status === 'expired' ? 'Link expirado' : 'Link invalido'}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">
                    {tokenValidation.status === 'expired'
                      ? 'Este link de redefinicao expirou. Solicite um novo email para continuar.'
                      : tokenValidation.reason}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate({ to: '/login' })}
                className="mt-6 inline-flex items-center justify-center rounded-full border border-red-200 bg-white px-5 py-3 text-sm font-semibold text-red-700 transition-colors hover:bg-red-100 dark:border-red-400/20 dark:bg-transparent dark:text-red-300 dark:hover:bg-red-500/10"
              >
                Voltar para login
              </button>
            </div>
          ) : (
            <>
              {submitStatus && (
                <Alert variant={submitStatus.type === 'success' ? 'success' : 'error'}>
                  {submitStatus.type === 'success' ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <XCircle className="h-4 w-4" />
                  )}
                  <AlertTitle>{submitStatus.type === 'success' ? 'Senha atualizada' : 'Nao foi possivel concluir'}</AlertTitle>
                  <AlertDescription>{submitStatus.message}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <PasswordInput
                    name="password"
                    label="Nova senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Digite sua nova senha"
                    required
                    disabled={isSubmitting || submitStatus?.type === 'success'}
                  />

                  {password.length > 0 && (
                    <div className="mt-3 rounded-2xl border border-gray-200 bg-gray-50/80 p-4 dark:border-white/10 dark:bg-white/5">
                      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400">
                        Requisitos da senha
                      </p>
                      <div className="space-y-2">
                        <PasswordRequirement met={password.length >= 8} text="Minimo 8 caracteres" />
                        <PasswordRequirement met={/[A-Z]/.test(password)} text="Uma letra maiuscula" />
                        <PasswordRequirement met={/[a-z]/.test(password)} text="Uma letra minuscula" />
                        <PasswordRequirement met={/[0-9]/.test(password)} text="Um numero" />
                        <PasswordRequirement met={/[^A-Za-z0-9]/.test(password)} text="Um caractere especial" />
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <PasswordInput
                    name="confirmPassword"
                    label="Confirmar senha"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirme sua nova senha"
                    required
                    disabled={isSubmitting || submitStatus?.type === 'success'}
                  />

                  {confirmPassword.length > 0 && (
                    <div className="mt-3">
                      <PasswordRequirement met={passwordsMatch} text="As senhas coincidem" />
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={!isFormValid || isSubmitting || submitStatus?.type === 'success'}
                  className="w-full flex items-center justify-center bg-primary text-white py-3 px-6 rounded-lg font-semibold text-lg hover:bg-primary-600 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-950 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isSubmitting ? 'Redefinindo senha...' : submitStatus?.type === 'success' ? 'Senha redefinida' : 'Redefinir senha'}
                </button>

                <div className="rounded-2xl border border-gray-200 bg-gray-50/80 px-5 py-4 text-center dark:border-white/10 dark:bg-white/5">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Lembrou sua senha?
                  </p>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Volte para o login e entre novamente com suas credenciais atualizadas.
                  </p>
                  <button
                    type="button"
                    onClick={() => navigate({ to: '/login' })}
                    className="mt-4 inline-flex items-center justify-center rounded-full border border-green-200 bg-green-50 px-5 py-2.5 text-sm font-semibold text-green-700 transition-colors hover:border-green-300 hover:bg-green-100 dark:border-green-500/30 dark:bg-green-500/10 dark:text-green-300 dark:hover:border-green-400/40 dark:hover:bg-green-500/15"
                  >
                    Voltar para login
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>

      <LoginIllustrationPanel />

      {(tokenValidation.status === 'validating' || isSubmitting) && <LoadingOverlay />}
    </div>
  )
}

function PasswordRequirement({ met, text }: { met: boolean; text: string }) {
  return (
    <div className="flex items-center text-sm">
      {met ? (
        <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
      ) : (
        <XCircle className="mr-2 h-4 w-4 text-gray-300 dark:text-gray-600" />
      )}
      <span className={met ? 'text-green-700 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}>
        {text}
      </span>
    </div>
  )
}

function getPasswordErrors(password: string): string[] {
  const errors: string[] = []

  if (password.length < 8) errors.push('Minimo 8 caracteres')
  if (!/[A-Z]/.test(password)) errors.push('Pelo menos uma letra maiuscula')
  if (!/[a-z]/.test(password)) errors.push('Pelo menos uma letra minuscula')
  if (!/[0-9]/.test(password)) errors.push('Pelo menos um numero')
  if (!/[^A-Za-z0-9]/.test(password)) errors.push('Pelo menos um caractere especial')

  return errors
}
