/**
 * TransactionList Component
 * Renders list of transactions with animations
 */

import { TransactionCard } from './TransactionCard'
import { SkeletonTransactionCard } from './SkeletonTransactionCard'
import { AnimatedList } from '@/components/ui/AnimatedList'
import { EmptyState } from '@/components/ui/EmptyState'
import type { Transaction } from '@/types'

interface TransactionListProps {
  transactions: Transaction[]
  loading: boolean
  emptyState?: React.ReactNode
  className?: string
}

export const TransactionList = ({
  transactions,
  loading,
  emptyState,
  className,
}: TransactionListProps) => {
  // Show skeletons while loading (initial load or filter change)
  if (loading && transactions.length === 0) {
    return (
      <AnimatedList
        items={Array.from({ length: 5 })}
        renderItem={() => <SkeletonTransactionCard />}
        keyExtractor={(_, index) => `skeleton-${index}`}
        className={className}
        animationType="fade"
      />
    )
  }

  // Show skeletons for filter changes when there are existing transactions
  if (loading && transactions.length > 0) {
    return (
      <div className={className}>
        <AnimatedList
          items={transactions}
          renderItem={(transaction) => (
            <TransactionCard transaction={transaction} />
          )}
          keyExtractor={(transaction) => transaction.id}
          animationType="fade"
        />
        <div className="mt-4">
          <AnimatedList
            items={Array.from({ length: 3 })}
            renderItem={() => <SkeletonTransactionCard />}
            keyExtractor={(_, index) => `loading-${index}`}
            animationType="fade"
          />
        </div>
      </div>
    )
  }

  // Show empty state if no transactions
  if (transactions.length === 0) {
    return (
      <div className={className}>
        {emptyState ?? (
          <EmptyState
            icon="ph-bold ph-chart-bar"
            title="Nenhuma transação encontrada"
            description="Suas movimentações de moedas aparecerão aqui quando você enviar elogios ou resgatar prêmios."
          />
        )}
      </div>
    )
  }

  // Show transactions with animation
  return (
    <AnimatedList
      items={transactions}
      renderItem={(transaction) => (
        <TransactionCard transaction={transaction} />
      )}
      keyExtractor={(transaction) => transaction.id}
      className={className}
      animationType="fade"
    />
  )
}