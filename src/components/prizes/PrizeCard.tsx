import React from 'react'
import { Prize } from '@/types/prize.types'
import { useSpring, animated } from '@react-spring/web'
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
    config: { tension: 300, friction: 10 },
  })

  const categoryColors = {
    eletronicos: 'from-blue-500/20 to-cyan-500/20',
    casa: 'from-amber-500/20 to-orange-500/20',
    esporte: 'from-green-500/20 to-emerald-500/20',
    livros: 'from-purple-500/20 to-pink-500/20',
    'vale-compras': 'from-red-500/20 to-rose-500/20',
    experiencias: 'from-indigo-500/20 to-purple-500/20',
  }

  const categoryLabels = {
    eletronicos: 'Eletrônicos',
    casa: 'Casa',
    esporte: 'Esporte',
    livros: 'Livros',
    'vale-compras': 'Vale Compras',
    experiencias: 'Experiências',
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
        className="group relative h-full cursor-pointer overflow-hidden rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 backdrop-blur-xl transition-colors hover:border-gray-300 dark:hover:border-white/20 shadow-lg hover:shadow-xl"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900/50 dark:to-gray-800/50">
          <img
            src={prize.images[0]}
            alt={prize.title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />

          {prize.featured && (
            <div className="absolute right-2 top-2 rounded-full bg-gradient-to-r from-yellow-500 to-amber-500 px-3 py-1 text-xs font-semibold text-white shadow-lg">
              Destaque
            </div>
          )}

          <div className={`absolute inset-0 bg-gradient-to-t ${categoryColors[prize.category]} opacity-40`} />
        </div>

        <div className="relative p-5">
          <div className="mb-2 flex items-center justify-between">
            <span className="rounded-full bg-gray-100 dark:bg-white/10 px-3 py-1 text-xs font-medium text-gray-700 dark:text-gray-300 backdrop-blur-md">
              {categoryLabels[prize.category]}
            </span>
            {prize.stock <= 5 && (
              <span className="text-xs text-orange-400">
                Últimas {prize.stock} unidades
              </span>
            )}
          </div>

          <h3 className="mb-2 line-clamp-2 text-lg font-semibold text-gray-900 dark:text-white transition-colors group-hover:text-purple-600 dark:group-hover:text-purple-400">
            {prize.title}
          </h3>

          <p className="mb-4 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
            {prize.description}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">
                {prize.price.toLocaleString('pt-BR')}
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400">moedas</span>
            </div>

            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 dark:bg-white/10 backdrop-blur-md transition-all group-hover:bg-gradient-to-r group-hover:from-purple-500 group-hover:to-indigo-500">
              <svg
                className="h-4 w-4 text-gray-700 dark:text-white group-hover:text-white transition-transform group-hover:translate-x-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>

          {prize.brand && (
            <div className="mt-3 flex items-center gap-2 border-t border-gray-200 dark:border-white/5 pt-3">
              <span className="text-xs text-gray-500">por</span>
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{prize.brand}</span>
            </div>
          )}
        </div>
      </animated.div>
    </animated.div>
  )
}