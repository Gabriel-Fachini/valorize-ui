/**
 * Transaction Reason Mapper
 * Maps API reason strings to user-friendly Portuguese descriptions
 */

import type { TransactionType, BalanceType } from '@/types'

interface ReasonMappingResult {
  title: string
  sourceIcon: string
  sourceLabel: string
  sourceBgColor: string
  sourceIconColor: string
}

/**
 * Maps transaction reason from API to user-friendly Portuguese text
 * Handles various reason patterns returned by the API
 * Includes contextual details from metadata (names, prize info, etc.)
 */
export const mapTransactionReason = (
  reason: string,
  transactionType: TransactionType,
  balanceType: BalanceType,
  metadata: Record<string, unknown> | null = null,
): ReasonMappingResult => {
  const reasonLower = (reason || '').toLowerCase()
  
  // Extract metadata fields safely
  const receiverName = metadata?.receiverName as string | undefined
  const senderName = metadata?.senderName as string | undefined
  const prizeName = metadata?.prizeName as string | undefined

  // ========================================
  // COMPLIMENT-RELATED TRANSACTIONS
  // ========================================
  if (reasonLower.includes('received compliment') || reasonLower.includes('elogio recebido')) {
    const title = senderName ? `Elogio de ${senderName}` : 'Elogio Recebido'
    return {
      title,
      sourceIcon: 'ph-heart',
      sourceLabel: 'Elogio',
      sourceBgColor: 'bg-pink-100 dark:bg-pink-900/20',
      sourceIconColor: 'text-pink-600 dark:text-pink-400',
    }
  }

  if (reasonLower.includes('sent compliment') || reasonLower.includes('elogio enviado')) {
    const title = receiverName ? `Elogio para ${receiverName}` : 'Elogio Enviado'
    return {
      title,
      sourceIcon: 'ph-heart',
      sourceLabel: 'Elogio',
      sourceBgColor: 'bg-pink-100 dark:bg-pink-900/20',
      sourceIconColor: 'text-pink-600 dark:text-pink-400',
    }
  }

  if (reasonLower.includes('compliment') || reasonLower.includes('elogio')) {
    let title = transactionType === 'CREDIT' ? 'Elogio Recebido' : 'Elogio Enviado'
    
    // Add contextual name based on transaction type
    if (transactionType === 'CREDIT' && senderName) {
      title = `Elogio de ${senderName}`
    } else if (transactionType === 'DEBIT' && receiverName) {
      title = `Elogio para ${receiverName}`
    }
    
    return {
      title,
      sourceIcon: 'ph-heart',
      sourceLabel: 'Elogio',
      sourceBgColor: 'bg-pink-100 dark:bg-pink-900/20',
      sourceIconColor: 'text-pink-600 dark:text-pink-400',
    }
  }

  // ========================================
  // PRIZE/REDEMPTION-RELATED TRANSACTIONS
  // ========================================
  if (reasonLower.includes('prize redeemed') || reasonLower.includes('prêmio resgatado')) {
    const title = prizeName ? `Prêmio Resgatado: ${prizeName}` : 'Prêmio Resgatado'
    return {
      title,
      sourceIcon: 'ph-gift',
      sourceLabel: 'Prêmio',
      sourceBgColor: 'bg-purple-100 dark:bg-purple-900/20',
      sourceIconColor: 'text-purple-600 dark:text-purple-400',
    }
  }

  if (reasonLower.includes('redemption cancelled') || reasonLower.includes('resgate cancelado')) {
    const title = prizeName ? `Resgate Cancelado: ${prizeName}` : 'Resgate Cancelado'
    return {
      title,
      sourceIcon: 'ph-gift',
      sourceLabel: 'Prêmio',
      sourceBgColor: 'bg-purple-100 dark:bg-purple-900/20',
      sourceIconColor: 'text-purple-600 dark:text-purple-400',
    }
  }

  if (reasonLower.includes('prize') || reasonLower.includes('prêmio') || reasonLower.includes('redemption') || reasonLower.includes('resgate')) {
    let title = transactionType === 'DEBIT' ? 'Prêmio Resgatado' : 'Resgate Cancelado'
    
    // Add prize name if available
    if (prizeName) {
      title = transactionType === 'DEBIT' 
        ? `Prêmio Resgatado: ${prizeName}` 
        : `Resgate Cancelado: ${prizeName}`
    }
    
    return {
      title,
      sourceIcon: 'ph-gift',
      sourceLabel: 'Prêmio',
      sourceBgColor: 'bg-purple-100 dark:bg-purple-900/20',
      sourceIconColor: 'text-purple-600 dark:text-purple-400',
    }
  }

  // ========================================
  // SYSTEM-RELATED TRANSACTIONS
  // ========================================
  if (reasonLower.includes('monthly allowance') || reasonLower.includes('mesada mensal')) {
    return {
      title: 'Mesada Mensal',
      sourceIcon: 'ph-calendar-check',
      sourceLabel: 'Sistema',
      sourceBgColor: 'bg-blue-100 dark:bg-blue-900/20',
      sourceIconColor: 'text-blue-600 dark:text-blue-400',
    }
  }

  if (reasonLower.includes('weekly reset') || reasonLower.includes('reset semanal')) {
    return {
      title: 'Reset Semanal',
      sourceIcon: 'ph-arrow-clockwise',
      sourceLabel: 'Sistema',
      sourceBgColor: 'bg-blue-100 dark:bg-blue-900/20',
      sourceIconColor: 'text-blue-600 dark:text-blue-400',
    }
  }

  if (reasonLower.includes('admin adjustment') || reasonLower.includes('ajuste administrativo')) {
    return {
      title: 'Ajuste Administrativo',
      sourceIcon: 'ph-shield-check',
      sourceLabel: 'Sistema',
      sourceBgColor: 'bg-blue-100 dark:bg-blue-900/20',
      sourceIconColor: 'text-blue-600 dark:text-blue-400',
    }
  }

  if (reasonLower.includes('balance correction') || reasonLower.includes('correção de saldo')) {
    return {
      title: 'Correção de Saldo',
      sourceIcon: 'ph-gear',
      sourceLabel: 'Sistema',
      sourceBgColor: 'bg-blue-100 dark:bg-blue-900/20',
      sourceIconColor: 'text-blue-600 dark:text-blue-400',
    }
  }

  // ========================================
  // FALLBACK BASED ON TRANSACTION TYPE
  // ========================================
  if (transactionType === 'RESET') {
    return {
      title: 'Reset de Saldo',
      sourceIcon: 'ph-arrow-clockwise',
      sourceLabel: 'Sistema',
      sourceBgColor: 'bg-blue-100 dark:bg-blue-900/20',
      sourceIconColor: 'text-blue-600 dark:text-blue-400',
    }
  }

  if (transactionType === 'CREDIT') {
    return {
      title: balanceType === 'COMPLIMENT' ? 'Moedas Recebidas' : 'Saldo Adicionado',
      sourceIcon: 'ph-gear',
      sourceLabel: 'Sistema',
      sourceBgColor: 'bg-blue-100 dark:bg-blue-900/20',
      sourceIconColor: 'text-blue-600 dark:text-blue-400',
    }
  }

  if (transactionType === 'DEBIT') {
    return {
      title: balanceType === 'COMPLIMENT' ? 'Moedas Gastas' : 'Saldo Deduzido',
      sourceIcon: 'ph-gear',
      sourceLabel: 'Sistema',
      sourceBgColor: 'bg-blue-100 dark:bg-blue-900/20',
      sourceIconColor: 'text-blue-600 dark:text-blue-400',
    }
  }

  // Ultimate fallback
  return {
    title: 'Transação',
    sourceIcon: 'ph-circle',
    sourceLabel: 'Sistema',
    sourceBgColor: 'bg-gray-100 dark:bg-gray-800/50',
    sourceIconColor: 'text-gray-600 dark:text-gray-400',
  }
}
