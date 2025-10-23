import { type FC, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Alert, AlertIcon, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { PrizeVariant } from '@/types/prize.types'

interface PrizeVariantSelectorProps {
  variants: PrizeVariant[]
  selectedId?: string
  onSelect: (variantId: string) => void
  required?: boolean
}

export const PrizeVariantSelector: FC<PrizeVariantSelectorProps> = ({
  variants,
  selectedId,
  onSelect,
  required = false,
}) => {
  const groupedVariants = useMemo(() => {
    return variants.reduce((acc, variant) => {
      if (!acc[variant.name]) acc[variant.name] = []
      acc[variant.name].push(variant)
      return acc
    }, {} as Record<string, PrizeVariant[]>)
  }, [variants])

  const allVariantsOutOfStock = useMemo(() => {
    return variants.every(variant => variant.stock === 0)
  }, [variants])

  if (variants.length === 0) {
    return null
  }

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 p-6 backdrop-blur-xl">
      <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Variantes</h3>
      
      {allVariantsOutOfStock ? (
        <Alert variant="warning" className="mb-4">
          <AlertIcon variant="warning" />
          <AlertTitle>Todas as variantes estão esgotadas</AlertTitle>
          <AlertDescription>
            Este produto não está mais disponível. Tente novamente mais tarde.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="space-y-4">
          {Object.entries(groupedVariants).map(([name, variantGroup]) => (
            <div key={name}>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                {name}
                {required && <span className="ml-1 text-red-500">*</span>}
              </label>
              <div className="flex flex-wrap gap-2">
                {variantGroup.map(variant => (
                  <Button
                    key={variant.id}
                    onClick={() => onSelect(variant.id)}
                    disabled={variant.stock === 0}
                    variant="outline"
                    size="sm"
                    className={
                      selectedId === variant.id
                        ? 'border-primary bg-primary/5 dark:bg-primary/10 text-primary hover:bg-primary/10 dark:hover:bg-primary/15 ring-2 ring-primary/20'
                        : variant.stock === 0
                          ? 'opacity-50 cursor-not-allowed bg-gray-50 dark:bg-gray-900/20'
                          : 'bg-white dark:bg-gray-800/30 hover:bg-gray-50 dark:hover:bg-gray-800/50 border-gray-200 dark:border-gray-700'
                    }
                    aria-label={`Selecionar ${variant.value}${variant.stock === 0 ? ' (Esgotado)' : ''}`}
                  >
                    {variant.value}
                    {variant.stock === 0 && ' (Esgotado)'}
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
