import { Prize, PrizeFilters } from '@/types/prize.types'

const mockPrizes: Prize[] = [
  {
    id: '1',
    title: 'AirPods Pro 2ª Geração',
    description: 'Fones de ouvido com cancelamento ativo de ruído, áudio espacial personalizado e até 6 horas de bateria. Inclui estojo de recarga MagSafe.',
    category: 'eletronicos',
    price: 2500,
    images: [
      'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=800',
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800',
      'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800',
    ],
    preferences: [
      {
        label: 'Cor',
        options: ['Branco', 'Midnight'],
        required: true,
        type: 'select',
      },
    ],
    stock: 5,
    featured: true,
    brand: 'Apple',
    specifications: {
      'Conectividade': 'Bluetooth 5.3',
      'Bateria': '6h (30h com estojo)',
      'Resistência': 'IPX4',
    },
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
  },
  {
    id: '2',
    title: 'Echo Dot 5ª Geração',
    description: 'Smart speaker com Alexa, som de alta qualidade, controle por voz para casa inteligente.',
    category: 'eletronicos',
    price: 800,
    images: [
      'https://images.unsplash.com/photo-1543512214-318c7553f230?w=800',
      'https://images.unsplash.com/photo-1558089687-a682e1329154?w=800',
    ],
    preferences: [
      {
        label: 'Cor',
        options: ['Preto', 'Branco', 'Azul'],
        required: true,
        type: 'select',
      },
    ],
    stock: 10,
    featured: false,
    brand: 'Amazon',
    specifications: {
      'Dimensões': '100 x 100 x 89 mm',
      'Conectividade': 'Wi-Fi, Bluetooth',
      'Assistente': 'Alexa',
    },
    createdAt: '2024-01-10',
    updatedAt: '2024-01-10',
  },
  {
    id: '3',
    title: 'Kit Halteres Ajustáveis',
    description: 'Conjunto de halteres ajustáveis de 5kg a 24kg, ideal para treinos em casa. Material emborrachado premium.',
    category: 'esporte',
    price: 1200,
    images: [
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800',
      'https://images.unsplash.com/photo-1517963879433-6ad2b056d712?w=800',
    ],
    preferences: [
      {
        label: 'Peso máximo',
        options: ['24kg', '32kg', '40kg'],
        required: true,
        type: 'select',
      },
    ],
    stock: 8,
    featured: false,
    brand: 'PowerFit',
    specifications: {
      'Material': 'Ferro fundido com revestimento',
      'Ajustes': '15 níveis de peso',
      'Garantia': '2 anos',
    },
    createdAt: '2024-01-12',
    updatedAt: '2024-01-12',
  },
  {
    id: '4',
    title: 'Kindle Paperwhite',
    description: 'E-reader com tela de 6.8", à prova d\'água, 8GB de armazenamento e semanas de bateria.',
    category: 'livros',
    price: 1500,
    images: [
      'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=800',
      'https://images.unsplash.com/photo-1585398694249-0c3e74d0762f?w=800',
    ],
    preferences: [
      {
        label: 'Armazenamento',
        options: ['8GB', '16GB', '32GB'],
        required: true,
        type: 'select',
      },
      {
        label: 'Cor',
        options: ['Preto', 'Azul', 'Verde'],
        required: false,
        type: 'select',
      },
    ],
    stock: 12,
    featured: true,
    brand: 'Amazon',
    specifications: {
      'Tela': '6.8" 300 ppi',
      'Bateria': 'Até 10 semanas',
      'À prova d\'água': 'IPX8',
    },
    createdAt: '2024-01-08',
    updatedAt: '2024-01-08',
  },
  {
    id: '5',
    title: 'Cafeteira Nespresso Vertuo',
    description: 'Máquina de café com tecnologia de centrifusão, prepara 5 tamanhos de xícaras diferentes.',
    category: 'casa',
    price: 1800,
    images: [
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800',
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800',
    ],
    preferences: [
      {
        label: 'Cor',
        options: ['Preto', 'Vermelho', 'Cinza'],
        required: true,
        type: 'select',
      },
      {
        label: 'Voltagem',
        options: ['110V', '220V'],
        required: true,
        type: 'select',
      },
    ],
    stock: 6,
    featured: false,
    brand: 'Nespresso',
    specifications: {
      'Capacidade': '1.2L',
      'Tamanhos': '5 (40ml a 414ml)',
      'Tecnologia': 'Centrifusão',
    },
    createdAt: '2024-01-14',
    updatedAt: '2024-01-14',
  },
  {
    id: '6',
    title: 'Vale-Compras iFood',
    description: 'Créditos para utilizar em pedidos no iFood, válido em todo Brasil.',
    category: 'vale-compras',
    price: 500,
    images: [
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800',
      'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800',
    ],
    preferences: [
      {
        label: 'Valor',
        options: ['R$ 50', 'R$ 100', 'R$ 150'],
        required: true,
        type: 'select',
      },
    ],
    stock: 50,
    featured: true,
    brand: 'iFood',
    specifications: {
      'Validade': '6 meses',
      'Uso': 'Todo Brasil',
      'Tipo': 'Digital',
    },
    createdAt: '2024-01-20',
    updatedAt: '2024-01-20',
  },
  {
    id: '7',
    title: 'Smart TV Samsung 50"',
    description: 'Smart TV 4K UHD com processador Crystal 4K, Tizen OS e controle remoto único.',
    category: 'eletronicos',
    price: 3500,
    images: [
      'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800',
      'https://images.unsplash.com/photo-1558888401-3cc1de77652d?w=800',
    ],
    preferences: [
      {
        label: 'Tamanho',
        options: ['43"', '50"', '55"'],
        required: true,
        type: 'select',
      },
    ],
    stock: 3,
    featured: true,
    brand: 'Samsung',
    specifications: {
      'Resolução': '4K UHD (3840 x 2160)',
      'Sistema': 'Tizen OS',
      'HDR': 'HDR10+',
    },
    createdAt: '2024-01-18',
    updatedAt: '2024-01-18',
  },
  {
    id: '8',
    title: 'Experiência Spa Day',
    description: 'Um dia completo de relaxamento com massagem, sauna, hidromassagem e tratamentos faciais.',
    category: 'experiencias',
    price: 2000,
    images: [
      'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800',
      'https://images.unsplash.com/photo-1596178060810-72f53ce9a65c?w=800',
    ],
    preferences: [
      {
        label: 'Cidade',
        options: ['São Paulo', 'Rio de Janeiro', 'Belo Horizonte'],
        required: true,
        type: 'select',
      },
      {
        label: 'Tratamento adicional',
        options: ['Pedras quentes', 'Aromaterapia', 'Reflexologia'],
        required: false,
        type: 'select',
      },
    ],
    stock: 15,
    featured: false,
    brand: 'Spa Premium',
    specifications: {
      'Duração': '6 horas',
      'Incluso': 'Almoço e bebidas',
      'Validade': '1 ano',
    },
    createdAt: '2024-01-16',
    updatedAt: '2024-01-16',
  },
]

