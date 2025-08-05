import { useState, useEffect, type ReactNode } from 'react'
import { Theme, ThemeContext } from './theme'

interface ThemeProviderProps {
  children: ReactNode
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [theme, setTheme] = useState<Theme>('light')

  useEffect(() => {
    // Verificar se há um tema armazenado no localStorage
    const storedTheme = localStorage.getItem('valorize_theme') as Theme
    
    // Se não houver tema armazenado, usar a preferência do sistema
    if (!storedTheme) {
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      const initialTheme = systemPrefersDark ? 'dark' : 'light'
      setTheme(initialTheme)
      localStorage.setItem('valorize_theme', initialTheme)
    } else {
      setTheme(storedTheme)
    }
  }, [])

  useEffect(() => {
    // Aplicar ou remover a classe 'dark' no elemento html
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('valorize_theme', newTheme)
  }

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      toggleTheme, 
      isDark: theme === 'dark',
    }}>
      {children}
    </ThemeContext.Provider>
  )
}