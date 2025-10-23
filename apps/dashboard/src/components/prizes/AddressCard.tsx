import React, { memo, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { Address } from '@/types/address.types'

interface AddressCardProps {
  address: Address
  isSelected: boolean
  onSelect: (addressId: string) => void
  onEdit: (addressId: string) => void
  onDelete: (addressId: string) => void
  className?: string
}

export const AddressCard = memo<AddressCardProps>(({
  address,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  className,
}) => {
  const handleSelect = useCallback(() => {
    onSelect(address.id)
  }, [address.id, onSelect])

  const handleEdit = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    onEdit(address.id)
  }, [address.id, onEdit])

  const handleDelete = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    onDelete(address.id)
  }, [address.id, onDelete])

  return (
    <div
      onClick={handleSelect}
      className={cn(
        'cursor-pointer rounded-lg border-2 p-4 transition-all duration-200',
        isSelected
          ? 'border-green-500 bg-green-50 dark:bg-green-500/10'
          : 'border-gray-200 dark:border-white/10 bg-white/95 dark:bg-[#262626]/95 hover:border-gray-300 dark:hover:border-white/20',
        className,
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="mb-1 flex items-center gap-2">
            <input
              type="radio"
              checked={isSelected}
              onChange={handleSelect}
              className="h-4 w-4 text-green-600 focus:ring-green-500"
              aria-label={`Selecionar endereço ${address.name}`}
            />
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {address.name}
            </h3>
            {address.isDefault && (
              <Badge className="bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-500/20">
                Padrão
              </Badge>
            )}
          </div>
          
          <div className="space-y-1">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {address.street}, {address.number}
              {address.complement && ` - ${address.complement}`}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {address.neighborhood && `${address.neighborhood} - `}
              {address.city}, {address.state} - CEP: {address.zipCode}
            </p>
            {address.phone && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Telefone: {address.phone}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleEdit}
            aria-label={`Editar endereço ${address.name}`}
          >
            <i className="ph ph-pencil-simple" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-500/10"
            aria-label={`Excluir endereço ${address.name}`}
          >
            <i className="ph ph-trash" />
          </Button>
        </div>
      </div>
    </div>
  )
})

AddressCard.displayName = 'AddressCard'
