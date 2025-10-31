export type IconCategory =
  | 'lideranca'
  | 'inovacao'
  | 'colaboracao'
  | 'excelencia'
  | 'aprendizado'
  | 'comunicacao'
  | 'valores'
  | 'acao'
  | 'negocios'
  | 'positividade'
  | 'tecnologia'

export interface IconCategoryInfo {
  id: IconCategory
  label: string
  icon: string
}

export const iconCategories: IconCategoryInfo[] = [
  { id: 'lideranca', label: 'Liderança e Gestão', icon: 'crown' },
  { id: 'inovacao', label: 'Inovação e Criatividade', icon: 'lightbulb' },
  { id: 'colaboracao', label: 'Colaboração e Pessoas', icon: 'users' },
  { id: 'excelencia', label: 'Excelência e Qualidade', icon: 'star' },
  { id: 'aprendizado', label: 'Aprendizado e Crescimento', icon: 'book' },
  { id: 'comunicacao', label: 'Comunicação', icon: 'chat' },
  { id: 'valores', label: 'Valores e Ética', icon: 'scales' },
  { id: 'acao', label: 'Ação e Energia', icon: 'fire' },
  { id: 'negocios', label: 'Negócios e Estratégia', icon: 'briefcase' },
  { id: 'positividade', label: 'Positividade e Felicidade', icon: 'smiley' },
  { id: 'tecnologia', label: 'Tecnologia e Digital', icon: 'code' },
]

export interface PhosphorIcon {
  name: string
  label: string
  category: IconCategory
  keywords: string[]
}

