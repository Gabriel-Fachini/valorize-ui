import { z } from 'zod'

export const emailSchema = z
  .string()
  .min(1, 'Email é obrigatório')
  .email('Email inválido')

export const nameSchema = z
  .string()
  .min(2, 'Nome deve ter pelo menos 2 caracteres')
  .max(50, 'Nome deve ter no máximo 50 caracteres')

export const companySchema = z
  .string()
  .min(2, 'Nome da empresa é obrigatório')
  .max(100, 'Nome da empresa deve ter no máximo 100 caracteres')

export const phoneSchema = z
  .string()
  .min(10, 'Telefone deve ter pelo menos 10 dígitos')
  .max(15, 'Telefone deve ter no máximo 15 dígitos')
  .regex(/^[\d\s()-+]+$/, 'Telefone deve conter apenas números e símbolos válidos')

export const employeeCountSchema = z.enum(['1-10', '11-50', '51-200', '200+'])