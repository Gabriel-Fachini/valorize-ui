import { useState, useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { PasswordInput } from '@/components/ui/Input'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

type TokenValidationState =
  | { status: 'validating' }
  | { status: 'valid' }
  | { status: 'invalid'; reason: string }
  | { status: 'expired' }

export function OnboardingPage() {
  const navigate = useNavigate()
  const { logout } = useAuth()

  // Estados principais
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

  // Validações de senha
  const passwordErrors = getPasswordErrors(password)
  const passwordsMatch = password === confirmPassword
  const isFormValid = password.length >= 8 && passwordsMatch && passwordErrors.length === 0

  // 1. VALIDAR TOKENS NA URL (useEffect)
  useEffect(() => {
    const validateTokens = () => {
      // Extrai hash params
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

      // Validação 1: Token existe?
      if (!accessToken) {
        setTokenValidation({
          status: 'invalid',
          reason: 'Link inválido. Token não encontrado.',
        })
        return
      }

      // Validação 2: É um token de invite?
      if (tokenType !== 'invite') {
        setTokenValidation({
          status: 'invalid',
          reason: 'Este link não é válido para configuração de conta.',
        })
        return
      }

      // Validação 3: Token expirou?
      if (expiresAt) {
        const expirationTime = parseInt(expiresAt) * 1000 // Unix timestamp em ms
        if (Date.now() > expirationTime) {
          setTokenValidation({
            status: 'expired',
          })
          return
        }
      }

      // Token válido!
      setTokenValidation({ status: 'valid' })
    }

    validateTokens()
  }, [])

  // 2. HANDLER DE SUBMIT
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isFormValid) return

    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      // Define a senha no Supabase
      const { error } = await supabase.auth.updateUser({
        password: password,
      })

      if (error) {
        throw error
      }

      // Sucesso!
      setSubmitStatus({
        type: 'success',
        message: 'Senha definida com sucesso! Redirecionando para login...',
      })

      // Faz logout para forçar novo login
      logout()

      // Redireciona após 3 segundos
      setTimeout(() => {
        navigate({ to: '/login' })
      }, 3000)

    } catch (error: unknown) {
      // eslint-disable-next-line no-console
      console.error('Onboarding error:', error)

      const message = error instanceof Error ? error.message : 'Erro ao definir senha. Tente novamente.'

      setSubmitStatus({
        type: 'error',
        message: message,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // 3. RENDER: Loading state
  if (tokenValidation.status === 'validating') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600 dark:text-blue-400" />
          <p className="text-gray-600 dark:text-gray-400">Validando convite...</p>
        </div>
      </div>
    )
  }

  // 4. RENDER: Token inválido ou expirado
  if (tokenValidation.status === 'invalid' || tokenValidation.status === 'expired') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <img
                src="/logo.svg"
                alt="Valorize Logo"
                className="h-10 dark:hidden"
              />
              <img
                src="/logo1.svg"
                alt="Valorize Logo"
                className="h-10 hidden dark:block"
              />
            </div>
            <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {tokenValidation.status === 'expired' ? 'Convite Expirado' : 'Convite Inválido'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {tokenValidation.status === 'expired'
                ? 'Este convite expirou. Entre em contato com o administrador para receber um novo convite.'
                : tokenValidation.reason}
            </p>
            <Button
              onClick={() => navigate({ to: '/login' })}
              className="w-full"
            >
              Voltar para Login
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // 5. RENDER: Formulário (token válido)
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-6">
            <img
              src="/logo.svg"
              alt="Valorize Logo"
              className="h-10 dark:hidden"
            />
            <img
              src="/logo1.svg"
              alt="Valorize Logo"
              className="h-10 hidden dark:block"
            />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Complete seu Cadastro
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Defina uma senha forte para acessar sua conta.
          </p>
        </div>

        {/* Alert de sucesso/erro */}
        {submitStatus && (
          <Alert
            variant={submitStatus.type === 'success' ? 'success' : 'error'}
            className={`mb-6 ${submitStatus.type === 'success' ? 'border-green-500 text-green-700 bg-green-50' : ''}`}
          >
            {submitStatus.type === 'success' ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <XCircle className="h-4 w-4" />
            )}
            <AlertTitle>{submitStatus.type === 'success' ? 'Sucesso' : 'Erro'}</AlertTitle>
            <AlertDescription>{submitStatus.message}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Campo: Nova Senha */}
          <div>
            <PasswordInput
              name="password"
              label="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite sua senha"
              required
              disabled={isSubmitting || submitStatus?.type === 'success'}
            />

            {/* Validações de senha */}
            {password.length > 0 && (
              <div className="mt-2 space-y-1">
                <PasswordRequirement
                  met={password.length >= 8}
                  text="Mínimo 8 caracteres"
                />
                <PasswordRequirement
                  met={/[A-Z]/.test(password)}
                  text="Uma letra maiúscula"
                />
                <PasswordRequirement
                  met={/[a-z]/.test(password)}
                  text="Uma letra minúscula"
                />
                <PasswordRequirement
                  met={/[0-9]/.test(password)}
                  text="Um número"
                />
                <PasswordRequirement
                  met={/[^A-Za-z0-9]/.test(password)}
                  text="Um caractere especial"
                />
              </div>
            )}
          </div>

          {/* Campo: Confirmar Senha */}
          <div>
            <PasswordInput
              name="confirmPassword"
              label="Confirmar Senha"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirme sua senha"
              required
              disabled={isSubmitting || submitStatus?.type === 'success'}
            />

            {/* Validação de match */}
            {confirmPassword.length > 0 && (
              <PasswordRequirement
                met={passwordsMatch}
                text="As senhas coincidem"
              />
            )}
          </div>

          {/* Botão de Submit */}
          <Button
            type="submit"
            className="w-full"
            disabled={!isFormValid || isSubmitting || submitStatus?.type === 'success'}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Definindo senha...
              </>
            ) : submitStatus?.type === 'success' ? (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Senha definida!
              </>
            ) : (
              'Definir Senha e Acessar'
            )}
          </Button>
        </form>

        {/* Link para voltar */}
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate({ to: '/login' })}
            className="text-sm text-blue-600 hover:text-blue-700"
            disabled={isSubmitting}
          >
            Voltar para Login
          </button>
        </div>
      </div>
    </div>
  )
}

// 6. COMPONENTE AUXILIAR: Indicador de requisito
function PasswordRequirement({ met, text }: { met: boolean; text: string }) {
  return (
    <div className="flex items-center text-sm">
      {met ? (
        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
      ) : (
        <XCircle className="h-4 w-4 text-gray-300 dark:text-gray-600 mr-2" />
      )}
      <span className={met ? 'text-green-700 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}>
        {text}
      </span>
    </div>
  )
}

// 7. FUNÇÃO AUXILIAR: Validação de senha
function getPasswordErrors(password: string): string[] {
  const errors: string[] = []

  if (password.length < 8) {
    errors.push('Mínimo 8 caracteres')
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Pelo menos uma letra maiúscula')
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Pelo menos uma letra minúscula')
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Pelo menos um número')
  }
  if (!/[^A-Za-z0-9]/.test(password)) {
    errors.push('Pelo menos um caractere especial')
  }

  return errors
}
