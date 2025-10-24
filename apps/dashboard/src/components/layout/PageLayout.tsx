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
    <div className={`min-h-screen bg-gray-50 dark:bg-[#1a1a1a] ${className}`}>
      <div className={`${maxWidthClasses[maxWidth]} mx-auto px-6 sm:px-8 lg:px-8 py-4 sm:py-6 lg:py-8`}>
        {children}
      </div>
    </div>
  )
}

