import { useTheme } from '@/hooks/useTheme'

interface ThemeWrapperProps {
  children: React.ReactNode
}

export const ThemeWrapper = ({ children }: ThemeWrapperProps) => {
  const { isDark } = useTheme()

  return (
    <div className={`min-h-screen ${isDark ? 'dark' : ''}`}>
      {children}
    </div>
  )
}
