export interface PrizePreference {
  label: string
  options: string[]
  required: boolean
  type: 'select' | 'color' | 'text'
}

export interface Prize {
  id: string
  title: string
  description: string
  category: 'eletronicos' | 'casa' | 'esporte' | 'livros' | 'vale-compras' | 'experiencias'
  price: number
  images: string[]
  preferences?: PrizePreference[]
  stock: number
  featured: boolean
  brand?: string
  specifications?: Record<string, string>
  createdAt: string
  updatedAt: string
}

export interface PrizeFilters {
  category?: Prize['category']
  priceRange?: {
    min: number
    max: number
  }
  search?: string
  sortBy?: 'price_asc' | 'price_desc' | 'newest' | 'popular'
}

export interface PrizeRedemption {
  prizeId: string
  preferences: Record<string, string>
  quantity: number
}