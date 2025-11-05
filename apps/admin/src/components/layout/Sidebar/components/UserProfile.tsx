import type { UserProfileProps } from '../types'
import { SkeletonAvatar, SkeletonBase } from '@/components/ui/Skeleton'

export const UserProfile = ({
  collapsed = false,
  userName = 'Usuário',
  userEmail = 'email@exemplo.com',
  avatarUrl,
  userRoles = [],
  isLoading = false,
}: UserProfileProps) => {
  const initials = userName.charAt(0).toUpperCase()

  // Skeleton loading state for collapsed sidebar
  if (collapsed && isLoading) {
    return (
      <div className="flex justify-center py-4 border-b border-gray-200 dark:border-[#242424] bg-gray-50 dark:bg-black/20">
        <SkeletonAvatar size="lg" className="bg-neutral-700" />
      </div>
    )
  }

  // Skeleton loading state for expanded sidebar
  if (isLoading) {
    return (
      <div className="p-6 border-b border-gray-200 dark:border-[#242424] bg-gray-50 dark:bg-black/20">
        <div className="flex items-center gap-4 mb-6">
          <SkeletonAvatar size="xl" className="bg-neutral-700" />
          <div className="flex-1 min-w-0 space-y-2">
            <SkeletonBase>
              <div className="h-5 w-32 bg-neutral-700 rounded" />
            </SkeletonBase>
            <SkeletonBase>
              <div className="h-4 w-40 bg-neutral-700 rounded" />
            </SkeletonBase>
          </div>
        </div>
      </div>
    )
  }

  const avatar = avatarUrl
    ? <img src={avatarUrl} alt="User Avatar" className="h-16 w-16 rounded-full" />
    : (
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-700 dark:to-gray-600">
        <span className="text-xl font-bold text-gray-700 dark:text-white">{initials}</span>
      </div>
    )

  if (collapsed) {
    return (
      <div className="flex justify-center py-4 border-b border-gray-200 dark:border-[#242424] bg-gray-50 dark:bg-black/20">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-700 dark:to-gray-600">
          {avatarUrl ? <img src={avatarUrl} alt="User Avatar" className="h-12 w-12 rounded-full" /> : <span className="text-lg font-bold text-gray-700 dark:text-white">{initials}</span>}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 border-b border-gray-200 dark:border-[#242424] bg-gray-50 dark:bg-black/20">
      <div className="flex items-center gap-4" data-tour="user-profile">
        {avatar}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col items-left gap-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
              {userName}
            </h3>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 truncate mb-3">
            {userEmail}
          </p>
          {userRoles && userRoles.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {userRoles.map((role) => (
                <span 
                  key={role.id}
                  className="items-center w-fit px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-light whitespace-nowrap"
                  title={role.description || role.name}
                >
                  {role.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

