import type { FC, ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  description?: string
  icon?: string // Classe do ícone Phosphor (ex: 'ph-users')
  iconClassName?: string
  right?: ReactNode
  className?: string
}

export const PageHeader: FC<PageHeaderProps> = ({
  title,
  description,
  icon,
  iconClassName = 'text-primary',
  right,
  className = '',
}) => {
  return (
    <div className={`flex items-start justify-between ${className}`}>
      <div className="space-y-1.5">
        <h1 className="text-3xl font-bold leading-tight tracking-tight flex items-center gap-3">
          {icon && <i className={`ph ${icon} ${iconClassName}`} />}
          {title}
        </h1>
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>
      {right && <div className="shrink-0">{right}</div>}
    </div>
  )
}


