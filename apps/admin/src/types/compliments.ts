/**
 * Compliments Dashboard Types
 * Types for managing compliments analytics and metrics in admin
 * Based on actual API response structure
 */

/**
 * Company value reference
 */
export interface CompanyValue {
  id: number
  title: string
  description?: string
  iconName?: string
  iconColor?: string
}

/**
 * Department reference
 */
export interface Department {
  id: string
  name: string
  userCount?: number
}

/**
 * Filter parameters for compliments dashboard
 */
export interface ComplimentsDashboardFilters {
  startDate?: string
  endDate?: string
  departmentId?: string
  jobTitleId?: string
  companyValueId?: string
}

/**
 * Period information
 */
export interface PeriodInfo {
  startDate: string
  endDate: string
  previousPeriod: {
    startDate: string
    endDate: string
  }
}

/**
 * Comparison metrics with previous period
 */
export interface ComparisonMetrics {
  complimentsChange: number
  complimentsChangeLabel: string
  coinsChange: number
  coinsChangeLabel: string
  usersChange: number
  usersChangeLabel: string
}

/**
 * Overview metrics (top cards)
 */
export interface ComplimentsOverview {
  totalCompliments: number
  totalCoinsDistributed: number
  activeUsers: {
    count: number
    percentage: number
    total: number
  }
  avgCoinsPerCompliment: number
  engagementRate: number
  comparison: ComparisonMetrics
}

/**
 * Company value distribution item
 */
export interface ValueDistributionItem {
  valueId: number
  valueName: string
  description: string
  iconName: string
  iconColor: string
  count: number
  percentage: number
  totalCoins: number
  trend: 'up' | 'down' | 'stable'
  trendPercentage: number
}

/**
 * Top sender user
 */
export interface TopSenderUser {
  userId: string
  name: string
  email: string
  avatar: string | null
  department: string | null
  jobTitle: string | null
  sentCount: number
  totalCoinsSent: number
  avgCoinsPerCompliment: number
}

/**
 * Top receiver user
 */
export interface TopReceiverUser {
  userId: string
  name: string
  email: string
  avatar: string | null
  department: string | null
  jobTitle: string | null
  receivedCount: number
  totalCoinsReceived: number
  avgCoinsPerCompliment: number
}

/**
 * Balanced user
 */
export interface BalancedUser {
  userId: string
  name: string
  email: string
  avatar: string | null
  department: string | null
  jobTitle: string | null
  sentCount: number
  receivedCount: number
  balanceScore: number
}

/**
 * Top users categorized
 */
export interface TopUsers {
  senders: TopSenderUser[]
  receivers: TopReceiverUser[]
  balanced: BalancedUser[]
}

/**
 * Department analytics item
 */
export interface DepartmentAnalyticsItem {
  departmentId: string
  departmentName: string
  totalUsers: number
  activeUsers: number
  totalCompliments: number
  avgPerUser: number
  engagementRate: number
  topValue: {
    valueName: string
    count: number
  }
}

/**
 * Cross-department flow item
 */
export interface CrossDepartmentFlowItem {
  fromDepartmentId: string
  fromDepartmentName: string
  toDepartmentId: string
  toDepartmentName: string
  complimentCount: number
  coinAmount: number
}

/**
 * Department analytics with flow
 */
export interface DepartmentAnalytics {
  departments: DepartmentAnalyticsItem[]
  crossDepartmentFlow: CrossDepartmentFlowItem[]
}

/**
 * Weekly trend data point
 */
export interface WeeklyTrendPoint {
  weekStart: string
  weekEnd: string
  count: number
  coins: number
}

/**
 * Day of week distribution
 */
export interface DayOfWeekDistribution {
  dayOfWeek: number // 0-6
  dayName: string // "Segunda", "Terça"...
  count: number
  percentage: number
}

/**
 * Hourly distribution
 */
export interface HourlyDistribution {
  hour: number // 0-23
  count: number
  percentage: number
}

/**
 * Monthly growth data
 */
export interface MonthlyGrowth {
  currentMonth: {
    month: string
    count: number
    coins: number
  }
  previousMonth: {
    month: string
    count: number
    coins: number
  }
  growthRate: number
}

/**
 * Temporal patterns analytics
 */
export interface TemporalPatterns {
  weeklyTrend: WeeklyTrendPoint[]
  dayOfWeekDistribution: DayOfWeekDistribution[]
  hourlyDistribution: HourlyDistribution[]
  monthlyGrowth: MonthlyGrowth
}

/**
 * Recent activity item
 */
export interface RecentActivityItem {
  id: string
  sender: {
    id: string
    name: string
    avatar: string | null
    department: string | null
  }
  receiver: {
    id: string
    name: string
    avatar: string | null
    department: string | null
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

/**
 * Insight item
 */
export interface InsightItem {
  type: 'warning' | 'success' | 'info'
  category: 'engagement' | 'values' | 'departments' | 'users'
  title: string
  description: string
  metric: number | null
  actionable: boolean
  priority: 'high' | 'medium' | 'low'
}

/**
 * Engagement metrics
 */
export interface EngagementMetrics {
  participationRate: number
  averageComplimentsPerUser: number
  medianCoinsPerCompliment: number
  inactiveUsers: {
    count: number
    percentage: number
    list: Array<{
      userId: string
      name: string
      department: string | null
      lastActivity: string | null
    }>
  }
}

/**
 * Dashboard metadata
 */
export interface DashboardMetadata {
  generatedAt: string
  executionTime: number
  filters: {
    departmentId: string | null
    jobTitleId: string | null
  }
  companyInfo: {
    totalEmployees: number
    activeEmployees: number
    totalValues: number
    activeValues: number
  }
}

/**
 * Complete dashboard response
 */
export interface ComplimentsDashboardResponse {
  period: PeriodInfo
  overview: ComplimentsOverview
  valuesDistribution: ValueDistributionItem[]
  topUsers: TopUsers
  departmentAnalytics: DepartmentAnalytics
  temporalPatterns: TemporalPatterns
  insights: InsightItem[]
  recentActivity: RecentActivityItem[]
  engagementMetrics: EngagementMetrics
  metadata: DashboardMetadata
}

/**
 * Network node (for network visualization)
 */
export interface NetworkNode {
  id: string
  name: string
  avatar?: string
  role: string
  department: string
  complimentsGiven: number
  complimentsReceived: number
}

/**
 * Network link (connection between users)
 */
export interface NetworkLink {
  source: string // userId
  target: string // userId
  value: number // number of compliments
  compliments: string[] // array of compliment messages
}

/**
 * Network graph data
 */
export interface NetworkGraphData {
  nodes: NetworkNode[]
  links: NetworkLink[]
}

/**
 * Network visualization filters
 */
export interface NetworkFilters {
  startDate?: string // YYYY-MM-DD
  endDate?: string // YYYY-MM-DD
  department?: string // department name
  minConnections?: number // minimum number of compliments
  limit?: number // maximum number of nodes (default: 50, max: 100)
  userIds?: string // comma-separated list of user IDs
}

/**
 * Export format options
 */
export enum ExportFormat {
  PDF = 'pdf',
  EXCEL = 'excel',
  CSV = 'csv',
}

/**
 * Export request payload
 */
export interface ExportDashboardPayload {
  format: ExportFormat
  filters?: ComplimentsDashboardFilters
  sections?: string[] // which sections to include
}
