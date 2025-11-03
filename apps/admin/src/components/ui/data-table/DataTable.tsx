/**
 * Data Table Component
 * Componente de tabela genérico e reutilizável baseado em configuração
 */

import { useState, useMemo } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
  type RowSelectionState,
  type ColumnDef,
} from '@tanstack/react-table'
import { animated, useTransition } from '@react-spring/web'
import { Checkbox } from '@/components/ui/checkbox'
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { DataTableToolbar } from './DataTableToolbar'
import { DataTableBulkActions } from './DataTableBulkActions'
import { DataTablePagination } from './DataTablePagination'
import { renderColumn } from './renderColumn'
import type { DataTableProps, ColumnConfig, ActionConfig } from '@/config/tables/types'

export function DataTable<T>({
  config,
  data,
  isLoading = false,
  isFetching = false,
  totalCount,
  pageCount,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
  filters = {},
  onFiltersChange = () => {},
  onRowAction = () => {},
  onBulkAction = async () => {},
  getRowId,
  dynamicFilterOptions,
}: DataTableProps<T>) {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

  // Construir colunas do TanStack Table a partir da config
  const columns = useMemo<ColumnDef<T>[]>(() => {
    const cols: ColumnDef<T>[] = []

    // Adicionar coluna de seleção se habilitado
    if (config.selectable) {
      cols.push({
        id: 'select',
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && 'indeterminate')
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Selecionar todos"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Selecionar linha"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      })
    }

    // Adicionar colunas configuradas
    config.columns.forEach((colConfig: ColumnConfig<T>) => {
      if (colConfig.type === 'selection') {
        return // Já adicionado acima
      }

      if (colConfig.type === 'actions') {
        // Coluna de ações
        cols.push({
          id: colConfig.id,
          header: String(colConfig.header),
          cell: ({ row }) => {
            const rowActions = config.actions?.row || []
            return (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Abrir menu</span>
                    <i className="ph ph-dots-three-vertical text-lg" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Ações</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {rowActions.map((action: ActionConfig, index: number) => {
                    // Verificar condição
                    if (action.condition && !action.condition(row.original)) {
                      return null
                    }

                    return (
                      <div key={action.id}>
                        {action.separator && index > 0 && <DropdownMenuSeparator />}
                        <DropdownMenuItem
                          onClick={() => onRowAction(action.id, row.original)}
                          className={action.variant === 'destructive' ? 'text-destructive' : ''}
                        >
                          {action.icon && <i className={`ph ${action.icon} mr-2`} />}
                          {action.label}
                        </DropdownMenuItem>
                      </div>
                    )
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            )
          },
          enableSorting: colConfig.enableSorting ?? false,
          enableHiding: colConfig.enableHiding ?? false,
        })
      } else if (colConfig.type === 'custom') {
        // Coluna customizada
        cols.push({
          id: colConfig.id,
          header: String(colConfig.header),
          cell: ({ row }) => colConfig.cell(row.original),
          enableSorting: colConfig.enableSorting ?? false,
          enableHiding: colConfig.enableHiding ?? false,
        })
      } else {
        // Colunas padrão
        cols.push({
          id: colConfig.id,
          header: String(colConfig.header),
          cell: ({ row }) => renderColumn(row.original, colConfig),
          enableSorting: colConfig.enableSorting ?? false,
          enableHiding: colConfig.enableHiding ?? false,
        })
      }
    })

    return cols
  }, [config, onRowAction])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onRowSelectionChange: setRowSelection,
    getRowId: (row) => getRowId(row),
    state: {
      rowSelection,
    },
    pageCount,
    manualPagination: true,
  })

  const selectedRows = table.getFilteredSelectedRowModel().rows
  const selectedRowIds = selectedRows.map((row) => getRowId(row.original))

  // Animações de entrada
  const transitions = useTransition(table.getRowModel().rows, {
    keys: (row) => getRowId(row.original),
    from: { opacity: 0, transform: 'translateY(-8px)' },
    enter: { opacity: 1, transform: 'translateY(0px)' },
    leave: { opacity: 0, transform: 'translateY(-8px)' },
    config: { tension: 220, friction: 20 },
  })

  // Loading state inicial
  if (isLoading && data.length === 0) {
    return (
      <div className="space-y-4">
        {config.filters && (
          <DataTableToolbar
            filters={config.filters}
            filterValues={filters}
            onFiltersChange={onFiltersChange}
            toolbarActions={config.actions?.toolbar}
            dynamicFilterOptions={dynamicFilterOptions}
          />
        )}
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
      {/* Toolbar de filtros */}
      {config.filters && (
        <DataTableToolbar
          filters={config.filters}
          filterValues={filters}
          onFiltersChange={onFiltersChange}
          toolbarActions={config.actions?.toolbar}
          dynamicFilterOptions={dynamicFilterOptions}
        />
      )}

      {/* Barra de ações em lote */}
      {selectedRows.length > 0 && config.actions?.bulk && (
        <DataTableBulkActions
          selectedCount={selectedRows.length}
          selectedRowIds={selectedRowIds}
          actions={config.actions.bulk}
          onBulkAction={onBulkAction}
          onClearSelection={() => setRowSelection({})}
        />
      )}

      {/* Tabela */}
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
            {isFetching && data.length > 0 ? (
              // Skeleton durante fetch (paginação)
              Array.from({ length: pageSize }).map((_, index) => (
                <TableRow key={`skeleton-${index}`} className="opacity-50">
                  {columns.map((_, cellIndex) => (
                    <TableCell key={cellIndex}>
                      <Skeleton className="h-6 w-full rounded" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              // Linhas reais ou empty state
              <>
                {config.animation !== false
                  ? // Com animação
                    transitions((style, row) => (
                      <animated.tr
                        key={getRowId(row.original)}
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
                    ))
                  : // Sem animação
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={getRowId(row.original)}
                        data-state={row.getIsSelected() && 'selected'}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}

                {data.length === 0 && !isLoading && (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        {config.emptyState?.icon && (
                          <i className={`ph ${config.emptyState.icon} text-4xl`} />
                        )}
                        <p className="font-medium">
                          {config.emptyState?.title || 'Nenhum resultado encontrado'}
                        </p>
                        {config.emptyState?.description && (
                          <p className="text-sm">{config.emptyState.description}</p>
                        )}
                        {config.emptyState?.action}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Paginação */}
      <DataTablePagination
        totalCount={totalCount}
        pageCount={pageCount}
        currentPage={currentPage}
        pageSize={pageSize}
        selectedCount={selectedRows.length}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
        config={config.pagination}
      />
    </div>
  )
}
