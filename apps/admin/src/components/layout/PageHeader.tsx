import type { FC, ReactNode } from 'react'

type PageHeaderProps = {
  title: string
  description?: string
  right?: ReactNode
  className?: string
}

export const PageHeader: FC<PageHeaderProps> = ({ title, description, right, className = '' }) => {
  return (
    <div className={`flex items-start justify-between ${className}`}>
      <div className="space-y-1.5">
        <h1 className="text-3xl font-bold leading-tight tracking-tight">
          {title}
        </h1>
        {description ? (
          <p className="text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      {right ? (
        <div className="shrink-0">
          {right}
        </div>
      ) : null}
    </div>
  )
}


