import { type FC, type ChangeEvent } from 'react'
import { Button } from '@/components/ui/button'

interface UserCSVUploadProps {
  onFileSelect: (fileContent: string) => void
  isLoading?: boolean
}

export const UserCSVUpload: FC<UserCSVUploadProps> = ({ onFileSelect, isLoading }) => {
  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      const base64 = btoa(content)
      onFileSelect(base64)
    }
    reader.readAsText(file)
  }

  return (
    <div className="flex flex-col items-center gap-4 rounded-lg border-2 border-dashed p-8">
      <i className="ph ph-file-csv text-6xl text-muted-foreground" />
      <div className="text-center">
        <h3 className="font-semibold">Upload de arquivo CSV</h3>
        <p className="text-sm text-muted-foreground">
          Selecione um arquivo CSV para importar usuários
        </p>
      </div>
      <Button asChild disabled={isLoading}>
        <label htmlFor="csv-upload" className="cursor-pointer">
          <i className="ph ph-upload-simple mr-2" />
          {isLoading ? 'Processando...' : 'Selecionar arquivo'}
          <input
            id="csv-upload"
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
            disabled={isLoading}
          />
        </label>
      </Button>
    </div>
  )
}
