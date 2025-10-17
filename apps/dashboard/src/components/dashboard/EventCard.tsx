import { Badge } from '@/components/ui/badge'
import type { EventItem } from '@/types/dashboard.types'

interface EventCardProps {
  event: EventItem
  className?: string
}

const categoryColors = {
  meeting: 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20',
  training: 'bg-green-500/10 text-green-700 dark:text-green-300 border-green-500/20',
  social: 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20',
  celebration: 'bg-orange-500/10 text-orange-700 dark:text-orange-300 border-orange-500/20',
}

export const EventCard = ({ event, className = '' }: EventCardProps) => {
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

  const getAttendeeStatus = () => {
    if (!event.attendees || !event.maxAttendees) return null

    const percentage = (event.attendees / event.maxAttendees) * 100
    const isAlmostFull = percentage >= 80

    return {
      percentage,
      isAlmostFull,
      text: `${event.attendees}/${event.maxAttendees} participantes`,
    }
  }

  const attendeeStatus = getAttendeeStatus()

  return (
    <div className={`bg-white/70 dark:bg-[#2a2a2a]/90 backdrop-blur-sm border border-gray-200/50 dark:border-neutral-700/50 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-200 h-full flex flex-col ${className}`}>
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

          {attendeeStatus && (
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
          )}
        </div>
      </div>
    </div>
  )
}

