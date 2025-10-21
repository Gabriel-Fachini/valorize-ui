import { memo, useMemo, useCallback } from 'react'
import { animated, useSpring } from '@react-spring/web'
import type { PraiseUser } from '@/hooks/usePraisesData'
import type { SelectionStepProps } from '@/types/praise.types'

interface UserSelectionStepProps extends SelectionStepProps<PraiseUser> {
  searchQuery: string
  onSearchChange: (query: string) => void
}

// Memoized user card component
const UserCard = memo(({ 
  user, 
  isSelected, 
  onSelect,
}: { 
  user: PraiseUser
  isSelected: boolean
  onSelect: (user: PraiseUser) => void,
}) => {
  const handleClick = useCallback(() => {
    onSelect(user)
  }, [user, onSelect])

  return (
    <button
      onClick={handleClick}
      className={`w-full p-5 rounded-xl border-2 flex items-center space-x-4 transition-all ${
        isSelected
          ? 'border-green-500 bg-green-50 dark:bg-green-900/20 scale-[1.02] shadow-lg shadow-green-500/20'
          : 'border-[#e5e5e5] dark:border-[#404040] bg-white dark:bg-[#262626] hover:border-green-300 hover:bg-[#fafafa] dark:hover:bg-[#404040]/50'
      }`}
    >
      <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
        <i className="ph-bold ph-user text-white text-xl"></i>
      </div>
      <div className="flex-1 text-left min-w-0">
        <p className="font-bold text-[#171717] dark:text-[#f5f5f5] text-base truncate">{user.name}</p>
        <p className="text-sm text-[#525252] dark:text-[#a3a3a3] truncate">{user.department}</p>
      </div>
      {isSelected && (
        <div className="w-7 h-7 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
          <i className="ph-bold ph-check text-white text-base"></i>
        </div>
      )}
    </button>
  )
})

UserCard.displayName = 'UserCard'

export const UserSelectionStep = memo(({
  selectedItem,
  onSelect,
  items,
  searchQuery,
  onSearchChange,
}: UserSelectionStepProps) => {
  const searchAnimation = useSpring({
    from: { opacity: 0, transform: 'translateY(10px)' },
    to: { opacity: 1, transform: 'translateY(0px)' },
    config: { tension: 300, friction: 30 },
  })

  const cardAnimation = useSpring({
    from: { opacity: 0, transform: 'scale(0.95)' },
    to: { opacity: 1, transform: 'scale(1)' },
    config: { tension: 280, friction: 60 },
  })

  // Memoized filtered users to prevent recalculation on every render
  const filteredUsers = useMemo(() => 
    items.filter(user =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.department.toLowerCase().includes(searchQuery.toLowerCase()),
    ),
    [items, searchQuery],
  )

  // Memoized search handler
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value)
  }, [onSearchChange])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#171717] dark:text-[#f5f5f5] mb-2">
          Quem você gostaria de elogiar?
        </h2>
        <p className="text-[#525252] dark:text-[#a3a3a3]">
          Selecione um colega para enviar seu reconhecimento
        </p>
      </div>
      
      {/* Search Input */}
      <animated.div style={searchAnimation} className="relative">
        <input
          type="text"
          placeholder="Buscar por nome ou departamento..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full px-4 py-4 bg-white dark:bg-[#262626] border border-[#d4d4d4] dark:border-[#525252] rounded-xl text-base text-[#171717] dark:text-[#f5f5f5] placeholder-[#737373] dark:placeholder-[#a3a3a3] focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
          autoFocus
        />
        <i className="ph-bold ph-magnifying-glass absolute right-4 top-5 text-xl text-[#a3a3a3]"></i>
      </animated.div>

      {/* Users List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredUsers.map((user) => (
          <animated.div
            key={user.id}
            style={cardAnimation}
          >
            <UserCard
              user={user}
              isSelected={selectedItem?.id === user.id}
              onSelect={onSelect}
            />
          </animated.div>
        ))}
      </div>
    </div>
  )
})

UserSelectionStep.displayName = 'UserSelectionStep'
