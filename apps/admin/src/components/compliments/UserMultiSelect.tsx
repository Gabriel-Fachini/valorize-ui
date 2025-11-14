/**
 * User Multi-Select Component
 * Allows searching and selecting multiple users for filtering
 */

import { useState } from 'react'
import { useUserSearch } from '@/hooks/useUserSearch'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface SelectedUser {
  id: string
  name: string
  avatar?: string
}

interface UserMultiSelectProps {
  selectedUsers: SelectedUser[]
  onSelectionChange: (users: SelectedUser[]) => void
  placeholder?: string
  className?: string
}

export function UserMultiSelect({
  selectedUsers,
  onSelectionChange,
  placeholder = 'Buscar usuários...',
  className,
}: UserMultiSelectProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const { users, isLoading } = useUserSearch(search)

  const handleSelectUser = (user: { id: string; name: string; avatar?: string }) => {
    const isSelected = selectedUsers.some(u => u.id === user.id)

    if (isSelected) {
      // Remove user
      onSelectionChange(selectedUsers.filter(u => u.id !== user.id))
    } else {
      // Add user
      onSelectionChange([...selectedUsers, { id: user.id, name: user.name, avatar: user.avatar }])
    }
  }

  const handleRemoveUser = (userId: string) => {
    onSelectionChange(selectedUsers.filter(u => u.id !== userId))
  }

  const handleClearAll = () => {
    onSelectionChange([])
  }

  return (
    <div className={cn('space-y-2', className)}>
      {/* Selected Users Badges */}
      {selectedUsers.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedUsers.map((user) => (
            <Badge
              key={user.id}
              variant="secondary"
              className="gap-1.5 pl-2 pr-1 py-1"
            >
              {user.avatar && (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-4 h-4 rounded-full"
                />
              )}
              <span className="text-xs">{user.name}</span>
              <button
                type="button"
                onClick={() => handleRemoveUser(user.id)}
                className="ml-1 hover:bg-muted rounded-full p-0.5"
              >
                <i className="ph ph-x text-xs" />
              </button>
            </Badge>
          ))}
          {selectedUsers.length > 1 && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClearAll}
              className="h-6 px-2 text-xs"
            >
              Limpar tudo
            </Button>
          )}
        </div>
      )}

      {/* Search Popover */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            <span className="flex items-center gap-2">
              <i className="ph ph-users text-base" />
              {selectedUsers.length === 0 ? (
                <span className="text-muted-foreground">{placeholder}</span>
              ) : (
                <span>{selectedUsers.length} usuário(s) selecionado(s)</span>
              )}
            </span>
            <i className={cn(
              'ph ph-caret-down text-sm transition-transform',
              open && 'rotate-180'
            )} />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-0" align="start">
          <Command shouldFilter={false}>
            <CommandInput
              placeholder="Buscar por nome ou email..."
              value={search}
              onValueChange={setSearch}
            />
            <CommandList>
              {isLoading ? (
                <div className="py-6 text-center text-sm">
                  <i className="ph ph-spinner animate-spin text-lg" />
                </div>
              ) : search.length < 2 ? (
                <CommandEmpty>Digite ao menos 2 caracteres para buscar</CommandEmpty>
              ) : users.length === 0 ? (
                <CommandEmpty>Nenhum usuário encontrado</CommandEmpty>
              ) : (
                <CommandGroup>
                  {users.map((user) => {
                    const isSelected = selectedUsers.some(u => u.id === user.id)
                    return (
                      <CommandItem
                        key={user.id}
                        value={user.id}
                        onSelect={() => handleSelectUser(user)}
                        className="cursor-pointer"
                      >
                        <div className="flex items-center gap-3 flex-1">
                          {user.avatar ? (
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className="w-8 h-8 rounded-full"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <i className="ph ph-user text-primary" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{user.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                          </div>
                          {isSelected && (
                            <i className="ph ph-check-circle text-primary text-lg" />
                          )}
                        </div>
                      </CommandItem>
                    )
                  })}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
