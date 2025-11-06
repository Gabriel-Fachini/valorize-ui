/**
 * Prize Edit Dialog Component
 * Dialog for editing a prize (note: images are not editable in this dialog)
 */

import { type FC, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { PrizeForm, type PrizeFormData } from './PrizeForm'
import { usePrizeMutations } from '@/hooks/usePrizeMutations'
import { prizesService } from '@/services/prizes'
import { toast } from 'sonner'
import type { Prize } from '@/types/prizes'

interface PrizeEditDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  prize: Prize
}

export const PrizeEditDialog: FC<PrizeEditDialogProps> = ({ open, onOpenChange, prize }) => {
  const { updatePrize } = usePrizeMutations()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const onSubmit = async (data: PrizeFormData) => {
    setIsSubmitting(true)

    try {
      // Step 1: Update prize basic info
      const updatePayload = {
        name: data.name,
        description: data.description,
        category: data.category,
        brand: data.brand,
        coinPrice: data.coinPrice,
        stock: data.stock,
        isActive: data.isActive,
        specifications: data.specifications,
      }

      await updatePrize.mutateAsync({
        id: prize.id,
        payload: updatePayload,
      })

      // Step 2: Handle images update if there are new images
      if (data.images.length > 0) {
        try {
          // First, delete existing images
          const deletePromises = prize.images.map((_, index) =>
            prizesService.deleteImage(prize.id, index)
          )
          await Promise.all(deletePromises)

          // Then upload new images
          await prizesService.uploadImages(prize.id, data.images)
          toast.success('Prêmio atualizado e imagens enviadas com sucesso!')
        } catch (imageError) {
          console.error('Error updating images:', imageError)
          toast.warning('Prêmio atualizado, mas houve erro ao atualizar as imagens', {
            description: 'Tente atualizar as imagens novamente',
          })
        }
      } else {
        toast.success('Prêmio atualizado com sucesso!')
      }

      onOpenChange(false)
    } catch (error: any) {
      console.error('Error updating prize:', error)
      toast.error('Erro ao atualizar prêmio', {
        description: error?.response?.data?.message || 'Tente novamente',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Prêmio</DialogTitle>
          <DialogDescription>
            Atualize as informações do prêmio. Campos marcados com * são obrigatórios.
          </DialogDescription>
        </DialogHeader>
        <PrizeForm prize={prize} onSubmit={onSubmit} onCancel={handleCancel} isSubmitting={isSubmitting} />
      </DialogContent>
    </Dialog>
  )
}
