export const LoginHeader = () => {
  return (
    <>
      {/* Logo */}
      <div className="flex items-center">
        <div className="w-64 h-16 flex items-center justify-center mr-3">
          <img src='/logo1.svg' alt="Valorize Logo" />
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
    </>
  )
}
