import { memo } from 'react'
import { ImageControlsProps } from '../types'

export const ImageControls = memo<ImageControlsProps>(({ 
  zoom, 
  onZoomIn, 
  onZoomOut, 
  onResetZoom, 
  onClose,
  showReset = true 
}) => {
  return (
    <>
      {/* Top Controls Bar */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4 sm:p-6 bg-gradient-to-b from-gray-900/80 dark:from-[#171717]/80 to-transparent">
        <div className="flex items-center gap-3">
          <div className="hidden sm:block rounded-lg bg-gray-800 dark:bg-[#262626] px-4 py-2 text-sm text-white shadow-lg border border-gray-700 dark:border-gray-600">
            Use ← → para navegar
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-10 h-10 rounded-lg bg-gray-900 dark:bg-[#171717] text-white hover:bg-gray-800 dark:hover:bg-[#262626] transition-all shadow-lg border border-gray-700 dark:border-gray-600 flex items-center justify-center"
          aria-label="Fechar visualizador"
          type="button"
        >
          <i className="ph ph-x text-xl" />
        </button>
      </div>

      {/* Bottom Zoom Controls */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center p-6 bg-gradient-to-t from-gray-900/80 dark:from-[#171717]/80 to-transparent">
        <div className="flex items-center justify-center gap-2 rounded-lg bg-gray-900 dark:bg-[#171717] p-3 shadow-lg border border-gray-700 dark:border-gray-600">
          <button
            onClick={onZoomOut}
            disabled={zoom <= 0.9}
            className="w-10 h-10 rounded-md bg-gray-800 dark:bg-[#262626] text-white hover:bg-gray-700 dark:hover:bg-[#404040] disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            aria-label="Diminuir zoom"
            type="button"
          >
            <i className="ph ph-magnifying-glass-minus text-lg" />
          </button>

          <div className="px-4 py-2 text-sm font-medium text-white min-w-[60px] text-center bg-gray-800 dark:bg-[#262626] rounded-md border border-gray-700 dark:border-gray-600">
            {Math.round(zoom * 100)}%
          </div>

          <button
            onClick={onZoomIn}
            disabled={zoom >= 3}
            className="w-10 h-10 rounded-md bg-gray-800 dark:bg-[#262626] text-white hover:bg-gray-700 dark:hover:bg-[#404040] disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            aria-label="Aumentar zoom"
            type="button"
          >
            <i className="ph ph-magnifying-glass-plus text-lg" />
          </button>

          {showReset && zoom > 1 && (
            <button
              onClick={onResetZoom}
              className="ml-2 rounded-md px-4 py-2 text-sm font-medium text-white bg-gray-800 dark:bg-[#262626] hover:bg-gray-700 dark:hover:bg-[#404040] transition-colors border border-gray-700 dark:border-gray-600"
              aria-label="Resetar zoom"
              type="button"
            >
              Resetar
            </button>
          )}
        </div>
      </div>
    </>
  )
})