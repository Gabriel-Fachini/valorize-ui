/**
 * Voucher Bulk Assign Dialog Component
 * Multi-step dialog for bulk assigning vouchers to multiple users
 *
 * Steps:
 * 1. Select voucher
 * 2. Define voucher value within allowed range
 * 3. Select users from list with checkboxes
 * 4. Confirm and send
 */

import { type FC, useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
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
import { useDebounce } from '@/hooks/useDebounce'
import { useVoucherMutations } from '@/hooks/useVoucherMutations'
import { vouchersService } from '@/services/vouchers'
import type { VoucherProduct, BulkAssignResponse } from '@/types/vouchers'

interface VoucherBulkAssignDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: (result: BulkAssignResponse) => void
}

type Step = 1 | 2 | 3 | 4

export const VoucherBulkAssignDialog: FC<VoucherBulkAssignDialogProps> = ({
  open,
  onOpenChange,
  onSuccess,
}) => {
  const [step, setStep] = useState<Step>(1)
  const [selectedVoucher, setSelectedVoucher] = useState<VoucherProduct | null>(null)
  const [value, setValue] = useState<number>(0)
  const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(new Set())
  const [voucherSearchQuery, setVoucherSearchQuery] = useState('')
  const [userSearchQuery, setUserSearchQuery] = useState('')
  const [allUsersSelected, setAllUsersSelected] = useState(false)

  // Debounce user search query to avoid excessive API calls
  const debouncedUserSearchQuery = useDebounce(userSearchQuery, 300)

  // Fetch users from /admin/users endpoint with search and status filter
  const { users, isLoading: isLoadingUsers } = useUsers({
    status: 'active',
    search: debouncedUserSearchQuery.trim() || undefined,
    limit: 100,
  })
  const { bulkAssignVouchers } = useVoucherMutations()

  // Fetch vouchers
  const { data: vouchersData, isLoading: isLoadingVouchers } = useQuery({
    queryKey: ['vouchers', { isActive: true }],
    queryFn: () => vouchersService.list({ isActive: true, limit: 1000 }),
    enabled: open,
  })

  // Filter vouchers by search query
  const filteredVouchers = useMemo(() => {
    const vouchers = vouchersData?.items || []
    if (!voucherSearchQuery.trim()) return vouchers

    const query = voucherSearchQuery.toLowerCase()
    return vouchers.filter(
      (voucher) =>
        voucher.name?.toLowerCase().includes(query) ||
        voucher.brand?.toLowerCase().includes(query)
    )
  }, [vouchersData?.items, voucherSearchQuery])

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
    if (selectedUserIds.size === users.length) {
      setSelectedUserIds(new Set())
    } else {
      setSelectedUserIds(new Set(users.map((u) => u.id)))
    }
  }

  const handleNext = () => {
    if (step === 1) {
      // Validate voucher selection
      if (!selectedVoucher) {
        toast.error('Selecione um voucher')
        return
      }
      setValue(selectedVoucher.minValue)
      setStep(2)
    } else if (step === 2) {
      // Validate value
      if (!selectedVoucher) return
      if (value < selectedVoucher.minValue || value > selectedVoucher.maxValue) {
        toast.error('Valor inválido', {
          description: `O valor deve estar entre ${selectedVoucher.minValue} e ${selectedVoucher.maxValue}`,
        })
        return
      }
      setStep(3)
    } else if (step === 3) {
      // Validate user selection
      if (!allUsersSelected && selectedUserIds.size === 0) {
        toast.error('Selecione pelo menos um usuário')
        return
      }
      setStep(4)
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep((step - 1) as Step)
    }
  }

  const handleSubmit = async () => {
    if (!selectedVoucher) return

    try {
      const selectedUsers = allUsersSelected
        ? []
        : Array.from(selectedUserIds).map((userId) => {
            const user = users.find((u) => u.id === userId)
            return {
              userId,
              email: user?.email || '',
            }
          })

      const result = await bulkAssignVouchers.mutateAsync({
        prizeId: selectedVoucher.id,
        customAmount: value,
        users: selectedUsers,
        allUsersSelected,
      })

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
    setSelectedVoucher(null)
    setValue(0)
    setSelectedUserIds(new Set())
    setVoucherSearchQuery('')
    setUserSearchQuery('')
    setAllUsersSelected(false)
    onOpenChange(false)
  }

  const formatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: selectedVoucher?.currency || 'BRL',
  })

  const isVariableValue = selectedVoucher ? selectedVoucher.minValue !== selectedVoucher.maxValue : false

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Enviar Vouchers em Lote</DialogTitle>
          <DialogDescription>
            {step === 1 && 'Selecione o voucher que deseja enviar'}
            {step === 2 && 'Defina o valor do voucher dentro do range permitido'}
            {step === 3 && 'Selecione os usuários que receberão o voucher'}
            {step === 4 && 'Confirme o envio dos vouchers'}
          </DialogDescription>
        </DialogHeader>

        <div className="py-6">
          {/* Step Indicator */}
          <div className="mb-6 flex items-center justify-center gap-2">
            {[1, 2, 3, 4].map((s) => (
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

          {/* Step 1: Select Voucher */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="voucher-search">Buscar Voucher</Label>
                <div className="relative">
                  <i className="ph ph-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    name="voucher-search"
                    label=""
                    id="voucher-search"
                    type="text"
                    placeholder="Nome ou marca..."
                    value={voucherSearchQuery}
                    onChange={(e) => setVoucherSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="h-[400px] overflow-y-auto rounded-lg border">
                <div className="p-4 space-y-2">
                  {isLoadingVouchers ? (
                    <p className="text-center text-sm text-muted-foreground">
                      Carregando vouchers...
                    </p>
                  ) : filteredVouchers.length === 0 ? (
                    <p className="text-center text-sm text-muted-foreground">
                      Nenhum voucher encontrado
                    </p>
                  ) : (
                    filteredVouchers.map((voucher) => (
                      <button
                        key={voucher.id}
                        type="button"
                        onClick={() => setSelectedVoucher(voucher)}
                        className={`flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors border ${
                          selectedVoucher?.id === voucher.id
                            ? 'bg-primary/10 border-primary'
                            : 'hover:bg-muted border-transparent'
                        }`}
                      >
                        {voucher.images?.[0] && (
                          <img
                            src={voucher.images[0]}
                            alt={voucher.name}
                            className="h-10 w-10 rounded object-cover"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{voucher.name}</p>
                          <p className="text-sm text-muted-foreground truncate">{voucher.brand}</p>
                          <p className="text-xs text-muted-foreground">
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
                        {selectedVoucher?.id === voucher.id && (
                          <i className="ph ph-check-circle text-primary" />
                        )}
                      </button>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Define Value */}
          {step === 2 && selectedVoucher && (
            <div className="space-y-6">
              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-3">
                  {selectedVoucher.images?.[0] && (
                    <img
                      src={selectedVoucher.images[0]}
                      alt={selectedVoucher.name}
                      className="h-12 w-12 rounded object-cover"
                    />
                  )}
                  <div>
                    <p className="font-medium">{selectedVoucher.name}</p>
                    <p className="text-sm text-muted-foreground">{selectedVoucher.brand}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {isVariableValue ? (
                  <>
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
                        <span>Min: {formatter.format(selectedVoucher.minValue)}</span>
                        <span>•</span>
                        <span>Max: {formatter.format(selectedVoucher.maxValue)}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="value-slider">Ajustar Valor (Slider)</Label>
                      <input
                        id="value-slider"
                        type="range"
                        min={Math.ceil(selectedVoucher.minValue)}
                        max={Math.floor(selectedVoucher.maxValue)}
                        step={1}
                        value={Math.round(value)}
                        onChange={(e) => handleValueChange(e.target.value)}
                        className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{formatter.format(selectedVoucher.minValue)}</span>
                        <span>{formatter.format(selectedVoucher.maxValue)}</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="rounded-lg border p-4 bg-muted/50">
                    <p className="text-sm text-muted-foreground mb-2">Valor do Voucher</p>
                    <p className="text-lg font-semibold">
                      {formatter.format(selectedVoucher.minValue)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Select Users */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 rounded-lg border p-4 bg-muted/50">
                <Checkbox
                  id="all-users"
                  checked={allUsersSelected}
                  onCheckedChange={(checked) => setAllUsersSelected(checked as boolean)}
                />
                <Label htmlFor="all-users" className="flex-1 cursor-pointer">
                  <p className="font-medium">Enviar para todos os usuários</p>
                  <p className="text-sm text-muted-foreground">
                    Todos os usuários ativos receberão o voucher
                  </p>
                </Label>
              </div>

              {!allUsersSelected && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="user-search">Buscar Usuários</Label>
                    <div className="relative">
                      <i className="ph ph-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        name="user-search"
                        label=""
                        id="user-search"
                        type="text"
                        placeholder="Nome ou email..."
                        value={userSearchQuery}
                        onChange={(e) => setUserSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between rounded-lg border bg-muted/50 p-3">
                    <span className="text-sm font-medium">
                      {selectedUserIds.size} usuários selecionados
                    </span>
                    <Button variant="ghost" size="sm" onClick={handleToggleAll}>
                      {selectedUserIds.size === users.length
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
                      ) : users.length === 0 ? (
                        <p className="text-center text-sm text-muted-foreground">
                          Nenhum usuário encontrado
                        </p>
                      ) : (
                        users.map((user) => (
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
                </>
              )}
            </div>
          )}

          {/* Step 4: Confirm */}
          {step === 4 && selectedVoucher && (
            <div className="space-y-4">
              <div className="rounded-lg border p-4 space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Voucher</p>
                  <p className="font-medium">{selectedVoucher.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Valor</p>
                  <p className="font-medium">{formatter.format(value)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Usuários</p>
                  <p className="font-medium">
                    {allUsersSelected ? 'Todos os usuários ativos' : `${selectedUserIds.size} selecionados`}
                  </p>
                </div>
                {!allUsersSelected && (
                  <div>
                    <p className="text-sm text-muted-foreground">Total</p>
                    <p className="text-lg font-bold">
                      {formatter.format(value * selectedUserIds.size)}
                    </p>
                  </div>
                )}
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
          {step < 4 ? (
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
