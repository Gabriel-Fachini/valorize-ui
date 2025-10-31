import { z } from 'zod'

/**
 * Company interface representing company settings
 * Matches the model described in FAC-82
 */
export interface Company {
  id: string
  name: string
  logo_url?: string
  domains: string[] // ["empresa.com.br", "empresa.com"]
  weekly_renewal_amount: number // 100 (min: 50, max: 500)
  renewal_day: number // 1 = Monday, 7 = Sunday
  timezone?: string
  created_at: string
  updated_at: string
}

/**
 * Partial company settings for updates
 */
export interface CompanySettings {
  name: string
  logo_url?: string
  domains: string[]
  weekly_renewal_amount: number
  renewal_day: number
}

/**
 * Domain validation regex
 * Validates domain format like: empresa.com.br, empresa.com
 */
const domainRegex = /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?(\.[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)*$/i

/**
 * Schema for basic info form validation
 */
export const basicInfoSchema = z.object({
  name: z
    .string()
    .min(1, 'Nome da empresa é obrigatório')
    .min(3, 'Nome deve ter pelo menos 3 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),
  logo_url: z.string().optional(),
})

export type BasicInfoFormData = z.infer<typeof basicInfoSchema>

/**
 * Schema for domain validation
 */
export const domainSchema = z
  .string()
  .min(1, 'Domínio é obrigatório')
  .regex(domainRegex, 'Formato de domínio inválido (ex: empresa.com.br)')
  .toLowerCase()

/**
 * Schema for domains form validation
 */
export const domainsSchema = z.object({
  domains: z
    .array(z.string())
    .min(1, 'Pelo menos um domínio é obrigatório')
    .refine((domains) => domains.length === new Set(domains).size, {
      message: 'Domínios duplicados não são permitidos',
    }),
})

export type DomainsFormData = z.infer<typeof domainsSchema>

/**
 * Schema for coin economy form validation
 */
export const coinEconomySchema = z.object({
  weekly_renewal_amount: z
    .number()
    .min(50, 'Quantidade mínima é 50 moedas')
    .max(500, 'Quantidade máxima é 500 moedas')
    .int('Quantidade deve ser um número inteiro'),
  renewal_day: z
    .number()
    .min(1, 'Dia da semana é obrigatório')
    .max(7, 'Dia da semana inválido')
    .int('Dia da semana deve ser um número inteiro'),
})

export type CoinEconomyFormData = z.infer<typeof coinEconomySchema>

/**
 * Full company settings schema
 */
export const companySettingsSchema = z.object({
  name: z.string().min(1, 'Nome da empresa é obrigatório'),
  logo_url: z.string().optional(),
  domains: z.array(z.string()).min(1, 'Pelo menos um domínio é obrigatório'),
  weekly_renewal_amount: z.number().min(50).max(500),
  renewal_day: z.number().min(1).max(7),
})

export type CompanySettingsFormData = z.infer<typeof companySettingsSchema>

/**
 * Weekday options for renewal day select
 */
export const WEEKDAY_OPTIONS = [
  { value: 1, label: 'Segunda-feira' },
  { value: 2, label: 'Terça-feira' },
  { value: 3, label: 'Quarta-feira' },
  { value: 4, label: 'Quinta-feira' },
  { value: 5, label: 'Sexta-feira' },
  { value: 6, label: 'Sábado' },
  { value: 7, label: 'Domingo' },
] as const

/**
 * File upload constraints for logo
 */
export const LOGO_CONSTRAINTS = {
  maxSize: 1024 * 1024, // 1MB
  acceptedFormats: ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml'],
  recommendedDimensions: '200x200px',
} as const
