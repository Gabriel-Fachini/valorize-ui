export const LoginFooter = () => {
  return (
    <>
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
    </>
  )
}
