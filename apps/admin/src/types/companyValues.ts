export interface CompanyValue {
  id: string
  title: string
  description?: string
  example?: string
  icon?: string // Legacy: URL da imagem (mantido para compatibilidade)
  iconName?: string // Nome do ícone Phosphor (ex: "lightbulb", "rocket")
  iconColor?: string // Cor do ícone em hex (ex: "#00D959")
  position: number
  is_active: boolean
  created_at: string
  updated_at: string
}