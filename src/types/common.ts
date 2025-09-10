/**
 * Common Types
 * Reusable types across the application
 */

import { type ReactNode } from 'react'

// Common component props
export interface BaseProps {
  className?: string
  children?: ReactNode
}

// Provider component props
export interface ProviderProps {
  children: ReactNode
}

// Common form types
export interface FormField {
  value: string
  error?: string
  touched?: boolean
}

// Loading states
export interface LoadingState {
  isLoading: boolean
  error?: string | null
}
