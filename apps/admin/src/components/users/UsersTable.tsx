import { type FC, useState, useMemo } from 'react'
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
import { createUserTableColumns } from './UserTableColumns'
import { UserTableToolbar } from './UserTableToolbar'
import { UserBulkActionsBar } from './UserBulkActionsBar'
import type { User, UserFilters } from '@/types/users'

interface UsersTableProps {
  users: User[]
  isLoading: boolean
  isFetching: boolean
  totalCount: number
  pageCount: number
  currentPage: number
  filters: UserFilters
  onFiltersChange: (filters: UserFilters) => void
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
  pageSize: number
  onEdit: (user: User) => void
  onDelete: (user: User) => void
  onBulkAction: (userIds: string[], action: string) => Promise<void>
  onImportCSV: () => void
}

export const UsersTable: FC<UsersTableProps> = ({
  users,
  isLoading,
  isFetching,
  totalCount,
  pageCount,
  currentPage,
  filters,
  onFiltersChange,
  onPageChange,
  onPageSizeChange,
  pageSize,
  onEdit,
  onDelete,
  onBulkAction,
  onImportCSV,
}) => {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

  const columns = useMemo(
    () => createUserTableColumns({ onEdit, onDelete }),
    [onEdit, onDelete],
  )

  const table = useReactTable({
    data: users,
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

  const selectedRows = table.getFilteredSelectedRowModel().rows
  const selectedUserIds = selectedRows.map((row) => row.original.id)

  // Transition animation for rows
  const transitions = useTransition(table.getRowModel().rows, {
    keys: (row) => row.original.id,
    from: { opacity: 0, transform: 'translateY(-8px)' },
    enter: { opacity: 1, transform: 'translateY(0px)' },
    leave: { opacity: 0, transform: 'translateY(-8px)' },
    config: { tension: 220, friction: 20 },
  })

  if (isLoading && users.length === 0) {
    return (
      <div className="space-y-4">
        <UserTableToolbar
          filters={filters}
          onFiltersChange={onFiltersChange}
          onImportCSV={onImportCSV}
          isLoading={isLoading}
        />
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((_, index) => (
                  <TableHead key={index}>
                    <Skeleton className="h-4 w-20" />
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  {columns.map((_, cellIndex) => (
                    <TableCell key={cellIndex}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <UserTableToolbar
        filters={filters}
        onFiltersChange={onFiltersChange}
        onImportCSV={onImportCSV}
        isLoading={isFetching}
      />

      {selectedRows.length > 0 && (
        <UserBulkActionsBar
          selectedCount={selectedRows.length}
          selectedUserIds={selectedUserIds}
          onBulkAction={onBulkAction}
          onClearSelection={() => setRowSelection({})}
        />
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {transitions((style, row) => (
              <animated.tr
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
                className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                style={style}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </animated.tr>
            ))}
            {users.length === 0 && !isLoading && (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <i className="ph ph-users text-4xl" />
                    <p>Nenhum usuário encontrado</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {selectedRows.length > 0 ? (
            <span>
              {selectedRows.length} de {totalCount} linha(s) selecionada(s)
            </span>
          ) : (
            <span>
              Mostrando {Math.min((currentPage - 1) * pageSize + 1, totalCount)} a{' '}
              {Math.min(currentPage * pageSize, totalCount)} de {totalCount} resultado(s)
            </span>
          )}
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Linhas por página:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="h-9 rounded-md border px-3 text-sm"
            >
              {[20, 50, 100].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Página {currentPage} de {pageCount}
            </span>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(1)}
                disabled={currentPage === 1}
              >
                <i className="ph ph-caret-double-left" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <i className="ph ph-caret-left" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage >= pageCount}
              >
                <i className="ph ph-caret-right" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(pageCount)}
                disabled={currentPage >= pageCount}
              >
                <i className="ph ph-caret-double-right" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
