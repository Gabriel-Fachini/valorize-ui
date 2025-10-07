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
        className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 dark:bg-gray-800/40 backdrop-blur-md text-gray-700 dark:text-gray-200 hover:bg-white/30 dark:hover:bg-gray-700/50 transition-all duration-300 border border-white/20 dark:border-gray-600/30"
        aria-label="Expandir sidebar"
      >
        <svg 
          className="h-4 w-4 transition-transform duration-300 rotate-180" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
    )
  }

  return (
    <div className="flex items-center justify-between w-full px-3">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600">
          <span className="text-xl font-bold text-white">V</span>
        </div>
        <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent drop-shadow-sm">
          Valorize
        </span>
      </div>
      {showToggle && (
        <button
          onClick={onToggle}
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20 dark:bg-gray-800/40 backdrop-blur-md text-gray-700 dark:text-gray-200 hover:bg-white/30 dark:hover:bg-gray-700/50 transition-all duration-300 border border-white/20 dark:border-gray-600/30 shadow-lg shadow-black/5 dark:shadow-black/20"
          aria-label="Colapsar sidebar"
        >
          <svg 
            className="h-4 w-4 transition-transform duration-300" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}
    </div>
  )
}

