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

// Prize categories (types)
export const PRIZE_CATEGORIES = [
  { value: 'voucher', label: 'Voucher' },
  { value: 'experience', label: 'Experiência' },
  { value: 'product', label: 'Produto' },
] as const

// Form schema
const prizeFormSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(255, 'Nome muito longo'),
  description: z.string().min(1, 'Descrição é obrigatória').max(2000, 'Descrição muito longa'),
  category: z.enum(['voucher', 'experience', 'product'], {
    errorMap: () => ({ message: 'Tipo é obrigatório' }),
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
      brand: prize?.brand || '',
      coinPrice: prize?.coinPrice || 0,
      stock: prize?.stock || 0,
      isActive: prize?.isActive ?? true,
      specifications: prize?.specifications || {},
      images: [],
    },
  })

  const handleFormSubmit = async (data: PrizeFormData) => {
    await onSubmit({ ...data, images, specifications })
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
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

        {/* Category and Brand */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="category">
              Tipo <span className="text-red-500">*</span>
            </Label>
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={isSubmitting}
                >
                  <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {PRIZE_CATEGORIES.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.category && (
              <p className="text-sm text-red-600">{errors.category.message}</p>
            )}
          </div>

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
        <MultipleImageUpload
          images={images}
          onImagesChange={(files) => {
            setImages(files)
            setValue('images', files)
          }}
          disabled={isSubmitting}
        />
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
