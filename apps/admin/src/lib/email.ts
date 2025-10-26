/**
 * Email Utilities
 * Helper functions for email domain suggestions and validation
 */

// Common email domains for suggestions
export const COMMON_EMAIL_DOMAINS = [
  'gmail.com',
  'outlook.com',
  'hotmail.com',
  'yahoo.com',
  'icloud.com',
  'live.com',
  'msn.com',
  'aol.com',
  'protonmail.com',
  'yandex.com',
]

/**
 * Extract domain from email address
 */
export const extractEmailDomain = (email: string): string => {
  const atIndex = email.indexOf('@')
  return atIndex !== -1 ? email.slice(atIndex + 1) : ''
}

/**
 * Suggest email domains based on partial input
 */
export const suggestEmailDomain = (input: string): string[] => {
  const atIndex = input.indexOf('@')
  if (atIndex === -1) return []
  
  const domainPart = input.slice(atIndex + 1).toLowerCase()
  if (!domainPart) return COMMON_EMAIL_DOMAINS
  
  return COMMON_EMAIL_DOMAINS.filter(domain => 
    domain.startsWith(domainPart)
  ).slice(0, 5) // Limit to 5 suggestions
}
