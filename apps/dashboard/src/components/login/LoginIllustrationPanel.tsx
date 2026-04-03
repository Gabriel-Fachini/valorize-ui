import { lazy, Suspense, useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

const Silk = lazy(() => import('@/components/Silk'))
const ShapeGrid = lazy(() => import('@/components/ShapeGrid'))

interface LoginIllustrationPanelProps {
  variant?: 'split' | 'background'
  className?: string
}

export const LoginIllustrationPanel = ({
  variant = 'split',
  className,
}: LoginIllustrationPanelProps) => {
  const isBackgroundVariant = variant === 'background'
  const [canRenderAnimation, setCanRenderAnimation] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 1024px)')
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

    const sync = () => {
      setCanRenderAnimation(mediaQuery.matches && !motionQuery.matches)
    }

    sync()
    mediaQuery.addEventListener('change', sync)
    motionQuery.addEventListener('change', sync)

    return () => {
      mediaQuery.removeEventListener('change', sync)
      motionQuery.removeEventListener('change', sync)
    }
  }, [])

  if (!canRenderAnimation) {
    return null
  }

  return (
    <div
      className={cn(
        'login-illustration-panel relative isolate overflow-hidden items-center justify-center bg-[#09120c]',
        isBackgroundVariant
          ? 'absolute inset-0 hidden min-h-dvh w-full lg:flex'
          : 'hidden lg:flex lg:w-3/5',
        className,
      )}
    >
      <Suspense fallback={null}>
        <div
          className={cn(
            'absolute inset-0 scale-[1.04] mix-blend-screen',
            isBackgroundVariant ? 'opacity-34' : 'opacity-40',
          )}
        >
          <Silk
            speed={0.85}
            scale={1.35}
            color="#00d959"
            noiseIntensity={0.65}
            rotation={0.16}
          />
        </div>

        <div
          className={cn(
            'absolute inset-0',
            isBackgroundVariant ? 'opacity-72' : 'opacity-68',
          )}
        >
          <ShapeGrid
            direction="right"
            shape="square"
            speed={0.28}
            squareSize={72}
            borderColor="rgba(0, 217, 89, 0.12)"
            hoverFillColor="rgba(0, 217, 89, 0.16)"
            hoverTrailAmount={4}
            className="h-full w-full"
          />
        </div>
      </Suspense>

      <div
        className={cn(
          'pointer-events-none absolute inset-0',
          isBackgroundVariant
            ? 'bg-[linear-gradient(90deg,rgba(3,8,6,0.95)_0%,rgba(3,8,6,0.84)_18%,rgba(3,8,6,0.3)_48%,rgba(3,8,6,0.62)_100%)]'
            : 'bg-[linear-gradient(135deg,rgba(3,8,6,0.48)_0%,rgba(3,8,6,0.12)_42%,rgba(3,8,6,0.5)_100%)]',
        )}
      />

      <div
        className={cn(
          'pointer-events-none absolute inset-0',
          isBackgroundVariant
            ? 'bg-[radial-gradient(circle_at_18%_18%,rgba(0,217,89,0.14),transparent_22%),radial-gradient(circle_at_78%_24%,rgba(51,255,135,0.1),transparent_20%),radial-gradient(circle_at_70%_82%,rgba(0,173,71,0.15),transparent_24%)]'
            : 'bg-[radial-gradient(circle_at_24%_28%,rgba(0,217,89,0.12),transparent_22%),radial-gradient(circle_at_74%_68%,rgba(51,255,135,0.08),transparent_20%)]',
        )}
      />

      <div
        className={cn(
          'pointer-events-none absolute inset-0 mix-blend-screen',
          isBackgroundVariant
            ? 'bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_40%),linear-gradient(180deg,rgba(255,255,255,0.04)_0%,rgba(255,255,255,0)_18%,rgba(0,217,89,0.04)_100%)]'
            : 'bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.04),transparent_36%),linear-gradient(180deg,rgba(255,255,255,0.03)_0%,rgba(255,255,255,0)_20%,rgba(0,217,89,0.04)_100%)]',
        )}
      />

      <div
        className={cn(
          'pointer-events-none relative z-10 text-center',
          isBackgroundVariant
            ? 'hidden lg:flex lg:absolute lg:inset-y-0 lg:right-0 lg:w-[52%] lg:items-center lg:justify-center lg:px-16 xl:w-[54%] xl:px-24'
            : 'max-w-xl px-16',
        )}
      >
        <div className={cn(isBackgroundVariant ? 'max-w-[32rem]' : '')}>
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.32em] text-white/45">
            Valorize Platform
          </p>
          <p
            style={{
              fontFamily: '\'Rubik\', sans-serif',
              fontWeight: 350,
              fontSize: 'clamp(1.6rem, 2.6vw, 2.5rem)',
              lineHeight: 1.35,
              color: 'rgba(255, 255, 255, 0.84)',
              letterSpacing: '-0.02em',
              userSelect: 'none',
            }}
          >
            Cultura organizacional
            <br />
            que transforma.
          </p>
        </div>
      </div>
    </div>
  )
}
