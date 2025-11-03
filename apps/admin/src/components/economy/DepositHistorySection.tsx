/**
 * Deposit History Section Component
 * Shows paginated history of wallet deposits
 */

import type { FC } from 'react'
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useWalletHistory } from '@/hooks/useEconomy'

interface DepositHistorySectionProps {
  limit?: number
  className?: string
}

/**
 * DepositHistorySection - Displays paginated deposit history
 *
 * Features:
 * - Paginated table with "Load more" button
 * - Date formatting in pt-BR
 * - Status badges with semantic colors
 * - Loading skeleton
 * - Empty state
 */
export const DepositHistorySection: FC<DepositHistorySectionProps> = ({
  limit = 10,
  className = '',
}) => {
  const [currentLimit, setCurrentLimit] = useState(limit)
  const { data, isLoading } = useWalletHistory(currentLimit)

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            ✓ Completo
          </Badge>
        )
      case 'pending':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
            ⏳ Pendente
          </Badge>
        )
      case 'failed':
        return (
          <Badge variant="destructive" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
            ✕ Falho
          </Badge>
        )
      default:
        return null
    }
  }

  const handleLoadMore = () => {
    setCurrentLimit((prev) => prev + 10)
  }

  if (isLoading && !data) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Histórico de Aportes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-10 bg-muted animate-pulse rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  const deposits = data?.deposits ?? []

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Histórico de Aportes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {deposits.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-muted-foreground">Nenhum aporte realizado ainda</p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Método</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Saldo Resultante</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {deposits.map((deposit) => (
                    <TableRow key={deposit.id}>
                      <TableCell className="text-sm">
                        {formatDate(deposit.deposited_at)}
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(deposit.amount)}
                      </TableCell>
                      <TableCell className="text-sm capitalize">{deposit.payment_method}</TableCell>
                      <TableCell>{getStatusBadge(deposit.status)}</TableCell>
                      <TableCell className="text-right font-medium">
                        {deposit.resulting_balance !== null
                          ? formatCurrency(deposit.resulting_balance)
                          : '—'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-3">
              {deposits.map((deposit) => (
                <div
                  key={deposit.id}
                  className="rounded-lg border p-3 space-y-2 text-sm"
                >
                  <div className="flex justify-between items-start">
                    <span className="font-medium">{formatCurrency(deposit.amount)}</span>
                    {getStatusBadge(deposit.status)}
                  </div>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>{formatDate(deposit.deposited_at)}</p>
                    <p>Método: {deposit.payment_method}</p>
                    {deposit.resulting_balance !== null && (
                      <p>Saldo: {formatCurrency(deposit.resulting_balance)}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Load More Button */}
            {(data?.total ?? 0) > deposits.length && (
              <Button
                variant="outline"
                onClick={handleLoadMore}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? 'Carregando...' : 'Carregar Mais'}
              </Button>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
