import { type FC } from 'react'
import { Badge } from '@/components/ui/badge'
import type { CSVImportResponse } from '@/types/users'

interface UserCSVReportProps {
  report: CSVImportResponse
}

export const UserCSVReport: FC<UserCSVReportProps> = ({ report }) => {
  const { created, updated, skipped, errors } = report.report

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 rounded-lg bg-green-50 p-4 dark:bg-green-950">
        <i className="ph ph-check-circle text-2xl text-green-600" />
        <div>
          <h3 className="font-semibold text-green-900 dark:text-green-100">
            Importação concluída!
          </h3>
          <p className="text-sm text-green-700 dark:text-green-300">
            Os usuários foram importados com sucesso.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Criados</p>
          <p className="text-2xl font-bold text-green-600">{created}</p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Atualizados</p>
          <p className="text-2xl font-bold text-blue-600">{updated}</p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Ignorados</p>
          <p className="text-2xl font-bold text-gray-600">{skipped}</p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Erros</p>
          <p className="text-2xl font-bold text-destructive">{errors.length}</p>
        </div>
      </div>

      {errors.length > 0 && (
        <div className="rounded-lg border p-4">
          <h4 className="mb-2 font-semibold">Erros encontrados:</h4>
          <div className="space-y-2">
            {errors.map((error, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <Badge variant="destructive">Linha {error.rowNumber}</Badge>
                <span className="text-muted-foreground">{error.email}:</span>
                <span>{error.reason}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
