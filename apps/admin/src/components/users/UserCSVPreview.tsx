import { type FC } from 'react'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { CSVPreviewResponse } from '@/types/users'

interface UserCSVPreviewProps {
  preview: CSVPreviewResponse
}

export const UserCSVPreview: FC<UserCSVPreviewProps> = ({ preview }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Total de linhas</p>
          <p className="text-2xl font-bold">{preview.totalRows}</p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Linhas válidas</p>
          <p className="text-2xl font-bold text-green-600">{preview.validRows}</p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Com erros</p>
          <p className="text-2xl font-bold text-destructive">{preview.rowsWithErrors}</p>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Linha</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Departamento</TableHead>
              <TableHead>Cargo</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {preview.preview.map((row) => (
              <TableRow key={row.rowNumber}>
                <TableCell>{row.rowNumber}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell>{row.department || '-'}</TableCell>
                <TableCell>{row.position || '-'}</TableCell>
                <TableCell>
                  <Badge variant={row.status === 'valid' ? 'default' : 'destructive'}>
                    {row.status}
                  </Badge>
                  {row.errors.length > 0 && (
                    <p className="mt-1 text-xs text-destructive">{row.errors.join(', ')}</p>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
