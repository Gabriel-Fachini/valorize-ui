/**
 * EmptyState Component for Transactions
 * Displays when there are no transactions to show
 */

import { animated } from '@react-spring/web'

interface EmptyStateProps {
  message?: string
  description?: string
  style?: React.CSSProperties
  className?: string
}

export const EmptyState = ({ 
  message = 'Nenhuma transação encontrada',
  description = 'Suas movimentações de moedas aparecerão aqui quando você enviar elogios ou resgatar prêmios.',
  style = {},
  className = '',
}: EmptyStateProps) => {
  return (
    <animated.div 
      style={style}
      className={`
        flex flex-col items-center justify-center
        py-12 sm:py-16 px-4
        text-center
        ${className}
      `}
    >
      {/* Empty state icon */}
      <div className="
        w-16 h-16 sm:w-20 sm:h-20 
        bg-green-100 
        dark:bg-green-900/30
        rounded-full 
        flex items-center justify-center
        mb-4 sm:mb-6
      ">
        <i className="ph ph-chart-bar text-3xl sm:text-4xl text-green-600 dark:text-green-400" aria-hidden="true" />
      </div>
      
      {/* Empty state text */}
      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
        {message}
      </h3>
      
      <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-md">
        {description}
      </p>
      
      {/* Optional action hint */}
      <div className="mt-6 sm:mt-8">
        <div className="
          px-4 py-2 
          bg-green-50 dark:bg-green-900/20 
          border border-green-200 dark:border-green-800/30
          rounded-lg
          text-sm text-green-700 dark:text-green-300
        ">
          💡 Experimente ajustar os filtros para ver mais transações
        </div>
      </div>
    </animated.div>
  )
}