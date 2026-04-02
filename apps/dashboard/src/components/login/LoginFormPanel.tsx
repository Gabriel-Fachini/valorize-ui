import { animated, useTransition } from '@react-spring/web'
import { UseFormReturn } from 'react-hook-form'
import { ForgotPasswordFormData, LoginFormData, RegisterFormData } from '@/types'
import { LoginHeader } from './LoginHeader'
import { LoginForm } from './LoginForm'
import { RegisterForm } from './RegisterForm'
import { ForgotPasswordForm } from './ForgotPasswordForm'
import {
  loginPanelSurfaceClassName,
  loginPanelWrapperClassName,
  loginSecondaryButtonClassName,
  loginSecondaryCardClassName,
} from './loginStyles'

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
    <div className={loginPanelWrapperClassName}>
      <div className="dark pointer-events-auto w-full max-w-[34rem] lg:ml-0 lg:w-[calc(46vw-1.5rem)] lg:max-w-none xl:w-[calc(46vw-2rem)]">
        <div className={loginPanelSurfaceClassName}>
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(74,222,128,0.18),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.1)_0%,rgba(255,255,255,0)_18%)]" />
          <div className="pointer-events-none absolute inset-[1px] rounded-[calc(2rem-1px)] border border-white/6" />

          <div className="relative z-10 mx-auto flex min-h-full w-full max-w-md flex-col items-center justify-center space-y-4 sm:space-y-5 xl:space-y-6 lg:[@media(max-height:900px)]:space-y-[0.875rem]">
            {panelTransitions((style, currentMode) => {
              const isCurrentRegisterMode = currentMode === 'register'
              const isCurrentForgotPasswordMode = currentMode === 'forgotPassword'

              return (
                <animated.div style={style} className="w-full space-y-4 sm:space-y-5 xl:space-y-6">
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
                    <div className={loginSecondaryCardClassName}>
                      <p className="text-sm font-medium text-white">
                        Primeira vez por aqui?
                      </p>
                      <p className="mt-1 text-sm text-white/62">
                        Crie uma conta de teste para explorar a plataforma antes de entrar com seu time.
                      </p>
                      <button
                        type="button"
                        onClick={onToggleRegisterMode}
                        className={loginSecondaryButtonClassName}
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
    </div>
  )
}
