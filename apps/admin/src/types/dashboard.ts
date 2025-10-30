// Dashboard metrics types based on Linear task FAC-79

export interface DashboardMetrics {
  totalCompliments: number
  coinsMovement: number
  activeUsers: {
    count: number
    percentage: number
  }
  prizesRedeemed: number
  platformEngagement: number
}

export interface ComplimentsByWeek {
  week: string // ISO date string
  count: number
}

export interface ValueRanking {
  valueId: string
  valueName: string
  count: number
  percentage: number
}

export interface DashboardData {
  metrics: DashboardMetrics
  complimentsByWeek: ComplimentsByWeek[]
  topValues: ValueRanking[]
}

// API Response types
export interface DashboardMetricsResponse {
  success: boolean
  data: DashboardMetrics
  message?: string
}

export interface ComplimentsByWeekResponse {
  success: boolean
  data: ComplimentsByWeek[]
  message?: string
}

export interface TopValuesResponse {
  success: boolean
  data: ValueRanking[]
  message?: string
}

export interface DashboardDataResponse {
  success: boolean
  data: DashboardData
  message?: string
}
