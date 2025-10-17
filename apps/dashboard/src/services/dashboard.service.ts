import type { NewsItem, EventItem } from '@/types/dashboard.types'

// Mock data for news items
const newsData: Omit<NewsItem, 'id' | 'publishedAt'>[] = [
  {
    title: 'Nova Política de Trabalho Remoto Implementada',
    summary: 'A empresa anuncia mudanças significativas na política de trabalho remoto para melhor equilíbrio entre vida pessoal e profissional.',
    content: 'A partir de janeiro, todos os colaboradores terão direito a dois dias de trabalho remoto por semana. Esta iniciativa visa promover maior flexibilidade e melhorar a qualidade de vida dos nossos profissionais.',
    category: 'announcement',
    author: { name: 'Maria Silva', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face' },
    tags: ['trabalho remoto', 'política', 'qualidade de vida'],
  },
  {
    title: 'Recorde de Vendas no Trimestre',
    summary: 'Equipe comercial supera todas as expectativas com crescimento de 35% nas vendas do último trimestre.',
    content: 'Graças ao esforço conjunto e estratégias inovadoras, conseguimos alcançar números nunca vistos antes. Parabéns a toda equipe comercial pelo excelente desempenho!',
    category: 'achievement',
    author: { name: 'João Santos', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face' },
    tags: ['vendas', 'recorde', 'equipe comercial'],
  },
  {
    title: 'Atualização do Sistema de Elogios',
    summary: 'Novas funcionalidades adicionadas ao sistema de reconhecimento, incluindo categorias personalizadas.',
    content: 'O sistema foi aprimorado com novas categorias de elogios, maior integração com redes sociais corporativas e relatórios mais detalhados sobre o engajamento da equipe.',
    category: 'update',
    author: { name: 'Ana Costa', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face' },
    tags: ['sistema', 'elogios', 'atualização'],
  },
  {
    title: 'Programa de Desenvolvimento Profissional',
    summary: 'Lançamento de novo programa focado no crescimento e desenvolvimento dos colaboradores.',
    content: 'Programa inclui cursos, mentorias e oportunidades de desenvolvimento personalizado, alinhado com os objetivos de carreira de cada profissional.',
    category: 'general',
    author: { name: 'Carlos Oliveira', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face' },
    tags: ['desenvolvimento', 'carreira', 'cursos'],
  },
  {
    title: 'Conquista Ambiental: Empresa Carbono Neutro',
    summary: 'Valorize atinge marco importante ao se tornar uma empresa carbono neutro através de iniciativas sustentáveis.',
    content: 'Após investimentos em energia renovável, reciclagem e compensação de carbono, conseguimos neutralizar completamente nossa pegada ambiental.',
    category: 'achievement',
    author: { name: 'Beatriz Ferreira', avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face' },
    tags: ['sustentabilidade', 'meio ambiente', 'conquista'],
  },
  {
    title: 'Novas Instalações em São Paulo',
    summary: 'Inauguração do novo escritório em São Paulo com espaços modernos e colaborativos.',
    content: 'O novo espaço foi projetado para fomentar a colaboração e inovação, com salas de reunião equipadas, áreas de descanso e tecnologia de ponta.',
    category: 'announcement',
    author: { name: 'Rafael Mendes', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face' },
    tags: ['escritório', 'são paulo', 'inauguração'],
  },
]

// Mock data for events
const eventsData: Omit<EventItem, 'id' | 'startDate'>[] = [
  {
    title: 'Reunião Mensal de Equipes',
    description: 'Revisão de metas, apresentação de resultados e alinhamento estratégico para o próximo mês.',
    location: 'Sala de Conferências Principal',
    category: 'meeting',
    attendees: 45,
    maxAttendees: 60,
  },
  {
    title: 'Workshop de Liderança',
    description: 'Treinamento intensivo sobre técnicas de liderança eficaz e gestão de equipes de alta performance.',
    location: 'Auditório Central',
    category: 'training',
    attendees: 28,
    maxAttendees: 40,
  },
  {
    title: 'Happy Hour de Integração',
    description: 'Momento descontraído para integração entre novos colaboradores e fortalecimento do networking.',
    location: 'Terraço do Escritório',
    category: 'social',
    attendees: 32,
    maxAttendees: 50,
  },
  {
    title: 'Seminário de Inovação',
    description: 'Discussão sobre tendências tecnológicas e oportunidades de inovação para o negócio.',
    location: 'Sala de Inovação - 3º Andar',
    category: 'meeting',
    attendees: 35,
    maxAttendees: 45,
  },
  {
    title: 'Treinamento de Comunicação',
    description: 'Workshop prático sobre comunicação eficaz, apresentação em público e feedback construtivo.',
    location: 'Sala de Treinamento 2',
    category: 'training',
    attendees: 22,
    maxAttendees: 30,
  },
  {
    title: 'Comemoração de Aniversário da Empresa',
    description: 'Celebração dos 10 anos da Valorize com atividades especiais e reconhecimento dos colaboradores.',
    location: 'Espaço de Eventos',
    category: 'celebration',
    attendees: 80,
    maxAttendees: 100,
  },
]

// Generate IDs and dates for news
const generateNewsItems = (): NewsItem[] => {
  const now = new Date()

  return newsData.map((item, index) => ({
    ...item,
    id: `news-${index + 1}`,
    publishedAt: new Date(now.getTime() - (Math.random() * 14 * 24 * 60 * 60 * 1000)).toISOString(), // Random date in last 14 days
  }))
}

// Generate IDs and dates for events
const generateEventItems = (): EventItem[] => {
  const now = new Date()

  return eventsData.map((item, index) => ({
    ...item,
    id: `event-${index + 1}`,
    startDate: new Date(now.getTime() + (Math.random() * 30 * 24 * 60 * 60 * 1000)).toISOString(), // Random date in next 30 days
    endDate: item.endDate ? new Date(now.getTime() + (Math.random() * 30 * 24 * 60 * 60 * 1000) + (2 * 60 * 60 * 1000)).toISOString() : undefined,
  }))
}

export const getCompanyNews = async (): Promise<NewsItem[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 400))

  return generateNewsItems()
}

export const getUpcomingEvents = async (): Promise<EventItem[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 350))

  return generateEventItems()
}

