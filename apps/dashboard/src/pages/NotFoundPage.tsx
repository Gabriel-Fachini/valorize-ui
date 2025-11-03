import { Link } from '@tanstack/react-router'
import { LottieAnimation } from '@components/ui/LottieAnimation'
import { usePageEntrance } from '@hooks/useAnimations'
import { animated } from '@react-spring/web'

export const NotFoundPage = () => {
  const pageAnimation = usePageEntrance()

  return (
    <animated.div
      style={pageAnimation as any}
      className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-50 via-white to-indigo-50 px-4 dark:from-[#262626] dark:via-[#2a2a2a] dark:to-[#262626]"
    >
      <div className="w-full max-w-2xl text-center">
        {/* Logo */}
        <div className="mb-8 flex items-center justify-center">
          <div className="h-16 w-64 flex items-center justify-center">
            <img 
              src="/logo.svg" 
              alt="Valorize Logo" 
              className="dark:hidden"
            />
            <img 
              src="/logo1.svg" 
              alt="Valorize Logo" 
              className="hidden dark:block"
            />
          </div>
        </div>

        {/* Lottie Animation */}
        <div className="mx-auto mb-8 w-full max-w-md">
          <LottieAnimation
            path="/animations/lmao.json"
            loop={true}
            autoplay={true}
            className="h-auto w-full"
          />
        </div>

        {/* 404 Text */}
        <h1 className="mb-4 text-6xl font-bold text-gray-900 dark:text-white">
          404
        </h1>

        {/* Error Message */}
        <h2 className="mb-4 text-3xl font-semibold text-gray-800 dark:text-gray-100">
          Página não encontrada
        </h2>

        <p className="mb-8 text-lg text-gray-600 dark:text-gray-300">
          Ops! A página que você está procurando não existe ou foi movida.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            to="/home"
            className="rounded-xl bg-primary-600 px-8 py-3 font-medium text-white transition-all hover:bg-primary-700 hover:shadow-lg"
          >
            Voltar ao início
          </Link>

          <button
            onClick={() => window.history.back()}
            className="rounded-xl border-2 border-[#363636] bg-[#262626] px-8 py-3 font-medium text-white transition-all hover:bg-[#404040] hover:border-[#404040]"
          >
            Voltar à página anterior
          </button>
        </div>

        {/* Additional Info */}
        <div className="mt-12">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Se você acredita que isso é um erro, entre em contato com o suporte.
          </p>
        </div>
      </div>
    </animated.div>
  )
}
