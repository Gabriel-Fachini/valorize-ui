import React from 'react'
import { Prize } from '@/types/prize.types'
import { useSpring, animated, config } from '@react-spring/web'
import { useNavigate } from '@tanstack/react-router'

interface PrizesMiniCardProps {
  prize: Prize
  index?: number
}

export const PrizesMiniCard: React.FC<PrizesMiniCardProps> = ({
  prize,
  index = 0,
}) => {
  const navigate = useNavigate()
  const [isHovered, setIsHovered] = React.useState(false)

  const capitalizeCategory = (category: string) => {
    return category
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join('-')
  }

  const springProps = useSpring({
    from: { opacity: 0, transform: 'translateY(10px)' },
    to: { opacity: 1, transform: 'translateY(0px)' },
    delay: index * 80,
    config: { tension: 280, friction: 60 },
  })

  const hoverSpring = useSpring({
    transform: isHovered ? 'scale(1.02)' : 'scale(1)',
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
        className="group relative h-full cursor-pointer overflow-hidden rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 backdrop-blur-xl hover:border-gray-300 dark:hover:border-white/20 shadow-md hover:shadow-lg flex flex-col transition-all duration-200"
      >
        {/* Imagem do prêmio */}
        <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900/50 dark:to-gray-800/50">
          <img
            src={prize.images[0]}
            alt={prize.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className={`absolute inset-0 bg-gradient-to-t ${getCategoryColor(prize.category)} opacity-40`} />
        </div>

        {/* Conteúdo */}
        <div className="relative p-3 flex flex-col flex-grow">
          {/* Categoria */}
          <span className="mb-2 w-fit rounded-full bg-white/80 dark:bg-white/10 border border-white/40 dark:border-white/20 px-2 py-0.5 text-xs font-medium text-gray-800 dark:text-white backdrop-blur-sm">
            {capitalizeCategory(prize.category)}
          </span>

          {/* Nome do prêmio */}
          <h4 className="mb-2 line-clamp-2 text-sm font-semibold text-gray-900 dark:text-white leading-tight">
            {prize.name}
          </h4>

          {/* Preço */}
          <div className="flex items-baseline gap-1 mt-auto pt-2 border-t border-gray-100 dark:border-white/5">
            <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
              {prize.coinPrice.toLocaleString('pt-BR')}
            </span>
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">moedas</span>
          </div>

          {/* Alerta de estoque baixo */}
          {prize.stock <= 5 && (
            <div className="mt-2 flex items-center gap-1 text-xs text-orange-600 dark:text-orange-400">
              <i className="ph ph-warning-circle"></i>
              <span>{prize.stock} restantes</span>
            </div>
          )}
        </div>
      </animated.div>
    </animated.div>
  )
}
