import { useUserBalance } from '@/hooks/useUser'
import { SkeletonCard, SkeletonText } from '@/components/ui'

const BalanceCardsSkeleton = () => {
  return (
    <div className="grid grid-cols-2 gap-3">
      <SkeletonCard gradient="gray">
        <div className="flex flex-col items-start gap-1">
          <div className="w-6 h-6 bg-gray-700 rounded animate-pulse" />
          <SkeletonText width="lg" height="lg" />
          <SkeletonText width="sm" height="sm" />
        </div>
      </SkeletonCard>

      <SkeletonCard gradient="gray">
        <div className="flex flex-col items-start gap-1">
          <div className="w-6 h-6 bg-gray-700 rounded animate-pulse" />
          <SkeletonText width="lg" height="lg" />
          <SkeletonText width="sm" height="sm" />
        </div>
      </SkeletonCard>
    </div>
  )
}

const BalanceCards = ({ 
  complimentBalance, 
  redeemableBalance, 
}: { complimentBalance: number; redeemableBalance: number }) => {
  const formatBalance = (balance: number) => {
    return new Intl.NumberFormat('pt-BR').format(balance)
  }

  // Função para determinar o tamanho da fonte baseado no número de caracteres
  const getFontSize = (value: string) => {
    const length = value.length
    if (length <= 5) return 'text-xl' // Ex: 1.000
    if (length <= 7) return 'text-lg' // Ex: 100.000
    if (length <= 9) return 'text-base' // Ex: 1.000.000
    return 'text-sm' // Ex: 10.000.000+
  }

  const formattedRedeemable = formatBalance(redeemableBalance)
  const formattedCompliment = formatBalance(complimentBalance)

  return (
    <div className="grid grid-cols-2 gap-3">
      {/* Saldo Acumulado (Moedas) - Esquerda */}
      <div 
        className="group relative rounded-xl bg-gray-800/40 border border-gray-700/50 p-3 hover:bg-gray-800/60 transition-colors cursor-help"
        title={`Saldo Acumulado: ${formattedRedeemable} moedas`}
      >
        <div className="flex flex-col gap-1">
          <i 
            className="ph-fill ph-coins text-primary" 
            style={{ fontSize: '1.5rem' }}
            aria-hidden="true"
          />
          <p className={`${getFontSize(formattedRedeemable)} font-bold text-white leading-none`}>
            {formattedRedeemable}
          </p>
          <p className="text-xs text-gray-400 font-medium">
            Moedas
          </p>
        </div>
        
        {/* Tooltip */}
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-50 shadow-lg">
          Seu saldo total acumulado
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </div>
      </div>

      {/* Saldo de Elogios - Direita */}
      <div 
        className="group relative rounded-xl bg-gray-800/40 border border-gray-700/50 p-3 hover:bg-gray-800/60 transition-colors cursor-help"
        title={`Elogios Disponíveis: ${formattedCompliment}`}
      >
        <div className="flex flex-col gap-1">
          <i 
            className="ph-fill ph-hand-coins text-gray-400" 
            style={{ fontSize: '1.5rem' }}
            aria-hidden="true"
          />
          <p className={`${getFontSize(formattedCompliment)} font-bold text-white leading-none`}>
            {formattedCompliment}
          </p>
          <p className="text-xs text-gray-400 font-medium">
            Elogios
          </p>
        </div>
        
        {/* Tooltip */}
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-50 shadow-lg">
          Moedas disponíveis para elogiar
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </div>
      </div>
    </div>
  )
}

export const BalanceSection = () => {
  const { balance, isLoading } = useUserBalance()

  if (isLoading) {
    return <BalanceCardsSkeleton />
  }

  return (
    <BalanceCards 
      complimentBalance={balance.complimentBalance} 
      redeemableBalance={balance.redeemableBalance} 
    />
  )
}

