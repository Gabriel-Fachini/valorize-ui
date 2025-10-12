import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuth } from '@hooks/useAuth'
import { useNavigate } from '@tanstack/react-router'
import { EmailInput, PasswordInput } from '@components/ui'
import { LoginFormData, loginFormSchema } from '@types'
import { useSpring, animated, useTransition } from '@react-spring/web'

export const LoginPage = () => {
  const { login, user } = useAuth()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [isExiting, setIsExiting] = useState(false)

  // React Hook Form setup with Zod validation
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    clearErrors,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
    mode: 'onBlur',
  })

  // Redirecionar se já estiver logado
  useEffect(() => {
    if (user) {
      navigate({ to: '/home' })
    }
  }, [user, navigate])

  // Animação do painel esquerdo
  const leftPanelSpring = useSpring({
    transform: isExiting ? 'translateX(-100%)' : 'translateX(0%)',
    opacity: isExiting ? 0 : 1,
    config: { tension: 200, friction: 30 },
  })

  // Animação do painel direito (ilustração)
  const rightPanelSpring = useSpring({
    transform: isExiting ? 'translateX(-50%)' : 'translateX(0%)',
    opacity: isExiting ? 0.5 : 1,
    config: { tension: 200, friction: 30 },
  })

  // Animação do loader
  const loaderTransition = useTransition(isLoading, {
    from: { opacity: 0, transform: 'scale(0.8)' },
    enter: { opacity: 1, transform: 'scale(1)' },
    leave: { opacity: 0, transform: 'scale(0.8)' },
    config: { tension: 260, friction: 20 },
  })

  // Handle form submission
  const onSubmit = async (data: LoginFormData) => {
    clearErrors()
    setIsLoading(true)
    
    const res = await login(data.email, data.password)
    
    if (res.success) {
      setIsExiting(true)
      navigate({ to: '/home' })
    } else {
      setIsLoading(false)
      setError('root', {
        type: 'manual',
        message: res.message ?? 'Email ou senha inválidos',
      })
    }
  }

  return (
    <div className="min-h-screen flex relative overflow-hidden">

      {/* Left Panel - Login Form */}
      <animated.div 
        style={leftPanelSpring}
        className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-[#1a1a1a] relative"
      >
        {/* Loader Overlay - apenas no painel esquerdo */}
        {loaderTransition((style, item) =>
          item ? (
            <animated.div
              style={style}
              className="absolute inset-0 z-50 flex items-center justify-center bg-[#1a1a1a]/95 backdrop-blur-sm"
            >
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full animate-pulse shadow-lg shadow-green-500/50"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white font-bold text-3xl">V</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-3 h-3 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
                <p className="text-gray-300 font-medium">Autenticando...</p>
              </div>
            </animated.div>
          ) : null,
        )}

        <div className="max-w-md w-full space-y-8">
          {/* Logo */}
          <div className="flex items-center">
            <div className="w-64 h-16 flex items-center justify-center mr-3">
              <img src='/logo1.svg' />
            </div>
          </div>

          {/* Header */}
          <div>
            <h2 className="text-4xl font-bold text-white leading-tight">
              Olá,<br />
              <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                Bem-vindo de volta
              </span>
            </h2>
            <p className="mt-3 text-gray-400 text-lg">
              Ei, bem-vindo de volta ao seu lugar especial
            </p>
          </div>

          {/* Login Form */}
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <EmailInput
              {...register('email')}
              name="email"
              label="Email"
              placeholder="seu@email.com"
              error={errors.email?.message}
              showDomainSuggestions={true}
              autoFocus
              disabled={isLoading}
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
            />

            {errors.root && (
              <div className="rounded-xl bg-red-900/30 border border-red-700/50 text-red-300 px-4 py-3">
                {errors.root.message}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting || isLoading}
              className="w-full flex items-center justify-center bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-[#1a1a1a] shadow-lg shadow-green-500/25 hover:shadow-xl hover:shadow-green-500/40 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting || isLoading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          {/* Footer */}
          <div className="text-center">
            <p className="text-gray-400">
              Não tem uma conta?{' '}
              <a href="#" className="text-green-400 hover:text-green-300 font-semibold transition-colors">
                Cadastre-se
              </a>
            </p>
          </div>

          <div className="text-center text-sm text-gray-500 mt-8">
            <p>💡 Digite seu e-mail e senha para entrar</p>
          </div>
        </div>
      </animated.div>

      {/* Right Panel - Illustration */}
      <animated.div 
        style={rightPanelSpring}
        className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 relative overflow-hidden"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 bg-white rounded-full"></div>
          <div className="absolute top-40 right-32 w-20 h-20 bg-white rounded-full"></div>
          <div className="absolute bottom-32 left-16 w-24 h-24 bg-white rounded-full"></div>
          <div className="absolute bottom-20 right-20 w-16 h-16 bg-white rounded-full"></div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 flex items-center justify-center w-full p-12">
          <div className="text-center text-white">
            {/* Phone Mockup */}
            <div className="relative mx-auto mb-8">
              <div className="w-64 h-96 bg-gradient-to-br from-green-400 via-emerald-500 to-teal-500 rounded-3xl shadow-2xl transform rotate-12 hover:rotate-6 transition-transform duration-300">
                <div className="p-6 h-full flex flex-col justify-center items-center">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-lg">
                    <span className="text-2xl">👋</span>
                  </div>
                  <h3 className="text-white font-bold text-xl mb-2">Valorize</h3>
                  <p className="text-white/80 text-sm text-center leading-relaxed">
                    Transforme a cultura da sua empresa com engajamento real
                  </p>
                  <div className="mt-6 flex space-x-2">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <div className="w-2 h-2 bg-white/60 rounded-full"></div>
                    <div className="w-2 h-2 bg-white/60 rounded-full"></div>
                  </div>
                </div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                <span className="text-white font-bold">🎯</span>
              </div>
              <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg animate-bounce" style={{ animationDelay: '150ms' }}>
                <span className="font-bold">✅</span>
              </div>
            </div>

            {/* Text Content */}
            <div className="max-w-md mx-auto">
              <h2 className="text-3xl font-bold mb-4">
                Conecte sua equipe
              </h2>
              <p className="text-xl text-white/90 leading-relaxed">
                Uma plataforma completa para cultura organizacional, 
                engajamento e reconhecimento de talentos.
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 mt-12 max-w-sm mx-auto">
              <div className="text-center">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <span className="text-2xl">🏆</span>
                </div>
                <p className="text-sm text-white/80">Conquistas</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <span className="text-2xl">🎁</span>
                </div>
                <p className="text-sm text-white/80">Recompensas</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <span className="text-2xl">📊</span>
                </div>
                <p className="text-sm text-white/80">Analytics</p>
              </div>
            </div>
          </div>
        </div>
      </animated.div>
    </div>
  )
}