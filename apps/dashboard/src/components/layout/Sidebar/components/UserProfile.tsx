import type { UserProfileProps } from '../types'
import { BalanceSection } from './BalanceSection'

export const UserProfile = ({ 
  collapsed = false, 
  userName = 'Usuário', 
  userEmail = 'email@exemplo.com', 
}: UserProfileProps) => {
  const initials = userName.charAt(0).toUpperCase()

  if (collapsed) {
    return (
      <div className="flex justify-center py-4 border-b border-white/10 dark:border-gray-700/30 bg-gradient-to-b from-white/5 to-transparent dark:from-gray-800/10">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-indigo-600">
          <span className="text-lg font-bold text-white">{initials}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 border-b border-white/10 dark:border-gray-700/30 bg-gradient-to-b from-white/5 to-transparent dark:from-gray-800/10">
      <div className="flex items-center gap-4 mb-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-indigo-600">
          <span className="text-xl font-bold text-white">{initials}</span>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate drop-shadow-sm">
            {userName}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
            {userEmail}
          </p>
        </div>
      </div>

      <div data-tour="balance-cards">
        <BalanceSection />
      </div>
    </div>
  )
}

