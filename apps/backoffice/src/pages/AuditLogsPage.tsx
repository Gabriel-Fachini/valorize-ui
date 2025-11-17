/**
 * Audit Logs Page
 * Página principal para visualização de logs de auditoria
 */

import { useState } from 'react'
import { PageLayout } from '@/components/layout/PageLayout'
import { DataTable } from '@/components/ui/data-table'
import { AuditLogDetailsDialog } from '@/components/audit/AuditLogDetailsDialog'
import { useAuditLogs } from '@/hooks/useAuditLogs'
import { auditLogsTableConfig } from '@/config/tables/auditLogs.table.config'
import type { AuditLogItem, AuditAction, AuditEntityType } from '@/types/audit'

interface AuditFiltersState extends Record<string, unknown> {
  search: string
  action: string
  entityType: string
}

export function AuditLogsPage() {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(50)
  const [filters, setFilters] = useState<AuditFiltersState>({
    search: '',
    action: 'all',
    entityType: 'all',
  })
  const [selectedLog, setSelectedLog] = useState<AuditLogItem | null>(null)
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false)

  // Prepare query params
  const queryFilters = {
    search: filters.search || undefined,
    action: filters.action !== 'all' ? (filters.action as AuditAction) : undefined,
    entityType:
      filters.entityType !== 'all' ? (filters.entityType as AuditEntityType) : undefined,
  }

  const { data, isLoading, isFetching } = useAuditLogs(
    queryFilters,
    { page, limit: pageSize },
    { sortOrder: 'desc' }
  )

  const handleRowAction = (actionId: string, log: AuditLogItem) => {
    switch (actionId) {
      case 'view':
        setSelectedLog(log)
        setDetailsDialogOpen(true)
        break
    }
  }

  return (
    <PageLayout
      title="Logs de Auditoria"
      subtitle="Visualize todas as ações realizadas no sistema pelos super administradores"
    >
      {/* Table with DataTable */}
      <DataTable<AuditLogItem>
        config={auditLogsTableConfig}
        data={data?.data || []}
        isLoading={isLoading && !data}
        isFetching={isFetching}
        totalCount={data?.pagination?.total || 0}
        pageCount={data?.pagination?.totalPages || 1}
        currentPage={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        sortState={{ columnId: 'createdAt', order: 'desc' }}
        filters={filters}
        onFiltersChange={(newFilters) => {
          setFilters(newFilters as AuditFiltersState)
          setPage(1) // Reset to first page when filters change
        }}
        onRowAction={handleRowAction}
        getRowId={(row) => row.id}
      />

      {/* Details Dialog */}
      <AuditLogDetailsDialog
        open={detailsDialogOpen}
        onOpenChange={setDetailsDialogOpen}
        log={selectedLog}
      />
    </PageLayout>
  )
}
