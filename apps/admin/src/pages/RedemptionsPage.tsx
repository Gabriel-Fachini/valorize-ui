/**
 * Redemptions Page
 * Main page for managing user redemptions
 */

import { type FC, useState, useEffect, useCallback, useMemo } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { PageLayout } from '@/components/layout/PageLayout'
import { PageHeader } from '@/components/layout/PageHeader'
import { DataTable } from '@/components/ui/data-table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { redemptionsTableConfig } from '@/config/tables/redemptions.table.config'
import { useRedemptions } from '@/hooks/useRedemptions'
import { useRedemptionMutations } from '@/hooks/useRedemptionMutations'
import { useDebounce } from '@/hooks/useDebounce'
import { toast } from 'sonner'
import { RedemptionUpdateStatusDialog } from '@/components/redemptions/RedemptionUpdateStatusDialog'
import type { Redemption, RedemptionFilters } from '@/types/redemptions'

export const RedemptionsPage: FC = () => {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [filters, setFilters] = useState<RedemptionFilters>({
    search: '',
    status: undefined,
    type: undefined,
  })

  // Dialogs state
  const [isUpdateStatusDialogOpen, setIsUpdateStatusDialogOpen] = useState(false)
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false)
  const [selectedRedemption, setSelectedRedemption] = useState<Redemption | null>(null)
  const [cancelReason, setCancelReason] = useState('')

  // Debounce search to avoid excessive API calls
  const debouncedSearch = useDebounce(filters.search, 500)

  // Build query params
  const queryParams: RedemptionFilters = {
    limit: pageSize,
    offset: (page - 1) * pageSize,
    orderBy: 'createdAt',
    order: 'desc',
    ...(debouncedSearch && { search: debouncedSearch }),
    ...(filters.status && filters.status !== 'all' && { status: filters.status }),
    ...(filters.type && filters.type !== 'all' && { type: filters.type }),
  }

  const { redemptions, totalCount, isLoading, isFetching } = useRedemptions(queryParams)
  const { updateStatus, cancel } = useRedemptionMutations()

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1)
  }, [debouncedSearch, filters.status, filters.type])

  // Handler for bulk actions
  const handleBulkAction = useCallback(async (actionId: string, _rowIds: string[]) => {
    if (actionId === 'bulk-export') {
      toast.info('Funcionalidade de exportação em desenvolvimento')
    }
  }, [])

  // Handler for row actions
  const handleRowAction = useCallback(
    (actionId: string, _row: unknown) => {
      const redemption = _row as Redemption

      switch (actionId) {
        case 'view':
          navigate({ to: '/redemptions/$redemptionId', params: { redemptionId: redemption.id } })
          break
        case 'cancel':
          // Bloqueia cancelamento de vouchers
          if ((redemption.prizeType || redemption.prize?.type) === 'voucher') {
            return
          }
          setSelectedRedemption(redemption)
          setIsCancelDialogOpen(true)
          break
        default:
          break
      }
    },
    [navigate]
  )

  // Check if there are active filters
  const hasActiveFilters = useMemo(() => {
    return !!(debouncedSearch || filters.status || filters.type)
  }, [debouncedSearch, filters.status, filters.type])

  // Clear all filters
  const handleClearFilters = useCallback(() => {
    setFilters({
      search: '',
      status: undefined,
      type: undefined,
    })
    setPage(1)
  }, [])

  // Handle update status
  const handleUpdateStatus = useCallback(
    async (payload: any) => {
      if (!selectedRedemption) return

      try {
        await updateStatus.mutateAsync({
          id: selectedRedemption.id,
          payload,
        })
        setSelectedRedemption(null)
      } catch (error) {
        // Error toast is handled in the mutation
      }
    },
    [selectedRedemption, updateStatus]
  )

  // Handle cancel redemption
  const handleCancelRedemption = useCallback(async () => {
    if (!selectedRedemption) return

    try {
      await cancel.mutateAsync({
        id: selectedRedemption.id,
        payload: {
          reason: cancelReason || undefined,
        },
      })
      setSelectedRedemption(null)
      setCancelReason('')
      setIsCancelDialogOpen(false)
    } catch (error) {
      // Error toast is handled in the mutation
    }
  }, [selectedRedemption, cancelReason, cancel])

  // Customize config
  const customizedConfig = useMemo(() => {
    return {
      ...redemptionsTableConfig,
      actions: {
        ...redemptionsTableConfig.actions,
        toolbar: hasActiveFilters ? (
          <Button variant="outline" size="sm" onClick={handleClearFilters}>
            <i className="ph ph-x mr-2" />
            Limpar Filtros
          </Button>
        ) : null,
      },
    }
  }, [hasActiveFilters, handleClearFilters])

  return (
    <PageLayout maxWidth="7xl">
      <div className="space-y-6">
        {/* Page Header */}
        <PageHeader
          icon="ph-receipt"
          title="Resgates"
          description="Gerencie os resgates de prêmios dos usuários"
        />

        {/* Data Table */}
        <DataTable
          config={customizedConfig as any}
          data={redemptions}
          totalCount={totalCount}
          isLoading={isLoading}
          isFetching={isFetching}
          pageCount={Math.ceil(totalCount / pageSize)}
          pageSize={pageSize}
          currentPage={page}
          onPageChange={setPage}
          onPageSizeChange={(size) => {
            setPageSize(size)
            setPage(1)
          }}
          filters={{
            search: filters.search || '',
            status: filters.status || '',
            type: filters.type || '',
          }}
          onFiltersChange={(newFilters: Record<string, unknown>) => {
            setFilters({
              search: String(newFilters.search || ''),
              status: newFilters.status && String(newFilters.status) !== 'all' ? String(newFilters.status) : undefined,
              type: newFilters.type && String(newFilters.type) !== 'all' ? String(newFilters.type) : undefined,
            })
          }}
          onBulkAction={handleBulkAction}
          onRowAction={handleRowAction}
          getRowId={(row) => row.id}
        />
      </div>

      {/* Update Status Dialog */}
      <RedemptionUpdateStatusDialog
        isOpen={isUpdateStatusDialogOpen && selectedRedemption !== null}
        onClose={() => {
          setIsUpdateStatusDialogOpen(false)
          setSelectedRedemption(null)
        }}
        onConfirm={handleUpdateStatus}
        isPending={updateStatus.isPending}
        currentStatus={selectedRedemption?.status}
      />

      {/* Cancel Dialog */}
      {(selectedRedemption?.prizeType || selectedRedemption?.prize?.type) !== 'voucher' && (
        <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Cancelar Resgate</DialogTitle>
              <DialogDescription>
                Esta ação não pode ser desfeita. Os usuários serão reembolsados automaticamente.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium">Resgate ID</p>
                <p className="mt-1 font-mono text-sm text-gray-600">{selectedRedemption?.id}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason">Motivo (Opcional)</Label>
                <Textarea
                  id="reason"
                  placeholder="Descreva o motivo do cancelamento..."
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  rows={3}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCancelDialogOpen(false)} disabled={cancel.isPending}>
                Manter
              </Button>
              <Button
                variant="destructive"
                onClick={handleCancelRedemption}
                disabled={cancel.isPending}
                className="gap-2"
              >
                {cancel.isPending && <i className="ph ph-spinner animate-spin" />}
                {cancel.isPending ? 'Cancelando...' : 'Cancelar Resgate'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </PageLayout>
  )
}
