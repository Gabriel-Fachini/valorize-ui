/**
 * Prizes Page
 * Main page for managing prizes catalog
 */

import { type FC, useState, useEffect, useCallback, useMemo } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { PageLayout } from '@/components/layout/PageLayout'
import { PageHeader } from '@/components/layout/PageHeader'
import { DataTable } from '@/components/ui/data-table'
import { prizesTableConfig } from '@/config/tables/prizes.table.config.tsx'
import { usePrizes } from '@/hooks/usePrizes'
import { usePrizeMutations } from '@/hooks/usePrizeMutations'
import { useDebounce } from '@/hooks/useDebounce'
import { toast } from 'sonner'
import type { Prize, PrizeFilters } from '@/types/prizes'

export const PrizesPage: FC = () => {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [filters, setFilters] = useState<PrizeFilters>({
    search: '',
    category: undefined,
    type: undefined,
    isActive: undefined,
    isGlobal: undefined,
  })

  // Debounce search to avoid excessive API calls
  const debouncedSearch = useDebounce(filters.search, 500)

  // Build query params
  const queryParams: PrizeFilters = {
    limit: pageSize,
    offset: (page - 1) * pageSize,
    orderBy: 'createdAt',
    order: 'desc',
    ...(debouncedSearch && { search: debouncedSearch }),
    ...(filters.category && filters.category !== 'all' && { category: filters.category }),
    ...(filters.type && filters.type !== 'all' && { type: filters.type }),
  }

  // Handle isActive filter
  if (filters.isActive !== undefined) {
    queryParams.isActive = filters.isActive
  }

  // Handle isGlobal filter
  if (filters.isGlobal !== undefined) {
    queryParams.isGlobal = filters.isGlobal
  }

  const { prizes, totalCount, isLoading, isFetching } = usePrizes(queryParams)
  const { toggleActive } = usePrizeMutations()

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1)
  }, [debouncedSearch, filters.category, filters.type, filters.isActive, filters.isGlobal])

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
        } catch (error) {
          toast.error('Erro ao ativar prêmios')
        }
      } else if (actionId === 'bulk-deactivate') {
        try {
          await Promise.all(selected.map((p) => toggleActive.mutateAsync({ id: p.id, isActive: false })))
          toast.success(`${selected.length} prêmio(s) desativado(s) com sucesso`)
        } catch (error) {
          toast.error('Erro ao desativar prêmios')
        }
      }
    },
    [prizes, toggleActive]
  )

  // Handler for row actions
  const handleRowAction = useCallback(
    async (actionId: string, _row: unknown) => {
      const prize = _row as Prize

      // Check if prize is global and action requires editing
      if (!prize.companyId && actionId === 'edit') {
        toast.error('Não é possível editar prêmios globais')
        return
      }

      switch (actionId) {
        case 'view':
          navigate({ to: '/prizes/$prizeId', params: { prizeId: prize.id } })
          break
        case 'edit':
          navigate({ to: '/prizes/$prizeId', params: { prizeId: prize.id } })
          break
        default:
          break
      }
    },
    [navigate]
  )

  // Check if there are active filters
  const hasActiveFilters = useMemo(() => {
    return !!(debouncedSearch || filters.category || filters.type || filters.isActive !== undefined || filters.isGlobal !== undefined)
  }, [debouncedSearch, filters.category, filters.type, filters.isActive, filters.isGlobal])

  // Clear all filters
  const handleClearFilters = useCallback(() => {
    setFilters({
      search: '',
      category: undefined,
      type: undefined,
      isActive: undefined,
      isGlobal: undefined,
    })
    setPage(1)
  }, [])

  // Inject customized table config with row action disabled for global prizes
  const customizedConfig = useMemo(() => {
    return {
      ...prizesTableConfig,
      columns: prizesTableConfig.columns.map((column) => {
        // Add onClick to image column
        if (column.id === 'image') {
          return {
            ...column,
            onClick: (prize: Prize) => {
              navigate({ to: '/prizes/$prizeId', params: { prizeId: prize.id } })
            },
          }
        }
        // Add onClick to name column
        if (column.id === 'name') {
          return {
            ...column,
            onClick: (prize: Prize) => {
              navigate({ to: '/prizes/$prizeId', params: { prizeId: prize.id } })
            },
          }
        }
        // Add switch renderer to status column
        if (column.id === 'isActive') {
          return {
            ...column,
            cell: (prize: Prize) => {
              const isGlobal = !prize.companyId
              return (
                <div className="flex items-center gap-2">
                  <Switch
                    checked={prize.isActive}
                    disabled={isGlobal}
                    onCheckedChange={(checked) => {
                      toggleActive.mutate({ id: prize.id, isActive: checked })
                    }}
                  />
                  <span className={`text-xs ${prize.isActive ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                    {prize.isActive ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
              )
            },
          }
        }
        return column
      }),
      actions: {
        ...prizesTableConfig.actions,
        row: prizesTableConfig.actions?.row?.map((action) => ({
          ...action,
          disabled: (row: unknown) => {
            const prize = row as Prize
            // Disable edit for global prizes
            if (action.id === 'edit' && !prize.companyId) {
              return true
            }
            return false
          },
        })),
        toolbar: hasActiveFilters ? (
          <Button variant="outline" size="sm" onClick={handleClearFilters}>
            <i className="ph ph-x mr-2" />
            Limpar Filtros
          </Button>
        ) : null,
      },
    }
  }, [navigate, hasActiveFilters, handleClearFilters, toggleActive])

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
            type: filters.type || '',
            isActive: filters.isActive !== undefined ? String(filters.isActive) : '',
            isGlobal: filters.isGlobal !== undefined ? String(filters.isGlobal) : '',
          }}
          onFiltersChange={(newFilters: Record<string, unknown>) => {
            setFilters({
              search: String(newFilters.search || ''),
              category: newFilters.category && String(newFilters.category) !== 'all' ? String(newFilters.category) : undefined,
              type: newFilters.type && String(newFilters.type) !== 'all' ? String(newFilters.type) : undefined,
              isActive: newFilters.isActive && String(newFilters.isActive) !== 'all' ? String(newFilters.isActive) === 'true' : undefined,
              isGlobal: newFilters.isGlobal && String(newFilters.isGlobal) !== 'all' ? String(newFilters.isGlobal) === 'true' : undefined,
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
