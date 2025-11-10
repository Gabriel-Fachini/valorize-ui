/**
 * Voucher Send Direct Dialog Component
 * Dialog for sending a voucher directly to a user
 */

import { type FC, useState } from 'react'
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
import { useDebounce } from '@/hooks/useDebounce'
import { vouchersService } from '@/services/vouchers'
import type { VoucherProduct } from '@/types/vouchers'

interface VoucherSendDirectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  voucher: VoucherProduct
}

export const VoucherSendDirectDialog: FC<VoucherSendDirectDialogProps> = ({
  open,
  onOpenChange,
  voucher,
}) => {
  const queryClient = useQueryClient()

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [selectedUserEmail, setSelectedUserEmail] = useState<string | null>(null)
  const [selectedValue, setSelectedValue] = useState<number>(voucher.minValue)

  // Debounce search query to avoid excessive API calls
  const debouncedSearchQuery = useDebounce(searchQuery, 300)

  // Fetch users from /admin/users endpoint with search and status filter
  const { users, isLoading: isLoadingUsers } = useUsers({
    status: 'active',
    search: debouncedSearchQuery.trim() || undefined,
    limit: 10,
  })

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
    mutationFn: () =>
      vouchersService.sendToUser({
        userId: selectedUserId!,
        email: selectedUserEmail!,
        prizeId: voucher.id,
        customAmount: selectedValue,
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['redemptions'] })
      toast.success('Voucher enviado com sucesso!', {
        description: `Voucher está sendo processado. Status: ${data.status}`,
      })
      onOpenChange(false)
      // Reset state
      setSelectedUserId(null)
      setSelectedUserEmail(null)
      setSearchQuery('')
      setSelectedValue(voucher.minValue)
    },
    onError: (error: any) => {
      toast.error('Erro ao enviar voucher', {
        description: error?.response?.data?.message || error.message || 'Erro desconhecido',
      })
    },
  })

  const handleValueChange = (newValue: string) => {
    const numValue = Number(newValue)
    if (!isNaN(numValue)) {
      setSelectedValue(numValue)
    }
  }

  const handleSend = async () => {
    if (!selectedUserId || !selectedUserEmail) {
      toast.error('Selecione um usuário')
      return
    }

    // Validate value is within range
    if (selectedValue < voucher.minValue || selectedValue > voucher.maxValue) {
      toast.error('Valor inválido', {
        description: `O valor deve estar entre ${voucher.minValue} e ${voucher.maxValue}`,
      })
      return
    }

    await sendVoucherMutation.mutateAsync()
  }

  const isProcessing = sendVoucherMutation.isPending
  const isVariableValue = voucher.minValue !== voucher.maxValue

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

          {/* Value Selection */}
          <div className="space-y-2">
            {isVariableValue ? (
              <>
                <Label htmlFor="voucher-value">Valor do Voucher</Label>
                <div className="flex items-center gap-4">
                  <Input
                    name="voucher-value"
                    label=""
                    id="voucher-value"
                    type="text"
                    inputMode="decimal"
                    placeholder="Digite o valor..."
                    value={String(selectedValue)}
                    onChange={(e) => handleValueChange(e.target.value)}
                    className="w-32"
                  />
                  <span className="text-sm text-muted-foreground">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: voucher.currency,
                    }).format(selectedValue)}
                  </span>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="value-slider">Ajustar Valor (Slider)</Label>
                  <input
                    id="value-slider"
                    type="range"
                    min={Math.ceil(voucher.minValue)}
                    max={Math.floor(voucher.maxValue)}
                    step={1}
                    value={Math.round(selectedValue)}
                    onChange={(e) => handleValueChange(e.target.value)}
                    className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: voucher.currency,
                    }).format(Math.ceil(voucher.minValue))}</span>
                    <span>{new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: voucher.currency,
                    }).format(Math.floor(voucher.maxValue))}</span>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Label>Valor do Voucher</Label>
                <div className="rounded-lg border p-4 bg-muted/50">
                  <p className="text-lg font-semibold">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: voucher.currency,
                    }).format(voucher.minValue)}
                  </p>
                </div>
              </>
            )}
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
              ) : users.length === 0 ? (
                <p className="p-4 text-center text-sm text-muted-foreground">
                  Nenhum usuário encontrado
                </p>
              ) : (
                users.map((user) => (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => {
                      setSelectedUserId(user.id)
                      setSelectedUserEmail(user.email || '')
                    }}
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
                Enviando...
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
