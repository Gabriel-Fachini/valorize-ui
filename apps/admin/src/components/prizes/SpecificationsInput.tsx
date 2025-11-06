import { type FC, useState, useEffect } from 'react'
import { Label } from '@/components/ui/label'
import { SimpleInput } from '@/components/ui/simple-input'
import { Button } from '@/components/ui/button'

interface SpecificationsInputProps {
  specifications: Record<string, string>
  onSpecificationsChange: (specs: Record<string, string>) => void
  disabled?: boolean
}

interface SpecItem {
  key: string
  value: string
}

export const SpecificationsInput: FC<SpecificationsInputProps> = ({
  specifications,
  onSpecificationsChange,
  disabled = false,
}) => {
  const [specs, setSpecs] = useState<SpecItem[]>([])
  const [error, setError] = useState<string | undefined>()

  // Initialize from specifications prop
  useEffect(() => {
    const items = Object.entries(specifications).map(([key, value]) => ({ key, value }))
    if (items.length === 0) {
      // Start with one empty field
      setSpecs([{ key: '', value: '' }])
    } else {
      setSpecs(items)
    }
  }, [])

  // Convert specs array to object and notify parent
  const updateParent = (newSpecs: SpecItem[]) => {
    const filtered = newSpecs.filter((item) => item.key.trim() !== '' || item.value.trim() !== '')
    const obj: Record<string, string> = {}
    filtered.forEach((item) => {
      if (item.key.trim() !== '') {
        obj[item.key.trim()] = item.value.trim()
      }
    })
    onSpecificationsChange(obj)
  }

  const handleAddSpec = () => {
    const newSpecs = [...specs, { key: '', value: '' }]
    setSpecs(newSpecs)
    setError(undefined)
  }

  const handleRemoveSpec = (index: number) => {
    const newSpecs = specs.filter((_, i) => i !== index)
    // Ensure at least one empty field
    if (newSpecs.length === 0) {
      newSpecs.push({ key: '', value: '' })
    }
    setSpecs(newSpecs)
    updateParent(newSpecs)
    setError(undefined)
  }

  const handleKeyChange = (index: number, key: string) => {
    // Check for duplicate keys
    const isDuplicate = specs.some((item, i) => i !== index && item.key.trim() === key.trim() && key.trim() !== '')
    if (isDuplicate) {
      setError(`A chave "${key}" já existe`)
    } else {
      setError(undefined)
    }

    const newSpecs = specs.map((item, i) => (i === index ? { ...item, key } : item))
    setSpecs(newSpecs)
    updateParent(newSpecs)
  }

  const handleValueChange = (index: number, value: string) => {
    const newSpecs = specs.map((item, i) => (i === index ? { ...item, value } : item))
    setSpecs(newSpecs)
    updateParent(newSpecs)
  }

  return (
    <div className="space-y-4">
      <div>
        <Label>Especificações Técnicas</Label>
        <p className="text-xs text-muted-foreground mt-1">
          Adicione detalhes técnicos do prêmio (ex: Cor, Tamanho, Voltagem, etc)
        </p>
      </div>

      <div className="space-y-3">
        {specs.map((spec, index) => (
          <div key={index} className="flex gap-2 items-start">
            <div className="flex-1">
              <SimpleInput
                placeholder="Chave (ex: Cor)"
                value={spec.key}
                onChange={(e) => handleKeyChange(index, e.target.value)}
                disabled={disabled}
                className="w-full"
              />
            </div>
            <div className="flex-1">
              <SimpleInput
                placeholder="Valor (ex: Azul)"
                value={spec.value}
                onChange={(e) => handleValueChange(index, e.target.value)}
                disabled={disabled}
                className="w-full"
              />
            </div>
            {specs.length > 1 && (
              <Button
                type="button"
                onClick={() => handleRemoveSpec(index)}
                disabled={disabled}
                variant="ghost"
                size="icon"
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <i className="ph ph-trash text-lg" />
              </Button>
            )}
          </div>
        ))}
      </div>

      <Button
        type="button"
        onClick={handleAddSpec}
        disabled={disabled}
        variant="outline"
        className="w-full"
      >
        <i className="ph ph-plus mr-2" />
        Adicionar Especificação
      </Button>

      {error && (
        <div className="text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
          <i className="ph ph-warning-circle" />
          {error}
        </div>
      )}

      {Object.keys(specifications).length > 0 && (
        <div className="text-xs text-muted-foreground">
          {Object.keys(specifications).length} especificação(ões) definida(s)
        </div>
      )}
    </div>
  )
}
