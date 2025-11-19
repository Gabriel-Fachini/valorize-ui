/**
 * Vouchers Page
 * Main page for managing voucher products catalog (Backoffice - Super Admin)
 */

import { useState, useEffect, useMemo, useCallback } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { PageLayout } from '@/components/layout/PageLayout'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import { StatCard } from '@/components/companies/StatCard'
import { SyncCatalogDialog } from '@/components/vouchers/SyncCatalogDialog'
import { useVouchers } from '@/hooks/useVouchers'
import { vouchersTableConfig } from '@/config/tables/vouchers.table.config'
import type { VoucherProduct, VoucherFilters } from '@/types/voucher'
import type { TableConfig } from '@/config/tables/types'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export function VouchersPage() {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [filters, setFilters] = useState<VoucherFilters>({
    search: '',
  })
  const [isSyncDialogOpen, setIsSyncDialogOpen] = useState(false)

  // Fetch all active vouchers (we'll do client-side filtering and pagination)
  const queryParams = {
    limit: 1000, // Fetch all vouchers
    offset: 0,
    isActive: true, // Only active vouchers by default
  }

  const { vouchers: allVouchers, isLoading, isFetching, stats } = useVouchers(queryParams)

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

  // Handler for row actions
  const handleRowAction = useCallback(
    async (actionId: string, _row: unknown) => {
      const voucher = _row as VoucherProduct
      switch (actionId) {
        case 'view':
          navigate({ to: '/vouchers/$id', params: { id: voucher.id } })
          break
        default:
          break
      }
    },
    [navigate]
  )

  // Format last sync time
  const formatLastSync = (lastSyncAt: string | null) => {
    if (!lastSyncAt) return 'Nunca sincronizado'

    try {
      return formatDistanceToNow(new Date(lastSyncAt), {
        addSuffix: true,
        locale: ptBR,
      })
    } catch {
      return 'Data inválida'
    }
  }

  // Calculate active percentage
  const activePercentage = stats.total > 0
    ? Math.round((stats.active / stats.total) * 100)
    : 0

  const inactivePercentage = stats.total > 0
    ? Math.round((stats.inactive / stats.total) * 100)
    : 0

  // Customize table config to make image and name clickable
  const customTableConfig = useMemo<TableConfig<VoucherProduct>>(() => {
    return {
      ...vouchersTableConfig,
      columns: vouchersTableConfig.columns.map((col) => {
        // Make image clickable
        if (col.id === 'image') {
          return {
            ...col,
            type: 'custom',
            cell: (row: VoucherProduct) => (
              <button
                onClick={() => navigate({ to: '/vouchers/$id', params: { id: row.id } })}
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
        // Make name clickable
        if (col.id === 'name') {
          return {
            ...col,
            type: 'custom',
            cell: (row: VoucherProduct) => (
              <button
                onClick={() => navigate({ to: '/vouchers/$id', params: { id: row.id } })}
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
  }, [navigate])

  return (
    <PageLayout
      title="Gerenciamento de Vouchers"
      subtitle="Gerencie o catálogo de vouchers digitais disponíveis na plataforma"
      action={
        <Button onClick={() => setIsSyncDialogOpen(true)} variant="default">
          <i className="ph ph-arrows-clockwise mr-2" style={{ fontSize: '1rem' }} />
          Sincronizar Catálogo
        </Button>
      }
    >
      {/* Stats Cards */}
      <div className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total de Produtos"
          value={stats.total}
          description="Produtos no catálogo"
          icon={<i className="ph ph-ticket" style={{ fontSize: '1rem' }} />}
          isLoading={isLoading}
        />
        <StatCard
          title="Produtos Ativos"
          value={stats.active}
          description={`${activePercentage}% do catálogo`}
          icon={<i className="ph ph-check-circle" style={{ fontSize: '1rem' }} />}
          isLoading={isLoading}
        />
        <StatCard
          title="Produtos Inativos"
          value={stats.inactive}
          description={`${inactivePercentage}% do catálogo`}
          icon={<i className="ph ph-x-circle" style={{ fontSize: '1rem' }} />}
          isLoading={isLoading}
        />
        <StatCard
          title="Última Sincronização"
          value={formatLastSync(stats.lastSyncAt)}
          description="Atualização do catálogo"
          icon={<i className="ph ph-clock-clockwise" style={{ fontSize: '1rem' }} />}
          isLoading={isLoading}
        />
      </div>

      {/* Data Table */}
      <DataTable<VoucherProduct>
        config={customTableConfig as any}
        data={paginatedVouchers}
        isLoading={isLoading && !allVouchers.length}
        isFetching={isFetching}
        totalCount={totalCount}
        pageCount={Math.ceil(totalCount / pageSize)}
        currentPage={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        filters={filters}
        onFiltersChange={(newFilters: Record<string, unknown>) => {
          setFilters((prev) => ({
            ...prev,
            search: String(newFilters.search || ''),
          }))
        }}
        onRowAction={handleRowAction}
        getRowId={(row: any) => row.id}
      />

      {/* Sync Catalog Dialog */}
      <SyncCatalogDialog
        open={isSyncDialogOpen}
        onOpenChange={setIsSyncDialogOpen}
      />
    </PageLayout>
  )
}
