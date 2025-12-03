import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Lock, RotateCw } from 'lucide-react'

interface Badge {
  icon: string
  title: string
  status: 'unlocked' | 'locked'
  description: string
}

const BADGES: Badge[] = [
  {
    icon: '🎯',
    title: 'Primeiro Passo',
    status: 'unlocked',
    description: 'Envie seu primeiro elogio para um colega.',
  },
  {
    icon: '🔥',
    title: 'On Fire',
    status: 'unlocked',
    description: 'Receba 3 elogios na mesma semana.',
  },
  {
    icon: '🤝',
    title: 'Parceiro',
    status: 'unlocked',
    description: 'Elogie pessoas de 3 áreas diferentes.',
  },
  {
    icon: '👑',
    title: 'Líder',
    status: 'locked',
    description: 'Fique no Top 3 do ranking semanal.',
  },
  {
    icon: '💡',
    title: 'Inovador',
    status: 'locked',
    description: 'Seja reconhecido pelo valor Inovação.',
  },
  {
    icon: '🚀',
    title: 'Promotor',
    status: 'locked',
    description: 'Complete 3 meses ativos na plataforma.',
  },
]

const VOUCHERS = [
  { name: 'iFood', color: 'bg-red-500', value: 'R$ 25' },
  { name: 'Uber', color: 'bg-black', value: 'R$ 50' },
  { name: 'Amazon', color: 'bg-orange-400', value: 'R$ 100' },
  { name: 'Spotify', color: 'bg-green-500', value: 'R$ 35' },
  { name: 'Netflix', color: 'bg-red-700', value: 'R$ 45' },
  { name: 'Netshoes', color: 'bg-purple-600', value: 'R$ 75' },
]

