/**
 * Email Utilities
 * General-purpose email helper functions
 */

// Common domains for email suggestions
export const COMMON_EMAIL_DOMAINS = [
  'gmail.com',
  'outlook.com',
  'hotmail.com',
  'yahoo.com',
  'icloud.com',
  'live.com',
  'msn.com',
  'uol.com.br',
  'terra.com.br',
  'bol.com.br',
] as const

// Email domain extraction
export const extractEmailDomain = (email: string): string | null => {
  const match = email.match(/@(.+)$/)
  return match ? match[1] : null
}

// Email domain suggestion
export const suggestEmailDomain = (partialEmail: string): string[] => {
  const atIndex = partialEmail.indexOf('@')
  if (atIndex === -1) return []
  
  const domain = partialEmail.slice(atIndex + 1).toLowerCase()
  if (!domain) return COMMON_EMAIL_DOMAINS.slice(0, 3)
  
  return COMMON_EMAIL_DOMAINS
    .filter(commonDomain => commonDomain.startsWith(domain))
    .slice(0, 3)
}
