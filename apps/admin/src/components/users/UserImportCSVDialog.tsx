import { type FC, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { UserCSVUpload } from './UserCSVUpload'
import { UserCSVPreview } from './UserCSVPreview'
import { UserCSVReport } from './UserCSVReport'
import { useUserCSVImport } from '@/hooks/useUserCSVImport'

interface UserImportCSVDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const UserImportCSVDialog: FC<UserImportCSVDialogProps> = ({ open, onOpenChange }) => {
  const [step, setStep] = useState<'upload' | 'preview' | 'report'>('upload')
  const { downloadTemplate, previewCSV, importCSV, isPreviewing, isImporting, previewData, importData } =
    useUserCSVImport()

  const handleFileSelect = async (fileContent: string) => {
    try {
      await previewCSV(fileContent)
      setStep('preview')
    } catch (error) {
      console.error('Preview error:', error)
    }
  }

  const handleImport = async () => {
    if (!previewData) return
    try {
      await importCSV({ previewId: previewData.previewId })
      setStep('report')
    } catch (error) {
      console.error('Import error:', error)
    }
  }

  const handleClose = () => {
    setStep('upload')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Importar usuários via CSV</DialogTitle>
          <DialogDescription>
            {step === 'upload' && 'Faça upload de um arquivo CSV com os dados dos usuários.'}
            {step === 'preview' && 'Revise os dados antes de importar.'}
            {step === 'report' && 'Confira o resultado da importação.'}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {step === 'upload' && (
            <>
              <UserCSVUpload onFileSelect={handleFileSelect} isLoading={isPreviewing} />
              <div className="mt-4 flex justify-center">
                <Button variant="link" onClick={() => downloadTemplate()}>
                  <i className="ph ph-download-simple mr-2" />
                  Baixar template CSV
                </Button>
              </div>
            </>
          )}
          {step === 'preview' && previewData && <UserCSVPreview preview={previewData} />}
          {step === 'report' && importData && <UserCSVReport report={importData} />}
        </div>

        <DialogFooter>
          {step === 'preview' && (
            <>
              <Button variant="outline" onClick={() => setStep('upload')} disabled={isImporting}>
                Voltar
              </Button>
              <Button onClick={handleImport} disabled={isImporting || previewData?.validRows === 0}>
                {isImporting ? 'Importando...' : 'Confirmar importação'}
              </Button>
            </>
          )}
          {step === 'report' && (
            <Button onClick={handleClose}>Fechar</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
