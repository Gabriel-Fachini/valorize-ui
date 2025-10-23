import React from 'react'
import type { Redemption } from '@/types/redemption.types'
import { useNavigate } from '@tanstack/react-router'
import { useSpring, animated } from '@react-spring/web'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RedemptionStatusBadge } from './RedemptionStatusBadge'

interface Props {
  redemption: Redemption
}

export const RedemptionCard: React.FC<Props> = ({ redemption }) => {
  const navigate = useNavigate()

  const [isHovered, setIsHovered] = React.useState(false)
  const [isImageLoading, setIsImageLoading] = React.useState(true)


  // Card hover animation
  const cardSpring = useSpring({
    transform: isHovered ? 'translateY(-2px)' : 'translateY(0px)',
    boxShadow: isHovered 
      ? '0 8px 16px -4px rgba(0, 0, 0, 0.12), 0 4px 8px -2px rgba(0, 0, 0, 0.08)' 
      : '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    config: { tension: 300, friction: 25 },
  })

  // Image animation  
  const imageSpring = useSpring({
    transform: isHovered ? 'scale(1.03)' : 'scale(1)',
    opacity: isImageLoading ? 0 : 1,
    config: { tension: 200, friction: 20 },
  })

  const goToPrize = () => navigate({ to: `/prizes/${redemption.prizeId}` })
  const goToDetails = () => navigate({ to: `/resgates/${redemption.id}` })

  const date = new Date(redemption.redeemedAt).toLocaleString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
  const amountFormatted = new Intl.NumberFormat('pt-BR').format(redemption.coinsSpent)

  return (
    <animated.div 
      style={cardSpring}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card className="p-5 bg-white dark:bg-neutral-800 border-gray-200 dark:border-neutral-700 hover:border-gray-300 dark:hover:border-neutral-600 transition-colors">
        <div className="flex flex-col sm:flex-row gap-5">
          {/* Prize Image */}
          <button 
            onClick={goToPrize} 
            className="shrink-0 relative focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-900 rounded-xl overflow-hidden group"
            aria-label={`Ver prêmio ${redemption.prize.name}`}
          >
            <animated.img
              style={imageSpring}
              src={redemption.prize.images[0] ?? '/valorize_logo.png'}
              alt={redemption.prize.name}
              className="h-28 w-28 rounded-xl object-cover border-2 border-gray-200 dark:border-neutral-600 group-hover:border-green-500 dark:group-hover:border-green-500 transition-colors"
              loading="lazy"
              onLoad={() => setIsImageLoading(false)}
              onError={() => setIsImageLoading(false)}
            />
          </button>

          <div className="flex-1 min-w-0">
            {/* Header: Title and Status */}
            <div className="mb-4 flex items-start justify-between gap-3">
              <button onClick={goToPrize} className="text-left flex-1 min-w-0">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white hover:text-green-600 dark:hover:text-green-400 transition-colors truncate">
                  {redemption.prize.name}
                </h3>
                <p className="mt-1 text-sm font-medium text-gray-600 dark:text-gray-400">
                  {redemption.prize.category}
                </p>
              </button>
              
              <RedemptionStatusBadge 
                status={redemption.status}
                size="sm"
                showIcon={true}
              />
            </div>

            {/* Variant Info (if exists) */}
            {redemption.variant && (
              <div className="mb-4 flex items-center gap-2">
                <i className="ph-bold ph-tag text-base text-gray-500 dark:text-gray-400" />
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Variante: <span className="font-normal">{redemption.variant.value}</span>
                </span>
              </div>
            )}
              
            {/* Footer: Amount, Date, and Action */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              {/* Amount and Date */}
              <div className="flex flex-col gap-2">
                {/* Coin Amount */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 rounded-lg bg-red-50 dark:bg-red-950 px-3 py-1.5 border border-red-200 dark:border-red-800">
                    <i className="ph-bold ph-coins text-base text-red-600 dark:text-red-400" />
                    <span className="text-base font-bold text-red-700 dark:text-red-300">
                      {amountFormatted}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">moedas</span>
                </div>
                
                {/* Date */}
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <i className="ph-bold ph-calendar-blank text-base" />
                  <time dateTime={redemption.redeemedAt}>{date}</time>
                </div>
              </div>

              {/* Action Button */}
              <Button
                onClick={goToDetails}
                variant="default"
                size="sm"
                aria-label={`Ver detalhes do resgate ${redemption.prize.name}`}
                className="sm:self-end bg-green-600 hover:bg-green-700 text-white border-0 font-semibold px-5 py-2.5 h-auto"
              >
                <i className="ph-bold ph-arrow-right text-base mr-2" />
                Ver detalhes
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </animated.div>
  )
}
