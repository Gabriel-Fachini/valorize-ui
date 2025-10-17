import React from 'react'
import { Prize } from '@/types/prize.types'
import { useSpring, animated, config } from '@react-spring/web'
import { useNavigate } from '@tanstack/react-router'

interface PrizeCardProps {
  prize: Prize
  index?: number
}

export const PrizeCard: React.FC<PrizeCardProps> = ({ prize, index = 0 }) => {
  const navigate = useNavigate()
  const [isHovered, setIsHovered] = React.useState(false)

  const springProps = useSpring({
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0px)' },
    delay: index * 50,
    config: { tension: 280, friction: 60 },
  })

  const hoverSpring = useSpring({
    transform: isHovered ? 'scale(1.03)' : 'scale(1)',
    boxShadow: isHovered
      ? '0 20px 25px -5px rgb(0 0 0 / 0.3), 0 10px 10px -5px rgb(0 0 0 / 0.2)'
      : '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -2px rgb(0 0 0 / 0.05)',
    // config: { tension: 300, friction: 10 },
    config: config.gentle,
  })

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      eletronicos: 'from-blue-500/20 to-cyan-500/20',
      electronics: 'from-blue-500/20 to-cyan-500/20',
      casa: 'from-amber-500/20 to-orange-500/20',
      'home-office': 'from-amber-500/20 to-orange-500/20',
      esporte: 'from-green-500/20 to-emerald-500/20',
      livros: 'from-purple-500/20 to-pink-500/20',
      'vale-compras': 'from-red-500/20 to-rose-500/20',
      'gift-cards': 'from-red-500/20 to-rose-500/20',
      experiencias: 'from-indigo-500/20 to-purple-500/20',
      experiences: 'from-indigo-500/20 to-purple-500/20',
    }
    return colors[category] || 'from-gray-500/20 to-gray-600/20'
  }

  const handleClick = () => {
    navigate({ to: `/prizes/${prize.id}` })
  }

  return (
    <animated.div
      style={springProps}
      className="h-full"
    >
      <animated.div
        style={hoverSpring}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
        className="group relative h-full cursor-pointer overflow-hidden rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 backdrop-blur-xl transition-colors hover:border-gray-300 dark:hover:border-white/20 shadow-lg hover:shadow-xl flex flex-col"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900/50 dark:to-gray-800/50">
          <img
            src={prize.images[0]}
            alt={prize.name}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />

          <div className={`absolute inset-0 bg-gradient-to-t ${getCategoryColor(prize.category)} opacity-40`} />
        </div>

        <div className="relative p-5 flex flex-col flex-grow">
          <div className="mb-2 flex items-center justify-between">
            <span className="rounded-full bg-gray-100 dark:bg-white/10 px-3 py-1 text-xs font-medium text-gray-700 dark:text-gray-300 backdrop-blur-md">
              {prize.category}
            </span>
            {prize.stock <= 5 && (
              <span className="text-xs text-orange-400">
                Últimas {prize.stock} unidades
              </span>
            )}
          </div>

          <h3 className="mb-2 line-clamp-2 text-lg font-semibold text-gray-900 dark:text-white transition-colors group-hover:text-green-600 dark:group-hover:text-green-500">
            {prize.name}
          </h3>

          <p className="mb-4 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
            {prize.description}
          </p>

          <div className="flex items-center gap-1 mt-auto">
            <span className="text-2xl font-bold text-amber-600 dark:text-amber-500">
              {prize.coinPrice.toLocaleString('pt-BR')}
            </span>
            <span className="text-sm text-gray-600 dark:text-gray-400">moedas</span>
          </div>
        </div>
      </animated.div>
    </animated.div>
  )
}