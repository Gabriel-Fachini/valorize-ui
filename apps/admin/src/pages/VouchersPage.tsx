/**
 * Vouchers Page
 * Main page for managing voucher products catalog
 */

import { type FC, useState, useEffect, useCallback, useMemo } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { PageLayout } from '@/components/layout/PageLayout'
import { PageHeader } from '@/components/layout/PageHeader'
import { DataTable } from '@/components/ui/data-table'
import { vouchersTableConfig } from '@/config/tables/vouchers.table.config'
import { VoucherBulkAssignDialog } from '@/components/vouchers/VoucherBulkAssignDialog'
import { VoucherAssignResultDialog } from '@/components/vouchers/VoucherAssignResultDialog'
import { VoucherSendDirectDialog } from '@/components/vouchers/VoucherSendDirectDialog'
import { useVouchers } from '@/hooks/useVouchers'
import type { VoucherProduct, VoucherFilters, BulkAssignResponse } from '@/types/vouchers'
import type { TableConfig } from '@/config/tables/types'

export const VouchersPage: FC = () => {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [filters, setFilters] = useState<VoucherFilters>({
    search: '',
  })
  const [isBulkAssignDialogOpen, setIsBulkAssignDialogOpen] = useState(false)
  const [isResultDialogOpen, setIsResultDialogOpen] = useState(false)
  const [assignResult, setAssignResult] = useState<BulkAssignResponse | null>(null)
  const [isSendDirectDialogOpen, setIsSendDirectDialogOpen] = useState(false)
  const [selectedVoucherForSend, setSelectedVoucherForSend] = useState<VoucherProduct | null>(null)

  // Build query params (without search, as we'll filter client-side)
  const queryParams = {
    limit: 1000, // Fetch all vouchers for client-side filtering
    offset: 0,
    isActive: true, // Only show active vouchers by default
  }

  const { vouchers: allVouchers, isLoading, isFetching } = useVouchers(queryParams)

  // Client-side filtering based on search
  const filteredVouchers = useMemo(() => {
    if (!filters.search.trim()) return allVouchers

    const searchLower = filters.search.toLowerCase()
    return allVouchers.filter((voucher) =>
      voucher.name?.toLowerCase().includes(searchLower) ||
      voucher.brand?.toLowerCase().includes(searchLower) ||
      voucher.category?.toLowerCase().includes(searchLower)
    )
  }, [allVouchers, filters.search])

  // Client-side pagination
  const paginatedVouchers = useMemo(() => {
    const start = (page - 1) * pageSize
    const end = start + pageSize
    return filteredVouchers.slice(start, end)
  }, [filteredVouchers, page, pageSize])

  const totalCount = filteredVouchers.length

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1)
  }, [filters.search])

  // Handler for bulk actions
  const handleBulkAction = useCallback(
    async (actionId: string, _rowIds: string[]) => {
      if (actionId === 'bulk-assign') {
        // Open bulk assign dialog without pre-selecting a voucher
        setIsBulkAssignDialogOpen(true)
      }
    },
    []
  )

  // Handler for row actions
  const handleRowAction = useCallback(
    async (actionId: string, _row: unknown) => {
      const voucher = _row as VoucherProduct
      switch (actionId) {
        case 'view':
          // Navigate to voucher detail page
          navigate({ to: '/vouchers/$voucherId', params: { voucherId: voucher.id } })
          break
        case 'send-direct':
          // Open send direct dialog
          setSelectedVoucherForSend(voucher)
          setIsSendDirectDialogOpen(true)
          break
        default:
          break
      }
    },
    [navigate]
  )

  const handleBulkAssignSuccess = (result: BulkAssignResponse) => {
    setAssignResult(result)
    setIsResultDialogOpen(true)
  }

  // Handler for send-direct button
  const handleSendDirect = useCallback((voucher: VoucherProduct) => {
    setSelectedVoucherForSend(voucher)
    setIsSendDirectDialogOpen(true)
  }, [])

  // Handler for closing send-direct dialog
  const handleSendDirectDialogClose = useCallback((open: boolean) => {
    setIsSendDirectDialogOpen(open)
    if (!open) {
      setSelectedVoucherForSend(null)
    }
  }, [])

  // Customize table config to render send-direct button and make image/name clickable
  const customTableConfig = useMemo<TableConfig<VoucherProduct>>(() => {
    return {
      ...vouchersTableConfig,
      columns: vouchersTableConfig.columns.map((col) => {
        if (col.id === 'send-direct-btn') {
          return {
            ...col,
            type: 'custom',
            cell: (row: VoucherProduct) => (
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleSendDirect(row)}
              >
                <i className="ph ph-user mr-2" />
                Enviar Direto
              </Button>
            ),
          }
        }
        if (col.id === 'image') {
          return {
            ...col,
            type: 'custom',
            cell: (row: VoucherProduct) => (
              <button
                onClick={() => navigate({ to: '/vouchers/$voucherId', params: { voucherId: row.id } })}
                className="cursor-pointer hover:opacity-80 transition-opacity"
              >
                <img
                  src={row.images?.[0] || ''}
                  alt={row.name}
                  className="h-[60px] w-[100px] rounded object-cover"
                />
              </button>
            ),
          }
        }
        if (col.id === 'name') {
          return {
            ...col,
            type: 'custom',
            cell: (row: VoucherProduct) => (
              <button
                onClick={() => navigate({ to: '/vouchers/$voucherId', params: { voucherId: row.id } })}
                className="cursor-pointer font-medium hover:underline text-left"
              >
                {row.name}
              </button>
            ),
          }
        }
        return col
      }),
    }
  }, [handleSendDirect, navigate])

  return (
    <PageLayout maxWidth="7xl">
      <div className="space-y-6">
        {/* Page Header */}
        <PageHeader
          title="Gerenciamento de Vouchers"
          description="Gerencie o catálogo de vouchers digitais e envie para usuários"
          icon="ph-ticket"
          right={
            <Button
              onClick={() => setIsBulkAssignDialogOpen(true)}
              variant="default"
            >
              <i className="ph ph-paper-plane-tilt mr-2" />
              Enviar em Lote
            </Button>
          }
        />

        {/* Data Table */}
        <DataTable
          config={customTableConfig as any}
          data={paginatedVouchers}
          isLoading={isLoading}
          isFetching={isFetching}
          totalCount={totalCount}
          pageCount={Math.ceil(totalCount / pageSize)}
          pageSize={pageSize}
          currentPage={page}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
          filters={filters}
          onFiltersChange={(newFilters: Record<string, unknown>) => {
            setFilters((prev) => ({
              ...prev,
              search: String(newFilters.search || ''),
            }))
          }}
          onBulkAction={handleBulkAction}
          onRowAction={handleRowAction}
          getRowId={(row: any) => row.id}
        />

        {/* Bulk Assign Dialog */}
        <VoucherBulkAssignDialog
          open={isBulkAssignDialogOpen}
          onOpenChange={setIsBulkAssignDialogOpen}
          onSuccess={handleBulkAssignSuccess}
        />

        {/* Result Dialog */}
        <VoucherAssignResultDialog
          open={isResultDialogOpen}
          onOpenChange={setIsResultDialogOpen}
          result={assignResult}
        />

        {/* Send Direct Dialog */}
        {selectedVoucherForSend && (
          <VoucherSendDirectDialog
            open={isSendDirectDialogOpen}
            onOpenChange={handleSendDirectDialogClose}
            voucher={selectedVoucherForSend}
          />
        )}
      </div>
    </PageLayout>
  )
}
