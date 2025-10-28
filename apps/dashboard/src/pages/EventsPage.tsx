import { useSpring, animated } from '@react-spring/web'
import { PageLayout } from '@/components/layout/PageLayout'
import { Badge } from '@/components/ui/badge'

export const EventsPage = () => {
  const pageAnimation = useSpring({
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0px)' },
    config: { tension: 180, friction: 25 },
  })

  // Mock data para preview
  const mockEvents = [
    {
      id: 1,
      title: 'Workshop de Liderança',
      description: 'Aprenda técnicas essenciais de liderança e gestão de equipes neste workshop prático.',
      category: 'training' as const,
      startDate: '2024-01-20T09:00:00',
      endDate: '2024-01-20T17:00:00',
      location: 'Auditório Principal',
      imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=250&fit=crop',
      attendees: 45,
      maxAttendees: 50,
    },
    {
      id: 2,
      title: 'Happy Hour Mensal',
      description: 'Confraternização mensal da equipe com drinks, petiscos e muita diversão.',
      category: 'social' as const,
      startDate: '2024-01-25T18:00:00',
      endDate: '2024-01-25T22:00:00',
      location: 'Área de Convivência',
      imageUrl: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400&h=250&fit=crop',
      attendees: 28,
      maxAttendees: 40,
    },
    {
      id: 3,
      title: 'Reunião de Planejamento Q1',
      description: 'Apresentação dos objetivos e metas para o primeiro trimestre do ano.',
      category: 'meeting' as const,
      startDate: '2024-01-30T14:00:00',
      endDate: '2024-01-30T16:00:00',
      location: 'Sala de Conferências',
      imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=250&fit=crop',
      attendees: 15,
      maxAttendees: 20,
    },
    {
      id: 4,
      title: 'Celebração de Aniversário',
      description: 'Comemoração dos aniversariantes do mês com bolo e presentes.',
      category: 'celebration' as const,
      startDate: '2024-02-05T15:00:00',
      endDate: '2024-02-05T16:30:00',
      location: 'Cafeteria',
      imageUrl: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=400&h=250&fit=crop',
      attendees: 35,
      maxAttendees: 50,
    },
  ]

  const categoryColors = {
    meeting: 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20',
    training: 'bg-green-500/10 text-green-700 dark:text-green-300 border-green-500/20',
    social: 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20',
    celebration: 'bg-orange-500/10 text-orange-700 dark:text-orange-300 border-orange-500/20',
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getAttendeeStatus = (attendees: number, maxAttendees: number) => {
    const percentage = (attendees / maxAttendees) * 100
    const isAlmostFull = percentage >= 80

    return {
      percentage,
      isAlmostFull,
      text: `${attendees}/${maxAttendees} participantes`,
    }
  }

  return (
    <PageLayout maxWidth="4xl">
      <animated.div style={pageAnimation} className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <i className="ph-duotone ph-calendar-blank text-green-600 dark:text-green-400" style={{ fontSize: '48px' }}></i>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Eventos da Empresa
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Participe dos eventos corporativos, workshops e atividades que promovem o engajamento da equipe
          </p>
        </div>

        {/* Development Status Card */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-8 border border-green-200/50 dark:border-green-800/50">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ph-duotone ph-gear text-green-600 dark:text-green-400" style={{ fontSize: '32px' }}></i>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
              Funcionalidade em Desenvolvimento
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-lg mx-auto">
              Estamos criando uma plataforma completa de eventos. Em breve você poderá:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="flex items-center gap-3 p-4 bg-white/70 dark:bg-gray-800/70 rounded-xl">
                <i className="ph-duotone ph-calendar-check text-green-600 dark:text-green-400" style={{ fontSize: '24px' }}></i>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Inscrever-se em eventos
                </span>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white/70 dark:bg-gray-800/70 rounded-xl">
                <i className="ph-duotone ph-bell text-green-600 dark:text-green-400" style={{ fontSize: '24px' }}></i>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Lembretes automáticos
                </span>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white/70 dark:bg-gray-800/70 rounded-xl">
                <i className="ph-duotone ph-users text-green-600 dark:text-green-400" style={{ fontSize: '24px' }}></i>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Ver participantes
                </span>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 rounded-lg text-sm font-medium">
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockEvents.map((event) => {
              const attendeeStatus = getAttendeeStatus(event.attendees, event.maxAttendees)
              
              return (
                <div key={event.id} className="bg-white/70 dark:bg-[#2a2a2a]/90 backdrop-blur-sm border border-gray-200/50 dark:border-neutral-700/50 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-200 h-full flex flex-col opacity-60">
                  {/* Image Banner */}
                  {event.imageUrl ? (
                    <div className="w-full h-40 overflow-hidden">
                      <img 
                        src={event.imageUrl} 
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-40 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
                      <i className="ph-duotone ph-calendar-blank text-gray-400 dark:text-gray-600" style={{ fontSize: '48px' }}></i>
                    </div>
                  )}
                  
                  <div className="p-5 flex flex-col flex-grow">
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant="outline" className={categoryColors[event.category]}>
                        {event.category === 'meeting' && 'Reunião'}
                        {event.category === 'training' && 'Treinamento'}
                        {event.category === 'social' && 'Social'}
                        {event.category === 'celebration' && 'Celebração'}
                      </Badge>
                    </div>
                    
                    <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg mb-2 leading-tight">
                      {event.title}
                    </h3>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-4 flex-grow">
                      {event.description}
                    </p>

                    <div className="space-y-2 mt-auto pt-3 border-t border-gray-200 dark:border-neutral-700">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <i className="ph-bold ph-calendar-blank" style={{ fontSize: '16px' }}></i>
                        <span className="text-xs">{formatDate(event.startDate)}</span>
                        {event.endDate && (
                          <span className="text-xs text-gray-400">→ {formatTime(event.endDate)}</span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <i className="ph-bold ph-map-pin" style={{ fontSize: '16px' }}></i>
                        <span className="text-xs">{event.location}</span>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <i className="ph-bold ph-users" style={{ fontSize: '16px' }}></i>
                          <span className="text-xs">{attendeeStatus.text}</span>
                        </div>
                        {attendeeStatus.isAlmostFull && (
                          <Badge variant="outline" className="text-xs bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-800">
                            Quase lotado
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </animated.div>
    </PageLayout>
  )
}
