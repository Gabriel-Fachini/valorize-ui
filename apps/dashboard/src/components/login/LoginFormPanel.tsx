import { animated, useTransition } from '@react-spring/web'
import { UseFormReturn } from 'react-hook-form'
import { ForgotPasswordFormData, LoginFormData, RegisterFormData } from '@/types'
import { LoginHeader } from './LoginHeader'
import { LoginForm } from './LoginForm'
import { RegisterForm } from './RegisterForm'
import { ForgotPasswordForm } from './ForgotPasswordForm'

type AuthMode = 'login' | 'register' | 'forgotPassword'

interface LoginFormPanelProps {
  formMethods: UseFormReturn<LoginFormData>
  registerFormMethods: UseFormReturn<RegisterFormData>
  forgotPasswordFormMethods: UseFormReturn<ForgotPasswordFormData>
  isLoading: boolean
  forgotPasswordSuccessEmail: string | null
  mode: AuthMode
  onSubmit: (data: LoginFormData) => void
  onRegisterSubmit: (data: RegisterFormData) => void
  onForgotPasswordSubmit: (data: ForgotPasswordFormData) => void
  onToggleRegisterMode: () => void
  onShowForgotPassword: () => void
  onBackToLogin: () => void
  onForgotPasswordTryAgain: () => void
}

export const LoginFormPanel = ({ 
  formMethods, 
  registerFormMethods,
  forgotPasswordFormMethods,
  isLoading, 
  forgotPasswordSuccessEmail,
  mode,
  onSubmit, 
  onRegisterSubmit,
  onForgotPasswordSubmit,
  onToggleRegisterMode,
  onShowForgotPassword,
  onBackToLogin,
  onForgotPasswordTryAgain,
}: LoginFormPanelProps) => {
  const panelTransitions = useTransition(mode, {
    from: {
      opacity: 0,
      transform: 'translate3d(28px, 0, 0)',
    },
    enter: {
      opacity: 1,
      transform: 'translate3d(0px, 0, 0)',
    },
    leave: {
      opacity: 0,
      transform: 'translate3d(-20px, 0, 0)',
    },
    config: {
      tension: 220,
      friction: 26,
      clamp: true,
    },
    exitBeforeEnter: true,
  })

  return (
    <div className={`
      relative flex flex-1 items-center justify-center bg-white px-4 py-4 sm:px-6 sm:py-5 lg:w-2/5 lg:px-6 lg:py-4 xl:px-8 xl:py-6 dark:bg-[#1a1a1a]
      lg:[@media(max-height:900px)]:items-center lg:[@media(max-height:900px)]:py-4
      [&_h1]:lg:[@media(max-height:900px)]:text-[2.65rem]
      [&_p]:lg:[@media(max-height:900px)]:leading-[1.45]
      [&_.auth-form]:lg:[@media(max-height:900px)]:space-y-3
      [&_.auth-label]:lg:[@media(max-height:900px)]:mb-1 [&_.auth-label]:lg:[@media(max-height:900px)]:text-[0.8125rem]
      [&_.auth-input]:lg:[@media(max-height:900px)]:py-[0.55rem] [&_.auth-input]:lg:[@media(max-height:900px)]:text-[0.92rem]
      [&_.auth-inline-link:not(.auth-back-link)]:lg:[@media(max-height:900px)]:pb-0.5
      [&_.auth-primary-button]:lg:[@media(max-height:900px)]:py-[0.7rem] [&_.auth-primary-button]:lg:[@media(max-height:900px)]:text-[0.96rem]
      [&_.auth-social-button]:lg:[@media(max-height:900px)]:py-[0.7rem] [&_.auth-social-button]:lg:[@media(max-height:900px)]:text-[0.96rem]
      [&_.auth-secondary-card]:lg:[@media(max-height:900px)]:px-4 [&_.auth-secondary-card]:lg:[@media(max-height:900px)]:py-3
      [&_.auth-secondary-button]:lg:[@media(max-height:900px)]:mt-[0.625rem] [&_.auth-secondary-button]:lg:[@media(max-height:900px)]:py-[0.55rem] [&_.auth-secondary-button]:lg:[@media(max-height:900px)]:px-[0.95rem]
    `}>
      <div className="w-full max-w-md space-y-4 sm:space-y-5 xl:space-y-6 lg:[@media(max-height:900px)]:space-y-[0.875rem]">
        <div className="relative">
          {panelTransitions((style, currentMode) => {
            const isCurrentRegisterMode = currentMode === 'register'
            const isCurrentForgotPasswordMode = currentMode === 'forgotPassword'

            return (
              <animated.div style={style} className="space-y-4 sm:space-y-5 xl:space-y-6">
                <LoginHeader mode={currentMode} />

                <div className={isCurrentRegisterMode || isCurrentForgotPasswordMode ? 'pt-3 sm:pt-4' : ''}>
                  {isCurrentRegisterMode ? (
                    <RegisterForm
                      formMethods={registerFormMethods}
                      isLoading={isLoading}
                      onSubmit={onRegisterSubmit}
                      onBackToLogin={onBackToLogin}
                    />
                  ) : isCurrentForgotPasswordMode ? (
                    <ForgotPasswordForm
                      formMethods={forgotPasswordFormMethods}
                      isLoading={isLoading}
                      successEmail={forgotPasswordSuccessEmail}
                      onSubmit={onForgotPasswordSubmit}
                      onBackToLogin={onBackToLogin}
                      onTryAgain={onForgotPasswordTryAgain}
                    />
                  ) : (
                    <LoginForm
                      formMethods={formMethods}
                      isLoading={isLoading}
                      onSubmit={onSubmit}
                      onForgotPasswordClick={onShowForgotPassword}
                    />
                  )}
                </div>

                {currentMode === 'login' && (
                  <div className="auth-secondary-card rounded-xl border border-gray-200 bg-gray-50/80 px-4 py-3.5 text-center sm:px-5 sm:py-4 dark:border-white/10 dark:bg-white/5">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Primeira vez por aqui?
                    </p>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                      Crie uma conta de teste para explorar a plataforma antes de entrar com seu time.
                    </p>
                    <button
                      type="button"
                      onClick={onToggleRegisterMode}
                      className="auth-secondary-button mt-4 inline-flex items-center justify-center rounded-full border border-green-200 bg-green-50 px-5 py-2.5 text-sm font-semibold text-green-700 transition-colors hover:border-green-300 hover:bg-green-100 dark:border-green-500/30 dark:bg-green-500/10 dark:text-green-300 dark:hover:border-green-400/40 dark:hover:bg-green-500/15"
                    >
                      Cadastrar-se
                    </button>
                  </div>
                )}
              </animated.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
