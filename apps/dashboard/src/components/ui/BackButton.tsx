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
      className={`mb-6 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/5 ${className}`}
      aria-label={label}
    >
      <i className="ph ph-arrow-left text-lg mr-2" />
      {label}
    </Button>
  )
}
