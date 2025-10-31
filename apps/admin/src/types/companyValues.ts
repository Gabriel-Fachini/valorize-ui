export interface CompanyValue {
  id: number
  company_id?: string
  title: string
  description?: string
  example?: string
  icon?: string // Legacy: URL da imagem (mantido para compatibilidade)
  iconName?: string // Nome do ícone Phosphor (ex: "lightbulb", "rocket")
  iconColor?: string // Cor do ícone em hex (ex: "#00D959")
  order: number // Campo 'order' conforme API (mantendo 'position' como alias temporário)
  position?: number // @deprecated Use 'order' instead
  is_active: boolean
  created_at: string
  updated_at: string
}