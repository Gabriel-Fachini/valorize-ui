/**
 * Voucher Send Direct Dialog Component
 * Dialog for sending a voucher directly to a user
 */

import { type FC, useState, useMemo } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { useUsers } from '@/hooks/useUsers'
import { usePrizeMutations } from '@/hooks/usePrizeMutations'
import { vouchersService } from '@/services/vouchers'
import type { VoucherProduct } from '@/types/vouchers'
import type { Prize } from '@/types/prizes'

interface VoucherSendDirectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  voucher: VoucherProduct
  prize: Prize | null
}

export const VoucherSendDirectDialog: FC<VoucherSendDirectDialogProps> = ({
  open,
  onOpenChange,
  voucher,
  prize,
}) => {
  const queryClient = useQueryClient()
  const { createPrize } = usePrizeMutations()

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [isCreatingPrize, setIsCreatingPrize] = useState(false)

  // Fetch users
  const { users, isLoading: isLoadingUsers } = useUsers({ status: 'active', limit: 100 })

  // Filter users by search query
  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return users.slice(0, 5) // Show first 5 if no search

    const query = searchQuery.toLowerCase()
    return users
      .filter(
        (user) =>
          user.name?.toLowerCase().includes(query) ||
          user.email?.toLowerCase().includes(query)
      )
      .slice(0, 10)
  }, [users, searchQuery])

  // Helper function to get user initials
  const getUserInitials = (name: string) => {
    return name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || '?'
  }

  // Send voucher mutation
  const sendVoucherMutation = useMutation({
    mutationFn: (prizeId: string) =>
      vouchersService.sendToUser({ userId: selectedUserId!, prizeId }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['redemptions'] })
      toast.success('Voucher enviado com sucesso!', {
        description: `Voucher está sendo processado. Status: ${data.status}`,
      })
      onOpenChange(false)
      // Reset state
      setSelectedUserId(null)
      setSearchQuery('')
    },
    onError: (error: any) => {
      toast.error('Erro ao enviar voucher', {
        description: error?.response?.data?.message || error.message || 'Erro desconhecido',
      })
    },
  })

  const handleSend = async () => {
    if (!selectedUserId) {
      toast.error('Selecione um usuário')
      return
    }

    try {
      let prizeIdToUse = prize?.id

      // Se não existe prêmio vinculado, criar um automaticamente
      if (!prize) {
        setIsCreatingPrize(true)
        const newPrize = await createPrize.mutateAsync({
          name: voucher.name,
          description: voucher.description || `Voucher ${voucher.name}`,
          category: voucher.category,
          brand: voucher.brand || voucher.name,
          coinPrice: Math.round(voucher.minValue * 10), // Convert currency to coins (example: R$10 = 100 coins)
          images: voucher.images,
          stock: 999,
          isActive: true,
          isGlobal: false,
          voucherProductId: voucher.id,
        })
        setIsCreatingPrize(false)
        prizeIdToUse = newPrize.prize.id

        toast.success('Prêmio criado com sucesso!')
      }

      // Enviar voucher para o usuário usando o prizeId
      await sendVoucherMutation.mutateAsync(prizeIdToUse!)
    } catch (error) {
      setIsCreatingPrize(false)
      console.error('Error sending voucher:', error)
    }
  }

  const isProcessing = isCreatingPrize || sendVoucherMutation.isPending

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Enviar Voucher Direto</DialogTitle>
          <DialogDescription>
            Envie este voucher gratuitamente para um usuário. A empresa pagará pelo voucher.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Voucher Info */}
          <div className="rounded-lg border p-4">
            <div className="flex items-center gap-3">
              {voucher.images?.[0] && (
                <img
                  src={voucher.images[0]}
                  alt={voucher.name}
                  className="h-12 w-12 rounded object-cover"
                />
              )}
              <div>
                <p className="font-medium">{voucher.name}</p>
                <p className="text-sm text-muted-foreground">
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: voucher.currency,
                  }).format(voucher.minValue)}{' '}
                  -{' '}
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: voucher.currency,
                  }).format(voucher.maxValue)}
                </p>
              </div>
            </div>
          </div>

          {/* User Search */}
          <div className="space-y-2">
            <Label htmlFor="user-search">Buscar Usuário</Label>
            <Input
              name="user-search"
              label=""
              id="user-search"
              type="text"
              placeholder="Nome ou email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* User List */}
          <div className="space-y-2">
            <Label>Selecione um usuário</Label>
            <div className="max-h-[300px] overflow-y-auto rounded-lg border">
              {isLoadingUsers ? (
                <p className="p-4 text-center text-sm text-muted-foreground">
                  Carregando usuários...
                </p>
              ) : filteredUsers.length === 0 ? (
                <p className="p-4 text-center text-sm text-muted-foreground">
                  Nenhum usuário encontrado
                </p>
              ) : (
                filteredUsers.map((user) => (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => setSelectedUserId(user.id)}
                    className={`flex w-full items-center gap-3 border-b p-3 text-left transition-colors hover:bg-muted ${
                      selectedUserId === user.id ? 'bg-primary/10' : ''
                    }`}
                  >
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name || ''}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                        {getUserInitials(user.name || '')}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{user.name}</p>
                      <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                    </div>
                    {selectedUserId === user.id && (
                      <i className="ph ph-check-circle text-primary" />
                    )}
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Info */}
          {!prize && (
            <div className="rounded-lg bg-blue-50 border border-blue-200 p-4 dark:bg-blue-950 dark:border-blue-800">
              <div className="flex gap-3">
                <i className="ph ph-info text-blue-600 dark:text-blue-400" />
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  Este voucher ainda não está configurado como prêmio. Um prêmio será criado automaticamente ao enviar.
                </p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isProcessing}
          >
            Cancelar
          </Button>
          <Button onClick={handleSend} disabled={!selectedUserId || isProcessing}>
            {isProcessing ? (
              <>
                <i className="ph ph-circle-notch mr-2 animate-spin" />
                {isCreatingPrize ? 'Criando prêmio...' : 'Enviando...'}
              </>
            ) : (
              <>
                <i className="ph ph-paper-plane-tilt mr-2" />
                Enviar Voucher
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
