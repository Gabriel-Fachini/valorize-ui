/**
 * Praise Form Types & Validation Schemas
 * Centralized form validation using Zod for type safety and runtime validation
 */

import { z } from 'zod'

/**
 * @description Multi-setp form validation schema for the praise form
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
 * @description Type inferred from the schema for type-safety
 */
export type NewPraiseFormData = z.infer<typeof newPraiseSchema>

/**
 * @description Possible states for the steps
 */
export type PraiseStep = 0 | 1 | 2 | 3 | 4

/**
 * @description Base props for the step components
 */
export interface StepComponentProps {
  onNext: () => void
  onPrev: () => void
  onCancel: () => void
  isSubmitting?: boolean
}

/**
 * @description Props for the selection step components
 */
export interface SelectionStepProps<T> extends StepComponentProps {
  selectedItem: T | null
  onSelect: (item: T) => void
  items: T[]
  loading?: boolean
}

/**
 * @description Props for the input step components
 */
export interface InputStepProps extends StepComponentProps {
  value: string
  onChange: (value: string) => void
  error?: string
  maxLength?: number
  minLength?: number
}

/**
 * @description Props for the confirmation step components
 */
export interface ConfirmationStepProps extends StepComponentProps {
  formData: NewPraiseFormData
  selectedUser: { name: string; department: string } | null
  selectedValue: { name: string; icon: string; color: string } | null
}
