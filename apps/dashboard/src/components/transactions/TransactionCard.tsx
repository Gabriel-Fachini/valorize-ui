/**
 * TransactionCard Component
 * Individual transaction card display with Phosphor icons
 */

import { useMemo, useState } from 'react'
import { animated, useSpring, config } from '@react-spring/web'
import type { Transaction, TransactionDisplayInfo } from '@/types'
import { mapTransactionReason } from '@helpers/transactionReasonMapper'

interface TransactionCardProps {
  transaction: Transaction
  style?: React.CSSProperties
  className?: string
}

// Transaction type configuration with Phosphor icons
const getTransactionDisplayInfo = (transaction: Transaction): TransactionDisplayInfo => {
  const { transactionType, balanceType, reason, metadata } = transaction

  // Determine icon and color based on transaction type
  const baseInfo = {
    CREDIT: {
      icon: 'ph-arrow-up-right',
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      iconColor: 'text-green-600 dark:text-green-400',
      amountColor: 'text-green-600 dark:text-green-400',
      amountPrefix: '+' as const,
    },
    DEBIT: {
      icon: 'ph-arrow-down-left', 
      color: 'from-red-500 to-rose-600',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      iconColor: 'text-red-600 dark:text-red-400',
      amountColor: 'text-red-600 dark:text-red-400',
      amountPrefix: '-' as const,
    },
    RESET: {
      icon: 'ph-arrow-clockwise',
      color: 'from-blue-500 to-cyan-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      iconColor: 'text-blue-600 dark:text-blue-400',
      amountColor: 'text-blue-600 dark:text-blue-400',
      amountPrefix: '' as const,
    },
  }

  const typeInfo = baseInfo[transactionType]
  
  // Use the mapper to get translated and simplified reason with contextual details
  const reasonInfo = mapTransactionReason(reason, transactionType, balanceType, metadata)

  const balanceTypeLabel = balanceType === 'COMPLIMENT' ? 'Moedas para Elogiar' : 'Moedas para Resgatar'
  
  return {
    ...typeInfo,
    title: reasonInfo.title,
    description: balanceTypeLabel,
    sourceIcon: reasonInfo.sourceIcon,
    sourceLabel: reasonInfo.sourceLabel,
    sourceBgColor: reasonInfo.sourceBgColor,
    sourceIconColor: reasonInfo.sourceIconColor,
  }
}

export const TransactionCard = ({ 
  transaction, 
  style = {},
  className = '',
}: TransactionCardProps) => {
  const [showDetails, setShowDetails] = useState(false)
  const displayInfo = useMemo(() => getTransactionDisplayInfo(transaction), [transaction])
  
  // Animação complexa de abertura/fechamento dos detalhes
  // Solução para animação 100% fluída: combinar maxHeight + opacity
  const detailsAnimation = useSpring({
    maxHeight: showDetails ? '150px' : '0px',
    opacity: showDetails ? 1 : 0,
    marginTop: showDetails ? '16px' : '0px',
    paddingTop: showDetails ? '16px' : '0px',
    config: {
      ...config.gentle,
      clamp: true, // Previne overshoot
    },
  })
  
  // Animação do ícone de expansão
  const iconAnimation = useSpring({
    transform: showDetails ? 'rotate(180deg)' : 'rotate(0deg)',
    config: config.gentle,
  })
  
  // Animação do container principal ao expandir
  const cardAnimation = useSpring({
    transform: showDetails ? 'scale(1.02)' : 'scale(1)',
    boxShadow: showDetails 
      ? '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
      : '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    config: config.gentle,
  })
  
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
      style={{ ...cardAnimation, ...style }}
      className={`
        group
        bg-white dark:bg-[#262626] 
        border border-gray-200/80 dark:border-gray-700/50
        rounded-2xl p-5
        hover:shadow-lg hover:border-gray-300 dark:hover:border-gray-600
        cursor-pointer
        ${className}
      `}
      onClick={() => setShowDetails(!showDetails)}
    >
      <div className="flex items-center justify-between gap-4">
        {/* Left side - Icon and Transaction info */}
        <div className="flex items-center gap-4 flex-1 min-w-0">
          {/* Icon with gradient background */}
          <div className={`
            relative
            w-14 h-14
            bg-gradient-to-br ${displayInfo.color}
            rounded-xl
            flex items-center justify-center
            shadow-md
            group-hover:scale-110
          `}>
            <i className={`ph-bold ${displayInfo.icon} text-white text-2xl`}></i>
          </div>
          
          {/* Transaction details */}
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 truncate mb-1">
              {displayInfo.title}
            </h3>
            
            <div className="flex items-center gap-2 flex-wrap">
              {/* Source indicator badge */}
              <span className={`
                inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium
                ${displayInfo.sourceBgColor} ${displayInfo.sourceIconColor}
              `}>
                <i className={`ph-bold ${displayInfo.sourceIcon} text-sm`}></i>
                {displayInfo.sourceLabel}
              </span>
              
              {/* Balance type badge */}
              <span className={`
                inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium
                ${displayInfo.bgColor} ${displayInfo.iconColor}
              `}>
                <i className="ph-bold ph-coins text-sm"></i>
                {displayInfo.description}
              </span>
            </div>
          </div>
        </div>

        {/* Right side - Amount */}
        <div className="flex flex-col items-end gap-1">
          <span className={`
            text-2xl font-bold
            ${displayInfo.amountColor}
          `}>
            {formatAmount(transaction.amount, displayInfo.amountPrefix)}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {formatDate(transaction.createdAt)}
          </span>
        </div>
      </div>
      
      {/* Expandable Balance Details */}
      <animated.div 
        style={{
          ...detailsAnimation,
          overflow: 'hidden',
        }}
      >
        <div className="border-t border-gray-200/50 dark:border-gray-700/50 space-y-2 pt-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
              <i className="ph-bold ph-arrow-bend-left-up text-base"></i>
              Saldo anterior
            </span>
            <span className="font-semibold text-gray-900 dark:text-gray-100">
              {transaction.previousBalance.toLocaleString('pt-BR')} moedas
            </span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
              <i className="ph-bold ph-check-circle text-base"></i>
              Novo saldo
            </span>
            <span className="font-bold text-gray-900 dark:text-gray-100">
              {transaction.newBalance.toLocaleString('pt-BR')} moedas
            </span>
          </div>
        </div>
      </animated.div>
      
      {/* Expand indicator */}
      <div className="flex justify-center mt-3">
        <animated.i 
          style={iconAnimation}
          className="ph-bold ph-caret-down text-gray-400 dark:text-gray-500 text-sm"
        />
      </div>
    </animated.div>
  )
}