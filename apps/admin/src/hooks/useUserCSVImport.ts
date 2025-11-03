/**
 * User CSV Import Hook
 * Hook for CSV template download, preview, and import operations
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { usersService } from '@/services/users'
import type { CSVImportPayload } from '@/types/users'

export const useUserCSVImport = () => {
  const queryClient = useQueryClient()

  const downloadTemplateMutation = useMutation({
    mutationFn: async () => await usersService.downloadCSVTemplate(),
    onSuccess: (blob) => {
      // Trigger download
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'users_template.csv'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    },
  })

  const previewMutation = useMutation({
    mutationFn: async (fileContent: string) => await usersService.previewCSV(fileContent),
  })

  const importMutation = useMutation({
    mutationFn: async (payload: CSVImportPayload) => await usersService.importCSV(payload),
    onSuccess: () => {
      // Invalidate users list after successful import
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })

  return {
    // Download template
    downloadTemplate: downloadTemplateMutation.mutateAsync,
    isDownloading: downloadTemplateMutation.isPending,
    downloadError: downloadTemplateMutation.error,

    // Preview CSV
    previewCSV: previewMutation.mutateAsync,
    isPreviewing: previewMutation.isPending,
    previewError: previewMutation.error,
    previewData: previewMutation.data,

    // Import CSV
    importCSV: importMutation.mutateAsync,
    isImporting: importMutation.isPending,
    importError: importMutation.error,
    importData: importMutation.data,

    // Reset states
    resetPreview: previewMutation.reset,
    resetImport: importMutation.reset,

    // General states
    isPending:
      downloadTemplateMutation.isPending || previewMutation.isPending || importMutation.isPending,
  }
}

export type UseUserCSVImportReturn = ReturnType<typeof useUserCSVImport>

[
  {
    name: 'Nome',
      type: 'string',
      display: 'string-bold'
  },
  {
    name: "",
    type: 'avatar',
    display: 'avatar'
  },
  {
    name: 'Email',
    type: 'string',
    display: 'string-secondary'
  },
  {
    name: 'Departamento',
    type: 'string',
    display: 'string'
  },
  {
    name: 'Cargo',
    type: 'string',
    display: 'string'
  },
  {
    name: 'Status',
    type: 'boolean',
    display: 'badge'
  }
]