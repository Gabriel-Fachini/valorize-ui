/**
 * New Praise Error Component
 * Error state com retry para carregamento de dados
 */

import { animated } from '@react-spring/web'
import { useNavigate } from '@tanstack/react-router'
import { useCardEntrance } from '@/hooks/useAnimations'

interface NewPraiseErrorProps {
  error: string
  onRetry: () => void
}

export const NewPraiseError = ({ error, onRetry }: NewPraiseErrorProps) => {
  const navigate = useNavigate()
  const cardAnimation = useCardEntrance()
  
  return (
    <animated.div style={cardAnimation} className="flex flex-col items-center justify-center py-16 px-4">
      <div className="max-w-md w-full text-center">
        <div className="w-24 h-24 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <i className="ph-bold ph-warning-circle text-red-500 text-6xl"></i>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
          Erro ao Carregar Dados
        </h2>
        
        <p className="text-base text-gray-600 dark:text-gray-400 mb-6">
          {error || 'Não foi possível carregar os dados necessários para enviar um elogio. Tente novamente.'}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={onRetry}
            className="px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl font-bold hover:from-primary-700 hover:to-primary-800 transition-all shadow-lg flex items-center justify-center gap-2"
          >
            <i className="ph-bold ph-arrow-clockwise text-lg"></i>
            Tentar Novamente
          </button>
          
          <button
            onClick={() => navigate({ to: '/elogios' })}
            className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-xl font-bold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
          >
            Voltar para Elogios
          </button>
        </div>
      </div>
    </animated.div>
  )
}
