export const LoginIllustrationPanel = () => {
  return (
    <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 relative overflow-hidden">
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
    </div>
  )
}
