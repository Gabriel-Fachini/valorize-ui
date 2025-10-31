import { z } from 'zod'

/**
 * Company Info - Basic company information
 * Endpoint: GET/PATCH /admin/company/info
 */
export interface CompanyInfo {
  id: string
  name: string
  logo_url?: string
  country?: string
  timezone?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

/**
 * Company Domain - Allowed domains for SSO
 * Endpoint: GET/POST/DELETE /admin/company/domains
 */
export interface CompanyDomain {
  id: string
  domain: string
  created_at: string
}

/**
 * Coin Economy Settings
 * Endpoint: GET/PATCH /admin/company/coin-economy
 */
export interface CoinEconomy {
  weekly_renewal_amount: number // 50-500
  renewal_day: number // 1=Monday, 7=Sunday
  created_at: string
  updated_at: string
}

/**
 * Legacy Company interface for backward compatibility
 * @deprecated Use CompanyInfo, CompanyDomain, and CoinEconomy instead
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
 * @deprecated Use specific update types instead
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
 * Rules:
 * - Must have at least one dot (e.g., empresa.com)
 * - Cannot start or end with dot or hyphen
 * - Cannot have consecutive dots
 * - Each label must be 1-63 characters
 * - Must have valid TLD (at least 2 characters after last dot)
 * - Cannot be only numbers
 */
const domainRegex = /^(?!-)[a-z0-9-]{1,63}(?<!-)(\.[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)+$/i

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
  .trim()
  .refine((val) => {
    const trimmed = val.trim()
    if (!trimmed) return false
    
    // Must have at least one dot
    if (!trimmed.includes('.')) {
      return false
    }
    
    // Cannot start or end with dot or hyphen
    if (trimmed.startsWith('.') || trimmed.endsWith('.') || 
        trimmed.startsWith('-') || trimmed.endsWith('-')) {
      return false
    }
    
    // Cannot have consecutive dots
    if (trimmed.includes('..')) {
      return false
    }
    
    // Must have valid TLD (at least 2 characters after last dot)
    const parts = trimmed.split('.')
    if (parts.length < 2) return false
    const tld = parts[parts.length - 1]
    if (tld.length < 2 || !/^[a-z]+$/i.test(tld)) {
      return false
    }
    
    // Cannot be only numbers
    if (/^\d+$/.test(parts[0])) {
      return false
    }
    
    // Apply regex validation
    return domainRegex.test(trimmed)
  }, {
    message: 'Formato de domínio inválido. Use o formato: empresa.com.br (sem www, sem http, sem @)'
  })
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
