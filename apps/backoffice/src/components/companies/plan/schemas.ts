import { z } from 'zod'
import { PlanType } from '@/types/company'

export const updatePlanSchema = z.object({
  planType: z.nativeEnum(PlanType, {
    required_error: 'Selecione um tipo de plano',
  }),
  pricePerUser: z
    .number({
      required_error: 'Preço por usuário é obrigatório',
      invalid_type_error: 'Preço deve ser um número',
    })
    .positive('Preço deve ser maior que zero')
    .max(1000, 'Preço máximo é R$ 1.000,00')
    .multipleOf(0.01, 'Preço deve ter no máximo 2 casas decimais'),
  startDate: z
    .string({
      required_error: 'Data de início é obrigatória',
    })
    .min(1, 'Data de início é obrigatória')
    .transform((val) => {
      // Se já está no formato ISO completo, retorna como está
      if (val.includes('Z') || val.includes('+')) {
        return val
      }
      // Se é do formato datetime-local (YYYY-MM-DDTHH:mm), converte para ISO
      if (val.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/)) {
        return new Date(val).toISOString()
      }
      // Tenta converter qualquer outro formato
      const date = new Date(val)
      if (isNaN(date.getTime())) {
        throw new Error('Data inválida')
      }
      return date.toISOString()
    }),
})

export type UpdatePlanFormData = z.infer<typeof updatePlanSchema>
