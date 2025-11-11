import { useNavigate } from '@tanstack/react-router'
import type { Redemption } from '@/types/redemptions'

interface PrizeImageCellProps {
  row: Redemption
}

export function PrizeImageCell({ row }: PrizeImageCellProps) {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate({ to: '/redemptions/$redemptionId', params: { redemptionId: row.id } })
  }

  return (
    <button
      onClick={handleClick}
      className="group flex items-center gap-3 cursor-pointer bg-transparent border-0 p-0 hover:bg-transparent"
    >
      {row.prizeImage && (
        <div className="w-12 h-12 rounded-md overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-gray-800">
          <img
            src={row.prizeImage}
            alt={row.prizeName || 'Prêmio'}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <span className="text-sm font-medium truncate group-hover:text-primary group-hover:underline transition-colors duration-200">
        {row.prizeName || '-'}
      </span>
    </button>
  )
}
