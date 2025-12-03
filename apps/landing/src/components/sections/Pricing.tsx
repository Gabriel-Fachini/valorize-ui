import React, { useState } from 'react'
import { Button } from '../ui/Button'
import { Check, Plus, Minus } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface PricingTier {
  name: string
  price: number
  features: string[]
  highlight?: boolean
  buttonText: string
  buttonVariant: 'primary' | 'outline'
}

interface FAQItem {
  question: string
  answer: string
}

const PRICING: PricingTier[] = [
  {
    name: 'Padrão',
    price: 14,
    features: [
      'Envio ilimitado de elogios',
      'Sistema de badges',
      'Leaderboard semanal',
      'Loja de recompensas',
      'Dashboard básico',
      'Suporte por email',
    ],
    buttonText: 'Agendar Demo',
    buttonVariant: 'outline',
  },
  {
    name: 'Profissional',
    price: 18,
    features: [
      'Tudo do Padrão',
      'Analytics avançados',
      'Valores customizáveis',
      'API para integrações',
      'Onboarding dedicado',
      'Suporte prioritário',
    ],
    highlight: true,
    buttonText: 'Falar com Vendas',
    buttonVariant: 'primary',
  },
]

const FAQS: FAQItem[] = [
  {
    question: 'Como funciona o sistema de moedas?',
    answer:
      'A empresa distribui um budget mensal de moedas virtuais. Colaboradores usam essas moedas para elogiar colegas. Quem recebe, acumula saldo para trocar por recompensas reais.',
  },
  {
    question: 'Há custo extra nos Gift Cards?',
    answer:
      'Não. A empresa paga apenas o valor de face. Se o colaborador resgata R$ 50 no iFood, custa exatamente R$ 50 para a empresa. Sem taxas ocultas.',
  },
  {
    question: 'Quanto tempo leva para implementar?',
    answer:
      'O setup técnico leva cerca de 15 minutos. O onboarding completo, com comunicação e cadastro de usuários, costuma levar 1 semana.',
  },
  {
    question: 'Funciona para equipes remotas?',
    answer:
      'Perfeitamente. O Valorize foi desenhado para conectar times distribuídos, tornando a cultura visível mesmo à distância.',
  },
]

export const Pricing: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <section id="pricing" className="py-24 bg-zinc-950 relative">
      <div className="container mx-auto px-4 md:px-6">
        {/* Pricing Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-3 py-1 mb-4 rounded-full bg-valorize-500/10 border border-valorize-500/20 text-valorize-500 text-xs font-bold uppercase tracking-wide">
            Preços
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Investimento transparente.
          </h2>
          <p className="text-lg text-zinc-300">
            Sem surpresas no final do mês. Escolha o plano ideal para o tamanho
            do seu time.
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-24">
          {PRICING.map((tier, index) => (
            <div
              key={index}
              className={`relative p-8 rounded-3xl border flex flex-col
                ${
                  tier.highlight
                    ? 'bg-zinc-900/80 border-valorize-500 ring-1 ring-valorize-500/50 shadow-2xl shadow-valorize-500/10'
                    : 'bg-zinc-900/40 border-zinc-800'
                }`}
            >
              {tier.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-valorize-500 text-zinc-950 text-xs font-bold uppercase tracking-wide rounded-full">
                  Mais Popular
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-lg font-medium text-zinc-300 mb-2">
                  {tier.name}
                </h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-white">
                    R$ {tier.price}
                  </span>
                  <span className="text-zinc-300">/usuário/mês</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8 flex-1">
                {tier.features.map((feature, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-zinc-300 text-sm"
                  >
                    <Check
                      size={18}
                      className={
                        tier.highlight ? 'text-valorize-500' : 'text-zinc-500'
                      }
                    />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button variant={tier.buttonVariant} className="w-full">
                {tier.buttonText}
              </Button>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto">
          <h3 className="text-2xl font-bold text-white mb-8 text-center">
            Perguntas Frequentes
          </h3>
          <div className="space-y-4">
            {FAQS.map((faq, index) => (
              <div
                key={index}
                className="border border-zinc-800 rounded-xl bg-zinc-900/50 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-zinc-800/50 transition-colors"
                >
                  <span className="font-medium text-zinc-200">
                    {faq.question}
                  </span>
                  {openFaq === index ? (
                    <Minus size={18} className="text-valorize-500" />
                  ) : (
                    <Plus size={18} className="text-zinc-300" />
                  )}
                </button>
                <AnimatePresence>
                  {openFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-6 pt-2 pb-6 text-zinc-300 text-sm leading-relaxed border-t border-zinc-800/50">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
