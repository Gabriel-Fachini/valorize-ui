import { type FC } from 'react'
import { Button } from '@/components/ui/button'

interface BackButtonProps {
  onClick: () => void
  label?: string
  className?: string
}

export const BackButton: FC<BackButtonProps> = ({ 
  onClick, 
  label = 'Voltar',
  className,
}) => {
  return (
    <Button
      onClick={onClick}
      variant="ghost"
      className={`mb-6 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white bg-white dark:bg-neutral-900 hover:bg-white/90 dark:hover:bg-neutral-900/90 backdrop-blur-sm border border-[#3a3a3a] shadow-lg ${className}`}
      aria-label={label}
    >
      <i className="ph ph-arrow-left text-lg mr-2" />
      {label}
    </Button>
  )
}
