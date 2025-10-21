import { animated } from '@react-spring/web'

interface EmptyStateProps {
  type: 'praises' | 'users' | 'values' | 'general'
  title?: string
  description?: string
  icon?: string
  actionText?: string
  onAction?: () => void
  style?: React.CSSProperties
}

const getEmptyStateContent = (type: EmptyStateProps['type']) => {
  switch (type) {
    case 'praises':
      return {
        icon: '🎉',
        title: 'Nenhum elogio ainda',
        description: 'Seja o primeiro a reconhecer o trabalho incrível da sua equipe!',
        actionText: 'Enviar primeiro elogio',
      }
    case 'users':
      return {
        icon: '👥',
        title: 'Nenhum usuário disponível',
        description: 'Não foi possível carregar a lista de usuários para envio de elogios.',
        actionText: 'Tentar novamente',
      }
    case 'values':
      return {
        icon: '⭐',
        title: 'Valores não configurados',
        description: 'Os valores da empresa ainda não foram configurados.',
        actionText: 'Contatar administrador',
      }
    default:
      return {
        icon: '📭',
        title: 'Nada para mostrar',
        description: 'Não há dados disponíveis no momento.',
        actionText: 'Atualizar',
      }
  }
}

export const EmptyState = ({ 
  type, 
  title, 
  description, 
  icon, 
  actionText, 
  onAction,
  style = {},
}: EmptyStateProps) => {
  const content = getEmptyStateContent(type)
  
  return (
    <animated.div 
      style={style}
      className="flex flex-col items-center justify-center py-12 px-4 text-center"
    >
      <div className="w-20 h-20 bg-[#3a3a3a] dark:bg-[#2a2a2a] rounded-full flex items-center justify-center mb-6 shadow-lg">
        <span className="text-3xl">{icon ?? content.icon}</span>
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
        {title ?? content.title}
      </h3>
      
      <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md leading-relaxed">
        {description ?? content.description}
      </p>
      
      {onAction && (
        <button
          onClick={onAction}
          className="px-6 py-3 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl hover:shadow-primary-500/20"
        >
          {actionText ?? content.actionText}
        </button>
      )}
    </animated.div>
  )
}