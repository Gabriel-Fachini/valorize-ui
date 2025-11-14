import type { FC } from 'react'
import { useState, useEffect } from 'react'
import { Calendar } from '@/components/ui/calendar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import type { ComplimentsDashboardFilters } from '@/types/compliments'
import { useDepartments, useJobTitles, useJobTitlesByDepartment } from '@/hooks/useFilters'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { animated, useSpring } from '@react-spring/web'

interface ComplimentsFiltersProps {
  filters: ComplimentsDashboardFilters
  onFiltersChange: (filters: ComplimentsDashboardFilters) => void
}

export const ComplimentsFilters: FC<ComplimentsFiltersProps> = ({
  filters,
  onFiltersChange,
}) => {
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined
    to: Date | undefined
  }>({
    from: filters.startDate ? new Date(filters.startDate) : undefined,
    to: filters.endDate ? new Date(filters.endDate) : undefined,
  })

  const { data: departments, isLoading: isLoadingDepartments } = useDepartments()
  const { data: allJobTitles, isLoading: isLoadingAllJobTitles } = useJobTitles()
  const { data: filteredJobTitles, isLoading: isLoadingFilteredJobTitles } = useJobTitlesByDepartment(
    filters.departmentId || undefined
  )

  // Use filtered job titles if department is selected, otherwise use all
  const jobTitles = filters.departmentId ? filteredJobTitles : allJobTitles
  const isLoadingJobTitles = filters.departmentId ? isLoadingFilteredJobTitles : isLoadingAllJobTitles

  const filtersAnimation = useSpring({
    from: { opacity: 0, transform: 'translateY(-20px)' },
    to: { opacity: 1, transform: 'translateY(0px)' },
    delay: 200,
  })

  const handleDateSelect = (range: { from: Date | undefined; to: Date | undefined }) => {
    setDateRange(range)
    onFiltersChange({
      ...filters,
      startDate: range.from ? format(range.from, 'yyyy-MM-dd') : undefined,
      endDate: range.to ? format(range.to, 'yyyy-MM-dd') : undefined,
    })
  }

  const handleDepartmentChange = (departmentId: string) => {
    const newDepartmentId = departmentId === 'all' ? undefined : departmentId

    // Clear jobTitle filter when department changes
    onFiltersChange({
      ...filters,
      departmentId: newDepartmentId,
      jobTitleId: newDepartmentId ? undefined : filters.jobTitleId,
    })
  }

  // Clear jobTitle filter when department changes if the selected jobTitle is not in the filtered list
  useEffect(() => {
    if (filters.departmentId && filters.jobTitleId && filteredJobTitles) {
      const isJobTitleAvailable = filteredJobTitles.some(jt => jt.id === filters.jobTitleId)
      if (!isJobTitleAvailable) {
        onFiltersChange({
          ...filters,
          jobTitleId: undefined,
        })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.departmentId, filteredJobTitles])

  const handleJobTitleChange = (jobTitleId: string) => {
    onFiltersChange({
      ...filters,
      jobTitleId: jobTitleId === 'all' ? undefined : jobTitleId,
    })
  }

  const handleClearFilters = () => {
    setDateRange({ from: undefined, to: undefined })
    onFiltersChange({})
  }

  const formatDateRange = () => {
    if (!dateRange.from) return 'Selecionar período'
    if (!dateRange.to) return format(dateRange.from, 'dd/MM/yyyy', { locale: ptBR })
    return `${format(dateRange.from, 'dd/MM/yyyy', { locale: ptBR })} - ${format(dateRange.to, 'dd/MM/yyyy', { locale: ptBR })}`
  }

  const hasActiveFilters =
    filters.startDate || filters.endDate || filters.departmentId || filters.jobTitleId

  return (
    <animated.div
      style={filtersAnimation}
      className="flex flex-wrap w-fit items-center gap-3 rounded-lg border bg-card p-4"
    >
      {/* Date Range Filter */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-[280px] justify-start text-left font-normal"
          >
            <i className="ph ph-calendar mr-2 h-4 w-4" />
            {formatDateRange()}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-4" align="start">
          <Calendar
            mode="range"
            selected={{ from: dateRange.from, to: dateRange.to }}
            onSelect={(range) =>
              handleDateSelect({
                from: range?.from,
                to: range?.to,
              })
            }
            numberOfMonths={2}
            locale={ptBR}
            showOutsideDays={false}
            className="[--cell-size:2.75rem]"
            classNames={{
              day: "h-11 w-11 p-0 font-normal aria-selected:opacity-100",
              day_range_start: "bg-primary text-primary-foreground rounded-md",
              day_range_end: "bg-primary text-primary-foreground rounded-md",
              day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground rounded-md",
              day_range_middle: "bg-primary/20 text-foreground rounded-none aria-selected:bg-primary/20 aria-selected:text-foreground",
              day_today: "bg-accent text-accent-foreground font-semibold",
            }}
          />
        </PopoverContent>
      </Popover>

      {/* Department Filter */}
      <Select
        value={filters.departmentId ?? 'all'}
        onValueChange={handleDepartmentChange}
        disabled={isLoadingDepartments}
      >
        <SelectTrigger className="w-[200px]">
          <i className="ph ph-buildings mr-2 h-4 w-4" />
          <SelectValue placeholder="Departamento" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos departamentos</SelectItem>
          {departments?.map((dept) => (
            <SelectItem key={dept.id} value={dept.id}>
              {dept.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Job Title Filter */}
      <Select
        value={filters.jobTitleId ?? 'all'}
        onValueChange={handleJobTitleChange}
        disabled={isLoadingJobTitles}
      >
        <SelectTrigger className="w-[200px]">
          <i className="ph ph-user-circle mr-2 h-4 w-4" />
          <SelectValue placeholder="Cargo" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os cargos</SelectItem>
          {jobTitles?.map((jobTitle) => (
            <SelectItem key={jobTitle.id} value={jobTitle.id}>
              {jobTitle.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClearFilters}
          className="ml-auto"
        >
          <i className="ph ph-x mr-2 h-4 w-4" />
          Limpar filtros
        </Button>
      )}
    </animated.div>
  )
}
