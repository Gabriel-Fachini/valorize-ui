import { useSpring, animated } from '@react-spring/web'
import { PageLayout } from '@/components/layout/PageLayout'
import { Badge } from '@/components/ui/badge'

export const NewsPage = () => {
  const pageAnimation = useSpring({
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0px)' },
    config: { tension: 180, friction: 25 },
  })

  // Mock data para preview
  const mockNews = [
    {
      id: 1,
      title: 'Nova Política de Trabalho Remoto',
      summary: 'Conheça as atualizações na política de trabalho remoto da empresa, incluindo novos horários flexíveis e diretrizes de comunicação.',
      category: 'announcement' as const,
      publishedAt: '2024-01-15',
      tags: ['Política', 'Trabalho Remoto', 'Recursos Humanos'],
    },
    {
      id: 2,
      title: 'Resultados do Trimestre Q4',
      summary: 'A empresa alcançou resultados excepcionais no último trimestre, superando todas as metas estabelecidas.',
      category: 'achievement' as const,
      publishedAt: '2024-01-12',
      tags: ['Resultados', 'Performance', 'Sucesso'],
    },
    {
      id: 3,
      title: 'Atualização do Sistema de Pontos',
      summary: 'Melhorias no sistema de pontos foram implementadas para uma experiência mais fluida e intuitiva.',
      category: 'update' as const,
      publishedAt: '2024-01-10',
      tags: ['Sistema', 'Melhorias', 'UX'],
    },
    {
      id: 4,
      title: 'Programa de Mentoria 2024',
      summary: 'Inscrições abertas para o programa de mentoria interno. Uma oportunidade única de desenvolvimento profissional.',
      category: 'general' as const,
      publishedAt: '2024-01-08',
      tags: ['Desenvolvimento', 'Mentoria', 'Carreira'],
    },
  ]

  const categoryColors = {
    announcement: 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20',
    update: 'bg-green-500/10 text-green-700 dark:text-green-300 border-green-500/20',
    achievement: 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20',
    general: 'bg-gray-500/10 text-gray-700 dark:text-gray-300 border-gray-500/20',
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
    })
  }

  return (
    <PageLayout maxWidth="4xl">
      <animated.div style={pageAnimation} className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <i className="ph-duotone ph-newspaper text-blue-600 dark:text-blue-400" style={{ fontSize: '48px' }}></i>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Notícias da Empresa
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Fique por dentro das últimas novidades, comunicados e atualizações da empresa
          </p>
        </div>

        {/* Development Status Card */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-8 border border-blue-200/50 dark:border-blue-800/50">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ph-duotone ph-gear text-blue-600 dark:text-blue-400" style={{ fontSize: '32px' }}></i>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
              Funcionalidade em Desenvolvimento
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-lg mx-auto">
              Estamos trabalhando para trazer uma experiência completa de notícias. Em breve você poderá:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="flex items-center gap-3 p-4 bg-white/70 dark:bg-gray-800/70 rounded-xl">
                <i className="ph-duotone ph-bell text-blue-600 dark:text-blue-400" style={{ fontSize: '24px' }}></i>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Notificações em tempo real
                </span>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white/70 dark:bg-gray-800/70 rounded-xl">
                <i className="ph-duotone ph-bookmark text-blue-600 dark:text-blue-400" style={{ fontSize: '24px' }}></i>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Salvar notícias importantes
                </span>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white/70 dark:bg-gray-800/70 rounded-xl">
                <i className="ph-duotone ph-share-network text-blue-600 dark:text-blue-400" style={{ fontSize: '24px' }}></i>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Compartilhar com colegas
                </span>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-lg text-sm font-medium">
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mockNews.map((news) => (
              <div key={news.id} className="bg-white/70 dark:bg-[#2a2a2a]/90 backdrop-blur-sm border border-gray-200/50 dark:border-neutral-700/50 rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-200 h-full flex flex-col opacity-60">
                <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
                  <Badge variant="outline" className={categoryColors[news.category]}>
                    {news.category === 'announcement' && 'Anúncio'}
                    {news.category === 'update' && 'Atualização'}
                    {news.category === 'achievement' && 'Conquista'}
                    {news.category === 'general' && 'Geral'}
                  </Badge>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {formatDate(news.publishedAt)}
                  </span>
                </div>
                
                <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg mb-3 leading-tight">
                  {news.title}
                </h3>
                
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-4 flex-grow">
                  {news.summary}
                </p>
                
                <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-200 dark:border-neutral-700">
                  {news.tags && news.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {news.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs px-2 py-0.5">
                          {tag}
                        </Badge>
                      ))}
                      {news.tags.length > 2 && (
                        <Badge variant="secondary" className="text-xs px-2 py-0.5">
                          +{news.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                  )}
                  
                  <button className="ml-auto text-sm font-semibold text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white transition-colors flex items-center gap-1 group">
                    Ler mais
                    <i className="ph-bold ph-arrow-right group-hover:translate-x-1 transition-transform" style={{ fontSize: '14px' }}></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </animated.div>
    </PageLayout>
  )
}
