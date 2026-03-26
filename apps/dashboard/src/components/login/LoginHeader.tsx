interface LoginHeaderProps {
  mode?: 'login' | 'register' | 'forgotPassword'
}

export const LoginHeader = ({ mode = 'login' }: LoginHeaderProps) => {
  const isLoginMode = mode === 'login'
  const title = mode === 'register'
    ? 'comece a transformar'
    : mode === 'forgotPassword'
      ? 'vamos recuperar seu acesso'
      : 'bem-vindo de volta'

  const description = mode === 'register'
    ? 'Crie sua conta para comecar a estruturar uma cultura de alta performance.'
    : mode === 'forgotPassword'
      ? 'Informe seu email cadastrado para receber o link de redefinicao de senha.'
      : 'Entre para continuar acompanhando e fortalecendo a cultura do seu time.'

  return (
    <>
      <div className="mb-4 sm:mb-5 xl:mb-6">
        <span
          style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontWeight: 700,
            fontSize: '1.2rem',
            lineHeight: 1,
            letterSpacing: '-0.04em',
            color: 'inherit',
          }}
          className="inline-block text-gray-900 dark:text-white"
        >
          Valorize
        </span>
      </div>

      <div>
        <h1 className={`leading-[1.02] font-semibold tracking-[-0.04em] text-gray-900 sm:text-[2.15rem] lg:text-[2.35rem] xl:text-[2.85rem] dark:text-white ${
          isLoginMode ? 'max-w-none whitespace-nowrap text-[1.55rem]' : 'max-w-[12ch] text-[1.8rem]'
        }`}>
          <span className="text-gray-900 dark:text-white">Olá,</span>{' '}
          <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
            {title}
          </span>
        </h1>
        <p className="mt-2 max-w-md text-[0.94rem] leading-6 text-gray-600 sm:text-[0.98rem] xl:mt-2.5 xl:text-[1rem] xl:leading-6 dark:text-gray-400">
          {description}
        </p>
      </div>
    </>
  )
}
