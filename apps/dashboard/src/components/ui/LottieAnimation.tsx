import { useEffect, useRef, useState } from 'react'
import lottie, { type AnimationItem } from 'lottie-web'

interface LottieAnimationProps {
  animationData?: object
  path?: string
  loop?: boolean
  autoplay?: boolean
  speed?: number
  scale?: number
  className?: string
  style?: React.CSSProperties
  onComplete?: () => void
  onLoopComplete?: () => void
}

export const LottieAnimation = ({
  animationData,
  path,
  loop = true,
  autoplay = true,
  speed = 1,
  scale = 1,
  className = '',
  style,
  onComplete,
  onLoopComplete,
}: LottieAnimationProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<AnimationItem | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    try {
      const animation = lottie.loadAnimation({
        container: containerRef.current,
        renderer: 'svg',
        loop,
        autoplay,
        animationData,
        path,
      })

      animationRef.current = animation

      if (onComplete) {
        animation.addEventListener('complete', onComplete)
      }

      if (onLoopComplete) {
        animation.addEventListener('loopComplete', onLoopComplete)
      }

      // Adicionar listener para erros
      animation.addEventListener('data_failed', () => {
        setError('Falha ao carregar animação')
      })

      // Aplicar velocidade
      animation.setSpeed(speed)

      return () => {
        animation.destroy()
        animationRef.current = null
      }
    } catch (err) {
      setError('Erro ao carregar animação')
      if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.error('Lottie animation error:', err)
      }
      return undefined
    }
  }, [animationData, path, loop, autoplay, speed, scale, onComplete, onLoopComplete])

  if (error) {
    return (
      <div className={`${className} flex items-center justify-center bg-gray-100 border-2 border-dashed border-gray-300`} style={style}>
        <div className="text-center text-gray-500">
          <div className="text-sm">Erro ao carregar animação</div>
          <div className="text-xs mt-1">{path}</div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`flex items-center justify-center ${className}`}
      style={style}
    >
      <div
        ref={containerRef}
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'center',
        }}
      />
    </div>
  )
}
