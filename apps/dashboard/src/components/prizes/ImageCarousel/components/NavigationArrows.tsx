import { memo } from 'react'
import { NavigationArrowsProps } from '../types'

export const NavigationArrows = memo<NavigationArrowsProps>(({ 
  onPrevious, 
  onNext, 
  disabled = false,
  className = '',
}) => {
  return (
    <>
      <button
        onClick={onPrevious}
        disabled={disabled}
        className={`absolute left-4 md:left-36 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-gray-100 dark:bg-[#171717] text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-[#262626] transition-all shadow-lg border border-gray-300 dark:border-gray-600 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed ${className}`}
        aria-label="Imagem anterior"
        type="button"
      >
        <i className="ph ph-caret-left text-2xl sm:text-3xl" />
      </button>

      <button
        onClick={onNext}
        disabled={disabled}
        className={`absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-gray-100 dark:bg-[#171717] text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-[#262626] transition-all shadow-lg border border-gray-300 dark:border-gray-600 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed ${className}`}
        aria-label="Próxima imagem"
        type="button"
      >
        <i className="ph ph-caret-right text-2xl sm:text-3xl" />
      </button>
    </>
  )
})