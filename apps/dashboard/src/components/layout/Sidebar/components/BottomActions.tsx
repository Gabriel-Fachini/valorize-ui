import type { BottomActionsProps } from '../types'

export const BottomActions = ({ 
  collapsed = false, 
  onLogout, 
}: BottomActionsProps) => {
  return (
    <div className={
      collapsed 
        ? 'border-t border-white/10 dark:border-gray-700/30 p-3 bg-gradient-to-t from-white/5 to-transparent dark:from-gray-800/10'
        : 'border-t border-white/10 dark:border-gray-700/30 p-6 bg-gradient-to-t from-white/5 to-transparent dark:from-gray-800/10'
    }>
      <button
        onClick={() => {
          if (navigator.vibrate) navigator.vibrate(100)
          onLogout()
        }}
        className={`flex w-full items-center ${
          collapsed 
            ? 'justify-center h-12 w-12 mx-auto' 
            : 'gap-4 px-4'
        } py-3 rounded-xl bg-gradient-to-r from-red-50/80 to-pink-50/80 dark:from-red-900/30 dark:to-pink-900/30 text-red-600 dark:text-red-400 hover:from-red-100/80 hover:to-pink-100/80 dark:hover:from-red-800/40 dark:hover:to-pink-800/40`}
        title={collapsed ? 'Sair' : undefined}
        aria-label={collapsed ? 'Sair da conta' : undefined}
        type="button"
      >
        <svg className="h-5 w-5 drop-shadow-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        {!collapsed && <span className="font-medium drop-shadow-sm">Sair</span>}
      </button>
    </div>
  )
}

