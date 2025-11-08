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

  const onSubmit = async (data: PrizeFormData & { imagesToRemove?: number[] }) => {
    setIsSubmitting(true)

    try {
      // Step 1: Update prize basic info
      const updatePayload = {
        name: data.name,
        description: data.description,
        category: data.category,
        type: data.type,
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

      // Step 2: Remove images if any are marked for removal
      if (data.imagesToRemove && data.imagesToRemove.length > 0) {
        try {
          // Sort indices in descending order to delete from end to start
          const sortedIndices = [...data.imagesToRemove].sort((a, b) => b - a)
          for (const index of sortedIndices) {
            await prizesService.deleteImage(prize.id, index)
          }
        } catch (imageError) {
          console.error('Error removing images:', imageError)
          toast.warning('Prêmio atualizado, mas houve erro ao remover algumas imagens', {
            description: 'Tente novamente',
          })
        }
      }

      // Step 3: Upload new images if provided
      if (data.images.length > 0) {
        try {
          await prizesService.uploadImages(prize.id, data.images)
          toast.success('Prêmio atualizado com sucesso!')
        } catch (imageError) {
          console.error('Error uploading new images:', imageError)
          toast.warning('Prêmio atualizado, mas houve erro ao enviar novas imagens', {
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
