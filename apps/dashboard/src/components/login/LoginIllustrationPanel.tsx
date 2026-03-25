import { useState, useCallback } from 'react'

export const LoginIllustrationPanel = () => {
  const [mouse, setMouse] = useState<{ x: number; y: number } | null>(null)

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMouse({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }, [])

  const handleMouseLeave = useCallback(() => {
    setMouse(null)
  }, [])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rubik:wght@400&display=swap');

        @keyframes orb-float-a {
          0%   { transform: translate(0px, 0px) scale(1); }
          33%  { transform: translate(-50px, 40px) scale(1.12); }
          66%  { transform: translate(30px, 60px) scale(0.95); }
          100% { transform: translate(0px, 0px) scale(1); }
        }

        @keyframes orb-float-b {
          0%   { transform: translate(0px, 0px) scale(1); }
          33%  { transform: translate(60px, -40px) scale(1.1); }
          66%  { transform: translate(-20px, 30px) scale(0.92); }
          100% { transform: translate(0px, 0px) scale(1); }
        }

        @keyframes orb-float-c {
          0%   { transform: translate(0px, 0px) scale(1); }
          40%  { transform: translate(-40px, -50px) scale(1.15); }
          70%  { transform: translate(50px, -20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }

        .illustration-bg {
          background: linear-gradient(
            135deg,
            #0d1a12 0%,
            #1a3324 25%,
            #0e1f14 50%,
            #162b1e 75%,
            #091209 100%
          );
        }

        .orb-a { animation: orb-float-a 5s ease-in-out infinite; }
        .orb-b { animation: orb-float-b 6s ease-in-out infinite; }
        .orb-c { animation: orb-float-c 7s ease-in-out infinite; }
      `}</style>

      <div
        className="illustration-bg hidden lg:flex lg:w-3/5 relative overflow-hidden items-center justify-center"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Grid 1 — base, always visible */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)
            `,
            backgroundSize: '48px 48px',
          }}
        />

        {/* Grid 2 — bright, revealed only under mouse via mask */}
        {mouse && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.18) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.18) 1px, transparent 1px)
              `,
              backgroundSize: '48px 48px',
              WebkitMaskImage: `radial-gradient(circle 260px at ${mouse.x}px ${mouse.y}px, black 0%, transparent 70%)`,
              maskImage: `radial-gradient(circle 260px at ${mouse.x}px ${mouse.y}px, black 0%, transparent 70%)`,
            }}
          />
        )}

        {/* Mouse spotlight — subtle background lightening */}
        {mouse && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(
                circle 280px at ${mouse.x}px ${mouse.y}px,
                rgba(255, 255, 255, 0.04) 0%,
                transparent 65%
              )`,
            }}
          />
        )}

        {/* Orb A — top right, large */}
        <div
          className="orb-a absolute"
          style={{
            width: '520px',
            height: '520px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(34, 197, 94, 0.28) 0%, transparent 65%)',
            top: '5%',
            right: '-5%',
            filter: 'blur(35px)',
          }}
        />

        {/* Orb B — bottom left, medium */}
        <div
          className="orb-b absolute"
          style={{
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(34, 197, 94, 0.20) 0%, transparent 65%)',
            bottom: '5%',
            left: '-5%',
            filter: 'blur(45px)',
          }}
        />

        {/* Orb C — center, soft accent */}
        <div
          className="orb-c absolute"
          style={{
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(74, 222, 128, 0.15) 0%, transparent 65%)',
            top: '45%',
            left: '40%',
            transform: 'translate(-50%, -50%)',
            filter: 'blur(55px)',
          }}
        />

        {/* Main phrase */}
        <div className="relative z-10 px-16 text-center">
          <p
            style={{
              fontFamily: "'Rubik', sans-serif",
              fontWeight: 400,
              fontSize: 'clamp(1.75rem, 3vw, 2.75rem)',
              lineHeight: 1.3,
              color: 'rgba(255, 255, 255, 0.92)',
              letterSpacing: '-0.01em',
            }}
          >
            Cultura organizacional
            <br />
            que transforma.
          </p>
        </div>
      </div>
    </>
  )
}
