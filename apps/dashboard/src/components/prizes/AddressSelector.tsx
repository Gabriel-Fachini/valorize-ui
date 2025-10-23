import React, { memo, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { AddressCard } from './AddressCard'
import { EmptyState } from '@/components/ui/EmptyState'
import { cn } from '@/lib/utils'
import type { Address } from '@/types/address.types'

interface AddressSelectorProps {
  addresses: Address[]
  selectedAddressId?: string
  onSelectAddress: (addressId: string) => void
  onAddAddress: () => void
  onEditAddress: (addressId: string) => void
  onDeleteAddress: (addressId: string) => void
  className?: string
}

export const AddressSelector = memo<AddressSelectorProps>(({
  addresses,
  selectedAddressId,
  onSelectAddress,
  onAddAddress,
  onEditAddress,
  onDeleteAddress,
  className,
}) => {
  const handleAddAddress = useCallback(() => {
    onAddAddress()
  }, [onAddAddress])

  const handleEditAddress = useCallback((addressId: string) => {
    onEditAddress(addressId)
  }, [onEditAddress])

  const handleDeleteAddress = useCallback((addressId: string) => {
    onDeleteAddress(addressId)
  }, [onDeleteAddress])

  if (addresses.length === 0) {
    return (
      <div className={cn('rounded-2xl border border-gray-200 dark:border-white/10 bg-white/95 dark:bg-[#262626]/95 p-6 backdrop-blur-xl shadow-lg', className)}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Endereço de Entrega
          </h2>
        </div>

        <EmptyState
          icon="ph-bold ph-map-pin"
          title="Nenhum endereço cadastrado"
          description="Você ainda não tem nenhum endereço cadastrado. Adicione um endereço para continuar."
          action={
            <Button
              onClick={handleAddAddress}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <i className="ph-bold ph-plus" />
              Cadastrar Endereço
            </Button>
          }
        />
      </div>
    )
  }

  return (
    <div className={cn('rounded-2xl border border-gray-200 dark:border-white/10 bg-white/95 dark:bg-[#262626]/95 p-6 backdrop-blur-xl shadow-lg', className)}>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Endereço de Entrega
        </h2>
        <Button
          onClick={handleAddAddress}
          size="sm"
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          <i className="ph-bold ph-plus" />
          Novo Endereço
        </Button>
      </div>

      <div className="space-y-3">
        {addresses.map((address) => (
          <AddressCard
            key={address.id}
            address={address}
            isSelected={selectedAddressId === address.id}
            onSelect={onSelectAddress}
            onEdit={handleEditAddress}
            onDelete={handleDeleteAddress}
          />
        ))}
      </div>
    </div>
  )
})

AddressSelector.displayName = 'AddressSelector'
