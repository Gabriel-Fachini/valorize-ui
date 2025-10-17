import { useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'

interface QuickAction {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  action: () => void
  variant: 'primary' | 'secondary' | 'outline'
}

export const QuickActionsWidget = () => {
  const navigate = useNavigate()

  const actions: QuickAction[] = [
    {
      id: 'send-praise',
      title: 'Enviar Elogio',
      description: 'Reconheça o trabalho excepcional dos seus colegas',
      icon: <i className="ph-duotone ph-sparkle" style={{ fontSize: '20px' }}></i>,
      action: () => navigate({ to: '/elogios' }),
      variant: 'primary',
    },
    {
      id: 'browse-prizes',
      title: 'Explorar Prêmios',
      description: 'Descubra recompensas incríveis para resgatar',
      icon: <i className="ph-duotone ph-gift" style={{ fontSize: '20px' }}></i>,
      action: () => navigate({ to: '/prizes' }),
      variant: 'secondary',
    },
    {
      id: 'view-transactions',
      title: 'Ver Transações',
      description: 'Acompanhe seu histórico de movimentações',
      icon: <i className="ph-duotone ph-chart-line" style={{ fontSize: '20px' }}></i>,
      action: () => navigate({ to: '/transacoes' }),
      variant: 'outline',
    },
  ]

  const getButtonVariant = (variant: 'primary' | 'secondary' | 'outline') => {
    switch (variant) {
      case 'primary':
        return 'default'
      case 'secondary':
        return 'secondary'
      case 'outline':
        return 'outline'
      default:
        return 'default'
    }
  }

  return (
    <div className="bg-white/70 dark:bg-[#2a2a2a]/80 backdrop-blur-xl border border-white/30 dark:border-neutral-700/30 rounded-2xl p-6 shadow-xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center justify-center w-10 h-10 bg-primary-600 rounded-xl shadow-lg">
          <i className="ph-duotone ph-sparkle text-white" style={{ fontSize: '20px' }}></i>
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
            Ações Rápidas
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Acesso rápido às principais funcionalidades
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {actions.map((action) => (
          <Button
            key={action.id}
            variant={getButtonVariant(action.variant)}
            size="sm"
            onClick={action.action}
            className="h-auto p-4 flex flex-col items-center gap-3 text-center hover:scale-105 transition-transform"
          >
            <div className="flex items-center justify-center w-12 h-12 bg-white/10 dark:bg-neutral-800/50 rounded-xl">
              {action.icon}
            </div>
            <div className="space-y-1">
              <div className="font-semibold text-sm">
                {action.title}
              </div>
              <div className="text-xs text-muted-foreground leading-tight">
                {action.description}
              </div>
            </div>
          </Button>
        ))}
      </div>
    </div>
  )
}

