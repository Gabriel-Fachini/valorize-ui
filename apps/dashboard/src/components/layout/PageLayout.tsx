import { ReactNode } from 'react'

interface PageLayoutProps {
  children: ReactNode
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | 'full'
  className?: string
}

export const PageLayout = ({ 
  children, 
  maxWidth = '4xl',
  className = '',
}: PageLayoutProps) => {
  const maxWidthClasses = {
    'sm': 'max-w-sm',
    'md': 'max-w-md',
    'lg': 'max-w-lg',
    'xl': 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
    '6xl': 'max-w-6xl',
    '7xl': 'max-w-7xl',
    'full': 'max-w-full',
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-50/80 via-white/60 to-purple-50/80 dark:from-gray-900/95 dark:via-gray-800/90 dark:to-gray-900/95 ${className}`}>
      <div className={`${maxWidthClasses[maxWidth]} mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8`}>
        {children}
      </div>
    </div>
  )
}