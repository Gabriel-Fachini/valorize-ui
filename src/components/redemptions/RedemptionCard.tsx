import React from 'react'
import type { Redemption } from '@/types/redemption.types'

import { useNavigate } from '@tanstack/react-router'
import { useSpring, animated } from '@react-spring/web'

const categoryLabels: Record<Redemption['category'], string> = {
  eletronicos: 'Eletrônicos',
  casa: 'Casa',
  esporte: 'Esporte',
  livros: 'Livros',
  'vale-compras': 'Vale Compras',
  experiencias: 'Experiências',
}

const statusConfig: Record<Redemption['status'], {
  badge: string
  icon: React.ReactNode
}> = {
  PENDING: {
    badge: 'bg-gradient-to-r from-amber-500/10 via-yellow-500/10 to-orange-500/10 text-amber-700 border border-amber-300/30 dark:from-amber-400/20 dark:via-yellow-400/20 dark:to-orange-400/20 dark:text-amber-300 dark:border-amber-400/40',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  PROCESSING: {
    badge: 'bg-gradient-to-r from-indigo-500/10 via-blue-500/10 to-cyan-500/10 text-indigo-700 border border-indigo-300/30 dark:from-indigo-400/20 dark:via-blue-400/20 dark:to-cyan-400/20 dark:text-indigo-300 dark:border-indigo-400/40',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
  },
  COMPLETED: {
    badge: 'bg-gradient-to-r from-emerald-500/10 via-green-500/10 to-teal-500/10 text-emerald-700 border border-emerald-300/30 dark:from-emerald-400/20 dark:via-green-400/20 dark:to-teal-400/20 dark:text-emerald-300 dark:border-emerald-400/40',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
      </svg>
    ),
  },
  CANCELLED: {
    badge: 'bg-gradient-to-r from-gray-500/10 via-slate-500/10 to-gray-600/10 text-gray-700 border border-gray-300/30 dark:from-white/10 dark:via-gray-400/10 dark:to-gray-500/10 dark:text-gray-300 dark:border-white/20',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
  },
}

interface Props {
  redemption: Redemption
}

export const RedemptionCard: React.FC<Props> = ({ redemption }) => {
  const navigate = useNavigate()

  const [isHovered, setIsHovered] = React.useState(false)
  const [isImageLoading, setIsImageLoading] = React.useState(true)



  // Animação do card principal
  const cardSpring = useSpring({
    transform: isHovered ? 'translateY(-4px) scale(1.01)' : 'translateY(0px) scale(1)',
    boxShadow: isHovered 
      ? '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' 
      : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    config: { tension: 300, friction: 20 },
  })

  // Animação da imagem  
  const imageSpring = useSpring({
    transform: isHovered ? 'scale(1.05)' : 'scale(1)',
    opacity: isImageLoading ? 0 : 1,
    config: { tension: 200, friction: 15 },
  })



  const goToPrize = () => navigate({ to: `/prizes/${redemption.prizeId}` })
  const goToDetails = () => navigate({ to: `/resgates/${redemption.id}` })

  const date = new Date(redemption.createdAt).toLocaleString('pt-BR')
  const amountFormatted = new Intl.NumberFormat('pt-BR').format(redemption.amount)

  return (
    <animated.div 
      style={cardSpring}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="rounded-3xl border border-gray-200/50 dark:border-white/10 bg-gradient-to-br from-white/90 via-white/80 to-gray-50/80 dark:from-white/10 dark:via-white/5 dark:to-gray-500/5 p-6 backdrop-blur-2xl"
    >
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
        <button onClick={goToPrize} className="shrink-0 relative focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:ring-offset-2 dark:focus:ring-offset-gray-900 rounded-2xl">
          <animated.img
            style={imageSpring}
            src={redemption.prizeImage ?? '/valorize_logo.png'}
            alt={redemption.prizeTitle}
            className="h-24 w-24 rounded-2xl object-cover border-2 border-white/50 dark:border-white/20 shadow-lg"
            loading="lazy"
            onLoad={() => setIsImageLoading(false)}
            onError={() => setIsImageLoading(false)}
          />
        </button>

        <div className="flex-1">
          <div className="mb-1 flex items-center gap-2">
            <button onClick={goToPrize} className="text-left">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-300">
                {redemption.prizeTitle}
              </h3>
            </button>
            <div className={`ml-auto flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-semibold backdrop-blur-sm ${statusConfig[redemption.status].badge}`}>
              <span className="flex items-center justify-center">{statusConfig[redemption.status].icon}</span>
              <span>
                {redemption.status === 'PENDING' && 'Pendente'}
                {redemption.status === 'PROCESSING' && 'Processando'}
                {redemption.status === 'COMPLETED' && 'Concluído'}
                {redemption.status === 'CANCELLED' && 'Cancelado'}
              </span>
            </div>
          </div>

          <div className="mb-4 space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-gray-100 to-gray-50 dark:from-white/15 dark:to-white/10 px-3 py-1.5 backdrop-blur-sm border border-gray-200/50 dark:border-white/10">
                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h10l2 5-2 5H7l-2-5 2-5z" />
                </svg>
                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  {categoryLabels[redemption.category]}
                </span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m3 0H4a1 1 0 00-1 1v16a1 1 0 001 1h16a1 1 0 001-1V5a1 1 0 00-1-1z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9h6M9 13h6" />
                </svg>
                <span>Qtd: <span className="font-semibold text-gray-800 dark:text-gray-200">{redemption.quantity}</span></span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
                <div className="flex items-center gap-1 rounded-lg bg-gradient-to-r from-rose-50 to-red-50 dark:from-rose-500/20 dark:to-red-500/20 px-2.5 py-1 border border-rose-200/50 dark:border-rose-500/30">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1L13.5 2.5L16.17 5.17C15.24 5.06 14.32 5 13.4 5H10.6C9.68 5 8.76 5.06 7.83 5.17L10.5 2.5L9 1L3 7V9H5V20C5 21.1 5.9 22 7 22H17C18.1 22 19 21.1 19 20V9H21ZM7 20V9H17V20H7Z" />
                  </svg>
                  <span className="text-sm font-bold">-{amountFormatted}</span>
                </div>
                <span className="text-xs font-medium">moedas</span>
              </div>
              
              <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {date}
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={goToDetails}
              aria-label={`Ver detalhes do resgate ID ${redemption.id}`}
              className="flex items-center gap-2 rounded-xl border border-gray-200/50 dark:border-white/10 bg-gradient-to-r from-white/80 to-gray-50/80 dark:from-white/10 dark:to-white/5 px-4 py-3 min-h-[44px] text-sm font-medium text-gray-700 dark:text-gray-200 backdrop-blur-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Ver detalhes
            </button>


          </div>
        </div>
      </div>
    </animated.div>
  )
}
