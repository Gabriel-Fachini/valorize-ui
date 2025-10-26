import { useState, useEffect, useCallback, useMemo, type ReactNode } from 'react'
import { ThemeContext } from '@/contexts/theme'
import type { Theme } from '@/contexts/theme'

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    // If there is no theme stored in localStorage, use the system preference
    const storedTheme = localStorage.getItem('valorize_admin_theme') as Theme
    
    if (!storedTheme) {
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      const initialTheme = systemPrefersDark ? 'dark' : 'light'
      localStorage.setItem('valorize_admin_theme', initialTheme)
      return initialTheme
    }
    return storedTheme
  })

  useEffect(() => {
    // Apply or remove the 'dark' class on the document root (html) and body elements
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
      document.body.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
      document.body.classList.remove('dark')
    }
  }, [theme])

  // Listen for changes in system theme preference and update automatically if no user preference is stored
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e: MediaQueryListEvent) => {
      // If there is no theme stored in localStorage, update the theme
      if (!localStorage.getItem('valorize_admin_theme')) {
        setTheme(e.matches ? 'dark' : 'light')
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  const toggleTheme = useCallback(() => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('valorize_admin_theme', newTheme)
  }, [theme])

  const value = useMemo(() => ({
    theme,
    toggleTheme,
    isDark: theme === 'dark',
  }), [theme, toggleTheme])

  return <ThemeContext value={value}>{children}</ThemeContext>
}
