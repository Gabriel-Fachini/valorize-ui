/**
 * Voucher Bulk Assign Dialog Component
 * Multi-step dialog for bulk assigning vouchers to multiple users
 *
 * Steps:
 * 1. Define voucher value within allowed range
 * 2. Select users from list with checkboxes
 * 3. Confirm and send
 */

import { type FC, useState, useMemo } from 'react'
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
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'
import { useUsers } from '@/hooks/useUsers'
import { useVoucherMutations } from '@/hooks/useVoucherMutations'
import type { VoucherProduct, BulkAssignResponse } from '@/types/vouchers'

interface VoucherBulkAssignDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  voucher: VoucherProduct | null
  onSuccess?: (result: BulkAssignResponse) => void
}

type Step = 1 | 2 | 3

export const VoucherBulkAssignDialog: FC<VoucherBulkAssignDialogProps> = ({
  open,
  onOpenChange,
  voucher,
  onSuccess,
}) => {
  const [step, setStep] = useState<Step>(1)
  const [value, setValue] = useState<number>(0)
  const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState('')

  // Fetch users (we'll get all active users)
  const { users, isLoading: isLoadingUsers } = useUsers({ status: 'active', limit: 100 })
  const { bulkAssignVouchers } = useVoucherMutations()

  // Initialize value when voucher changes
  useMemo(() => {
    if (voucher) {
      setValue(voucher.minValue)
    }
  }, [voucher])

  // Filter users by search query
  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return users

    const query = searchQuery.toLowerCase()
    return users.filter(
      (user) =>
        user.name?.toLowerCase().includes(query) ||
        user.email?.toLowerCase().includes(query)
    )
  }, [users, searchQuery])

  const handleValueChange = (newValue: string) => {
    const numValue = Number(newValue)
    if (!isNaN(numValue)) {
      setValue(numValue)
    }
  }

  const handleToggleUser = (userId: string) => {
    const newSelected = new Set(selectedUserIds)
    if (newSelected.has(userId)) {
      newSelected.delete(userId)
    } else {
      newSelected.add(userId)
    }
    setSelectedUserIds(newSelected)
  }

  const handleToggleAll = () => {
    if (selectedUserIds.size === filteredUsers.length) {
      setSelectedUserIds(new Set())
    } else {
      setSelectedUserIds(new Set(filteredUsers.map((u) => u.id)))
    }
  }

  const handleNext = () => {
    if (step === 1) {
      // Validate value
      if (!voucher) return
      if (value < voucher.minValue || value > voucher.maxValue) {
        toast.error('Valor inválido', {
          description: `O valor deve estar entre ${voucher.minValue} e ${voucher.maxValue}`,
        })
        return
      }
      setStep(2)
    } else if (step === 2) {
      // Validate user selection
      if (selectedUserIds.size === 0) {
        toast.error('Selecione pelo menos um usuário')
        return
      }
      setStep(3)
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep((step - 1) as Step)
    }
  }

  const handleSubmit = async () => {
    if (!voucher) return

    try {
      // TODO: We need to map VoucherProduct to Prize
      // For now, we'll use the voucher.id as prizeId
      // This will need to be adjusted based on your Prize implementation
      const items = Array.from(selectedUserIds).map((userId) => ({
        userId,
        prizeId: voucher.id, // This should be the Prize ID, not VoucherProduct ID
      }))

      const result = await bulkAssignVouchers.mutateAsync({ items })

      toast.success('Vouchers enviados!', {
        description: `${result.summary.successful} de ${result.summary.total} enviados com sucesso`,
      })

      onSuccess?.(result)
      handleClose()
    } catch (error) {
      // Error is already handled by the mutation
      console.error('Error sending vouchers:', error)
    }
  }

  const handleClose = () => {
    setStep(1)
    setValue(voucher?.minValue || 0)
    setSelectedUserIds(new Set())
    setSearchQuery('')
    onOpenChange(false)
  }

  const formatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: voucher?.currency || 'BRL',
  })

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Enviar Vouchers em Lote</DialogTitle>
          <DialogDescription>
            {step === 1 && 'Defina o valor do voucher dentro do range permitido'}
            {step === 2 && 'Selecione os usuários que receberão o voucher'}
            {step === 3 && 'Confirme o envio dos vouchers'}
          </DialogDescription>
        </DialogHeader>

        <div className="py-6">
          {/* Step Indicator */}
          <div className="mb-6 flex items-center justify-center gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors ${
                  s === step
                    ? 'bg-primary text-primary-foreground'
                    : s < step
                      ? 'bg-primary/20 text-primary'
                      : 'bg-muted text-muted-foreground'
                }`}
              >
                {s < step ? <i className="ph-fill ph-check" /> : s}
              </div>
            ))}
          </div>

          {/* Step 1: Define Value */}
          {step === 1 && voucher && (
            <div className="space-y-6">
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
                    <p className="text-sm text-muted-foreground">{voucher.brand}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="value">Valor do Voucher</Label>
                  <div className="flex items-center gap-4">
                    <Input
                      name="value"
                      label=""
                      id="value"
                      type="text"
                      inputMode="decimal"
                      value={String(value)}
                      onChange={(e) => handleValueChange(e.target.value)}
                      className="w-32"
                    />
                    <span className="text-sm text-muted-foreground">
                      {formatter.format(value)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>Min: {formatter.format(voucher.minValue)}</span>
                    <span>•</span>
                    <span>Max: {formatter.format(voucher.maxValue)}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="value-slider">Ajustar Valor (Slider)</Label>
                  <input
                    id="value-slider"
                    type="range"
                    min={voucher.minValue}
                    max={voucher.maxValue}
                    step={1}
                    value={value}
                    onChange={(e) => handleValueChange(e.target.value)}
                    className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{formatter.format(voucher.minValue)}</span>
                    <span>{formatter.format(voucher.maxValue)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Select Users */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="search">Buscar Usuários</Label>
                <div className="relative">
                  <i className="ph ph-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    name="search"
                    label=""
                    id="search"
                    type="text"
                    placeholder="Nome ou email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between rounded-lg border bg-muted/50 p-3">
                <span className="text-sm font-medium">
                  {selectedUserIds.size} usuários selecionados
                </span>
                <Button variant="ghost" size="sm" onClick={handleToggleAll}>
                  {selectedUserIds.size === filteredUsers.length
                    ? 'Desmarcar todos'
                    : 'Selecionar todos'}
                </Button>
              </div>

              <div className="h-[300px] overflow-y-auto rounded-lg border">
                <div className="p-4 space-y-2">
                  {isLoadingUsers ? (
                    <p className="text-center text-sm text-muted-foreground">
                      Carregando usuários...
                    </p>
                  ) : filteredUsers.length === 0 ? (
                    <p className="text-center text-sm text-muted-foreground">
                      Nenhum usuário encontrado
                    </p>
                  ) : (
                    filteredUsers.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center gap-3 rounded-lg p-2 hover:bg-muted/50 transition-colors"
                      >
                        <Checkbox
                          id={`user-${user.id}`}
                          checked={selectedUserIds.has(user.id)}
                          onCheckedChange={() => handleToggleUser(user.id)}
                        />
                        <Label
                          htmlFor={`user-${user.id}`}
                          className="flex-1 cursor-pointer"
                        >
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                          </div>
                        </Label>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Confirm */}
          {step === 3 && voucher && (
            <div className="space-y-4">
              <div className="rounded-lg border p-4 space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Voucher</p>
                  <p className="font-medium">{voucher.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Valor</p>
                  <p className="font-medium">{formatter.format(value)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Usuários</p>
                  <p className="font-medium">{selectedUserIds.size} selecionados</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-lg font-bold">
                    {formatter.format(value * selectedUserIds.size)}
                  </p>
                </div>
              </div>

              <div className="rounded-lg bg-muted p-4">
                <p className="text-sm text-muted-foreground">
                  <i className="ph ph-info mr-2" />
                  Os vouchers serão enviados imediatamente e os usuários receberão um link de
                  acesso por email.
                </p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          {step > 1 && (
            <Button variant="outline" onClick={handleBack}>
              <i className="ph ph-caret-left mr-2" />
              Voltar
            </Button>
          )}
          {step < 3 ? (
            <Button onClick={handleNext}>
              Próximo
              <i className="ph ph-caret-right ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={bulkAssignVouchers.isPending}
            >
              {bulkAssignVouchers.isPending ? (
                <>
                  <i className="ph ph-circle-notch mr-2 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <i className="ph ph-paper-plane-tilt mr-2" />
                  Enviar Vouchers
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
