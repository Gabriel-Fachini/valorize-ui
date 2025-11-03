import { type FC, useState, useMemo, useCallback } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  type RowSelectionState,
  flexRender,
} from '@tanstack/react-table'
import { animated, useTransition } from '@react-spring/web'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { SkeletonBase as Skeleton } from '@/components/ui/Skeleton'
import { createRoleTableColumns } from './RoleTableColumns'
import type { RoleWithCounts, RolesFilters } from '@/types/roles'

interface RolesTableProps {
  roles: RoleWithCounts[]
  isLoading: boolean
  isFetching: boolean
  totalCount: number
  pageCount: number
  currentPage: number
  filters: RolesFilters
  onFiltersChange: (filters: RolesFilters) => void
  onPageChange: (page: number) => void
  pageSize: number
  onEdit: (role: RoleWithCounts) => void
  onDelete: (role: RoleWithCounts) => void
  onViewDetails: (role: RoleWithCounts) => void
  userPermissions?: string[]
}

export const RolesTable: FC<RolesTableProps> = ({
  roles,
  isLoading,
  isFetching,
  totalCount,
  pageCount,
  currentPage,
  filters,
  onFiltersChange,
  onPageChange,
  pageSize,
  onEdit,
  onDelete,
  onViewDetails,
  userPermissions,
}) => {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

  const handleSort = useCallback(
    (sortBy: RolesFilters['sortBy'], sortOrder: 'asc' | 'desc') => {
      onFiltersChange({ ...filters, sortBy, sortOrder })
    },
    [filters, onFiltersChange],
  )

  const columns = useMemo(
    () =>
      createRoleTableColumns({
        onEdit,
        onDelete,
        onViewDetails,
        currentSort: { sortBy: filters.sortBy, sortOrder: filters.sortOrder },
        onSort: handleSort,
        userPermissions,
      }),
    [onEdit, onDelete, onViewDetails, filters.sortBy, filters.sortOrder, handleSort, userPermissions],
  )

  const table = useReactTable({
    data: roles,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      rowSelection,
    },
    pageCount,
    manualPagination: true,
  })

  // Transition animation for rows
  const transitions = useTransition(table.getRowModel().rows, {
    keys: (row) => row.original.id,
    from: { opacity: 0, transform: 'translateY(-8px)' },
    enter: { opacity: 1, transform: 'translateY(0px)' },
    leave: { opacity: 0, transform: 'translateY(-8px)' },
    config: { tension: 220, friction: 20 },
  })

  if (isLoading && roles.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex gap-2">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-24" />
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Buscar roles..."
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
            value={filters.search}
            onChange={(e) => onFiltersChange({ search: e.target.value })}
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          disabled={isFetching}
        >
          {isFetching ? 'Atualizando...' : 'Atualizar'}
        </Button>
      </div>

      <div className="rounded border border-gray-200">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="font-semibold">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {transitions((style, row) => (
              <animated.tr
                key={row.id}
                style={style}
                className="border-t border-gray-200 hover:bg-gray-50"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="py-3">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </animated.tr>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          {roles.length === 0
            ? 'Nenhum role encontrado'
            : `Mostrando ${(currentPage - 1) * pageSize + 1} a ${Math.min(
                currentPage * pageSize,
                totalCount,
              )} de ${totalCount} roles`}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            Anterior
          </Button>

          <div className="flex items-center gap-1">
            {Array.from({ length: pageCount }).map((_, i) => {
              const pageNum = i + 1
              return (
                <Button
                  key={pageNum}
                  variant={pageNum === currentPage ? 'default' : 'outline'}
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => onPageChange(pageNum)}
                >
                  {pageNum}
                </Button>
              )
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(Math.min(pageCount, currentPage + 1))}
            disabled={currentPage === pageCount}
          >
            Próxima
          </Button>
        </div>
      </div>
    </div>
  )
}
