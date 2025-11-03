import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { AccessibilityContext, type AccessibilityContextType, type AccessibilityPreferences, type FontScale } from './accessibility'

const defaultPrefs: AccessibilityPreferences = {
  fontScale: 'md',
  highContrast: false,
  reduceMotion: false,
}

const STORAGE_KEY = 'valorize_accessibility'

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [prefs, setPrefs] = useState<AccessibilityPreferences>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return defaultPrefs
      const parsed = JSON.parse(raw) as Partial<AccessibilityPreferences>
      return { ...defaultPrefs, ...parsed }
    } catch {
      return defaultPrefs
    }
  })

  // Apply preferences to documentElement/body
  useEffect(() => {
    // font scale via data-attr
    document.documentElement.setAttribute('data-font', prefs.fontScale)

    // high contrast via class
    document.documentElement.classList.toggle('hc', prefs.highContrast)

    // reduce motion via class
    document.documentElement.classList.toggle('reduce-motion', prefs.reduceMotion)

    // persist
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs))
    } catch {
      // ignore storage errors
    }
  }, [prefs])

  const setFontScale = useCallback((scale: FontScale) => {
    setPrefs(prev => ({ ...prev, fontScale: scale }))
  }, [])

  const toggleHighContrast = useCallback(() => {
    setPrefs(prev => ({ ...prev, highContrast: !prev.highContrast }))
  }, [])

  const toggleReduceMotion = useCallback(() => {
    setPrefs(prev => ({ ...prev, reduceMotion: !prev.reduceMotion }))
  }, [])

  const resetDefaults = useCallback(() => {
    setPrefs(defaultPrefs)
  }, [])

  const value = useMemo<AccessibilityContextType>(() => ({
    ...prefs,
    setFontScale,
    toggleHighContrast,
    toggleReduceMotion,
    resetDefaults,
  }), [prefs, setFontScale, toggleHighContrast, toggleReduceMotion, resetDefaults])

  return <AccessibilityContext.Provider value={value}>{children}</AccessibilityContext.Provider>
}
