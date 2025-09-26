export interface TrialFormData {
  email: string
  company: string
  employees: '1-10' | '11-50' | '51-200' | '200+'
}

export interface ContactFormData {
  name: string
  email: string
  company: string
  phone?: string
  message: string
}

export interface NewsletterFormData {
  email: string
}

export interface FormState {
  isSubmitting: boolean
  isSuccess: boolean
  error: string | null
}