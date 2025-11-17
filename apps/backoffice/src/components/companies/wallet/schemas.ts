import { z } from 'zod'

/**
 * Schema de validação para adicionar créditos à carteira
 */
export const addCreditsSchema = z.object({
  amount: z
    .number({
      required_error: 'Valor é obrigatório',
      invalid_type_error: 'Valor deve ser um número',
    })
    .positive('Valor deve ser maior que zero')
    .max(1000000, 'Valor máximo é R$ 1.000.000,00')
    .multipleOf(0.01, 'Valor deve ter no máximo 2 casas decimais'),
  reason: z
    .string()
    .max(500, 'Justificativa deve ter no máximo 500 caracteres')
    .optional(),
})

export type AddCreditsFormData = z.infer<typeof addCreditsSchema>

/**
 * Schema de validação para remover créditos da carteira
 */
export const removeCreditsSchema = z.object({
  amount: z
    .number({
      required_error: 'Valor é obrigatório',
      invalid_type_error: 'Valor deve ser um número',
    })
    .positive('Valor deve ser maior que zero')
    .max(1000000, 'Valor máximo é R$ 1.000.000,00')
    .multipleOf(0.01, 'Valor deve ter no máximo 2 casas decimais'),
  reason: z
    .string()
    .min(10, 'Justificativa deve ter no mínimo 10 caracteres')
    .max(500, 'Justificativa deve ter no máximo 500 caracteres'),
})

export type RemoveCreditsFormData = z.infer<typeof removeCreditsSchema>
