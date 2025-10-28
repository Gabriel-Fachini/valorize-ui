import { useSpring, animated } from '@react-spring/web'
import { PageLayout } from '@/components/layout/PageLayout'

export const TrainingPage = () => {
  const pageAnimation = useSpring({
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0px)' },
    config: { tension: 180, friction: 25 },
  })

  // Mock data para preview - usando os mesmos dados da home
  const courses = [
    {
      id: 1,
      title: 'Fundamentos de Liderança',
      type: 'Curso',
      duration: '4h 30min',
      thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=250&fit=crop',
      progress: 65,
      category: 'Liderança',
    },
    {
      id: 2,
      title: 'Comunicação Efetiva no Trabalho',
      type: 'Vídeo',
      duration: '45min',
      thumbnail: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=400&h=250&fit=crop',
      progress: 0,
      category: 'Soft Skills',
    },
    {
      id: 3,
      title: 'Gestão de Tempo e Produtividade',
      type: 'Treinamento',
      duration: '2h 15min',
      thumbnail: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=400&h=250&fit=crop',
      progress: 100,
      category: 'Produtividade',
    },
    {
      id: 4,
      title: 'Trabalho em Equipe e Colaboração',
      type: 'Curso',
      duration: '3h 20min',
      thumbnail: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=250&fit=crop',
      progress: 30,
      category: 'Colaboração',
    },
    {
      id: 5,
      title: 'Introdução ao Design Thinking',
      type: 'Workshop',
      duration: '6h 00min',
      thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=250&fit=crop',
      progress: 0,
      category: 'Design',
    },
    {
      id: 6,
      title: 'Fundamentos de Programação',
      type: 'Curso',
      duration: '8h 45min',
      thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&fit=crop',
      progress: 15,
      category: 'Tecnologia',
    },
    {
      id: 7,
      title: 'Marketing Digital Básico',
      type: 'Vídeo',
      duration: '3h 30min',
      thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop',
      progress: 0,
      category: 'Marketing',
    },
    {
      id: 8,
      title: 'Finanças Pessoais',
      type: 'Curso',
      duration: '5h 15min',
      thumbnail: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=250&fit=crop',
      progress: 0,
      category: 'Finanças',
    },
  ]

  return (
    <PageLayout maxWidth="4xl">
      <animated.div style={pageAnimation} className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="w-20 h-20 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <i className="ph-duotone ph-graduation-cap text-purple-600 dark:text-purple-400" style={{ fontSize: '48px' }}></i>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Treinamentos e Cursos
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Desenvolva suas habilidades com nossos cursos, treinamentos e materiais educacionais
          </p>
        </div>

        {/* Development Status Card */}
        <div className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 rounded-2xl p-8 border border-purple-200/50 dark:border-purple-800/50">
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/40 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ph-duotone ph-gear text-purple-600 dark:text-purple-400" style={{ fontSize: '32px' }}></i>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
              Funcionalidade em Desenvolvimento
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-lg mx-auto">
              Estamos construindo uma plataforma completa de aprendizado. Em breve você poderá:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="flex items-center gap-3 p-4 bg-white/70 dark:bg-gray-800/70 rounded-xl">
                <i className="ph-duotone ph-play-circle text-purple-600 dark:text-purple-400" style={{ fontSize: '24px' }}></i>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Assistir vídeos e cursos
                </span>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white/70 dark:bg-gray-800/70 rounded-xl">
                <i className="ph-duotone ph-certificate text-purple-600 dark:text-purple-400" style={{ fontSize: '24px' }}></i>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Obter certificados
                </span>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white/70 dark:bg-gray-800/70 rounded-xl">
                <i className="ph-duotone ph-chart-line text-purple-600 dark:text-purple-400" style={{ fontSize: '24px' }}></i>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Acompanhar progresso
                </span>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 rounded-lg text-sm font-medium">
              <i className="ph-bold ph-clock" style={{ fontSize: '16px' }}></i>
              Em breve disponível
            </div>
          </div>
        </div>

        {/* Preview Content */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 text-center">
            Preview do que está por vir
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {courses.map((course) => (
              <div
                key={course.id}
                className="group bg-white/70 dark:bg-[#2a2a2a]/90 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-200/50 dark:border-neutral-700/50 hover:border-gray-300 dark:hover:border-neutral-600 shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer opacity-60"
              >
                {/* Thumbnail */}
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 bg-gray-900/80 dark:bg-gray-100/90 backdrop-blur-sm text-white dark:text-gray-900 text-xs font-semibold rounded-full">
                      {course.type}
                    </span>
                  </div>
                  {course.progress > 0 && (
                    <div className="absolute top-3 right-3">
                      <span className="px-3 py-1 bg-blue-600/90 backdrop-blur-sm text-white text-xs font-semibold rounded-full">
                        {course.progress}%
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 bg-gray-100 dark:bg-[#3a3a3a] text-gray-700 dark:text-gray-300 text-xs font-medium rounded">
                      {course.category}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                      <i className="ph-bold ph-clock" style={{ fontSize: '14px' }}></i>
                      {course.duration}
                    </span>
                  </div>
                  
                  <h3 className="text-base font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-gray-700 dark:group-hover:text-gray-200 ">
                    {course.title}
                  </h3>

                  {/* Progress Bar */}
                  {course.progress > 0 && (
                    <div className="space-y-1">
                      <div className="w-full bg-gray-200 dark:bg-[#3a3a3a] rounded-full h-1.5 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {course.progress === 100 ? 'Concluído' : 'Em progresso'}
                      </p>
                    </div>
                  )}

                  {course.progress === 0 && (
                    <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-[#3a3a3a] text-gray-700 dark:text-gray-200 font-semibold text-sm rounded-lg hover:bg-gray-200 dark:hover:bg-[#4a4a4a] ">
                      Começar agora
                      <i className="ph-bold ph-arrow-right" style={{ fontSize: '16px' }}></i>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </animated.div>
    </PageLayout>
  )
}
