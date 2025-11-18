import { z } from 'zod'
import { PaymentMethod } from '@/types/financial'

/**
 * Schema for creating a new charge
 */
export const createChargeSchema = z.object({
  companyId: z.string().min(1, 'Empresa é obrigatória'),
  amount: z
    .string()
    .min(1, 'Valor é obrigatório')
    .refine(
      (val) => {
        const num = parseFloat(val.replace(/[^\d,.-]/g, '').replace(',', '.'))
        return !isNaN(num) && num > 0
      },
      { message: 'Valor deve ser maior que zero' }
    ),
  description: z.string().min(1, 'Descrição é obrigatória').max(500, 'Descrição muito longa'),
  dueDate: z.string().min(1, 'Data de vencimento é obrigatória'),
  issueDate: z.string().min(1, 'Data de emissão é obrigatória'),
  paymentMethod: z.nativeEnum(PaymentMethod).optional(),
  notes: z.string().max(1000, 'Observações muito longas').optional(),
})

export type CreateChargeFormData = z.infer<typeof createChargeSchema>

/**
 * Schema for editing a charge
 */
export const editChargeSchema = z.object({
  amount: z
    .string()
    .min(1, 'Valor é obrigatório')
    .refine(
      (val) => {
        const num = parseFloat(val.replace(/[^\d,.-]/g, '').replace(',', '.'))
        return !isNaN(num) && num > 0
      },
      { message: 'Valor deve ser maior que zero' }
    ),
  description: z.string().min(1, 'Descrição é obrigatória').max(500, 'Descrição muito longa'),
  dueDate: z.string().min(1, 'Data de vencimento é obrigatória'),
  issueDate: z.string().min(1, 'Data de emissão é obrigatória'),
  paymentMethod: z.nativeEnum(PaymentMethod).optional(),
  notes: z.string().max(1000, 'Observações muito longas').optional(),
})

export type EditChargeFormData = z.infer<typeof editChargeSchema>

/**
 * Schema for registering a payment
 */
export const registerPaymentSchema = z.object({
  amount: z
    .string()
    .min(1, 'Valor é obrigatório')
    .refine(
      (val) => {
        const num = parseFloat(val.replace(/[^\d,.-]/g, '').replace(',', '.'))
        return !isNaN(num) && num > 0
      },
      { message: 'Valor deve ser maior que zero' }
    ),
  paidAt: z.string().min(1, 'Data do pagamento é obrigatória'),
  paymentMethod: z.nativeEnum(PaymentMethod, {
    errorMap: () => ({ message: 'Método de pagamento é obrigatório' }),
  }),
  notes: z.string().max(1000, 'Observações muito longas').optional(),
})

export type RegisterPaymentFormData = z.infer<typeof registerPaymentSchema>

/**
 * Schema for uploading attachment
 */
export const uploadAttachmentSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.size <= 10 * 1024 * 1024, 'O arquivo deve ter no máximo 10MB')
    .refine(
      (file) => ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'].includes(file.type),
      'Formato não suportado. Use PDF, JPG, PNG ou WEBP'
    ),
})

export type UploadAttachmentFormData = z.infer<typeof uploadAttachmentSchema>