interface GetPrizesResponse {
  prizes: Prize[]
  total: number
  page: number
  pageSize: number
}

export const prizeService = {
  async getPrizes(filters?: PrizeFilters, page = 1, pageSize = 12): Promise<GetPrizesResponse> {
    await new Promise(resolve => setTimeout(resolve, 500))

    let filteredPrizes = [...mockPrizes]

    if (filters?.category) {
      filteredPrizes = filteredPrizes.filter(p => p.category === filters.category)
    }

    if (filters?.priceRange) {
      filteredPrizes = filteredPrizes.filter(
        p => p.price >= filters.priceRange!.min && p.price <= filters.priceRange!.max,
      )
    }

    if (filters?.search) {
      const searchLower = filters.search.toLowerCase()
      filteredPrizes = filteredPrizes.filter(
        p => p.title.toLowerCase().includes(searchLower) ||
             p.description.toLowerCase().includes(searchLower),
      )
    }

    if (filters?.sortBy) {
      switch (filters.sortBy) {
        case 'price_asc':
          filteredPrizes.sort((a, b) => a.price - b.price)
          break
        case 'price_desc':
          filteredPrizes.sort((a, b) => b.price - a.price)
          break
        case 'newest':
          filteredPrizes.sort((a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          )
          break
        case 'popular':
          filteredPrizes.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
          break
      }
    }

    const start = (page - 1) * pageSize
    const paginatedPrizes = filteredPrizes.slice(start, start + pageSize)

    return {
      prizes: paginatedPrizes,
      total: filteredPrizes.length,
      page,
      pageSize,
    }
  },

  async getPrizeById(id: string): Promise<Prize | null> {
    await new Promise(resolve => setTimeout(resolve, 300))

    const prize = mockPrizes.find(p => p.id === id)
    return prize ?? null
  },

  async redeemPrize(prizeId: string, preferences: Record<string, string>): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 1000))

    console.log('Redeeming prize:', prizeId, preferences)
    return true
  },
}