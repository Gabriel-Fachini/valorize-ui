/**
 * TransactionCard Component
 * Individual transaction card display
 */

import { useMemo } from 'react'
import { animated } from '@react-spring/web'
import type { Transaction, TransactionDisplayInfo } from '@/types'

interface TransactionCardProps {
  transaction: Transaction
  style?: React.CSSProperties
  className?: string
}

// Transaction type icons (using Unicode emojis for now, can be replaced with icon library)
const getTransactionDisplayInfo = (transaction: Transaction): TransactionDisplayInfo => {
  const { transactionType, balanceType, reason } = transaction

  // Determine icon and color based on transaction type
  const baseInfo = {
    CREDIT: {
      icon: '⬆️',
      color: 'from-green-500 to-emerald-600',
      amountPrefix: '+' as const,
    },
    DEBIT: {
      icon: '⬇️', 
      color: 'from-red-500 to-rose-600',
      amountPrefix: '-' as const,
    },
    RESET: {
      icon: '🔄',
      color: 'from-blue-500 to-cyan-600',
      amountPrefix: '' as const,
    },
  }

  const typeInfo = baseInfo[transactionType]
  
  // Generate title based on transaction type and reason
  let title = reason || 'Transação'
  if (transactionType === 'CREDIT') {
    title = reason || (balanceType === 'COMPLIMENT' ? 'Moedas Recebidas' : 'Saldo Adicionado')
  } else if (transactionType === 'DEBIT') {
    title = reason || (balanceType === 'COMPLIMENT' ? 'Elogio Enviado' : 'Resgate Realizado')
  } else if (transactionType === 'RESET') {
    title = reason || 'Reset Semanal'
  }

  const balanceTypeLabel = balanceType === 'COMPLIMENT' ? 'Moedas para Elogiar' : 'Moedas para Resgatar'
  
  return {
    ...typeInfo,
    title,
    description: balanceTypeLabel,
  }
}

export const TransactionCard = ({ 
  transaction, 
  style = {},
  className = '',
}: TransactionCardProps) => {
  const displayInfo = useMemo(() => getTransactionDisplayInfo(transaction), [transaction])
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatAmount = (amount: number, prefix: string) => {
    return `${prefix}${amount.toLocaleString('pt-BR')}`
  }

  return (
    <animated.div 
      style={style}
      className={`
        bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm 
        border border-white/30 dark:border-gray-700/30 
        rounded-xl sm:rounded-2xl p-4 sm:p-6
        hover:bg-white/80 dark:hover:bg-gray-800/80
        transition-all duration-200
        ${className}
      `}
    >
      <div className="flex items-start justify-between">
        {/* Left side - Transaction info */}
        <div className="flex items-start space-x-3 sm:space-x-4 flex-1">
          {/* Icon */}
          <div className={`
            w-10 h-10 sm:w-12 sm:h-12 
            bg-gradient-to-br ${displayInfo.color}
            rounded-xl sm:rounded-2xl
            flex items-center justify-center
            text-lg sm:text-xl
            shadow-lg
          `}>
            {displayInfo.icon}
          </div>
          
          {/* Transaction details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100 truncate">
                {displayInfo.title}
              </h3>
              <span className={`
                text-sm sm:text-base font-bold
                ${transaction.transactionType === 'CREDIT' 
                  ? 'text-green-600 dark:text-green-400'
                  : transaction.transactionType === 'DEBIT'
                  ? 'text-red-600 dark:text-red-400'  
                  : 'text-blue-600 dark:text-blue-400'
                }
              `}>
                {formatAmount(transaction.amount, displayInfo.amountPrefix)}
              </span>
            </div>
            
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2">
              {displayInfo.description}
            </p>
            
            {/* Balance info */}
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-gray-500 dark:text-gray-500">
                Saldo anterior: {transaction.previousBalance.toLocaleString('pt-BR')}
              </span>
              <span className="text-gray-700 dark:text-gray-300 font-medium">
                Novo saldo: {transaction.newBalance.toLocaleString('pt-BR')}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer with timestamp */}
      <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
        <span className="text-xs text-gray-500 dark:text-gray-500">
          {formatDate(transaction.createdAt)}
        </span>
      </div>
    </animated.div>
  )
}