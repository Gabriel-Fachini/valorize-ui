/**
 * Prize New Page
 * Page for creating a new prize
 */

import { type FC, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { PageLayout } from '@/components/layout/PageLayout'
import { BackButton } from '@/components/ui/BackButton'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PrizeForm, type PrizeFormData } from '@/components/prizes/PrizeForm'
import { usePrizeMutations } from '@/hooks/usePrizeMutations'
import { prizesService } from '@/services/prizes'
import { toast } from 'sonner'

export const PrizeNewPage: FC = () => {
  const navigate = useNavigate()
  const { createPrize } = usePrizeMutations()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (data: PrizeFormData) => {
    setIsSubmitting(true)

    try {
      // Step 1: Create prize without images
      const createPayload = {
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

      const result = await createPrize.mutateAsync(createPayload)

      // Step 2: Upload images if any
      if (data.images.length > 0) {
        try {
          await prizesService.uploadImages(result.prize.id, data.images)
          toast.success('Prêmio criado e imagens enviadas com sucesso!', {
            description: `${data.images.length} imagem(ns) adicionada(s)`,
          })
        } catch (imageError) {
          console.error('Error uploading images:', imageError)
          toast.warning('Prêmio criado, mas houve erro ao enviar as imagens', {
            description: 'Você pode adicionar as imagens depois na página de detalhes',
          })
        }
      } else {
        toast.success('Prêmio criado com sucesso!')
      }

      // Navigate to prize detail page
      navigate({ to: '/prizes/$prizeId', params: { prizeId: result.prize.id } })
    } catch (error: any) {
      console.error('Error creating prize:', error)
      toast.error('Erro ao criar prêmio', {
        description: error?.response?.data?.message || 'Tente novamente',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    navigate({ to: '/prizes' })
  }

  return (
    <PageLayout maxWidth="5xl">
      <div className="space-y-6">
        <BackButton to="/prizes" />

        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
            <i className="ph ph-gift text-2xl text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Novo Prêmio</h1>
            <p className="text-muted-foreground">Adicione um novo prêmio ao catálogo</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Informações do Prêmio</CardTitle>
            <CardDescription>
              Preencha os detalhes do prêmio. Campos marcados com * são obrigatórios.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PrizeForm onSubmit={handleSubmit} onCancel={handleCancel} isSubmitting={isSubmitting} />
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  )
}
