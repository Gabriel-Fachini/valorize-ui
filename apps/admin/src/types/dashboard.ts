// Dashboard metrics types based on Linear task FAC-79

export interface DashboardMetrics {
  totalCompliments: number
  coinsDistributed: number
  activeUsers: {
    count: number
    percentage: number
  }
  prizesRedeemed: number
  engagementRate: number
}

export interface ComplimentsByWeek {
  weekStart: string // ISO date string
  count: number
}

export interface ValueRanking {
  valueId: string
  valueName: string
  count: number
  percentage: number
}

export interface DashboardPeriod {
  days: number
  startDate: string // ISO date string
  endDate: string // ISO date string
}

export interface DashboardData {
  period: DashboardPeriod
  metrics: DashboardMetrics
  weeklyCompliments: ComplimentsByWeek[]
  topValues: ValueRanking[]
}

// Filters used by the dashboard UI
export interface DashboardFilters {
  startDate?: string // ISO string
  endDate?: string // ISO string
  departmentId?: string
  role?: string
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
