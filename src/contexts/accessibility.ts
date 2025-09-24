import { createContext } from 'react'

export type FontScale = 'sm' | 'md' | 'lg' | 'xl'

export interface AccessibilityPreferences {
  fontScale: FontScale
  highContrast: boolean
  reduceMotion: boolean
}

export interface AccessibilityContextType extends AccessibilityPreferences {
  setFontScale: (scale: FontScale) => void
  toggleHighContrast: () => void
  toggleReduceMotion: () => void
  resetDefaults: () => void
}

export const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined)
