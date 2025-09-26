/**
 * Theme Types
 * Types related to application theming
 */

export type Theme = 'light' | 'dark'

export interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
  isDark: boolean
}
