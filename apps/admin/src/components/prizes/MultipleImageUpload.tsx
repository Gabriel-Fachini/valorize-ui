import { type FC, useState, useRef } from 'react'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

const MAX_IMAGES = 4
const MAX_SIZE = 5 * 1024 * 1024 // 5MB
const ACCEPTED_FORMATS = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

interface MultipleImageUploadProps {
  images: File[]
  onImagesChange: (files: File[]) => void
  disabled?: boolean
}

export const MultipleImageUpload: FC<MultipleImageUploadProps> = ({
  images,
  onImagesChange,
  disabled = false,
}) => {
  const [previews, setPreviews] = useState<string[]>([])
  const [error, setError] = useState<string | undefined>()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateFile = (file: File): string | null => {
    if (!ACCEPTED_FORMATS.includes(file.type)) {
      return 'Formato inválido. Aceitos: JPEG, PNG, WebP'
    }
    if (file.size > MAX_SIZE) {
      return `Arquivo muito grande. Tamanho máximo: 5MB (${file.name})`
    }
    return null
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    setError(undefined)

    // Check total limit
    if (images.length + files.length > MAX_IMAGES) {
      setError(`Máximo de ${MAX_IMAGES} imagens permitidas`)
      return
    }

    // Validate each file
    for (const file of files) {
      const validationError = validateFile(file)
      if (validationError) {
        setError(validationError)
        return
      }
    }

    // Create previews
    const newPreviews: string[] = []
    let loadedCount = 0

    files.forEach((file) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        newPreviews.push(reader.result as string)
        loadedCount++

        if (loadedCount === files.length) {
          setPreviews([...previews, ...newPreviews])
          onImagesChange([...images, ...files])
        }
      }
      reader.readAsDataURL(file)
    })

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    const newPreviews = previews.filter((_, i) => i !== index)
    setError(undefined)
    onImagesChange(newImages)
    setPreviews(newPreviews)
  }

  const canAddMore = images.length < MAX_IMAGES

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="prize-images">Imagens do Prêmio</Label>
        <p className="text-xs text-muted-foreground mt-1">
          Formatos aceitos: JPEG, PNG, WebP | Tamanho máximo por imagem: 5MB | Máximo: {MAX_IMAGES} imagens
        </p>
      </div>

      <input
        ref={fileInputRef}
        id="prize-images"
        type="file"
        accept={ACCEPTED_FORMATS.join(',')}
        onChange={handleFileChange}
        className="hidden"
        aria-label="Upload de imagens"
        multiple
        disabled={disabled || !canAddMore}
      />

      {/* Preview Grid */}
      {previews.length > 0 && (
        <div className="grid grid-cols-2 gap-4">
          {previews.map((preview, index) => (
            <div key={index} className="relative">
              <div className="aspect-square rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 overflow-hidden bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <img
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                disabled={disabled}
                className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white rounded-full p-1 shadow-md transition-colors cursor-pointer flex items-center justify-center"
                aria-label={`Remover imagem ${index + 1}`}
              >
                <i className="ph ph-x text-lg" />
              </button>
              <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                {index + 1}/{MAX_IMAGES}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload placeholder or button */}
      {previews.length === 0 && (
        <div
          className="w-full h-48 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center bg-gray-50 dark:bg-gray-900 cursor-pointer hover:border-primary transition-colors"
          onClick={handleButtonClick}
        >
          <div className="text-center">
            <i className="ph ph-images text-5xl text-gray-400 dark:text-gray-500" />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Clique para adicionar imagens</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Até {MAX_IMAGES} imagens</p>
          </div>
        </div>
      )}

      {/* Add More Button */}
      {previews.length > 0 && canAddMore && (
        <Button
          type="button"
          onClick={handleButtonClick}
          disabled={disabled}
          variant="outline"
          className="w-full"
        >
          <i className="ph ph-plus mr-2" />
          Adicionar mais imagens ({images.length}/{MAX_IMAGES})
        </Button>
      )}

      {/* Error message */}
      {error && (
        <div className="text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
          <i className="ph ph-warning-circle" />
          {error}
        </div>
      )}

      {/* Info message */}
      {images.length === MAX_IMAGES && (
        <div className="text-sm text-muted-foreground flex items-center gap-2">
          <i className="ph ph-check-circle" />
          Limite máximo de imagens atingido
        </div>
      )}
    </div>
  )
}
