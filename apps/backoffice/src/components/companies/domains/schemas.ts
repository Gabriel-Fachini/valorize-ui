import { z } from 'zod'

export const addDomainSchema = z.object({
  domain: z
    .string()
    .min(1, 'Domínio é obrigatório')
    .min(3, 'Domínio deve ter no mínimo 3 caracteres')
    .regex(
      /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?(\.[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?)*\.[a-zA-Z]{2,}$/,
      'Formato de domínio inválido. Ex: example.com'
    )
    .transform((val) => val.toLowerCase().trim()),
})

export type AddDomainFormData = z.infer<typeof addDomainSchema>
