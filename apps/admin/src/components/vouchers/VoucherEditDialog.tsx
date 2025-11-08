/**
 * Voucher Edit Dialog Component
 * Dialog for creating or editing a prize based on a voucher product
 */

import { type FC, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
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
import { Switch } from '@/components/ui/switch'
import { usePrizeMutations } from '@/hooks/usePrizeMutations'
import type { VoucherProduct } from '@/types/vouchers'
import type { Prize } from '@/types/prizes'

const prizeFormSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().min(1, 'Descrição é obrigatória'),
  coinPrice: z.number().min(1, 'Preço deve ser maior que 0'),
  stock: z.number().min(1, 'Estoque deve ser maior que 0'),
  isActive: z.boolean(),
})

type PrizeFormData = z.infer<typeof prizeFormSchema>

interface VoucherEditDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  voucher: VoucherProduct
  prize: Prize | null
}

export const VoucherEditDialog: FC<VoucherEditDialogProps> = ({
  open,
  onOpenChange,
  voucher,
  prize,
}) => {
  const { createPrize, updatePrize } = usePrizeMutations()
  const isEditing = !!prize

  const form = useForm<PrizeFormData>({
    resolver: zodResolver(prizeFormSchema),
    defaultValues: {
      name: prize?.name || voucher.name,
      description: prize?.description || voucher.description || '',
      coinPrice: prize?.coinPrice || 100,
      stock: prize?.stock || 999,
      isActive: prize?.isActive ?? true,
    },
  })

  // Reset form when prize or voucher changes
  useEffect(() => {
    form.reset({
      name: prize?.name || voucher.name,
      description: prize?.description || voucher.description || '',
      coinPrice: prize?.coinPrice || 100,
      stock: prize?.stock || 999,
      isActive: prize?.isActive ?? true,
    })
  }, [prize, voucher, form])

  const onSubmit = async (data: PrizeFormData) => {
    try {
      if (isEditing && prize) {
        // Update existing prize
        await updatePrize.mutateAsync({
          id: prize.id,
          payload: {
            name: data.name,
            description: data.description,
            coinPrice: data.coinPrice,
            stock: data.stock,
            isActive: data.isActive,
          },
        })
      } else {
        // Create new prize
        await createPrize.mutateAsync({
          name: data.name,
          description: data.description,
          category: 'voucher',
          type: 'voucher',
          brand: voucher.brand || voucher.name,
          coinPrice: data.coinPrice,
          stock: data.stock,
          isActive: data.isActive,
          images: voucher.images,
          voucherProductId: voucher.id,
        })
      }
      onOpenChange(false)
      form.reset()
    } catch (error) {
      // Error is handled by the mutation hook
      console.error('Error saving prize:', error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar Prêmio' : 'Criar Novo Prêmio'}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Edite as informações do prêmio vinculado a este voucher.'
              : 'Configure este voucher como um prêmio que os usuários podem resgatar.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Prêmio</Label>
            <Input
              label=""
              id="name"
              {...form.register('name')}
              placeholder="Ex: Voucher iFood R$50"
            />
            {form.formState.errors.name && (
              <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <textarea
              id="description"
              {...form.register('description')}
              placeholder="Descreva como usar este voucher..."
              className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
            {form.formState.errors.description && (
              <p className="text-sm text-destructive">{form.formState.errors.description.message}</p>
            )}
          </div>

          {/* Coin Price */}
          <div className="space-y-2">
            <Label htmlFor="coinPrice">Preço em Moedas</Label>
            <Input
              label=""
              id="coinPrice"
              {...form.register('coinPrice', { valueAsNumber: true })}
              placeholder="100"
            />
            {form.formState.errors.coinPrice && (
              <p className="text-sm text-destructive">{form.formState.errors.coinPrice.message}</p>
            )}
          </div>

          {/* Stock */}
          <div className="space-y-2">
            <Label htmlFor="stock">Estoque</Label>
            <Input
              label=""
              id="stock"
              {...form.register('stock', { valueAsNumber: true })}
              placeholder="999"
            />
            {form.formState.errors.stock && (
              <p className="text-sm text-destructive">{form.formState.errors.stock.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Para vouchers digitais, use um valor alto (ex: 999)
            </p>
          </div>

          {/* Is Active */}
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label htmlFor="isActive">Ativo no Catálogo</Label>
              <p className="text-sm text-muted-foreground">
                Usuários só podem resgatar prêmios ativos
              </p>
            </div>
            <Switch
              id="isActive"
              checked={form.watch('isActive')}
              onCheckedChange={(checked) => form.setValue('isActive', checked)}
            />
          </div>

          {/* Voucher Info */}
          <div className="rounded-lg bg-muted p-4">
            <p className="text-sm font-medium">Voucher Vinculado</p>
            <p className="mt-1 text-xs text-muted-foreground">{voucher.name}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Valor: {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: voucher.currency,
              }).format(voucher.minValue)} - {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: voucher.currency,
              }).format(voucher.maxValue)}
            </p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={createPrize.isPending || updatePrize.isPending}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={createPrize.isPending || updatePrize.isPending}
            >
              {createPrize.isPending || updatePrize.isPending ? (
                <>
                  <i className="ph ph-circle-notch mr-2 animate-spin" />
                  {isEditing ? 'Salvando...' : 'Criando...'}
                </>
              ) : (
                <>
                  <i className={`ph ${isEditing ? 'ph-check' : 'ph-plus'} mr-2`} />
                  {isEditing ? 'Salvar Alterações' : 'Criar Prêmio'}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
