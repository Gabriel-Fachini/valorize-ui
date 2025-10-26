export const LoginHeader = () => {
  return (
    <div className="text-left">
      {/* Logo */}
      <div className="flex items-left justify-left mb-6">
        <div className="w-40 h-16 flex items-center justify-center">
          <img 
            src='/logo.svg' 
            alt="Valorize Logo" 
            className="h-12 w-auto dark:hidden"
          />
          <img 
            src='/logo1.svg' 
            alt="Valorize Logo" 
            className="h-12 w-auto hidden dark:block"
          />
        </div>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Admin
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
          Faça login para acessar o painel de administração do Valorize.
        </p>
      </div>
    </div>
  )
}
