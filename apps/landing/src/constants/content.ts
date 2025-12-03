/**
 * Content Configuration
 * Centralized copy for the landing page
 */

export const content = {
  hero: {
    badge: 'Plataforma em Beta',
    headline: 'Transforme elogios em cultura.',
    subheadline:
      'Valorize é a plataforma de reconhecimento que transforma sua cultura organizacional. Colaboradores trocam elogios por recompensas reais.',
    ctaPrimary: 'Agendar Demonstração',
    ctaSecondary: 'Ver vídeo',
  },
  features: {
    title: 'O problema é real.',
    titleHighlight: 'A solução também.',
    subtitle:
      'Empresas perdem talentos porque não sabem reconhecer. O Valorize resolve isso conectando ações a recompensas.',
    comparisons: [
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
    ],
  },
  howItWorks: {
    badge: 'Como Funciona',
    title: '4 passos para transformar sua cultura',
    steps: [
      {
        icon: 'MessageSquare',
        title: 'Elogios Instantâneos',
        description:
          'Reconheça colegas em segundos. Escolha um valor da empresa e envie moedas com uma mensagem.',
      },
      {
        icon: 'Trophy',
        title: 'Gamificação Real',
        description:
          'Badges, níveis e leaderboards semanais que transformam o trabalho em uma jornada engajante.',
      },
      {
        icon: 'Gift',
        title: 'Recompensas Tangíveis',
        description:
          'Troque moedas por Gift Cards (iFood, Uber, Amazon) sem taxas e com entrega imediata.',
      },
      {
        icon: 'LineChart',
        title: 'Analytics de Cultura',
        description:
          'Meça o imensurável. Acompanhe o engajamento, valores mais praticados e saúde do time.',
      },
    ],
  },
  gamification: {
    badge: 'Gamificação',
    title: 'Gamificação que',
    titleHighlight: 'vicia em engajamento.',
    subtitle:
      'Não é só diversão. É estratégia. Badges, níveis e conquistas mantêm o time motivado a participar e reforçar a cultura da empresa constantemente.',
    benefits: [
      '9 tipos de badges exclusivos',
      'Leaderboard semanal competitivo',
      'Recompensas progressivas',
      'Perfil público de conquistas',
    ],
    cta: 'Conhecer Badges',
  },
  vouchers: {
    badge: 'Loja de Recompensas',
    title: 'Gift Cards de marcas que todos amam',
    subtitle:
      'Dê liberdade real. Seus colaboradores trocam moedas por Gift Cards digitais e usam como quiserem no iFood, Uber, Amazon e mais.',
    stats: [
      { value: '0%', label: 'Taxas para a empresa' },
      { value: 'Instantâneo', label: 'Envio do código por email' },
      { value: '+40', label: 'Opções de Gift Cards' },
    ],
  },
  pricing: {
    badge: 'Preços',
    title: 'Investimento transparente.',
    subtitle:
      'Sem surpresas no final do mês. Escolha o plano ideal para o tamanho do seu time.',
  },
  cta: {
    title: 'Pronto para transformar sua cultura?',
    subtitle: 'Agende uma demo de 30 minutos. Sem compromisso. Sem cartão de crédito.',
    primaryButton: 'Agendar Demonstração',
    secondaryButton: 'Falar com Especialista',
  },
  footer: {
    description:
      'Transformando reconhecimento em resultados reais para empresas que valorizam pessoas.',
    copyright: '© 2025 Valorize Tecnologia Ltda. Todos os direitos reservados.',
  },
}

export const badges = [
  {
    icon: '🎯',
    title: 'Primeiro Passo',
    status: 'unlocked' as const,
    description: 'Envie seu primeiro elogio para um colega.',
  },
  {
    icon: '🔥',
    title: 'On Fire',
    status: 'unlocked' as const,
    description: 'Receba 3 elogios na mesma semana.',
  },
  {
    icon: '🤝',
    title: 'Parceiro',
    status: 'unlocked' as const,
    description: 'Elogie pessoas de 3 áreas diferentes.',
  },
  {
    icon: '👑',
    title: 'Líder',
    status: 'locked' as const,
    description: 'Fique no Top 3 do ranking semanal.',
  },
  {
    icon: '💡',
    title: 'Inovador',
    status: 'locked' as const,
    description: 'Seja reconhecido pelo valor Inovação.',
  },
  {
    icon: '🚀',
    title: 'Promotor',
    status: 'locked' as const,
    description: 'Complete 3 meses ativos na plataforma.',
  },
]

export const vouchers = [
  { name: 'iFood', color: 'bg-red-500', value: 'R$ 25' },
  { name: 'Uber', color: 'bg-black', value: 'R$ 50' },
  { name: 'Amazon', color: 'bg-orange-400', value: 'R$ 100' },
  { name: 'Spotify', color: 'bg-green-500', value: 'R$ 35' },
  { name: 'Netflix', color: 'bg-red-700', value: 'R$ 45' },
  { name: 'Netshoes', color: 'bg-purple-600', value: 'R$ 75' },
]