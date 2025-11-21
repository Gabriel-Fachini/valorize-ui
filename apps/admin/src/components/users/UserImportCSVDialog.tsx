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
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { UserCSVUpload } from './UserCSVUpload'
import { UserCSVPreview } from './UserCSVPreview'
import { UserCSVReport } from './UserCSVReport'
import { useUserCSVImport } from '@/hooks/useUserCSVImport'
import { toast } from 'sonner'

interface UserImportCSVDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const UserImportCSVDialog: FC<UserImportCSVDialogProps> = ({ open, onOpenChange }) => {
  const [step, setStep] = useState<'upload' | 'preview' | 'report'>('upload')
  const [sendEmails, setSendEmails] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const { downloadTemplate, previewCSV, importCSV, isPreviewing, isImporting, previewData, importData } =
    useUserCSVImport()

  const handleFileSelect = async (fileContent: string) => {
    setErrorMessage(null) // Clear previous errors
    try {
      await previewCSV(fileContent)
      setStep('preview')
    } catch (error: any) {
      console.error('Preview error:', error)

      // Extract error message from API response
      const errorMsg = error?.response?.data?.error?.message ||
                       error?.message ||
                       'Erro ao processar o arquivo CSV'

      setErrorMessage(errorMsg)
      toast.error('Erro na validação do CSV', {
        description: errorMsg,
        duration: 5000,
      })
    }
  }

  const handleImport = async () => {
    if (!previewData) return
    try {
      await importCSV({
        previewId: previewData.previewId,
        sendEmails,
      })
      setStep('report')
      toast.success('Importação concluída com sucesso!')
    } catch (error: any) {
      console.error('Import error:', error)

      // Extract error message from API response
      const errorMessage = error?.response?.data?.error?.message ||
                          error?.message ||
                          'Erro ao importar o arquivo CSV'

      toast.error('Erro na importação', {
        description: errorMessage,
        duration: 5000,
      })
    }
  }

  const handleClose = () => {
    setStep('upload')
    setSendEmails(false)
    setErrorMessage(null)
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

              {errorMessage && (
                <div className="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <div className="flex items-start gap-3">
                    <i className="ph ph-warning-circle text-destructive text-xl flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-destructive mb-1">
                        Erro na validação do arquivo
                      </p>
                      <p className="text-sm text-destructive/80">
                        {errorMessage}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-4 flex justify-center">
                <Button variant="link" onClick={() => downloadTemplate()}>
                  <i className="ph ph-download-simple mr-2" />
                  Baixar template CSV
                </Button>
              </div>
            </>
          )}
          {step === 'preview' && previewData && (
            <>
              {isImporting && (
                <div className="mb-4 p-6 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-base font-semibold text-blue-900 mb-1">
                        Processando importação...
                      </p>
                      <p className="text-sm text-blue-700">
                        Esta operação pode levar alguns minutos. Por favor, não feche esta janela.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              <UserCSVPreview preview={previewData} />
            </>
          )}
          {step === 'report' && importData && <UserCSVReport report={importData} />}
        </div>

        {step === 'preview' && (
          <div className="px-6 pb-4 space-y-4">
            {/* Processing time warning */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-3">
                <i className="ph ph-info text-blue-600 text-xl flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-900 mb-1">
                    Tempo de processamento
                  </p>
                  <p className="text-sm text-blue-800">
                    Para grandes volumes de dados, esta operação pode levar de 2 a 3 minutos.
                    Por favor, aguarde até que o processo seja concluído.
                  </p>
                </div>
              </div>
            </div>

            {/* Send emails option */}
            <div className="flex items-center justify-between rounded-lg border p-4 bg-muted/50">
              <div className="space-y-1">
                <Label htmlFor="sendEmails" className="text-base font-medium">
                  Enviar emails de boas-vindas
                </Label>
                <p className="text-sm text-muted-foreground">
                  Enviar automaticamente emails para os novos usuários criados
                </p>
              </div>
              <Switch
                id="sendEmails"
                checked={sendEmails}
                onCheckedChange={setSendEmails}
              />
            </div>
          </div>
        )}

        <DialogFooter>
          {step === 'preview' && (
            <>
              <Button variant="outline" onClick={() => setStep('upload')} disabled={isImporting}>
                Voltar
              </Button>
              <Button onClick={handleImport} disabled={isImporting || previewData?.validRows === 0}>
                {isImporting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Processando...
                  </>
                ) : (
                  'Confirmar importação'
                )}
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
