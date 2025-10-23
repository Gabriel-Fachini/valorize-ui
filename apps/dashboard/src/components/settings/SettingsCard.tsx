import React from 'react'
import { animated } from '@react-spring/web'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { SectionCardHeader } from '@/components/ui/SectionCardHeader'
import { cn } from '@/lib/utils'

interface SettingsCardProps {
  icon: string
  title: string
  description: string
  children: React.ReactNode
  animation?: any
  className?: string
}

export const SettingsCard: React.FC<SettingsCardProps> = ({
  icon,
  title,
  description,
  children,
  animation,
  className,
}) => {
  const CardComponent = animation ? animated(Card) : Card
  const cardProps = animation ? { style: animation } : {}

  return (
    <CardComponent
      className={cn(
        'border-neutral-200 dark:border-neutral-700/50 bg-white/70 dark:bg-neutral-800/70 backdrop-blur-xl shadow-xl',
        className,
      )}
      {...cardProps}
    >
      <CardHeader className="pb-4">
        <SectionCardHeader
          icon={icon}
          title={title}
          description={description}
        />
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </CardComponent>
  )
}
