import { useCallback, useEffect, useRef, type CSSProperties, type MouseEvent as ReactMouseEvent } from 'react'

export const LoginIllustrationPanel = () => {
  const panelRef = useRef<HTMLDivElement | null>(null)
  const frameRef = useRef<number | null>(null)

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
      className="login-illustration-panel illustration-bg hidden lg:flex lg:w-3/5 relative overflow-hidden items-center justify-center"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
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
          backgroundImage: `
              linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
            `,
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

      {/* Main phrase */}
      <div className="relative z-10 max-w-xl px-16 text-center">
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
  )
}
