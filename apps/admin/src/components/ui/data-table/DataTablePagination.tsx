/**
 * Data Table Pagination
 * Footer de paginação com controles de navegação
 */

import type { FC } from 'react'
import { Button } from '@/components/ui/button'
import type { PaginationConfig } from '@/config/tables/types'

interface DataTablePaginationProps {
  totalCount: number
  pageCount: number
  currentPage: number
  pageSize: number
  selectedCount?: number
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
  config?: PaginationConfig
}

export const DataTablePagination: FC<DataTablePaginationProps> = ({
  totalCount,
  pageCount,
  currentPage,
  pageSize,
  selectedCount = 0,
  onPageChange,
  onPageSizeChange,
  config,
}) => {
  const showPageInfo = config?.showPageInfo ?? true
  const showPageSizeSelector = config?.showPageSizeSelector ?? true
  const pageSizeOptions = config?.pageSizeOptions || [20, 50, 100]

  return (
    <div className="flex items-center justify-between">
      {/* Info de seleção/resultados */}
      <div className="text-sm text-muted-foreground">
        {selectedCount > 0 ? (
          <span>
            {selectedCount} de {totalCount} linha(s) selecionada(s)
          </span>
        ) : (
          <span>
            Mostrando {Math.min((currentPage - 1) * pageSize + 1, totalCount)} a{' '}
            {Math.min(currentPage * pageSize, totalCount)} de {totalCount} resultado(s)
          </span>
        )}
      </div>

      {/* Controles de paginação */}
      <div className="flex items-center gap-6">
        {/* Selector de linhas por página */}
        {showPageSizeSelector && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Linhas por página:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="h-9 rounded-md border px-3 text-sm"
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Info da página atual */}
        {showPageInfo && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Página {currentPage} de {pageCount}
            </span>

            {/* Botões de navegação */}
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(1)}
                disabled={currentPage === 1}
                aria-label="Primeira página"
              >
                <i className="ph ph-caret-double-left" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label="Página anterior"
              >
                <i className="ph ph-caret-left" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage >= pageCount}
                aria-label="Próxima página"
              >
                <i className="ph ph-caret-right" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(pageCount)}
                disabled={currentPage >= pageCount}
                aria-label="Última página"
              >
                <i className="ph ph-caret-double-right" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
