import { ReactNode } from 'react'
import { useSpring, animated } from '@react-spring/web'

interface PageTransitionProps {
  children: ReactNode
  direction?: 'left' | 'right' | 'fade'
  show: boolean
  delay?: number
}

export const PageTransition = ({ 
  children, 
  direction = 'fade', 
  show = true,
  delay = 0,
}: PageTransitionProps) => {
  const springConfig = {
    tension: 220,
    friction: 120,
    clamp: true,
  }

  const styles = useSpring({
    from: {
      opacity: direction === 'fade' ? 0 : 1,
      transform: 
        direction === 'left' ? 'translateX(0%)' :
        direction === 'right' ? 'translateX(100%)' :
        'translateX(0%)',
    },
    to: {
      opacity: show ? 1 : 0,
      transform: 
        direction === 'left' && !show ? 'translateX(-100%)' :
        direction === 'right' && show ? 'translateX(0%)' :
        direction === 'right' && !show ? 'translateX(100%)' :
        'translateX(0%)',
    },
    config: springConfig,
    delay,
  })

  return (
    <animated.div style={styles} className="w-full h-full">
      {children}
    </animated.div>
  )
}

export default PageTransition
