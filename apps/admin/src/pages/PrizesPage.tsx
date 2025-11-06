/**
 * Prizes Page
 * Main page for managing prizes catalog
 */

import { type FC, useState, useEffect, useCallback, useMemo } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { PageLayout } from '@/components/layout/PageLayout'
import { PageHeader } from '@/components/layout/PageHeader'
import { DataTable } from '@/components/ui/data-table'
import { prizesTableConfig } from '@/config/tables/prizes.table.config.tsx'
import { usePrizes } from '@/hooks/usePrizes'
import { usePrizeMutations } from '@/hooks/usePrizeMutations'
import { toast } from 'sonner'
import type { Prize, PrizeFilters } from '@/types/prizes'

export const PrizesPage: FC = () => {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [filters, setFilters] = useState<PrizeFilters>({
    search: '',
    category: undefined,
    isActive: undefined,
  })

  // Build query params
  const queryParams: PrizeFilters = {
    limit: pageSize,
    offset: (page - 1) * pageSize,
    ...(filters.search && { search: filters.search }),
    ...(filters.category && filters.category !== 'all' && { category: filters.category }),
  }

  // Handle isActive filter separately to avoid type issues
  if (filters.isActive !== undefined && String(filters.isActive) !== 'all') {
    queryParams.isActive = String(filters.isActive) === 'true'
  }

  const { prizes, totalCount, isLoading, isFetching, refetch } = usePrizes(queryParams)
  const { toggleActive } = usePrizeMutations()

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1)
  }, [filters.search, filters.category, filters.isActive])

  // Handler for bulk actions
  const handleBulkAction = useCallback(
    async (actionId: string, rowIds: string[]) => {
      const selected = prizes.filter((p) => rowIds.includes(p.id))

      // Check if any selected prize is global
      const hasGlobalPrizes = selected.some((p) => !p.companyId)
      if (hasGlobalPrizes) {
        toast.error('Não é possível editar prêmios globais')
        return
      }

      if (actionId === 'bulk-activate') {
        try {
          await Promise.all(selected.map((p) => toggleActive.mutateAsync({ id: p.id, isActive: true })))
          toast.success(`${selected.length} prêmio(s) ativado(s) com sucesso`)
          refetch()
        } catch (error) {
          toast.error('Erro ao ativar prêmios')
        }
      } else if (actionId === 'bulk-deactivate') {
        try {
          await Promise.all(selected.map((p) => toggleActive.mutateAsync({ id: p.id, isActive: false })))
          toast.success(`${selected.length} prêmio(s) desativado(s) com sucesso`)
          refetch()
        } catch (error) {
          toast.error('Erro ao desativar prêmios')
        }
      }
    },
    [prizes, toggleActive, refetch]
  )

  // Handler for row actions
  const handleRowAction = useCallback(
    async (actionId: string, _row: unknown) => {
      const prize = _row as Prize

      // Check if prize is global and action requires editing
      if (!prize.companyId && (actionId === 'edit' || actionId === 'delete')) {
        toast.error('Não é possível editar ou deletar prêmios globais')
        return
      }

      switch (actionId) {
        case 'view':
          navigate({ to: '/prizes/$prizeId', params: { prizeId: prize.id } })
          break
        case 'edit':
          navigate({ to: '/prizes/$prizeId', params: { prizeId: prize.id } })
          break
        case 'delete':
          navigate({ to: '/prizes/$prizeId', params: { prizeId: prize.id } })
          break
        default:
          break
      }
    },
    [navigate]
  )

  // Inject customized table config with row action disabled for global prizes
  const customizedConfig = useMemo(() => {
    return {
      ...prizesTableConfig,
      actions: {
        ...prizesTableConfig.actions,
        row: prizesTableConfig.actions?.row?.map((action) => ({
          ...action,
          disabled: (row: unknown) => {
            const prize = row as Prize
            // Disable edit/delete for global prizes
            if ((action.id === 'edit' || action.id === 'delete') && !prize.companyId) {
              return true
            }
            return false
          },
        })),
      },
    }
  }, [])

  return (
    <PageLayout maxWidth="7xl">
      <div className="space-y-6">
        {/* Page Header */}
        <PageHeader
          icon="ph-gift"
          title="Prêmios"
          description="Gerencie o catálogo de prêmios disponíveis para resgate"
          right={
            <Button onClick={() => navigate({ to: '/prizes/new' })}>
              <i className="ph ph-plus mr-2" />
              Novo Prêmio
            </Button>
          }
        />

        {/* Data Table */}
        <DataTable
          config={customizedConfig as any}
          data={prizes}
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
            category: filters.category || '',
            isActive: filters.isActive || '',
          }}
          onFiltersChange={(newFilters: Record<string, unknown>) => {
            setFilters({
              search: String(newFilters.search || ''),
              category: newFilters.category ? String(newFilters.category) : undefined,
              isActive: newFilters.isActive !== undefined ? (String(newFilters.isActive) === 'true') : undefined,
            })
          }}
          onBulkAction={handleBulkAction}
          onRowAction={handleRowAction}
          getRowId={(row) => row.id}
        />
      </div>
    </PageLayout>
  )
}
