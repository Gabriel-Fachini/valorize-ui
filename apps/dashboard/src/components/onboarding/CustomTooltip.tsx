import React from 'react'
import type { TooltipRenderProps } from 'react-joyride'

export const CustomTooltip: React.FC<TooltipRenderProps> = ({
  continuous,
  index,
  step,
  backProps,
  closeProps,
  primaryProps,
  tooltipProps,
  isLastStep,
  size,
}) => {
  return (
    <div
      {...tooltipProps}
      className="rounded-2xl bg-white dark:bg-[#171717] border border-[#e5e5e5] dark:border-[#262626] shadow-2xl p-6 relative"
      style={{
        fontFamily: 'Inter, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
        maxWidth: '380px',
      }}
    >
      {/* Close Button with Icon */}
      <button
        {...closeProps}
        className="absolute top-4 right-4 flex items-center justify-center w-8 h-8 rounded-lg hover:bg-[#f5f5f5] dark:hover:bg-[#262626] transition-colors"
        aria-label="Fechar tour"
        title="Fechar"
      >
        <i className="ph ph-x text-[#737373] dark:text-[#a3a3a3]" style={{ fontSize: '20px' }}></i>
      </button>

      {/* Title */}
      {step.title && (
        <h4 className="text-xl font-bold text-[#171717] dark:text-[#f5f5f5] mb-3 pr-8">
          {step.title}
        </h4>
      )}

      {/* Content */}
      <div className="text-base text-[#525252] dark:text-[#d4d4d4] leading-relaxed mb-6">
        {step.content}
      </div>

      {/* Footer with buttons */}
      <div className="flex items-center justify-between gap-3">
        {/* Back button (if not first step) */}
        {index > 0 && (
          <button
            {...backProps}
            className="px-4 py-2.5 text-sm font-medium text-[#525252] dark:text-[#a3a3a3] hover:bg-[#f5f5f5] dark:hover:bg-[#262626] rounded-lg transition-colors"
          >
            Voltar
          </button>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Primary button (Next or Finish) */}
        {continuous && (
          <button
            {...primaryProps}
            className="px-5 py-2.5 text-sm font-semibold bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-black rounded-xl transition-all shadow-md hover:shadow-lg"
          >
            {isLastStep ? 'Finalizar' : 'Próximo'}
          </button>
        )}
      </div>

      {/* Progress indicator */}
      {continuous && (
        <div className="mt-4 pt-3 border-t border-[#e5e5e5] dark:border-[#262626]">
          <div className="text-xs text-[#737373] dark:text-[#a3a3a3] text-center">
            Passo {index + 1} de {size}
          </div>
        </div>
      )}
    </div>
  )
}
