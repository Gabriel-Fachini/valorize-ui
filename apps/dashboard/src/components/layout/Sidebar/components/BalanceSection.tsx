import { useUserBalance } from '@/hooks/useUser'
import { SkeletonCard, SkeletonText } from '@/components/ui'

const BalanceCardsSkeleton = () => {
  return (
    <div className="grid grid-cols-2 gap-3">
      <SkeletonCard gradient="purple">
        <div className="flex flex-col items-center text-center">
          <span className="text-2xl mb-2">✨</span>
          <SkeletonText width="md" height="lg" />
        </div>
      </SkeletonCard>

      <SkeletonCard gradient="emerald">
        <div className="flex flex-col items-center text-center">
          <span className="text-2xl mb-2">🎁</span>
          <SkeletonText width="md" height="lg" />
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

  return (
    <div className="grid grid-cols-2 gap-3">
      <div 
        className="w-auto h-16 rounded-xl bg-gradient-to-r from-purple-50/80 to-indigo-50/80 dark:from-purple-900/30 dark:to-indigo-900/30 p-3 border border-white/20 dark:border-purple-500/20 flex justify-center items-center"
        title="Moedas para Elogiar"
      >
        <div className="w-auto h-auto flex gap-2 justify-center items-center text-center">
          <span className="text-2xl mb-1">✨</span>
          <p className="text-lg font-bold text-purple-700 dark:text-purple-300 drop-shadow-sm">
            {formatBalance(complimentBalance)}
          </p>
        </div>
        
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-10">
          Moedas para Elogiar
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-900 dark:border-t-gray-100"></div>
        </div>
      </div>

      <div 
        className="w-auto h-16 rounded-xl bg-gradient-to-r from-emerald-50/80 to-teal-50/80 dark:from-emerald-900/30 dark:to-teal-900/30 p-3 backdrop-blur-md border border-white/20 dark:border-emerald-500/20"
        title="Moedas Resgatáveis"
      >
        <div className="flex gap-2 justify-center align-center items-center text-center">
          <span className="text-2xl mb-1">🎁</span>
          <p className="text-lg font-bold text-emerald-700 dark:text-emerald-300">
            {formatBalance(redeemableBalance)}
          </p>
        </div>
        
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-10">
          Moedas Resgatáveis
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-900 dark:border-t-gray-100"></div>
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

