import type { UserProfileProps } from '../types'
import { BalanceSection } from './BalanceSection'

export const UserProfile = ({ 
  collapsed = false, 
  userName = 'Usuário', 
  userEmail = 'email@exemplo.com',
  avatarUrl,
}: UserProfileProps) => {
  const initials = userName.charAt(0).toUpperCase()

  const avatar = avatarUrl
    ? <img src={avatarUrl} alt="User Avatar" className="h-16 w-16 rounded-full" />
    : (
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-gray-700 to-gray-600">
        <span className="text-xl font-bold text-white">{initials}</span>
      </div>
    )

  if (collapsed) {
    return (
      <div className="flex justify-center py-4 border-b border-gray-800 bg-black/20">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-gray-700 to-gray-600">
          {avatarUrl ? <img src={avatarUrl} alt="User Avatar" className="h-12 w-12 rounded-full" /> : <span className="text-lg font-bold text-white">{initials}</span>}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 border-b border-gray-800 bg-black/20">
      <div className="flex items-center gap-4 mb-6">
        {avatar}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-white truncate">
            {userName}
          </h3>
          <p className="text-sm text-gray-400 truncate">
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

