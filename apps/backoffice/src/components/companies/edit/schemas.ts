import { z } from 'zod'

/**
 * Schema de validação para dados fiscais do Brasil
 */
export const companyBrazilSchema = z.object({
  cnpj: z
    .string()
    .regex(/^\d{14}$/, 'CNPJ deve conter 14 dígitos')
    .optional()
    .or(z.literal('')),
  razaoSocial: z
    .string()
    .min(2, 'Razão Social deve ter pelo menos 2 caracteres')
    .optional()
    .or(z.literal('')),
  inscricaoEstadual: z.string().optional().or(z.literal('')),
  cnaePrincipal: z.string().optional().or(z.literal('')),
  naturezaJuridica: z.string().optional().or(z.literal('')),
  porteEmpresa: z
    .enum(['Microempresa', 'Pequena Empresa', 'Média Empresa', 'Grande Empresa'])
    .optional()
    .or(z.literal('')),
  situacaoCadastral: z
    .enum(['Ativa', 'Suspensa', 'Inapta', 'Baixada'])
    .optional()
    .or(z.literal('')),
})

/**
 * Schema de validação para edição de informações gerais da empresa
 */
export const editCompanyOverviewSchema = z.object({
  name: z
    .string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),
  domain: z
    .string()
    .min(3, 'Domínio deve ter pelo menos 3 caracteres')
    .regex(
      /^([a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/,
      'Formato de domínio inválido'
    ),
  billingEmail: z
    .string()
    .email('Email inválido')
    .optional()
    .or(z.literal('')),
  country: z.string().length(2, 'País deve ser um código de 2 letras'),
  timezone: z.string().min(1, 'Timezone é obrigatório'),
  logoUrl: z
    .string()
    .url('URL inválida')
    .optional()
    .or(z.literal('')),
  companyBrazil: companyBrazilSchema.optional(),
})

export type EditCompanyOverviewFormData = z.infer<typeof editCompanyOverviewSchema>
