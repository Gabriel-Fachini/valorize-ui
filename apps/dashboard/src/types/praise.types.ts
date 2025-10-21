/**
 * Praise Form Types & Validation Schemas
 * Centralized form validation using Zod for type safety and runtime validation
 */

import { z } from 'zod'

/**
 * Schema de validação para o formulário de elogio multi-step
 */
export const newPraiseSchema = z.object({
  // Step 0: User Selection
  userId: z
    .string()
    .min(1, 'Selecione um usuário para enviar o elogio'),
  
  // Step 1: Value Selection  
  valueId: z
    .string()
    .min(1, 'Selecione um valor da empresa'),
  
  // Step 2: Coin Amount
  coins: z
    .number()
    .min(5, 'Mínimo de 5 moedas')
    .max(100, 'Máximo de 100 moedas'),
  
  // Step 3: Message
  message: z
    .string()
    .trim()
    .min(10, 'Mensagem deve ter pelo menos 10 caracteres')
    .max(500, 'Mensagem deve ter no máximo 500 caracteres'),
})

/**
 * Type inferido do schema para type-safety
 */
export type NewPraiseFormData = z.infer<typeof newPraiseSchema>

/**
 * Estados possíveis dos steps
 */
export type PraiseStep = 0 | 1 | 2 | 3 | 4

/**
 * Props base para componentes de step
 */
export interface StepComponentProps {
  onNext: () => void
  onPrev: () => void
  onCancel: () => void
  isSubmitting?: boolean
}

/**
 * Props para componentes de seleção
 */
export interface SelectionStepProps<T> extends StepComponentProps {
  selectedItem: T | null
  onSelect: (item: T) => void
  items: T[]
  loading?: boolean
}

/**
 * Props para componentes de input
 */
export interface InputStepProps extends StepComponentProps {
  value: string
  onChange: (value: string) => void
  error?: string
  maxLength?: number
  minLength?: number
}

/**
 * Props para componente de confirmação
 */
export interface ConfirmationStepProps extends StepComponentProps {
  formData: NewPraiseFormData
  selectedUser: { name: string; department: string } | null
  selectedValue: { name: string; icon: string; color: string } | null
}
