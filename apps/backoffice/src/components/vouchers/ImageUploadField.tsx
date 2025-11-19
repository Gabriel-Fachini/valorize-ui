/**
 * ImageUploadField Component
 * Image upload and management for vouchers
 * Supports preview, add, remove, and validation of images
 */

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface ImageUploadFieldProps {
  images: string[]
  onImagesChange: (images: string[]) => void
  onFilesChange: (files: File[]) => void
  maxImages?: number
  maxFileSize?: number // in MB
  acceptedFormats?: string[]
  disabled?: boolean
}

export function ImageUploadField({
  images,
  onImagesChange,
  onFilesChange,
  maxImages = 4,
  maxFileSize = 5,
  acceptedFormats = ['image/jpeg', 'image/png', 'image/webp'],
  disabled = false,
}: ImageUploadFieldProps) {
  const [pendingFiles, setPendingFiles] = useState<File[]>([])
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setError(null)

    // Validate number of files
    const totalImages = images.length + pendingFiles.length + files.length
    if (totalImages > maxImages) {
      setError(`Você pode adicionar no máximo ${maxImages} imagens`)
      return
    }

    // Validate each file
    for (const file of files) {
      // Validate format
      if (!acceptedFormats.includes(file.type)) {
        setError(`Formato não suportado: ${file.type}. Use JPEG, PNG ou WebP`)
        return
      }

      // Validate size
      const fileSizeMB = file.size / (1024 * 1024)
      if (fileSizeMB > maxFileSize) {
        setError(`Arquivo muito grande: ${file.name}. Máximo ${maxFileSize}MB`)
        return
      }
    }

    // Add files to pending
    const newPendingFiles = [...pendingFiles, ...files]
    setPendingFiles(newPendingFiles)
    onFilesChange(newPendingFiles)

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleRemoveExisting = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    onImagesChange(newImages)
  }

  const handleRemovePending = (index: number) => {
    const newPendingFiles = pendingFiles.filter((_, i) => i !== index)
    setPendingFiles(newPendingFiles)
    onFilesChange(newPendingFiles)
  }

  const totalImages = images.length + pendingFiles.length
  const canAddMore = totalImages < maxImages && !disabled

  return (
    <div className="space-y-4">
      {/* Existing Images */}
      {images.length > 0 && (
        <div>
          <p className="text-sm font-medium mb-2">Imagens atuais</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <div key={index} className="relative group">
                <img
                  src={image}
                  alt={`Imagem ${index + 1}`}
                  className="h-32 w-full rounded-lg object-cover border"
                />
                {!disabled && (
                  <button
                    type="button"
                    onClick={() => handleRemoveExisting(index)}
                    className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <i className="ph ph-x" style={{ fontSize: '1rem' }} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pending Files (to be uploaded) */}
      {pendingFiles.length > 0 && (
        <div>
          <p className="text-sm font-medium mb-2">Novas imagens (pendentes)</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {pendingFiles.map((file, index) => (
              <div key={index} className="relative group">
                <div className="h-32 w-full rounded-lg border bg-muted flex items-center justify-center overflow-hidden">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <Badge
                  variant="secondary"
                  className="absolute bottom-2 left-2 text-xs"
                >
                  {(file.size / (1024 * 1024)).toFixed(1)}MB
                </Badge>
                {!disabled && (
                  <button
                    type="button"
                    onClick={() => handleRemovePending(index)}
                    className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <i className="ph ph-x" style={{ fontSize: '1rem' }} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Button */}
      {canAddMore && (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept={acceptedFormats.join(',')}
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled}
          >
            <i className="ph ph-upload mr-2" style={{ fontSize: '1rem' }} />
            Adicionar Imagens ({totalImages}/{maxImages})
          </Button>
          <p className="text-xs text-muted-foreground mt-2">
            Formatos: JPEG, PNG, WebP • Máximo: {maxFileSize}MB por arquivo
          </p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-destructive/10 text-destructive px-3 py-2 rounded-md text-sm">
          <i className="ph ph-warning mr-2" style={{ fontSize: '1rem' }} />
          {error}
        </div>
      )}

      {/* Info */}
      {!canAddMore && totalImages >= maxImages && (
        <p className="text-xs text-muted-foreground">
          Limite máximo de {maxImages} imagens atingido
        </p>
      )}
    </div>
  )
}
