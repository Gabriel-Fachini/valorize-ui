import { useUserBalance } from '@/hooks/useUser'

const BalanceCardsSkeleton = () => {
  return (
    <div className="grid grid-cols-2 gap-3">
      {/* Skeleton Card 1 - Moedas */}
      <div 
        className="rounded-xl p-3 border dark:bg-[#171717] dark:border-[#262626]" 
        style={{ backgroundColor: '#f5f5f5', borderColor: '#e5e5e5' }}
      >
        <div className="flex flex-col gap-1 animate-pulse">
          <div className="w-6 h-6 rounded dark:bg-[#262626]" style={{ backgroundColor: '#d4d4d4' }} />
          <div className="h-6 w-20 rounded dark:bg-[#262626]" style={{ backgroundColor: '#d4d4d4' }} />
          <div className="h-3 w-12 rounded dark:bg-[#262626]" style={{ backgroundColor: '#d4d4d4' }} />
        </div>
      </div>

      {/* Skeleton Card 2 - Elogios */}
      <div 
        className="rounded-xl p-3 border dark:bg-[#171717] dark:border-[#262626]" 
        style={{ backgroundColor: '#f5f5f5', borderColor: '#e5e5e5' }}
      >
        <div className="flex flex-col gap-1 animate-pulse">
          <div className="w-6 h-6 rounded dark:bg-[#262626]" style={{ backgroundColor: '#d4d4d4' }} />
          <div className="h-6 w-20 rounded dark:bg-[#262626]" style={{ backgroundColor: '#d4d4d4' }} />
          <div className="h-3 w-12 rounded dark:bg-[#262626]" style={{ backgroundColor: '#d4d4d4' }} />
        </div>
      </div>
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
      {/* Acumulated Balance - Left*/}
      <div 
        className="group relative rounded-xl p-3 transition-colors cursor-help border bg-gray-100 dark:bg-[#171717] dark:border-[#262626] hover:bg-[#e5e5e5] dark:hover:bg-[#262626]"
        title={`Saldo Acumulado: ${formattedRedeemable} moedas`}
      >
        <div className="flex flex-col gap-1">
          <i 
            className="ph-fill ph-coins text-primary" 
            style={{ fontSize: '1.5rem' }}
            aria-hidden="true"
          />
          <p className={`${getFontSize(formattedRedeemable)} font-bold leading-none dark:text-[#fafafa]`}>
            {formattedRedeemable}
          </p>
          <p className="text-xs font-medium dark:text-[#a3a3a3]">
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
        className="group relative rounded-xl p-3 transition-colors cursor-help border bg-gray-100 dark:bg-[#171717] dark:border-[#262626] hover:bg-[#e5e5e5] dark:hover:bg-[#262626]"
        title={`Elogios Disponíveis: ${formattedCompliment}`}
      >
        <div className="flex flex-col gap-1">
          <i 
            className="ph-fill ph-hand-coins" 
            style={{ fontSize: '1.5rem' }}
            aria-hidden="true"
          />
          <p className={`${getFontSize(formattedCompliment)} font-bold leading-none dark:text-[#fafafa]`} >
            {formattedCompliment}
          </p>
          <p className="text-xs font-medium dark:text-[#a3a3a3]">
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

