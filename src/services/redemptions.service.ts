import type { Redemption, RedemptionsQuery, RedemptionsResponse } from '@/types/redemption.types'

const categoryLabels: Record<Redemption['category'], string> = {
  eletronicos: 'Eletrônicos',
  casa: 'Casa',
  esporte: 'Esporte',
  livros: 'Livros',
  'vale-compras': 'Vale Compras',
  experiencias: 'Experiências',
}

// Mock data
const MOCK_REDEMPTIONS: Redemption[] = [
  {
    id: 'r-1001',
    prizeId: '1',
    prizeTitle: 'Fone Bluetooth Premium',
    prizeImage: '/valorize_logo.png',
    category: 'eletronicos',
    amount: 1500,
    quantity: 1,
    status: 'COMPLETED',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
  },
  {
    id: 'r-1002',
    prizeId: '3',
    prizeTitle: 'Cafeteira Automática',
    prizeImage: '/valorize_logo.png',
    category: 'casa',
    amount: 2200,
    quantity: 1,
    status: 'PROCESSING',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
    cancellableUntil: new Date(Date.now() + 1000 * 60 * 60 * 4).toISOString(),
  },
  {
    id: 'r-1003',
    prizeId: '5',
    prizeTitle: 'Vale-Compras R$200',
    prizeImage: '/valorize_logo.png',
    category: 'vale-compras',
    amount: 2000,
    quantity: 1,
    status: 'PENDING',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    cancellableUntil: new Date(Date.now() + 1000 * 60 * 60 * 22).toISOString(),
  },
]

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

export const redemptionsService = {
  async getRedemptions(params: RedemptionsQuery = {}): Promise<RedemptionsResponse> {
    const { limit = 12, offset = 0, fromDate, toDate, status = 'ALL', search } = params
    await delay(400)

    let data = [...MOCK_REDEMPTIONS]
      // ordenar por data desc para uma lista estável
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    if (fromDate) {
      const fromTime = new Date(fromDate).getTime()
      data = data.filter((r) => new Date(r.createdAt).getTime() >= fromTime)
    }

    if (toDate) {
      const toTime = new Date(toDate).getTime()
      data = data.filter((r) => new Date(r.createdAt).getTime() <= toTime)
    }

    if (status !== 'ALL') {
      data = data.filter((r) => r.status === status)
    }

    if (search?.trim()) {
      const s = search.trim().toLowerCase()
      data = data.filter((r) =>
        r.prizeTitle.toLowerCase().includes(s) ||
        categoryLabels[r.category].toLowerCase().includes(s),
      )
    }

    const total = data.length
    const paged = data.slice(offset, offset + limit)

    return {
      redemptions: paged,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    }
  },

  async getRedemptionById(id: string): Promise<Redemption | null> {
    await delay(300)
    return MOCK_REDEMPTIONS.find((r) => r.id === id) ?? null
  },

  async cancelRedemption(id: string): Promise<Redemption> {
    await delay(600)
    const idx = MOCK_REDEMPTIONS.findIndex((r) => r.id === id)
    if (idx === -1) throw new Error('Resgate não encontrado')

    const redemption = MOCK_REDEMPTIONS[idx]

    // Verificar janela de cancelamento (1 dia)
    const createdAt = new Date(redemption.createdAt).getTime()
    const now = Date.now()
    const withinOneDay = now - createdAt <= 24 * 60 * 60 * 1000

    if (!withinOneDay) {
      throw new Error('Período de cancelamento expirado')
    }
    if (redemption.status === 'CANCELLED' || redemption.status === 'COMPLETED') {
      throw new Error('Não é possível cancelar este resgate')
    }

    const updated: Redemption = { ...redemption, status: 'CANCELLED' }
    MOCK_REDEMPTIONS[idx] = updated
    return updated
  },
}
