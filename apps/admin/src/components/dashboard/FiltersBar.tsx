import type { FC } from 'react'
import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { dashboardService } from '@/services/dashboard'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import type { DashboardFilters } from '@/types/dashboard'

interface Props {
  initialFilters?: DashboardFilters
  onApply: (filters?: DashboardFilters) => void
}

// Melhor UX para filtros:
// - Layout responsivo em grid
// - Inputs compactos com ícones (ph- classes já usadas no projeto)
// - Chips mostrando filtros aplicados e possibilidade de remover individualmente
// - Feedback de loading para selects
export const FiltersBar: FC<Props> = ({ initialFilters, onApply }) => {
  const [startDate, setStartDate] = useState<string | undefined>(() =>
    initialFilters?.startDate ? initialFilters.startDate.slice(0, 10) : undefined,
  )
  const [endDate, setEndDate] = useState<string | undefined>(() =>
    initialFilters?.endDate ? initialFilters.endDate.slice(0, 10) : undefined,
  )
  const [departmentId, setDepartmentId] = useState<string | undefined>(initialFilters?.departmentId)
  const [role, setRole] = useState<string | undefined>(initialFilters?.role)

  const { data: departments, isLoading: isLoadingDepartments } = useQuery({
    queryKey: ['dashboard', 'departments'],
    queryFn: () => dashboardService.getDepartments(),
  })

  const { data: roles, isLoading: isLoadingRoles } = useQuery({
    queryKey: ['dashboard', 'roles'],
    queryFn: () => dashboardService.getRoles(),
  })

  useEffect(() => {
    if (!initialFilters) return
    setStartDate(initialFilters.startDate ? initialFilters.startDate.slice(0, 10) : undefined)
    setEndDate(initialFilters.endDate ? initialFilters.endDate.slice(0, 10) : undefined)
    setDepartmentId(initialFilters.departmentId)
    setRole(initialFilters.role)
  }, [initialFilters])

  const applyFilters = () => {
    const filters: DashboardFilters = {}

    if (startDate) filters.startDate = new Date(startDate + 'T00:00:00').toISOString()
    if (endDate) filters.endDate = new Date(endDate + 'T23:59:59').toISOString()
    if (departmentId) filters.departmentId = departmentId
    if (role) filters.role = role

    onApply(filters)
  }

  const clearFilters = () => {
    setStartDate(undefined)
    setEndDate(undefined)
    setDepartmentId(undefined)
    setRole(undefined)
    onApply(undefined)
  }

  const removeFilter = (key: 'startDate' | 'endDate' | 'departmentId' | 'role') => {
    if (key === 'startDate') setStartDate(undefined)
    if (key === 'endDate') setEndDate(undefined)
    if (key === 'departmentId') setDepartmentId(undefined)
    if (key === 'role') setRole(undefined)
  }

  return (
    <div className="rounded-2xl border bg-card p-4">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-4 md:items-end">
        {/* Date range picker using shadcn Calendar in a Popover */}
        <div className="flex flex-col md:col-span-2">
          <label className="text-xs text-muted-foreground mb-1 flex items-center gap-2">
            <i className="ph ph-calendar text-base" />
            Período
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <button className="w-full rounded-md border px-3 py-2 bg-input text-sm text-left">
                {startDate && endDate ? (
                  <span>{`${startDate} → ${endDate}`}</span>
                ) : startDate ? (
                  <span>{startDate}</span>
                ) : (
                  <span className="text-muted-foreground">Selecionar período</span>
                )}
              </button>
            </PopoverTrigger>

            <PopoverContent side="bottom" align="start">
              <Calendar
                mode="range"
                selected={
                  startDate || endDate
                    ? { from: startDate ? new Date(startDate + 'T00:00:00') : undefined, to: endDate ? new Date(endDate + 'T23:59:59') : undefined }
                    : undefined
                }
                onSelect={(range: { from?: Date; to?: Date } | undefined) => {
                  // range is { from?: Date, to?: Date }
                  if (!range) {
                    setStartDate(undefined)
                    setEndDate(undefined)
                    return
                  }

                  if (range.from) setStartDate(range.from.toISOString().slice(0, 10))
                  else setStartDate(undefined)

                  if (range.to) setEndDate(range.to.toISOString().slice(0, 10))
                  else setEndDate(undefined)
                }}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Department select (shadcn) */}
        <div className="flex flex-col">
          <label className="text-xs text-muted-foreground mb-1 flex items-center gap-2">
            <i className="ph ph-buildings text-base" />
            Departamento
          </label>
          <Select
            onValueChange={(v) => setDepartmentId(v === 'all' ? undefined : v)}
            value={departmentId ?? 'all'}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {isLoadingDepartments ? (
                // disabled loading item
                <SelectItem value="__loading" disabled>
                  Carregando...
                </SelectItem>
              ) : (
                departments?.map((d) => (
                  <SelectItem key={d.id} value={d.id}>
                    {d.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Role select (shadcn) */}
        <div className="flex flex-col">
          <label className="text-xs text-muted-foreground mb-1 flex items-center gap-2">
            <i className="ph ph-user-list text-base" />
            Função
          </label>
          <Select onValueChange={(v) => setRole(v === 'all' ? undefined : v)} value={role ?? 'all'}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Todas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              {isLoadingRoles ? (
                <SelectItem value="__loading" disabled>
                  Carregando...
                </SelectItem>
              ) : (
                roles?.map((r) => (
                  <SelectItem key={r.id} value={r.id}>
                    {r.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Actions + Applied filters summary */}
      <div className="mt-3 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {/* Show chips for applied filters */}
          {startDate && (
            <button
              type="button"
              onClick={() => removeFilter('startDate')}
              className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-sm"
            >
              <i className="ph ph-calendar text-xs" />
              {startDate}
              <i className="ph ph-x text-xs ml-1" />
            </button>
          )}

          {endDate && (
            <button
              type="button"
              onClick={() => removeFilter('endDate')}
              className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-sm"
            >
              <i className="ph ph-calendar-check text-xs" />
              {endDate}
              <i className="ph ph-x text-xs ml-1" />
            </button>
          )}

          {departmentId && (
            <button
              type="button"
              onClick={() => removeFilter('departmentId')}
              className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-sm"
            >
              <i className="ph ph-buildings text-xs" />
              {departments?.find((d) => d.id === departmentId)?.name ?? departmentId}
              <i className="ph ph-x text-xs ml-1" />
            </button>
          )}

          {role && (
            <button
              type="button"
              onClick={() => removeFilter('role')}
              className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-sm"
            >
              <i className="ph ph-user-list text-xs" />
              {roles?.find((r) => r.id === role)?.name ?? role}
              <i className="ph ph-x text-xs ml-1" />
            </button>
          )}
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={clearFilters} className="inline-flex items-center gap-2">
            <i className="ph ph-trash" /> Limpar
          </Button>
          <Button onClick={applyFilters} className="inline-flex items-center gap-2">
            <i className="ph ph-faders" /> Aplicar
          </Button>
        </div>
      </div>
    </div>
  )
}
