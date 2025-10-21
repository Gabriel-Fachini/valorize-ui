import { animated, useSpring } from '@react-spring/web'

interface StepHeaderProps {
  title: string
  description: string
  stepNumber: number
  totalSteps: number
}

export const StepHeader = ({ title, description, stepNumber, totalSteps }: StepHeaderProps) => {
  const headerAnimation = useSpring({
    from: { opacity: 0, transform: 'translateY(-20px)' },
    to: { opacity: 1, transform: 'translateY(0px)' },
    config: { tension: 300, friction: 30 },
  })

  return (
    <animated.div style={headerAnimation} className="mb-6">
      <h1 className="mb-2 text-4xl font-bold text-[#171717] dark:text-[#f5f5f5]">
        {title}
      </h1>
      <p className="text-lg text-[#525252] dark:text-[#a3a3a3]">
        {description} • Etapa {stepNumber} de {totalSteps}
      </p>
    </animated.div>
  )
}
