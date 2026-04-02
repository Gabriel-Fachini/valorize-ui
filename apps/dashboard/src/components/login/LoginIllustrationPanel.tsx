import { useCallback, useEffect, useRef, type CSSProperties, type MouseEvent as ReactMouseEvent } from 'react'
import { cn } from '@/lib/utils'
import './LoginIllustration.css'

interface LoginIllustrationPanelProps {
  variant?: 'split' | 'background'
  className?: string
}

export const LoginIllustrationPanel = ({
  variant = 'split',
  className,
}: LoginIllustrationPanelProps) => {
  const panelRef = useRef<HTMLDivElement | null>(null)
  const frameRef = useRef<number | null>(null)
  const isBackgroundVariant = variant === 'background'

  const handleMouseMove = useCallback((e: ReactMouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()

    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current)
    }

    frameRef.current = requestAnimationFrame(() => {
      const panel = panelRef.current
      if (!panel) return

      panel.style.setProperty('--login-mouse-x', `${e.clientX - rect.left}px`)
      panel.style.setProperty('--login-mouse-y', `${e.clientY - rect.top}px`)
      panel.style.setProperty('--login-spotlight-opacity', '1')
      frameRef.current = null
    })
  }, [])

  const handleMouseLeave = useCallback(() => {
    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current)
      frameRef.current = null
    }

    panelRef.current?.style.setProperty('--login-spotlight-opacity', '0')
  }, [])

  useEffect(() => {
    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current)
      }
    }
  }, [])

  const panelStyle = {
    '--login-mouse-x': '50%',
    '--login-mouse-y': '50%',
    '--login-spotlight-opacity': '0',
  } as CSSProperties

  return (
    <div
      ref={panelRef}
      style={panelStyle}
      className={cn(
        'login-illustration-panel illustration-bg relative isolate overflow-hidden items-center justify-center',
        isBackgroundVariant
          ? 'absolute inset-0 flex min-h-dvh w-full'
          : 'hidden lg:flex lg:w-3/5',
        className,
      )}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className={cn(
          'pointer-events-none absolute inset-0',
          isBackgroundVariant
            ? 'bg-[linear-gradient(90deg,rgba(3,8,6,0.72)_0%,rgba(3,8,6,0.5)_18%,rgba(3,8,6,0.14)_46%,rgba(3,8,6,0.22)_100%)]'
            : 'bg-[linear-gradient(135deg,rgba(3,8,6,0.12)_0%,rgba(3,8,6,0.03)_42%,rgba(3,8,6,0.12)_100%)]',
        )}
      />

      {/* Grid 1 — base, always visible */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }}
      />

      {/* Grid 2 — bright, revealed only under mouse via mask */}
      <div
        className="login-illustration-grid absolute inset-0 pointer-events-none"
        style={{
          backgroundSize: '48px 48px',
        }}
      />

      {/* Mouse spotlight — subtle background lightening */}
      <div className="login-illustration-spotlight absolute inset-0 pointer-events-none" />

      {/* Orb A — top right, large */}
      <div
        className="login-illustration-orb orb-a absolute"
        style={{
          width: '460px',
          height: '460px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(34, 197, 94, 0.2) 0%, transparent 65%)',
          top: '5%',
          right: '-5%',
          filter: 'blur(50px)',
        }}
      />

      {/* Orb B — bottom left, medium */}
      <div
        className="login-illustration-orb orb-b absolute"
        style={{
          width: '340px',
          height: '340px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(34, 197, 94, 0.16) 0%, transparent 65%)',
          bottom: '5%',
          left: '-5%',
          filter: 'blur(60px)',
        }}
      />

      {/* Orb C — center, soft accent */}
      <div
        className="login-illustration-orb orb-c absolute"
        style={{
          width: '260px',
          height: '260px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(74, 222, 128, 0.1) 0%, transparent 65%)',
          top: '45%',
          left: '40%',
          transform: 'translate(-50%, -50%)',
          filter: 'blur(70px)',
        }}
      />

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_45%),radial-gradient(circle_at_bottom_right,rgba(74,222,128,0.08),transparent_35%)]" />

      {/* Main phrase */}
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
