import { z } from 'zod'

/**
 * Brazilian states (UF)
 */
export const BRAZILIAN_STATES = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
] as const

/**
 * Validate Brazilian CEP (ZIP code) format
 * Accepts: 12345-678, 12345678
 */
export const validateCEP = (cep: string): boolean => {
  const cleaned = cep.replace(/\D/g, '')
  return cleaned.length === 8
}

/**
 * Format CEP to standard format (12345-678)
 */
export const formatCEP = (cep: string): string => {
  const cleaned = cep.replace(/\D/g, '')
  if (cleaned.length !== 8) return cep
  return `${cleaned.slice(0, 5)}-${cleaned.slice(5)}`
}

/**
 * Validate Brazilian phone number
 * Accepts: (11) 98765-4321, (11) 3456-7890, 11987654321, etc.
 */
export const validatePhone = (phone: string): boolean => {
  const cleaned = phone.replace(/\D/g, '')
  // Landline: 10 digits (XX XXXX-XXXX)
  // Mobile: 11 digits (XX 9XXXX-XXXX)
  return cleaned.length === 10 || cleaned.length === 11
}

/**
 * Format phone to standard format
 */
export const formatPhone = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '')
  
  if (cleaned.length === 11) {
    // Mobile: (XX) 9XXXX-XXXX
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`
  } else if (cleaned.length === 10) {
    // Landline: (XX) XXXX-XXXX
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`
  }
  
  return phone
}

/**
 * Zod schema for Brazilian address validation
 */
export const addressSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, 'Nome do endereço deve ter pelo menos 3 caracteres')
    .max(100, 'Nome do endereço deve ter no máximo 100 caracteres'),
  
  street: z
    .string()
    .trim()
    .min(3, 'Rua/Avenida deve ter pelo menos 3 caracteres')
    .max(200, 'Rua/Avenida deve ter no máximo 200 caracteres'),
  
  number: z
    .string()
    .trim()
    .min(1, 'Número é obrigatório')
    .max(10, 'Número deve ter no máximo 10 caracteres'),
  
  complement: z
    .string()
    .trim()
    .max(100, 'Complemento deve ter no máximo 100 caracteres')
    .optional()
    .or(z.literal('')),
  
  neighborhood: z
    .string()
    .trim()
    .min(2, 'Bairro deve ter pelo menos 2 caracteres')
    .max(100, 'Bairro deve ter no máximo 100 caracteres')
    .optional()
    .or(z.literal('')),
  
  city: z
    .string()
    .trim()
    .min(2, 'Cidade deve ter pelo menos 2 caracteres')
    .max(100, 'Cidade deve ter no máximo 100 caracteres'),
  
  state: z
    .string()
    .trim()
    .length(2, 'UF deve ter 2 caracteres')
    .toUpperCase()
    .refine((val) => BRAZILIAN_STATES.includes(val as typeof BRAZILIAN_STATES[number]), {
      message: 'UF inválida',
    }),
  
  zipCode: z
    .string()
    .trim()
    .refine(validateCEP, {
      message: 'CEP inválido. Use o formato 12345-678 ou 12345678',
    })
    .transform((val) => val.replace(/\D/g, '')), // Store only digits
  
  country: z
    .string()
    .trim()
    .min(2, 'País é obrigatório')
    .max(2, 'Código do país deve ter 2 caracteres'),
  
  phone: z
    .string()
    .trim()
    .refine((val) => !val || validatePhone(val), {
      message: 'Telefone inválido. Use o formato (XX) XXXXX-XXXX',
    })
    .transform((val) => val.replace(/\D/g, '')) // Store only digits
    .optional(),
})

export type AddressFormData = z.infer<typeof addressSchema>
