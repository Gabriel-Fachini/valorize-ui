import { type FC, useMemo } from 'react'
import { useTrail, animated } from '@react-spring/web'
import { getAnimationConfig } from '@/constants/animations'

interface PrizeSpecificationsProps {
  specifications: Record<string, string>
}

export const PrizeSpecifications: FC<PrizeSpecificationsProps> = ({ specifications }) => {
  const specificationEntries = useMemo(() => Object.entries(specifications), [specifications])
  
  const trail = useTrail(specificationEntries.length, {
    from: { opacity: 0, transform: 'translateX(-20px)' },
    to: { opacity: 1, transform: 'translateX(0px)' },
    config: getAnimationConfig('trail'),
  })

  if (specificationEntries.length === 0) {
    return null
  }

  return (
    <div className="mt-6 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 p-6 backdrop-blur-xl">
      <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Especificações</h3>
      <dl className="space-y-3">
        {trail.map((style, index) => {
          const [key, value] = specificationEntries[index]
          return (
            <animated.div
              key={key}
              style={style}
              className="flex justify-between border-b border-gray-100 dark:border-white/5 pb-2"
            >
              <dt className="text-sm text-gray-600 dark:text-gray-400">{key}</dt>
              <dd className="text-sm font-medium text-gray-900 dark:text-white">{value}</dd>
            </animated.div>
          )
        })}
      </dl>
    </div>
  )
}
