import { type FC, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { SimpleInput } from '@/components/ui/simple-input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { MultipleImageUpload } from './MultipleImageUpload'
import { SpecificationsInput } from './SpecificationsInput'
import type { Prize } from '@/types/prizes'

// Prize types
export const PRIZE_TYPES = [
  { value: 'voucher', label: 'Voucher' },
  { value: 'experiencia', label: 'Experiência' },
  { value: 'produto', label: 'Produto' },
] as const

// Form schema
const prizeFormSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(255, 'Nome muito longo'),
  description: z.string().min(1, 'Descrição é obrigatória').max(2000, 'Descrição muito longa'),
  category: z.string().min(1, 'Categoria é obrigatória').max(100, 'Categoria muito longa'),
  type: z.enum(['voucher', 'experiencia', 'produto'], {
    message: 'Tipo é obrigatório',
  }),
  brand: z.string().min(1, 'Marca é obrigatória').max(100, 'Marca muito longa'),
  coinPrice: z.number().min(1, 'Preço deve ser maior que 0').int('Preço deve ser um número inteiro'),
  stock: z.number().min(0, 'Estoque não pode ser negativo').int('Estoque deve ser um número inteiro'),
  isActive: z.boolean(),
  specifications: z.record(z.string(), z.string()),
  images: z.array(z.instanceof(File)).max(4, 'Máximo de 4 imagens permitidas'),
})

export type PrizeFormData = z.infer<typeof prizeFormSchema>

interface PrizeFormProps {
  prize?: Prize
  onSubmit: (data: PrizeFormData) => Promise<void>
  onCancel: () => void
  isSubmitting?: boolean
}