const BadgeCard: React.FC<{ badge: Badge }> = ({ badge }) => {
  const [isFlipped, setIsFlipped] = useState(false)

  return (
    <div
      className="relative aspect-square cursor-pointer group perspective-1000"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        className="w-full h-full relative transform-style-3d transition-transform duration-300"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        {/* Front Face */}
        <div
          className={`absolute inset-0 w-full h-full backface-hidden rounded-2xl flex flex-col items-center justify-center gap-2 border
          ${
            badge.status === 'unlocked'
              ? 'bg-zinc-800/90 border-valorize-400/40 shadow-lg shadow-valorize-500/10'
              : 'bg-zinc-900/70 border-zinc-700 text-zinc-300'
          }`}
        >
          <span className="text-4xl mb-1 transform group-hover:scale-110 transition-transform duration-300">
            {badge.icon}
          </span>
          <span className="text-[10px] uppercase font-bold tracking-wide text-white">
            {badge.title}
          </span>
          {badge.status === 'locked' && (
            <Lock size={12} className="text-zinc-600 absolute top-2 right-2" />
          )}

          <div className="absolute bottom-3 opacity-0 group-hover:opacity-100 transition-opacity text-[9px] text-zinc-100 flex items-center gap-1">
            <RotateCw size={8} /> Girar
          </div>
        </div>

        {/* Back Face */}
        <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-2xl bg-zinc-900 border border-valorize-500/40 flex flex-col items-center justify-center p-4 text-center backdrop-blur-md">
          <p className="text-xs font-bold text-valorize-200 mb-1">{badge.title}</p>
          <p className="text-[10px] text-zinc-200 leading-tight mb-2">
            {badge.description}
          </p>
          <div className="px-2 py-1 bg-zinc-950 rounded text-[10px] text-valorize-300 font-mono border border-valorize-500/30">
            +50 moedas
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export const Gamification: React.FC = () => {
  return (
    <section id="gamification" className="py-32 relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[600px] bg-valorize-600/10 rounded-full blur-[100px] -z-10" />

      <div className="container mx-auto px-4 md:px-6">
        {/* Part 1: Badges */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-32">
          <div>
            <span className="inline-block px-3 py-1 mb-4 rounded-full bg-valorize-500/10 border border-valorize-500/20 text-valorize-500 text-xs font-bold uppercase tracking-wide">
              Gamificação
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Gamificação que <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-valorize-400 to-valorize-600">
                vicia em engajamento.
              </span>
            </h2>
            <p className="text-lg text-zinc-300 mb-8">
              Não é só diversão. É estratégia. Badges, níveis e conquistas
              mantêm o time motivado a participar e reforçar a cultura da
              empresa constantemente.
            </p>

            <ul className="space-y-4 mb-8">
              {[
                '9 tipos de badges exclusivos',
                'Leaderboard semanal competitivo',
                'Recompensas progressivas',
                'Perfil público de conquistas',
              ].map((item, i) => (
                <li key={i} className="flex items-center text-zinc-300">
                  <div className="w-6 h-6 rounded-full bg-valorize-500/20 flex items-center justify-center text-valorize-400 mr-3 text-xs">
                    ✓
                  </div>
                  {item}
                </li>
              ))}
            </ul>

          </div>

          {/* Interactive Badge Grid */}
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-3 gap-4 p-6 rounded-3xl bg-zinc-900/80 border border-zinc-700 shadow-2xl shadow-black/40 relative backdrop-blur-xl">
              {BADGES.map((badge, idx) => (
                <BadgeCard key={idx} badge={badge} />
              ))}
            </div>
            <p className="text-center text-xs text-zinc-300 flex items-center justify-center gap-2">
              <RotateCw size={12} /> Passe o mouse nos cards para ver os detalhes
            </p>
          </div>
        </div>

        {/* Part 2: Vouchers */}
        <div className="bg-zinc-950 rounded-3xl border border-zinc-800 p-8 md:p-12 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-white/5 blur-[80px] rounded-full" />

          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-block px-3 py-1 mb-4 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-bold uppercase tracking-wide">
              Loja de Recompensas
            </div>
            <h3 className="text-3xl font-bold text-white mb-4">
              Gift Cards de marcas que todos amam
            </h3>
            <p className="text-zinc-200 text-lg">
              Dê liberdade real. Seus colaboradores trocam moedas por{' '}
              <span className="text-white font-semibold">Gift Cards digitais</span>{' '}
              e usam como quiserem no iFood, Uber, Amazon e mais.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {VOUCHERS.map((voucher, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5, rotateX: 5 }}
                className={`relative aspect-[1.586/1] rounded-xl p-4 flex flex-col justify-between overflow-hidden group cursor-pointer transition-all duration-300 shadow-xl border border-black/10 ${voucher.color}`}
              >
                {/* Gloss Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/25 to-transparent opacity-40 pointer-events-none" />

                {/* Card Header (Value Tag) */}
                <div className="flex justify-end items-start z-10">
                  <div className="bg-black/20 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10">
                    <span className="text-white font-bold text-xs">{voucher.value}</span>
                  </div>
                </div>

                {/* Card Body (Brand Name) */}
                <div className="z-10 flex-1 flex items-center justify-center">
                  <h4 className="font-bold text-white text-2xl tracking-tight drop-shadow-md">
                    {voucher.name}
                  </h4>
                </div>

                {/* Card Footer (Barcode & Label) */}
                <div className="flex justify-between items-end z-10">
                  <span className="text-[10px] text-white/80 uppercase font-medium tracking-widest">
                    Vale Presente
                  </span>

                  {/* Fake Barcode Lines */}
                  <div className="flex gap-[2px] h-3 items-end opacity-70">
                    <div className="w-[2px] h-full bg-white" />
                    <div className="w-[1px] h-2/3 bg-white" />
                    <div className="w-[3px] h-full bg-white" />
                    <div className="w-[1px] h-1/2 bg-white" />
                    <div className="w-[2px] h-3/4 bg-white" />
                    <div className="w-[1px] h-full bg-white" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 grid md:grid-cols-3 gap-6 text-center border-t border-zinc-800 pt-8">
            <div>
              <div className="text-2xl font-bold text-white mb-1">0%</div>
              <div className="text-sm text-zinc-300">Taxas para a empresa</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white mb-1">Instantâneo</div>
              <div className="text-sm text-zinc-300">Envio do código por email</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white mb-1">+40</div>
              <div className="text-sm text-zinc-300">Opções de Gift Cards</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
