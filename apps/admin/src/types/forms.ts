/**
 * Form Types & Validation Schemas
 * Centralized form validation using Zod for type safety and runtime validation
 */

import { z } from 'zod'

/** --- Base validation schemas --- */
export const emailSchema = z
  .email({ error: 'Digite um email válido' })
  .transform((email) => email.toLowerCase().trim())

export const passwordSchema = z
  .string()
  .min(3, 'Senha é obrigatória')

export const loginFormSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
})

// Inferred types for TypeScript
export type LoginFormData = z.infer<typeof loginFormSchema>

// Input validation states
export interface InputValidationState {
  isValid: boolean
  error?: string
  touched: boolean
}

// Common input props for form integration
export interface BaseInputProps {
  name: string
  label: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  className?: string
  helperText?: string
  error?: string
  autoFocus?: boolean
  value?: string
  defaultValue?: string
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
}

// Email input specific props
export interface EmailInputProps extends Omit<BaseInputProps, 'type'> {
  showDomainSuggestions?: boolean
  commonDomains?: string[]
}

// Password input specific props
export interface PasswordInputProps extends Omit<BaseInputProps, 'type'> {
  showToggleVisibility?: boolean
  showCapsLockWarning?: boolean
}