export const PrizeForm: FC<PrizeFormProps> = ({ prize, onSubmit, onCancel, isSubmitting }) => {
  const [images, setImages] = useState<File[]>([])
  const [existingImages, setExistingImages] = useState<string[]>(prize?.images || [])
  const [imagesToRemove, setImagesToRemove] = useState<number[]>([])
  const [specifications, setSpecifications] = useState<Record<string, string>>(prize?.specifications || {})

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm<PrizeFormData>({
    resolver: zodResolver(prizeFormSchema),
    defaultValues: {
      name: prize?.name || '',
      description: prize?.description || '',
      category: prize?.category || '',
      type: (prize?.type as 'voucher' | 'experiencia' | 'produto' | undefined) || undefined,
      brand: prize?.brand || '',
      coinPrice: prize?.coinPrice || 0,
      stock: prize?.stock || 0,
      isActive: prize?.isActive ?? true,
      specifications: prize?.specifications || {},
      images: [],
    },
  })

  const handleFormSubmit = async (data: PrizeFormData) => {
    await onSubmit({ ...data, images, specifications, imagesToRemove } as any)
  }

  const handleRemoveExistingImage = (index: number) => {
    const imageIndex = prize?.images?.indexOf(existingImages[index]) || 0
    setImagesToRemove([...imagesToRemove, imageIndex])
    setExistingImages(existingImages.filter((_, i) => i !== index))
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit as any)} className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Informações Básicas</h3>

        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="name">
            Nome do Prêmio <span className="text-red-500">*</span>
          </Label>
          <SimpleInput
            id="name"
            {...register('name')}
            placeholder="Ex: Smartphone Samsung Galaxy"
            disabled={isSubmitting}
            className={errors.name ? 'border-red-500' : ''}
          />
          {errors.name && (
            <p className="text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">
            Descrição <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="description"
            {...register('description')}
            placeholder="Descreva o prêmio em detalhes..."
            disabled={isSubmitting}
            rows={4}
            className={errors.description ? 'border-red-500' : ''}
          />
          {errors.description && (
            <p className="text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        {/* Type and Category */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="type">
              Tipo <span className="text-red-500">*</span>
            </Label>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={isSubmitting}
                >
                  <SelectTrigger className={errors.type ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {PRIZE_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.type && (
              <p className="text-sm text-red-600">{errors.type.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">
              Categoria <span className="text-red-500">*</span>
            </Label>
            <SimpleInput
              id="category"
              {...register('category')}
              placeholder="Ex: Eletrônicos"
              disabled={isSubmitting}
              className={errors.category ? 'border-red-500' : ''}
            />
            {errors.category && (
              <p className="text-sm text-red-600">{errors.category.message}</p>
            )}
          </div>
        </div>

        {/* Brand */}
        <div className="space-y-2">
          <Label htmlFor="brand">
            Marca <span className="text-red-500">*</span>
          </Label>
          <SimpleInput
            id="brand"
            {...register('brand')}
            placeholder="Ex: Samsung"
            disabled={isSubmitting}
            className={errors.brand ? 'border-red-500' : ''}
          />
          {errors.brand && (
            <p className="text-sm text-red-600">{errors.brand.message}</p>
          )}
        </div>

        {/* Price and Stock */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="coinPrice">
              Preço em Moedas <span className="text-red-500">*</span>
            </Label>
            <SimpleInput
              id="coinPrice"
              type="number"
              {...register('coinPrice', { valueAsNumber: true })}
              placeholder="Ex: 1000"
              disabled={isSubmitting}
              className={errors.coinPrice ? 'border-red-500' : ''}
              min={1}
            />
            {errors.coinPrice && (
              <p className="text-sm text-red-600">{errors.coinPrice.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="stock">
              Estoque <span className="text-red-500">*</span>
            </Label>
            <SimpleInput
              id="stock"
              type="number"
              {...register('stock', { valueAsNumber: true })}
              placeholder="Ex: 10"
              disabled={isSubmitting}
              className={errors.stock ? 'border-red-500' : ''}
              min={0}
            />
            {errors.stock && (
              <p className="text-sm text-red-600">{errors.stock.message}</p>
            )}
          </div>
        </div>

        {/* Active Status */}
        <div className="flex items-center justify-between p-4 rounded-lg border">
          <div className="space-y-0.5">
            <Label htmlFor="isActive">Prêmio Ativo</Label>
            <p className="text-sm text-muted-foreground">
              Prêmios ativos ficam disponíveis para resgate
            </p>
          </div>
          <Controller
            name="isActive"
            control={control}
            render={({ field }) => (
              <Switch
                id="isActive"
                checked={field.value}
                onCheckedChange={field.onChange}
                disabled={isSubmitting}
              />
            )}
          />
        </div>
      </div>

      {/* Images */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Imagens</h3>

        {/* Existing Images */}
        {prize && existingImages.length > 0 && (
          <div className="space-y-2">
            <Label>Imagens Atuais</Label>
            <div className="grid grid-cols-2 gap-4">
              {existingImages.map((imageUrl, index) => (
                <div key={`existing-${index}`} className="relative">
                  <div className="aspect-square rounded-lg border-2 border-gray-300 dark:border-gray-600 overflow-hidden bg-gray-50 dark:bg-gray-900">
                    <img
                      src={imageUrl}
                      alt={`Imagem atual ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveExistingImage(index)}
                    disabled={isSubmitting}
                    className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white rounded-full p-1 shadow-md transition-colors cursor-pointer flex items-center justify-center"
                    aria-label={`Remover imagem ${index + 1}`}
                  >
                    <i className="ph ph-x text-lg" />
                  </button>
                  <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                    Atual {index + 1}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              Clique no X para remover uma imagem. A remoção será efetivada ao clicar em "Atualizar Prêmio".
            </p>
          </div>
        )}

        {/* New Images Upload */}
        <div className="space-y-2">
          {prize && <Label>Adicionar Novas Imagens</Label>}
          <MultipleImageUpload
            images={images}
            onImagesChange={(files) => {
              setImages(files)
              setValue('images', files)
            }}
            disabled={isSubmitting}
          />
        </div>
      </div>

      {/* Specifications */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Especificações Técnicas</h3>
        <SpecificationsInput
          specifications={specifications}
          onSpecificationsChange={(specs) => {
            setSpecifications(specs)
            setValue('specifications', specs)
          }}
          disabled={isSubmitting}
        />
      </div>

      {/* Form Actions */}
      <div className="flex gap-3 justify-end pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <i className="ph ph-circle-notch animate-spin mr-2" />
              Salvando...
            </>
          ) : (
            <>
              <i className="ph ph-check mr-2" />
              {prize ? 'Atualizar Prêmio' : 'Criar Prêmio'}
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
