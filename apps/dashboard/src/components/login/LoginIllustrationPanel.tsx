import { LottieAnimation } from '../ui/LottieAnimation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'

export const LoginIllustrationPanel = () => {
  return (
    <div className="hidden lg:flex lg:flex-1 bg-primary-600 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Fire Animation - Top Left */}
        <div className="absolute top-10 left-10 w-24 h-24">
          <LottieAnimation
            path="/animations/fire.json"
            loop={true}
            autoplay={true}
            speed={0.8}
            scale={0.6}
          />
        </div>
        
        {/* Money Animation - Top Right */}
        <div className="absolute top-16 right-16 w-32 h-32">
          <LottieAnimation
            path="/animations/money.json"
            loop={true}
            autoplay={true}
            speed={1.2}
            scale={0.8}
          />
        </div>
        
        {/* Happy Face Animation - Bottom Center */}
        <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 w-40 h-40 z-10">
          <LottieAnimation
            path="/animations/happy-face.json"
            loop={true}
            autoplay={true}
            speed={1.0}
            scale={1.0}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center w-full p-12">
        <div className="text-center text-white max-w-2xl">
          {/* Hero Section */}
          <div className="mb-12">
            <h1 className="text-5xl font-bold mb-6 text-white">
              Transforme sua empresa
            </h1>
            <p className="text-xl text-white/90 leading-relaxed mb-8">
              Uma plataforma completa para cultura organizacional, 
              engajamento e reconhecimento de talentos.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-primary-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <i className="ph ph-trophy text-2xl text-white"></i>
                </div>
                <CardTitle className="text-lg text-white">Conquistas</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-white/80">
                  Reconheça conquistas e celebre vitórias
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-secondary-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <i className="ph ph-gift text-2xl text-white"></i>
                </div>
                <CardTitle className="text-lg text-white">Recompensas</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-white/80">
                  Sistema de pontos e prêmios
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gray-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <i className="ph ph-chart-bar text-2xl text-white"></i>
                </div>
                <CardTitle className="text-lg text-white">Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-white/80">
                  Insights e métricas detalhadas
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          {/* Call to Action */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-white mb-4">Pronto para começar?</CardTitle>
              <CardDescription className="text-white/90 text-base">
                Junte-se a milhares de empresas que já transformaram sua cultura organizacional
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center space-x-6 text-sm text-white/80">
                <Badge variant="secondary" className="bg-primary-500/20 text-primary-100 border-primary-400/30">
                  <i className="ph ph-shield-check mr-2"></i>
                  100% Seguro
                </Badge>
                <Badge variant="secondary" className="bg-secondary-500/20 text-secondary-100 border-secondary-400/30">
                  <i className="ph ph-heart mr-2"></i>
                  Fácil de usar
                </Badge>
                <Badge variant="secondary" className="bg-gray-500/20 text-gray-100 border-gray-400/30">
                  <i className="ph ph-check-circle mr-2"></i>
                  Resultados garantidos
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
