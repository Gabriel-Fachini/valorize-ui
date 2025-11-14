/**
 * Department Analytics Chart
 * Displays department-level analytics with table and flow visualization
 */

import type { FC } from 'react'
import { animated, useSpring } from '@react-spring/web'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import type { DepartmentAnalytics } from '@/types/compliments'

interface DepartmentAnalyticsChartProps {
  data?: DepartmentAnalytics
  isLoading?: boolean
}

const TableSkeleton: FC = () => {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <div className="h-4 w-32 bg-muted animate-pulse rounded" />
          <div className="h-4 w-16 bg-muted animate-pulse rounded" />
          <div className="h-4 w-16 bg-muted animate-pulse rounded" />
          <div className="h-4 w-20 bg-muted animate-pulse rounded" />
          <div className="h-4 w-24 bg-muted animate-pulse rounded" />
        </div>
      ))}
    </div>
  )
}

export const DepartmentAnalyticsChart: FC<DepartmentAnalyticsChartProps> = ({
  data,
  isLoading = false,
}) => {
  const cardAnimation = useSpring({
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0px)' },
    delay: 400,
  })

  const sortedDepartments = data?.departments
    ? [...data.departments].sort((a, b) => b.totalCompliments - a.totalCompliments)
    : []

  const maxCompliments = sortedDepartments[0]?.totalCompliments || 1

  return (
    <animated.div
      style={cardAnimation as any}
      className="rounded-3xl border bg-card p-6 shadow-sm"
    >
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">Análise Departamental</h3>
          <TooltipProvider>
            <Tooltip delayDuration={200}>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className="inline-flex items-center justify-center hover:text-foreground transition-colors"
                >
                  <i className="ph ph-info text-xl text-muted-foreground/70 hover:text-muted-foreground" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs" side="right" align="start">
                <p className="text-sm">
                  Análise de engajamento e reconhecimento por departamento. Mostra a atividade e
                  valores mais reconhecidos em cada área.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <p className="text-sm text-muted-foreground">Engajamento e atividade por área</p>
      </div>

      {isLoading ? (
        <TableSkeleton />
      ) : sortedDepartments.length > 0 ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Departamento</TableHead>
                <TableHead className="text-center">Usuários</TableHead>
                <TableHead className="text-center">Ativos</TableHead>
                <TableHead className="text-center">Elogios</TableHead>
                <TableHead className="text-center">Taxa</TableHead>
                <TableHead>Valor Top</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedDepartments.map((dept, index) => {
                const activePercentage = dept.totalUsers > 0
                  ? ((dept.activeUsers / dept.totalUsers) * 100).toFixed(0)
                  : '0'

                return (
                  <TableRow key={dept.departmentId}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {index < 3 && (
                          <span className="text-lg">
                            {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                          </span>
                        )}
                        <span className="truncate max-w-[150px]">{dept.departmentName}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline">{dept.totalUsers}</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="space-y-1">
                        <Badge variant="secondary">{dept.activeUsers}</Badge>
                        <p className="text-xs text-muted-foreground">{activePercentage}%</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="space-y-2">
                        <span className="font-semibold">{dept.totalCompliments}</span>
                        <Progress
                          value={(dept.totalCompliments / maxCompliments) * 100}
                          className="h-1.5"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant={
                          typeof dept.engagementRate === 'number' && dept.engagementRate >= 5
                            ? 'default'
                            : 'secondary'
                        }
                      >
                        {typeof dept.engagementRate === 'number'
                          ? dept.engagementRate.toFixed(1)
                          : '0'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {dept.topValue ? (
                        <div className="flex items-center gap-1">
                          <span className="text-sm truncate max-w-[100px]">{dept.topValue.valueName}</span>
                          <span className="text-xs text-muted-foreground">
                            ({dept.topValue.count})
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">-</span>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="flex items-center justify-center h-60 text-muted-foreground">
          <p>Nenhum dado disponível</p>
        </div>
      )}

      {/* Department Flow Summary */}
      {data?.crossDepartmentFlow && data.crossDepartmentFlow.length > 0 && (
        <div className="mt-6 p-4 bg-muted/30 rounded-lg">
          <h4 className="text-sm font-semibold mb-3">Principais Fluxos de Reconhecimento</h4>
          <div className="space-y-2">
            {data.crossDepartmentFlow
              .sort((a, b) => b.complimentCount - a.complimentCount)
              .slice(0, 5)
              .map((flow, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground truncate max-w-[120px]">
                    {flow.fromDepartmentName}
                  </span>
                  <i className="ph ph-arrow-right text-primary flex-shrink-0" />
                  <span className="text-muted-foreground truncate max-w-[120px]">
                    {flow.toDepartmentName}
                  </span>
                  <Badge variant="outline" className="ml-auto">
                    {flow.complimentCount}
                  </Badge>
                </div>
              ))}
          </div>
        </div>
      )}
    </animated.div>
  )
}