export const phosphorIcons: PhosphorIcon[] = [
  // Liderança e Gestão
  { name: 'crown', label: 'Coroa', category: 'lideranca', keywords: ['liderança', 'líder', 'rei', 'realeza', 'crown', 'leadership'] },
  { name: 'medal', label: 'Medalha', category: 'lideranca', keywords: ['medalha', 'prêmio', 'conquista', 'medal', 'award'] },
  { name: 'trophy', label: 'Troféu', category: 'lideranca', keywords: ['troféu', 'vitória', 'campeão', 'trophy', 'winner'] },
  { name: 'target', label: 'Alvo', category: 'lideranca', keywords: ['alvo', 'objetivo', 'meta', 'foco', 'target', 'goal'] },
  { name: 'flag', label: 'Bandeira', category: 'lideranca', keywords: ['bandeira', 'meta', 'objetivo', 'flag', 'goal'] },

  // Inovação e Criatividade
  { name: 'lightbulb', label: 'Lâmpada', category: 'inovacao', keywords: ['ideia', 'inovação', 'criatividade', 'lightbulb', 'idea', 'innovation'] },
  { name: 'rocket', label: 'Foguete', category: 'inovacao', keywords: ['foguete', 'crescimento', 'lançamento', 'rocket', 'growth', 'launch'] },
  { name: 'sparkle', label: 'Brilho', category: 'inovacao', keywords: ['brilho', 'destaque', 'especial', 'sparkle', 'shine'] },
  { name: 'atom', label: 'Átomo', category: 'inovacao', keywords: ['átomo', 'ciência', 'inovação', 'atom', 'science'] },
  { name: 'lightning', label: 'Raio', category: 'inovacao', keywords: ['raio', 'energia', 'rápido', 'lightning', 'energy', 'fast'] },

  // Colaboração e Pessoas
  { name: 'handshake', label: 'Aperto de Mão', category: 'colaboracao', keywords: ['parceria', 'acordo', 'colaboração', 'handshake', 'partnership'] },
  { name: 'users', label: 'Usuários', category: 'colaboracao', keywords: ['equipe', 'time', 'pessoas', 'grupo', 'users', 'team'] },
  { name: 'heart', label: 'Coração', category: 'colaboracao', keywords: ['coração', 'amor', 'paixão', 'cuidado', 'heart', 'love', 'care'] },
  { name: 'hands-praying', label: 'Mãos em Oração', category: 'colaboracao', keywords: ['gratidão', 'agradecimento', 'respeito', 'praying', 'thanks'] },
  { name: 'user-focus', label: 'Foco em Pessoa', category: 'colaboracao', keywords: ['foco', 'atenção', 'pessoa', 'user', 'focus'] },

  // Excelência e Qualidade
  { name: 'star', label: 'Estrela', category: 'excelencia', keywords: ['estrela', 'favorito', 'destaque', 'star', 'favorite'] },
  { name: 'diamond', label: 'Diamante', category: 'excelencia', keywords: ['diamante', 'valioso', 'premium', 'diamond', 'valuable'] },
  { name: 'seal-check', label: 'Selo de Aprovação', category: 'excelencia', keywords: ['aprovado', 'verificado', 'qualidade', 'seal', 'verified'] },
  { name: 'shield-check', label: 'Escudo Verificado', category: 'excelencia', keywords: ['segurança', 'proteção', 'confiança', 'shield', 'security'] },
  { name: 'certificate', label: 'Certificado', category: 'excelencia', keywords: ['certificado', 'reconhecimento', 'conquista', 'certificate'] },

  // Aprendizado e Crescimento
  { name: 'book', label: 'Livro', category: 'aprendizado', keywords: ['livro', 'conhecimento', 'aprendizado', 'book', 'learning'] },
  { name: 'graduation-cap', label: 'Capelo', category: 'aprendizado', keywords: ['graduação', 'educação', 'formação', 'graduation', 'education'] },
  { name: 'plant', label: 'Planta', category: 'aprendizado', keywords: ['planta', 'crescimento', 'desenvolvimento', 'plant', 'growth'] },
  { name: 'brain', label: 'Cérebro', category: 'aprendizado', keywords: ['cérebro', 'inteligência', 'pensamento', 'brain', 'intelligence'] },
  { name: 'chart-line-up', label: 'Gráfico Crescente', category: 'aprendizado', keywords: ['crescimento', 'progresso', 'melhoria', 'chart', 'progress'] },

  // Comunicação
  { name: 'chat', label: 'Chat', category: 'comunicacao', keywords: ['conversa', 'comunicação', 'diálogo', 'chat', 'communication'] },
  { name: 'megaphone', label: 'Megafone', category: 'comunicacao', keywords: ['megafone', 'anúncio', 'comunicação', 'megaphone', 'announcement'] },
  { name: 'broadcast', label: 'Transmissão', category: 'comunicacao', keywords: ['transmissão', 'compartilhar', 'broadcast', 'share'] },
  { name: 'chats', label: 'Conversas', category: 'comunicacao', keywords: ['conversas', 'discussão', 'comunicação', 'chats', 'discussion'] },
  { name: 'microphone', label: 'Microfone', category: 'comunicacao', keywords: ['microfone', 'voz', 'fala', 'microphone', 'voice'] },

  // Valores e Ética
  { name: 'scales', label: 'Balança', category: 'valores', keywords: ['balança', 'justiça', 'equilíbrio', 'scales', 'justice', 'balance'] },
  { name: 'shield', label: 'Escudo', category: 'valores', keywords: ['escudo', 'proteção', 'defesa', 'shield', 'protection'] },
  { name: 'infinity', label: 'Infinito', category: 'valores', keywords: ['infinito', 'contínuo', 'eterno', 'infinity', 'continuous'] },
  { name: 'eye', label: 'Olho', category: 'valores', keywords: ['visão', 'observação', 'atenção', 'eye', 'vision'] },
  { name: 'hand-heart', label: 'Mão com Coração', category: 'valores', keywords: ['cuidado', 'carinho', 'empatia', 'hand', 'heart', 'care'] },

  // Ação e Energia
  { name: 'fire', label: 'Fogo', category: 'acao', keywords: ['fogo', 'paixão', 'energia', 'fire', 'passion', 'energy'] },
  { name: 'battery-charging', label: 'Bateria Carregando', category: 'acao', keywords: ['energia', 'motivação', 'bateria', 'battery', 'energy'] },
  { name: 'lightning-slash', label: 'Energia', category: 'acao', keywords: ['energia', 'poder', 'força', 'energy', 'power'] },
  { name: 'hand-fist', label: 'Punho', category: 'acao', keywords: ['força', 'determinação', 'poder', 'fist', 'strength', 'punho'] },
  { name: 'flame', label: 'Chama', category: 'acao', keywords: ['chama', 'paixão', 'intensidade', 'flame', 'passion'] },

  // Negócios e Estratégia
  { name: 'briefcase', label: 'Pasta', category: 'negocios', keywords: ['negócios', 'trabalho', 'profissional', 'briefcase', 'business'] },
  { name: 'presentation', label: 'Apresentação', category: 'negocios', keywords: ['apresentação', 'reunião', 'demonstração', 'presentation'] },
  { name: 'strategy', label: 'Estratégia', category: 'negocios', keywords: ['estratégia', 'planejamento', 'tática', 'strategy', 'planning'] },
  { name: 'compass', label: 'Bússola', category: 'negocios', keywords: ['bússola', 'direção', 'orientação', 'compass', 'direction'] },
  { name: 'binoculars', label: 'Binóculos', category: 'negocios', keywords: ['binóculos', 'visão', 'futuro', 'binoculars', 'vision'] },

  // Positividade e Felicidade
  { name: 'smiley', label: 'Sorriso', category: 'positividade', keywords: ['sorriso', 'felicidade', 'alegria', 'smiley', 'happiness'] },
  { name: 'sun', label: 'Sol', category: 'positividade', keywords: ['sol', 'energia', 'brilho', 'sun', 'sunshine'] },
  { name: 'gift', label: 'Presente', category: 'positividade', keywords: ['presente', 'recompensa', 'reconhecimento', 'gift', 'reward'] },
  { name: 'confetti', label: 'Confete', category: 'positividade', keywords: ['confete', 'celebração', 'festa', 'confetti', 'celebration'] },
  { name: 'balloon', label: 'Balão', category: 'positividade', keywords: ['balão', 'celebração', 'festa', 'balloon', 'celebration'] },

  // Tecnologia e Digital
  { name: 'code', label: 'Código', category: 'tecnologia', keywords: ['código', 'programação', 'desenvolvimento', 'code', 'programming'] },
  { name: 'cpu', label: 'CPU', category: 'tecnologia', keywords: ['processador', 'tecnologia', 'computador', 'cpu', 'technology'] },
  { name: 'gear', label: 'Engrenagem', category: 'tecnologia', keywords: ['engrenagem', 'configuração', 'processo', 'gear', 'settings'] },
  { name: 'monitor', label: 'Monitor', category: 'tecnologia', keywords: ['monitor', 'tela', 'computador', 'monitor', 'screen'] },
  { name: 'fingerprint', label: 'Impressão Digital', category: 'tecnologia', keywords: ['identidade', 'único', 'autenticidade', 'fingerprint', 'unique'] },
]
