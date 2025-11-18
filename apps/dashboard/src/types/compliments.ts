/**
 * Compliments Types
 * Types for the compliments system
 */

export interface ComplimentUser {
  id: string
  name: string
  email: string
  avatar?: string | null
}

export interface ComplimentUserWithDepartment extends ComplimentUser {
  department?: string
}

export interface CompanyValue {
  id: number
  companyId: string
  title: string
  description: string
  icon: string
  iconName?: string
  iconColor?: string
  example?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Compliment {
  id: string
  senderId: string
  receiverId: string
  valueId: number
  message: string
  coins: number
  createdAt: string
  sender?: ComplimentUser
  receiver?: ComplimentUser
  companyValue?: CompanyValue
}

export interface SendComplimentData {
  receiverId: string
  valueId: number
  message: string
  coins: number
}

export interface SendComplimentResponse {
  message: string
  compliment: Compliment
}

export interface ListReceivableUsersResponse {
  users: ComplimentUser[]
}

export interface ExpiringCoinDetail {
  amount: number
  expirationDate: string
  source?: string
}

export interface ExpiringCoins {
  next30Days: number
  next90Days: number
  urgentExpiration: boolean
  details: ExpiringCoinDetail[]
}

export interface UserBalance {
  complimentBalance: number
  redeemableBalance: number
  expiringCoins?: ExpiringCoins
}

export interface ComplimentsHistoryResponse {
  metainfo: {
    total: number
    page?: number
    limit?: number
    [key: string]: unknown
  }
  compliments: Compliment[]
}

// Public feed types
export interface ComplimentFeedItem {
  id: string
  sender: {
    id: string
    name: string
    avatar: string | null
    department: string
  }
  receiver: {
    id: string
    name: string
    avatar: string | null
    department: string
  }
  companyValue: {
    id: number
    title: string
    iconName: string
    iconColor: string
  }
  coins: number
  message: string
  createdAt: string
  timeAgo: string
}

// UI specific types (for backward compatibility with existing components)
export interface PraiseUser {
  id: string
  name: string
  email: string
  avatar?: string
  department: string
}

export interface PraiseValue {
  id: string
  name: string
  description: string
  color: string
  icon: string
}

export interface PraiseData {
  id: string
  from: {
    name: string
    avatar?: string
  }
  to: {
    name: string
    avatar?: string
  }
  message: string
  value: string
  coins: number
  createdAt: string
}
