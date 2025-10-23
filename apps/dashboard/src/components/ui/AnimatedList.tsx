import { useTrail, animated } from '@react-spring/web'
import { cn } from '@/lib/utils'

interface AnimatedListProps<T> {
  items: T[]
  renderItem: (item: T, index: number) => React.ReactNode
  className?: string
  animationType?: 'fade' | 'slide' | 'scale'
  delay?: number
}

export function AnimatedList<T>({
  items,
  renderItem,
  className,
  animationType = 'fade',
  delay = 0,
}: AnimatedListProps<T>) {
  const trail = useTrail(items.length, {
    from: getAnimationFrom(animationType),
    to: getAnimationTo(animationType),
    config: { tension: 200, friction: 25 },
    delay,
  })

  return (
    <div className={cn('space-y-4 sm:space-y-6', className)}>
      {trail.map((style, index) => {
        const item = items[index]
        if (!item) return null
        
        return (
          <animated.div key={index} style={style}>
            {renderItem(item, index)}
          </animated.div>
        )
      })}
    </div>
  )
}

function getAnimationFrom(type: string) {
  switch (type) {
    case 'slide':
      return { opacity: 0, transform: 'translateY(30px)' }
    case 'scale':
      return { opacity: 0, transform: 'scale(0.9)' }
    case 'fade':
    default:
      return { opacity: 0, transform: 'translateY(20px)' }
  }
}

function getAnimationTo(type: string) {
  switch (type) {
    case 'slide':
      return { opacity: 1, transform: 'translateY(0px)' }
    case 'scale':
      return { opacity: 1, transform: 'scale(1)' }
    case 'fade':
    default:
      return { opacity: 1, transform: 'translateY(0px)' }
  }
}