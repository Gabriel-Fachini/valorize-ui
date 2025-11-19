/**
 * Edit Voucher Dialog
 * Dialog for editing voucher product information
 */

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useUpdateVoucher, useUploadVoucherImages } from '@/hooks/useVoucherMutations'
import { ImageUploadField } from './ImageUploadField'
import type { VoucherProduct, UpdateVoucherInput } from '@/types/voucher'

interface EditVoucherDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  voucher: VoucherProduct
}

export function EditVoucherDialog({
  open,
  onOpenChange,
  voucher,
}: EditVoucherDialogProps) {
  const updateVoucherMutation = useUpdateVoucher()
  const uploadImagesMutation = useUploadVoucherImages()

  // State for managing images
  const [currentImages, setCurrentImages] = useState<string[]>(voucher.images)
  const [pendingFiles, setPendingFiles] = useState<File[]>([])

  // Reset state when dialog opens/closes or voucher changes
  useEffect(() => {
    if (open) {
      setCurrentImages(voucher.images)
      setPendingFiles([])
    }
  }, [open, voucher])

  const { register, handleSubmit, formState: { errors } } = useForm<UpdateVoucherInput>({
    defaultValues: {
      name: voucher.name,
      description: voucher.description || '',
      category: voucher.category,
      brand: voucher.brand || '',
      minValue: voucher.minValue,
      maxValue: voucher.maxValue,
    },
  })

  const onSubmit = async (data: UpdateVoucherInput) => {
    try {
      // Step 1: Upload new images if any
      if (pendingFiles.length > 0) {
        await uploadImagesMutation.mutateAsync({
          id: voucher.id,
          files: pendingFiles,
        })
      }

      // Step 2: Update other fields and images array if images were removed
      const imagesChanged = currentImages.length !== voucher.images.length ||
        !currentImages.every((img, i) => img === voucher.images[i])

      await updateVoucherMutation.mutateAsync({
        id: voucher.id,
        input: {
          ...data,
          brand: data.brand || null,
          description: data.description || null,
          ...(imagesChanged ? { images: currentImages } : {}),
        },
      })

      onOpenChange(false)
    } catch (error) {
      // Error is handled by the mutation hooks
    }
  }

  const isLoading = updateVoucherMutation.isPending || uploadImagesMutation.isPending

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <i className="ph ph-pencil text-blue-600" style={{ fontSize: '1.5rem' }} />
            Editar Voucher
          </DialogTitle>
          <DialogDescription>
            Atualize as informações do voucher. Campos marcados com * são obrigatórios.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Nome */}
          <div className="space-y-2">
            <Label htmlFor="name">Nome *</Label>
            <Input
              id="name"
              {...register('name', { required: 'Nome é obrigatório' })}
              placeholder="Nome do voucher"
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          {/* Descrição */}
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Descrição do voucher"
              rows={4}
            />
          </div>

          {/* Categoria */}
          <div className="space-y-2">
            <Label htmlFor="category">Categoria *</Label>
            <Input
              id="category"
              {...register('category', { required: 'Categoria é obrigatória' })}
              placeholder="Ex: merchant_card, gift-cards"
            />
            {errors.category && (
              <p className="text-sm text-destructive">{errors.category.message}</p>
            )}
          </div>

          {/* Marca */}
          <div className="space-y-2">
            <Label htmlFor="brand">Marca</Label>
            <Input
              id="brand"
              {...register('brand')}
              placeholder="Nome da marca"
            />
          </div>

          {/* Valores */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="minValue">Valor Mínimo *</Label>
              <Input
                id="minValue"
                type="number"
                step="0.01"
                {...register('minValue', {
                  required: 'Valor mínimo é obrigatório',
                  min: { value: 0, message: 'Valor deve ser positivo' },
                })}
                placeholder="0.00"
              />
              {errors.minValue && (
                <p className="text-sm text-destructive">{errors.minValue.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxValue">Valor Máximo *</Label>
              <Input
                id="maxValue"
                type="number"
                step="0.01"
                {...register('maxValue', {
                  required: 'Valor máximo é obrigatório',
                  min: { value: 0, message: 'Valor deve ser positivo' },
                })}
                placeholder="0.00"
              />
              {errors.maxValue && (
                <p className="text-sm text-destructive">{errors.maxValue.message}</p>
              )}
            </div>
          </div>

          {/* Imagens */}
          <div className="space-y-2">
            <Label>Imagens</Label>
            <ImageUploadField
              images={currentImages}
              onImagesChange={setCurrentImages}
              onFilesChange={setPendingFiles}
              disabled={isLoading}
            />
          </div>

          {/* Info box */}
          <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 p-4 border border-blue-200 dark:border-blue-800">
            <div className="flex gap-3">
              <i className="ph ph-info text-blue-600 mt-0.5" style={{ fontSize: '1.25rem' }} />
              <div className="text-sm text-blue-800 dark:text-blue-200">
                <p className="font-medium mb-1">Importante:</p>
                <p>
                  Algumas informações como provedor, ID externo e moeda não podem ser editadas
                  pois são controladas pela API do provedor.
                </p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="default"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <i className="ph ph-spinner animate-spin mr-2" />
                  Salvando...
                </>
              ) : (
                <>
                  <i className="ph ph-check mr-2" />
                  Salvar Alterações
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
