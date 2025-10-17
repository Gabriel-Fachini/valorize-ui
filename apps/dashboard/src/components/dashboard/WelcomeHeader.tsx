import { useAuth } from '@/hooks/useAuth'

export const WelcomeHeader = () => {
  const { user } = useAuth()

  const getCurrentTime = () => {
    const now = new Date()
    const hour = now.getHours()

    if (hour < 12) return 'Bom dia'
    if (hour < 18) return 'Boa tarde'
    return 'Boa noite'
  }

  const formatDate = () => {
    const now = new Date()
    return now.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  return (
    <div className="mb-8">
      <div className="flex items-center gap-4 mb-3">
        <div className="flex items-center justify-center w-14 h-14 bg-gray-100 dark:bg-[#3a3a3a] rounded-2xl shadow-lg">
          <i className="ph-duotone ph-hand-waving text-gray-700 dark:text-gray-200" style={{ fontSize: '28px' }}></i>
        </div>
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
            {getCurrentTime()}, {user?.name?.split(' ')[0] ?? 'Colaborador'}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base mt-1">
            {formatDate()}
          </p>
        </div>
      </div>

      <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg leading-relaxed">
        Bem-vindo ao Valorize! Aqui você pode reconhecer colegas, acompanhar suas conquistas e resgatar prêmios incríveis.
      </p>
    </div>
  )
}

