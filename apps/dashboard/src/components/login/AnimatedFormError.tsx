import { animated, config, useTransition } from '@react-spring/web'

interface AnimatedFormErrorProps {
  message?: string
}

export const AnimatedFormError = ({ message }: AnimatedFormErrorProps) => {
  const transitions = useTransition(message, {
    from: {
      opacity: 0,
      transform: 'translate3d(-14px, 0, 0)',
    },
    enter: {
      opacity: 1,
      transform: 'translate3d(0px, 0, 0)',
    },
    leave: {
      opacity: 0,
      transform: 'translate3d(-10px, 0, 0)',
    },
    config: {
      ...config.gentle,
      clamp: true,
    },
  })

  return transitions((style, item) =>
    item ? (
      <animated.div
        style={style}
        className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700 dark:border-red-700/50 dark:bg-red-900/30 dark:text-red-300"
        role="alert"
        aria-live="polite"
      >
        {item}
      </animated.div>
    ) : null,
  )
}
