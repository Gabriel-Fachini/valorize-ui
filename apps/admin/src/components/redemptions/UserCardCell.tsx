import { useNavigate } from '@tanstack/react-router'
import type { Redemption } from '@/types/redemptions'

interface UserCardCellProps {
  row: Redemption
}

export function UserCardCell({ row }: UserCardCellProps) {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate({ to: '/users/$userId', params: { userId: row.userId } })
  }

  return (
    <button
      onClick={handleClick}
      className="group flex items-center justify-start gap-3 p-2 rounded-lg transition-all duration-200 cursor-pointer bg-transparent border-0
      dark:bg-gray-800 hover:bg-accent/70 dark:hover:bg-accent/50 hover:shadow-md hover:-translate-y-0.5"
    >
      {row.userAvatar && (
        <img
          src={row.userAvatar}
          alt={row.userName || 'Avatar'}
          className="w-10 h-10 rounded-full object-cover flex-shrink-0 transition-transform duration-200 group-hover:scale-110"
        />
      )}
      <div className="flex flex-col items-start min-w-0 flex-1">
        <span className="font-medium text-sm truncate group-hover:text-accent-foreground transition-colors duration-200">
          {row.userName || 'N/A'}
        </span>
        <span className="text-xs text-muted-foreground truncate group-hover:text-accent-foreground/80 transition-colors duration-200">
          {row.userEmail || 'N/A'}
        </span>
      </div>
      <i className="ph ph-arrow-square-out flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-accent-foreground" />
    </button>
  )
}
