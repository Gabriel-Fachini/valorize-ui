/**
 * Pricing Configuration
 * Used by the Pricing component
 */

export interface PricingTier {
  name: string
  price: number
  period: string
  popular: boolean
  features: string[]
  cta: string
  ctaVariant: 'primary' | 'outline'
}

export const pricing: PricingTier[] = [
  {
    name: 'Padrão',
    price: 14,
    period: '/usuário/mês',
    popular: false,
    features: [
      'Envio ilimitado de elogios',
      'Sistema de badges',
      'Leaderboard semanal',
      'Loja de recompensas',
      'Dashboard básico',
      'Suporte por email',
    ],
    cta: 'Agendar Demo',
    ctaVariant: 'outline',
  },
  {
    name: 'Profissional',
    price: 18,
    period: '/usuário/mês',
    popular: true,
    features: [
      'Tudo do Padrão',
      'Analytics avançados',
      'Valores customizáveis',
      'API para integrações',
      'Onboarding dedicado',
      'Suporte prioritário',
    ],
    cta: 'Falar com Vendas',
    ctaVariant: 'primary',
  },
]

export const faqs = [
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