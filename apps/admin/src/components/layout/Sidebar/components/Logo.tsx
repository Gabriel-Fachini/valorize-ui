import type { LogoProps } from '../types'

export const Logo = ({ 
  collapsed = false, 
  onToggle, 
  showToggle = false, 
}: LogoProps) => {
  if (collapsed) {
    return (
      <button
        onClick={onToggle}
        className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10 transition-all duration-300"
        aria-label="Expandir sidebar"
      >
        <i 
          className="ph ph-caret-right" 
          style={{ fontSize: '1rem' }}
          aria-hidden="true"
        />
      </button>
    )
  }

  return (
    <div className="flex items-center justify-between w-full px-3">
      <div className="flex items-center gap-1" data-tour="logo">
        <div className="flex h-16 w-16 items-center justify-center rounded-xl p-2">
          <img 
            src='/logo4.svg'
            alt="Valorize Logo" 
            className="w-full h-full object-contain dark:hidden"
          />
          <img 
            src='/logo2.svg'
            alt="Valorize Logo" 
            className="w-full h-full object-contain hidden dark:block"
          />
        </div>
      </div>
      {showToggle && (
        <button
          onClick={onToggle}
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10 transition-all duration-300"
          aria-label="Colapsar sidebar"
        >
          <i 
            className="ph ph-caret-left" 
            style={{ fontSize: '1rem' }}
            aria-hidden="true"
          />
        </button>
      )}
    </div>
  )
}

