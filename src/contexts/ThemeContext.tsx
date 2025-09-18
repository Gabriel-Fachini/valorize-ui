import { useState, useEffect } from 'react'
import { ThemeContext } from './theme'
import type { Theme, ProviderProps } from '@types'

export const ThemeProvider = ({ children }: ProviderProps) => {
  const [theme, setTheme] = useState<Theme>(() => {
    // Verificar se há um tema armazenado no localStorage
    const storedTheme = localStorage.getItem('valorize_theme') as Theme
    
    // Se não houver tema armazenado, usar a preferência do sistema
    if (!storedTheme) {
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      const initialTheme = systemPrefersDark ? 'dark' : 'light'
      localStorage.setItem('valorize_theme', initialTheme)
      return initialTheme
    }
    return storedTheme
  })

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
    
    // Aplicar o tema imediatamente
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
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