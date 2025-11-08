import { type FC, useState, useRef, useEffect } from 'react'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { LOGO_CONSTRAINTS } from '@/types/company'

interface LogoUploadProps {
  currentLogoUrl?: string
  onLogoChange: (file: File | null) => void
  isUploading?: boolean
}

export const LogoUpload: FC<LogoUploadProps> = ({
  currentLogoUrl,
  onLogoChange,
  isUploading = false,
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(currentLogoUrl)
  const [error, setError] = useState<string | undefined>()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Update preview when currentLogoUrl prop changes
  useEffect(() => {
    if (currentLogoUrl && currentLogoUrl.trim() !== '') {
      console.log('🖼️ LogoUpload: Setting preview URL:', currentLogoUrl)
      setPreviewUrl(currentLogoUrl)
    } else {
      setPreviewUrl(undefined)
    }
  }, [currentLogoUrl])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Reset error
    setError(undefined)

    // Validate file type
    if (!LOGO_CONSTRAINTS.acceptedFormats.includes(file.type as typeof LOGO_CONSTRAINTS.acceptedFormats[number])) {
      setError('Formato inválido. Aceitos: PNG, JPG, SVG')
      return
    }

    // Validate file size
    if (file.size > LOGO_CONSTRAINTS.maxSize) {
      setError('Arquivo muito grande. Tamanho máximo: 1MB')
      return
    }

    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      const dataUrl = reader.result as string
      setPreviewUrl(dataUrl)
      // Call parent callback with the File object
      onLogoChange(file)
    }
    reader.readAsDataURL(file)
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  const handleRemoveLogo = () => {
    setPreviewUrl(undefined)
    setError(undefined)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    // Notify parent component that logo was removed
    onLogoChange(null)
  }

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="logo-upload">Logo da Empresa</Label>
        <p className="text-xs text-muted-foreground mt-1">
          Formatos aceitos: PNG, JPG, SVG | Tamanho máximo: 1MB | Recomendado: {LOGO_CONSTRAINTS.recommendedDimensions}
        </p>
      </div>

      <input
        ref={fileInputRef}
        id="logo-upload"
        type="file"
        accept={LOGO_CONSTRAINTS.acceptedFormats.join(',')}
        onChange={handleFileChange}
        className="hidden"
        aria-label="Upload de logo"
      />

      <div className="flex items-start gap-4">
        {/* Preview */}
        {previewUrl && (
          <div className="relative">
            <div className="w-64 h-32 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 overflow-hidden bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
              <img
                src={previewUrl}
                alt="Preview da logo"
                className="max-w-full max-h-full object-contain"
              />
            </div>
            <button
              type="button"
              onClick={handleRemoveLogo}
              className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-md transition-colors cursor-pointer flex items-center justify-center"
              aria-label="Remover logo"
            >
              <i className="ph ph-x text-lg" />
            </button>
          </div>
        )}

        {/* Upload button or placeholder */}
        {!previewUrl && (
          <div
            className="w-32 h-32 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center bg-gray-50 dark:bg-gray-900 cursor-pointer hover:border-primary transition-colors"
            onClick={handleButtonClick}
          >
            <div className="text-center">
              <i className="ph ph-upload-simple text-3xl text-gray-400 dark:text-gray-500" />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Sem logo</p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-2">
          <Button
            type="button"
            onClick={handleButtonClick}
            disabled={isUploading}
            variant="outline"
            className="w-full"
          >
            <i className="ph ph-folder-open mr-2" />
            {previewUrl ? 'Alterar Logo' : 'Selecionar Logo'}
          </Button>

          {previewUrl && (
            <Button
              type="button"
              onClick={handleRemoveLogo}
              disabled={isUploading}
              variant="ghost"
              className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <i className="ph ph-trash mr-2" />
              Remover
            </Button>
          )}
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
          <i className="ph ph-warning-circle" />
          {error}
        </div>
      )}

      {/* Upload progress */}
      {isUploading && (
        <div className="text-sm text-muted-foreground flex items-center gap-2">
          <i className="ph ph-circle-notch animate-spin" />
          Fazendo upload...
        </div>
      )}
    </div>
  )
}
