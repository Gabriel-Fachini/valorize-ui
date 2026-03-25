interface LoginHeaderProps {
  isRegisterMode?: boolean
}

export const LoginHeader = ({ isRegisterMode = false }: LoginHeaderProps) => {
  return (
    <>
      {/* Logo */}
      <div className="flex items-center mb-6">
        <div className="w-64 h-16 flex items-center justify-center mr-3">
          <img 
            src='/logo.svg' 
            alt="Valorize Logo" 
            className="dark:hidden"
          />
          <img 
            src='/logo1.svg' 
            alt="Valorize Logo" 
            className="hidden dark:block"
          />
          {/* <span style={{
            fontFamily: 'Rubik, sans-serif',
            fontWeight: 500,
            fontSize: '4rem',
            fontStyle: 'normal'
          }}>
            Valorize
          </span> */}
        </div>
      </div>

      {/* Header */}
      <div>
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white leading-tight">
          <span className="text-gray-900 dark:text-white">Olá,</span>{' '}
          <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
            {isRegisterMode ? 'comece a transformar' : 'bem-vindo de volta'}
          </span>
        </h2>
        <p className="mt-1 text-gray-600 dark:text-gray-400 text-base">
          {isRegisterMode 
            ? 'Dê o primeiro passo para uma cultura de alta performance.'
            : 'Continue transformando a cultura do seu time.'
          }
        </p>
      </div>
    </>
  )
}
