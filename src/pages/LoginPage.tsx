import { useEffect } from 'react'
import { useAuth } from '@hooks/useAuth'
import { useNavigate } from '@tanstack/react-router'

const LoginPage = () => {
  const { login, user, isLoading } = useAuth()
  const navigate = useNavigate()

  // Redirecionar se já estiver logado
  useEffect(() => {
    if (user) {
      navigate({ to: '/home' })
    }
  }, [user, navigate])

  const handleLogin = async () => {
    await login()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-md w-full space-y-8">
          {/* Logo */}
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center mr-3">
              <span className="text-white font-bold text-lg">V</span>
            </div>
            <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">Valorize</span>
          </div>

          {/* Header */}
          <div>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 leading-tight">
              Olá,<br />
              <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Bem-vindo de volta
              </span>
            </h2>
            <p className="mt-3 text-gray-600 dark:text-gray-300 text-lg">
              Ei, bem-vindo de volta ao seu lugar especial
            </p>
          </div>

          {/* Auth0 CTA */}
          <div className="space-y-6">
            <button
              onClick={handleLogin}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Entrar com Auth0
            </button>
          </div>

          {/* Footer */}
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-300">
              Não tem uma conta?{' '}
              <a href="#" className="text-purple-600 hover:text-purple-500 font-semibold">
                Cadastre-se
              </a>
            </p>
          </div>

          <div className="text-center text-sm text-gray-400 dark:text-gray-500 mt-8">
            <p>💡 Use qualquer e-mail e senha para testar a demo</p>
          </div>
        </div>
      </div>

      {/* Right Panel - Illustration */}
      <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-500 relative overflow-hidden">
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
              <div className="w-64 h-96 bg-gradient-to-br from-pink-400 to-purple-500 rounded-3xl shadow-2xl transform rotate-12 hover:rotate-6 transition-transform duration-300">
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
              <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-green-400 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                <span className="text-white font-bold">✅</span>
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
      </div>
    </div>
  )
}

export default LoginPage