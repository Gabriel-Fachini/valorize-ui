import React from 'react'
import { motion } from 'framer-motion'
import { Check, X, ArrowDown, MessageSquare, Trophy, Gift, LineChart } from 'lucide-react'

const FEATURES = [
  {
    icon: MessageSquare,
    title: 'Elogios Instantâneos',
    description:
      'Reconheça colegas em segundos. Escolha um valor da empresa e envie moedas com uma mensagem.',
  },
  {
    icon: Trophy,
    title: 'Gamificação Real',
    description:
      'Badges, níveis e leaderboards semanais que transformam o trabalho em uma jornada engajante.',
  },
  {
    icon: Gift,
    title: 'Recompensas Tangíveis',
    description:
      'Troque moedas por Gift Cards (iFood, Uber, Amazon) sem taxas e com entrega imediata.',
  },
  {
    icon: LineChart,
    title: 'Analytics de Cultura',
    description:
      'Meça o imensurável. Acompanhe o engajamento, valores mais praticados e saúde do time.',
  },
]

const COMPARISONS = [
  {
    title: 'Visibilidade',
    before: 'Colaboradores invisíveis',
    after: 'Todos valorizados',
  },
  {
    title: 'Cultura',
    before: 'Abstrata e imensurável',
    after: 'Tangível e via dados',
  },
  {
    title: 'Orçamento',
    before: 'Gasto sem retorno',
    after: 'Investimento no time',
  },
]

export const Features: React.FC = () => {
  return (
    <>
      {/* Problem / Solution Comparison */}
      <section id="features" className="py-24 relative bg-zinc-950">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              O problema é real. <br />
              <span className="text-valorize-500">A solução também.</span>
            </h2>
            <p className="text-lg text-zinc-300">
              Empresas perdem talentos porque não sabem reconhecer. O Valorize
              resolve isso conectando ações a recompensas.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {COMPARISONS.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="flex flex-col group"
              >
                {/* Title */}
                <div className="text-center mb-4">
                  <span className="text-sm font-semibold text-zinc-200 uppercase tracking-wider">
                    {item.title}
                  </span>
                </div>

                {/* Before Card */}
                <div className="bg-zinc-900/60 rounded-t-2xl p-6 border border-zinc-700 border-b-0 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-zinc-600 to-zinc-500" />
                  <h3 className="text-zinc-300 text-xs font-bold uppercase tracking-wider mb-3">
                    Antes
                  </h3>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0">
                      <X size={18} className="text-zinc-200" />
                    </div>
                    <span className="text-zinc-100 font-medium">
                      {item.before}
                    </span>
                  </div>
                </div>

                {/* Connector */}
                <div className="h-0 relative z-10">
                  <div className="absolute left-1/2 -translate-x-1/2 -top-3 w-8 h-8 bg-zinc-900/90 rounded-full border-2 border-zinc-600 flex items-center justify-center shadow-lg group-hover:border-valorize-500 group-hover:scale-110 transition-all duration-300">
                    <ArrowDown size={14} className="text-zinc-200 group-hover:text-valorize-500 transition-colors" />
                  </div>
                </div>

                {/* After Card */}
                <div className="bg-gradient-to-b from-zinc-900/80 to-valorize-950/40 rounded-b-2xl p-6 border border-valorize-400/60 border-t-0 relative overflow-hidden">
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-valorize-500 to-valorize-400" />
                  <div className="absolute inset-0 bg-gradient-to-b from-valorize-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <h3 className="text-valorize-200 text-xs font-bold uppercase tracking-wider mb-3 relative z-10">
                    Com Valorize
                  </h3>
                  <div className="flex items-center gap-3 relative z-10">
                    <div className="w-10 h-10 rounded-full bg-valorize-500 flex items-center justify-center shrink-0 shadow-lg shadow-valorize-500/30">
                      <Check size={18} className="text-zinc-950 stroke-[3px]" />
                    </div>
                    <span className="text-white font-semibold text-lg">
                      {item.after}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Steps */}
      <section className="py-24 bg-zinc-900/30 border-t border-zinc-800/50">
        <div className="container mx-auto px-4 md:px-6">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-block px-3 py-1 mb-4 rounded-full bg-valorize-500/10 border border-valorize-500/20 text-valorize-500 text-xs font-bold uppercase tracking-wide">
              Como Funciona
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              4 passos para transformar sua cultura
            </h2>
          </div>

          <div className="grid lg:grid-cols-4 gap-8 relative">
            {/* Connector Line (Desktop) */}
            <div className="hidden lg:block absolute top-[60px] left-[10%] w-[80%] h-1.5 bg-zinc-600/70 rounded-full overflow-hidden shadow-[0_0_20px_rgba(0,217,89,0.25)]">
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, ease: 'easeOut' }}
                className="h-full w-full origin-left bg-gradient-to-r from-valorize-300 via-white to-valorize-500"
              />
            </div>

            {FEATURES.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative z-10 flex flex-col items-center text-center"
              >
                <div className="w-24 h-24 rounded-2xl bg-zinc-900 border border-zinc-600 flex items-center justify-center mb-6 shadow-xl shadow-black/50 group hover:scale-110 hover:border-valorize-500 transition-all duration-300">
                  <feature.icon className="w-10 h-10 text-valorize-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-zinc-300 leading-relaxed text-sm">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
