import { type FC, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui/button'

interface UserCSVUploadProps {
  onFileSelect: (fileContent: string) => void
  isLoading?: boolean
}

export const UserCSVUpload: FC<UserCSVUploadProps> = ({ onFileSelect, isLoading }) => {
  const processFile = useCallback(
    (file: File) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        // Convert UTF-8 string to base64 properly
        const base64 = btoa(unescape(encodeURIComponent(content)))
        onFileSelect(base64)
      }
      // Explicitly specify UTF-8 encoding
      reader.readAsText(file, 'UTF-8')
    },
    [onFileSelect],
  )

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]
      if (file) {
        processFile(file)
      }
    },
    [processFile],
  )

  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
    },
    maxFiles: 1,
    disabled: isLoading,
  })

  const getBorderColor = () => {
    if (isDragReject) return 'border-destructive bg-destructive/5'
    if (isDragAccept) return 'border-primary bg-primary/5'
    if (isDragActive) return 'border-primary/50 bg-primary/5'
    return 'border-border'
  }

  return (
    <div
      {...getRootProps()}
      className={`flex flex-col items-center gap-4 rounded-lg border-2 border-dashed p-8 transition-colors ${getBorderColor()} ${
        isLoading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:border-primary/50'
      }`}
    >
      <input {...getInputProps()} />
      <i
        className={`ph ph-file-csv text-6xl ${
          isDragActive ? 'text-primary' : 'text-muted-foreground'
        } transition-colors`}
      />
      <div className="text-center">
        <h3 className="font-semibold">
          {isDragActive ? 'Solte o arquivo aqui' : 'Upload de arquivo CSV'}
        </h3>
        <p className="text-sm text-muted-foreground">
          {isDragReject
            ? 'Apenas arquivos .csv são aceitos'
            : isLoading
              ? 'Processando arquivo...'
              : 'Arraste e solte um arquivo CSV ou clique para selecionar'}
        </p>
      </div>
      {!isDragActive && (
        <Button type="button" disabled={isLoading}>
          <i className="ph ph-upload-simple mr-2" />
          {isLoading ? 'Processando...' : 'Selecionar arquivo'}
        </Button>
      )}
    </div>
  )
}
