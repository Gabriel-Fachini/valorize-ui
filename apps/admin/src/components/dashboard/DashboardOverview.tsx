import { ThemeToggle } from '@/components/ThemeToggle'

const stats = [
  {
    name: 'Total de Usuários',
    value: '2,345',
    change: '+12%',
    changeType: 'positive' as const,
    icon: 'ph-users',
  },
  {
    name: 'Receita Total',
    value: 'R$ 45,678',
    change: '+8%',
    changeType: 'positive' as const,
    icon: 'ph-currency-dollar',
  },
  {
    name: 'Transações',
    value: '1,234',
    change: '+15%',
    changeType: 'positive' as const,
    icon: 'ph-activity',
  },
  {
    name: 'Crescimento',
    value: '23%',
    change: '+3%',
    changeType: 'positive' as const,
    icon: 'ph-trending-up',
  },
]

export function DashboardOverview() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard Admin</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Visão geral do sistema Valorize
          </p>
        </div>
        <ThemeToggle />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {stat.name}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <i className={`ph-bold ${stat.icon} h-8 w-8 text-primary-500`} />
                <span
                  className={`text-sm font-medium ${
                    stat.changeType === 'positive'
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}
                >
                  {stat.change}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Atividade Recente
          </h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900 dark:text-white">
                  Novo usuário cadastrado
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  há 2 minutos
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900 dark:text-white">
                  Transação processada
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  há 5 minutos
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900 dark:text-white">
                  Sistema atualizado
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  há 1 hora
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Estatísticas Rápidas
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Usuários Ativos Hoje
              </span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                1,234
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Transações Hoje
              </span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                567
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Receita Hoje
              </span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                R$ 12,345
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
