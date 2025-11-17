import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import type { MetricsQueryParams } from '@/types/company'

interface MetricsPeriodFilterProps {
  onFilterChange: (filters: MetricsQueryParams | undefined) => void
  currentFilters?: MetricsQueryParams
}

export function MetricsPeriodFilter({ onFilterChange, currentFilters }: MetricsPeriodFilterProps) {
  const [startDate, setStartDate] = useState<string>(currentFilters?.startDate || '')
  const [endDate, setEndDate] = useState<string>(currentFilters?.endDate || '')
  const [isExpanded, setIsExpanded] = useState(false)

  const handleApplyFilters = () => {
    if (startDate || endDate) {
      onFilterChange({
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      })
    } else {
      onFilterChange(undefined)
    }
  }

  const handleClearFilters = () => {
    setStartDate('')
    setEndDate('')
    onFilterChange(undefined)
  }

  const handlePresetClick = (days: number) => {
    const end = new Date()
    const start = new Date()
    start.setDate(start.getDate() - days)

    const startDateStr = start.toISOString()
    const endDateStr = end.toISOString()

    setStartDate(startDateStr.split('T')[0])
    setEndDate(endDateStr.split('T')[0])

    onFilterChange({
      startDate: startDateStr,
      endDate: endDateStr,
    })
  }

  const hasActiveFilters = !!currentFilters?.startDate || !!currentFilters?.endDate

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <i className="ph ph-funnel text-muted-foreground" style={{ fontSize: '1.25rem' }} />
              <span className="text-sm font-medium">Filtros de Período</span>
              {hasActiveFilters && (
                <span className="ml-2 rounded-full bg-blue-100 dark:bg-blue-900/50 px-2 py-0.5 text-xs font-medium text-blue-700 dark:text-blue-400">
                  Ativo
                </span>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <i
                className={`ph ${isExpanded ? 'ph-caret-up' : 'ph-caret-down'}`}
                style={{ fontSize: '1rem' }}
              />
            </Button>
          </div>

          {/* Expanded Content */}
          {isExpanded && (
            <div className="space-y-4 pt-2">
              {/* Quick Presets */}
              <div>
                <Label className="text-xs text-muted-foreground mb-2 block">Atalhos Rápidos</Label>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePresetClick(7)}
                  >
                    Últimos 7 dias
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePresetClick(30)}
                  >
                    Últimos 30 dias
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePresetClick(90)}
                  >
                    Último trimestre
                  </Button>
                </div>
              </div>

              {/* Date Inputs */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="startDate" className="text-sm">
                    Data Inicial
                  </Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    max={endDate || undefined}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate" className="text-sm">
                    Data Final
                  </Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={startDate || undefined}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2">
                <Button onClick={handleApplyFilters} size="sm">
                  <i className="ph ph-check mr-2" style={{ fontSize: '0.875rem' }} />
                  Aplicar Filtros
                </Button>
                <Button
                  variant="outline"
                  onClick={handleClearFilters}
                  size="sm"
                  disabled={!hasActiveFilters}
                >
                  <i className="ph ph-x mr-2" style={{ fontSize: '0.875rem' }} />
                  Limpar
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
