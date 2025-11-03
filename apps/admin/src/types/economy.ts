/**
 * Economy Dashboard Types
 * Types for the economy dashboard feature (FAC-93)
 */

// Status possíveis dos cards de economia
export type EconomyStatus = 'healthy' | 'warning' | 'critical' | 'excess'

// Status possíveis de depósitos
export type DepositStatus = 'completed' | 'pending' | 'failed'

// Prioridade dos alertas
export type AlertPriority = 'critical' | 'warning' | 'info'

/**
 * Card 1: Saldo da Carteira
 * Representa o saldo atual da carteira da empresa em R$ (reais)
 */
export interface WalletBalance {
  total_loaded: number // Total já carregado na carteira (R$)
  total_spent: number // Total já gasto (R$)
  available_balance: number // Saldo disponível (R$)
  overdraft_limit: number // Limite de saque permitido (120% do ideal)
  percentage_of_ideal: number // % do saldo ideal para funcionar
  status: EconomyStatus // Status: 'healthy' | 'warning' | 'critical' | 'excess'
}

/**
 * Card 2: Fundo de Prêmios
 * Análise de saúde do fundo de prêmios com projeção de runway
 */
export interface PrizeFund {
  current_balance: number // Saldo atual em R$ (mesmo do wallet_balance)
  avg_monthly_consumption: number // Consumo médio mensal (R$)
  runway_days: number // Quantos dias dura o fundo
  status: EconomyStatus // Status baseado em runway
}

/**
 * Card 3: Moedas Resgatáveis
 * Indicador de cobertura: quanto em R$ equivalem as moedas em circulação
 */
export interface RedeemableCoins {
  total_in_circulation: number // Total de moedas em circulação
  equivalent_in_brl: number // Equivalente em R$ (taxa: 1 moeda = R$ 0,06)
  coverage_index: number // % de cobertura (quanto do saldo cobre as moedas)
  status: EconomyStatus // Status baseado em coverage_index
}

/**
 * Card 4: Engajamento de Elogios
 * Taxa de utilização de moedas distribuídas nesta semana
 */
export interface ComplimentEngagement {
  distributed_this_week: number // Moedas distribuídas esta semana
  used: number // Moedas usadas (resgatadas)
  wasted: number // Moedas que expiram sem uso
  usage_rate: number // % de taxa de uso
  status: EconomyStatus // Status baseado em usage_rate
}

/**
 * Card 5: Taxa de Resgate
 * Indicador de reengajamento: quantas moedas emitidas este mês foram resgatadas
 */
export interface RedemptionRate {
  coins_redeemed_this_month: number // Moedas resgatadas este mês
  coins_issued_this_month: number // Moedas emitidas este mês
  redemption_percentage: number // % de resgate
  status: EconomyStatus // Status baseado em redemption_percentage
}

/**
 * Alerta individual do dashboard
 */
export interface EconomyAlert {
  id: string // Identificador único
  priority: AlertPriority // Prioridade: 'critical' | 'warning' | 'info'
  title: string // Título do alerta
  description: string // Descrição detalhada
  recommended_action: string // Ação recomendada
  dismissible: boolean // Pode ser fechado pelo usuário
}

/**
 * Depósito individual na carteira
 */
export interface Deposit {
  id: string // UUID do depósito
  amount: number // Valor do depósito em R$
  status: DepositStatus // Status: 'completed' | 'pending' | 'failed'
  payment_method: string // Método de pagamento: 'PIX', 'boleto', etc
  deposited_at: string // Data do depósito em ISO 8601
  resulting_balance: number | null // Saldo após o aporte (null se pendente/falho)
}

/**
 * Histórico de depósitos (resposta paginada)
 */
export interface DepositHistory {
  deposits: Deposit[] // Lista de depósitos
  total: number // Total de depósitos na base
}

/**
 * Sugestão inteligente de aporte
 * Aparece apenas quando runway_days < 30
 */
export interface SuggestedDeposit {
  amount: number // Valor sugerido a aportar (R$)
  reason: string // Motivo da sugestão
  target_runway_days: number // Meta de dias de cobertura (45 dias é o ideal)
}

/**
 * Resposta completa do dashboard de economia
 * Retornada por GET /admin/dashboard/economy
 */
export interface EconomyDashboardData {
  wallet_balance: WalletBalance // Card 1: Saldo da carteira
  prize_fund: PrizeFund // Card 2: Fundo de prêmios
  redeemable_coins: RedeemableCoins // Card 3: Moedas em circulação
  compliment_engagement: ComplimentEngagement // Card 4: Engajamento de elogios
  redemption_rate: RedemptionRate // Card 5: Taxa de resgate
  alerts: EconomyAlert[] // Alertas priorizados
  deposit_history: Deposit[] // Histórico resumido de aportes (últimos 10)
  suggested_deposit: SuggestedDeposit | null // Sugestão de aporte (se runway < 30 dias)
}
