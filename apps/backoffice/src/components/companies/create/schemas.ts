/**
 * Validation schemas for Company creation wizard
 * Uses Zod for runtime validation
 */

import { z } from 'zod'
import { PlanType } from '@/types/company'

// Step 1: Basic Information
export const basicInfoSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  domain: z
    .string()
    .min(3, 'Domínio deve ter pelo menos 3 caracteres')
    .regex(
      /^([a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/,
      'Formato de domínio inválido (ex: empresa.com.br ou acme.com)'
    ),
  country: z.string().length(2, 'Código do país deve ter 2 caracteres').default('BR'),
  timezone: z.string().min(1, 'Timezone é obrigatório').default('America/Sao_Paulo'),
  logoUrl: z.string().url('URL inválida').optional().or(z.literal('')),
  billingEmail: z.string().email('Email inválido').optional().or(z.literal('')),
})

// Step 2: Brazil-specific data
export const brazilDataSchema = z.object({
  cnpj: z
    .string()
    .regex(/^\d{14}$/, 'CNPJ deve conter 14 dígitos')
    .optional()
    .or(z.literal('')),
  razaoSocial: z.string().min(2, 'Razão social é obrigatória'),
  inscricaoEstadual: z.string().optional(),
  cnaePrincipal: z.string().optional(),
  naturezaJuridica: z.string().optional(),
  porteEmpresa: z.enum(['Microempresa', 'Pequena Empresa', 'Média Empresa', 'Grande Empresa']).optional(),
  situacaoCadastral: z.enum(['Ativa', 'Suspensa', 'Inapta', 'Baixada']).default('Ativa'),
})

// Step 3: Plan and Values
export const planAndValuesSchema = z.object({
  plan: z.object({
    planType: z.nativeEnum(PlanType),
    pricePerUser: z.number().min(0, 'Preço deve ser maior ou igual a zero'),
    startDate: z.string().min(1, 'Data de início é obrigatória'),
  }),
  initialValues: z
    .array(
      z.object({
        title: z.string().min(1, 'Título é obrigatório'),
        description: z.string().optional(),
        iconName: z.string().optional(),
        iconColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Cor deve estar no formato hexadecimal').optional(),
      })
    )
    .min(2, 'Adicione pelo menos 2 valores')
    .max(10, 'Máximo de 10 valores permitidos'),
})

// Step 4: Initial Wallet
export const walletSchema = z.object({
  initialWalletBudget: z.number().min(0, 'Orçamento deve ser maior ou igual a zero').default(0),
})

// Step 5: First Admin
export const firstAdminSchema = z.object({
  firstAdmin: z.object({
    name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
    email: z.string().email('Email inválido'),
  }),
})

// Complete wizard schema
export const createCompanyWizardSchema = basicInfoSchema
  .merge(planAndValuesSchema)
  .merge(walletSchema)
  .merge(firstAdminSchema)
  .extend({
    companyBrazil: brazilDataSchema.optional(),
  })
  .refine(
    (data) => {
      // Validate that admin email domain matches company domain
      const emailDomain = data.firstAdmin.email.split('@')[1]
      return emailDomain === data.domain
    },
    {
      message: 'O email do administrador deve pertencer ao domínio da empresa',
      path: ['firstAdmin', 'email'],
    }
  )

export type BasicInfoFormData = z.infer<typeof basicInfoSchema>
export type BrazilDataFormData = z.infer<typeof brazilDataSchema>
export type PlanAndValuesFormData = z.infer<typeof planAndValuesSchema>
export type WalletFormData = z.infer<typeof walletSchema>
export type FirstAdminFormData = z.infer<typeof firstAdminSchema>
export type CreateCompanyWizardData = z.infer<typeof createCompanyWizardSchema>
