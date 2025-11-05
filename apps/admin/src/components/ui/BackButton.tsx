import { type FC } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'

interface BackButtonProps {
  to?: string
  label?: string
  onClick?: () => void
}

/**
 * BackButton - Componente reutilizável para navegação de volta
 * 
 * Pode navegar para uma rota específica ou usar navegação padrão do histórico
 * Permite customização do label e ação onClick
 */
export const BackButton: FC<BackButtonProps> = ({
  to,
  label = 'Voltar',
  onClick,
}) => {
  const navigate = useNavigate()

  const handleClick = () => {
    if (onClick) {
      onClick()
    } else if (to) {
      navigate({ to })
    } else {
      window.history.back()
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleClick}
      className="gap-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
    >
      <i className="ph ph-arrow-left" />
      {label}
    </Button>
  )
}
