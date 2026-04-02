import Silk from '@/components/Silk'
import { cn } from '@/lib/utils'

interface LoginIllustrationPanelProps {
  variant?: 'split' | 'background'
  className?: string
}

export const LoginIllustrationPanel = ({
  variant = 'split',
  className,
}: LoginIllustrationPanelProps) => {
  const isBackgroundVariant = variant === 'background'

  return (
    <div
      className={cn(
        'login-illustration-panel relative isolate overflow-hidden items-center justify-center bg-[#09120c]',
        isBackgroundVariant
          ? 'absolute inset-0 flex min-h-dvh w-full'
          : 'hidden lg:flex lg:w-3/5',
        className,
      )}
    >
      <div
        className={cn(
          'absolute inset-0',
          isBackgroundVariant ? 'opacity-85' : 'opacity-95',
        )}
      >
        <Silk
          speed={4.8}
          scale={1.15}
          color="#00d959"
          noiseIntensity={1.2}
          rotation={0.2}
        />
      </div>

      <div
        className={cn(
          'pointer-events-none absolute inset-0',
          isBackgroundVariant
            ? 'bg-[linear-gradient(90deg,rgba(3,8,6,0.9)_0%,rgba(3,8,6,0.78)_20%,rgba(3,8,6,0.3)_48%,rgba(3,8,6,0.58)_100%)]'
            : 'bg-[linear-gradient(135deg,rgba(3,8,6,0.38)_0%,rgba(3,8,6,0.1)_42%,rgba(3,8,6,0.42)_100%)]',
        )}
      />

      <div
        className={cn(
          'pointer-events-none absolute inset-0',
          isBackgroundVariant
            ? 'bg-[radial-gradient(circle_at_18%_18%,rgba(0,217,89,0.22),transparent_24%),radial-gradient(circle_at_78%_24%,rgba(51,255,135,0.14),transparent_22%),radial-gradient(circle_at_70%_82%,rgba(0,173,71,0.2),transparent_26%)]'
            : 'bg-[radial-gradient(circle_at_24%_28%,rgba(0,217,89,0.14),transparent_24%),radial-gradient(circle_at_74%_68%,rgba(51,255,135,0.1),transparent_22%)]',
        )}
      />

      <div
        className={cn(
          'pointer-events-none absolute inset-0 mix-blend-screen',
          isBackgroundVariant
            ? 'bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.07),transparent_42%),linear-gradient(180deg,rgba(255,255,255,0.05)_0%,rgba(255,255,255,0)_20%,rgba(0,217,89,0.05)_100%)]'
            : 'bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.05),transparent_38%),linear-gradient(180deg,rgba(255,255,255,0.03)_0%,rgba(255,255,255,0)_22%,rgba(0,217,89,0.05)_100%)]',
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
