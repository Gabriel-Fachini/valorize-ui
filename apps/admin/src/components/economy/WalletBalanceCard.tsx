/**
 * Wallet Balance Card Component
 * Prominent card displaying current wallet balance
 */

import type { FC } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { StatusBadge } from './StatusBadge'
import type { WalletBalance } from '@/types/economy'

interface WalletBalanceCardProps {
  data: WalletBalance | undefined
  isLoading?: boolean
}

/**
 * WalletBalanceCard - Main prominent card showing wallet balance
 *
 * Features:
 * - Large balance display
 * - Progress bar showing percentage of ideal
 * - Breakdown: Total Loaded | Total Spent
 * - Contextual action button
 * - Status badge
 */
export const WalletBalanceCard: FC<WalletBalanceCardProps> = ({ data, isLoading = false }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  if (isLoading) {
    return (
      <Card className="border-2 mb-6">
        <CardHeader>
          <div className="space-y-3">
            <div className="h-6 w-40 bg-muted animate-pulse rounded" />
            <div className="h-10 w-32 bg-muted animate-pulse rounded" />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="h-3 w-full bg-muted animate-pulse rounded" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-3 w-20 bg-muted/60 animate-pulse rounded" />
                <div className="h-6 w-24 bg-muted animate-pulse rounded" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!data) {
    return null
  }

  // Determine button state based on runway
  const getButtonConfig = (percentageOfIdeal: number) => {
    if (percentageOfIdeal < 33) {
      return {
        label: 'Carregar Saldo Agora',
        variant: 'destructive' as const,
        disabled: true,
      }
    } else if (percentageOfIdeal < 75) {
      return {
        label: 'Considerar Novo Aporte',
        variant: 'outline' as const,
        disabled: true,
      }
    }
    return null
  }

  const buttonConfig = getButtonConfig(data.percentage_of_ideal)

  return (
    <Card className="border-2 mb-6" role="region" aria-labelledby="wallet-title">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-3 flex-1">
            <div className="flex items-center gap-2">
              <i className="ph ph-wallet text-lg text-muted-foreground" aria-hidden="true" />
              <CardTitle className="text-lg" id="wallet-title">Saldo da Carteira</CardTitle>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button 
                      className="text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded p-1"
                      aria-label="Informações sobre saldo da carteira"
                      type="button"
                    >
                      <i className="ph ph-info text-base" aria-hidden="true" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-md">
                    <p className="text-base font-medium mb-2">💰 Saldo pré-pago disponível para pagamento de prêmios</p>
                    <div className="text-sm text-muted-foreground space-y-2 mt-2 pt-2 border-t">
                      <p className="font-medium">📊 Como funciona:</p>
                      <ul className="list-disc list-inside space-y-1 ml-2">
                        <li>Você deposita via PIX/Boleto (modelo pré-pago)</li>
                        <li>Colaboradores resgatam prêmios usando moedas</li>
                        <li>Sistema deduz o custo do prêmio deste saldo automaticamente</li>
                      </ul>
                      <p className="font-medium mt-2">🔒 Segurança:</p>
                      <p>Este saldo está em custódia (legalmente é seu, não da Valorize). Em caso de rescisão, o valor é estornado integralmente.</p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-primary" aria-live="polite">
                {formatCurrency(data.available_balance)}
              </span>
              <span className="text-sm text-muted-foreground">Saldo Disponível</span>
            </div>
          </div>
          <StatusBadge status={data.status} />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progress Bar */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="space-y-2">
                {/* Calculate progress as percentage of available to total loaded */}
                {(() => {
                  const progressPercentage = data.total_loaded > 0 
                    ? (data.available_balance / data.total_loaded) * 100 
                    : 0
                  return (
                    <>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Saúde do Fundo</span>
                        <span>{Math.min(progressPercentage, 100).toFixed(1)}%</span>
                      </div>
                      <Progress value={Math.min(progressPercentage, 100)} className="h-2" />
                    </>
                  )
                })()}
              </div>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p className="text-base font-medium mb-2">Percentual do saldo disponível em relação ao total carregado</p>
              <div className="text-sm text-muted-foreground space-y-1 mt-2 pt-2 border-t">
                <p>🟢 {'>'} 75%: Saudável - não requer ação</p>
                <p>🟡 33-75%: Monitorar - avaliar novo aporte</p>
                <p>🔴 {'<'} 33%: Crítico - carregar saldo urgentemente</p>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Total Carregado</p>
            <p className="text-lg font-semibold">{formatCurrency(data.total_loaded)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Já Gasto</p>
            <p className="text-lg font-semibold text-destructive">-{formatCurrency(data.total_spent)}</p>
          </div>
        </div>

        {/* Action Button */}
        {buttonConfig && (
          <Button
            variant={buttonConfig.variant}
            disabled={buttonConfig.disabled}
            className="w-full"
            onClick={() => {
              alert('Esta funcionalidade será implementada em breve!')
            }}
          >
            {buttonConfig.label}
          </Button>
        )}

        {/* Load Balance Button */}
        <Button
          variant="default"
          className="w-full"
          onClick={() => {
            alert('Esta funcionalidade ainda não foi implementada!')
          }}
        >
          <i className="ph ph-plus text-lg mr-2" />
          Carregar Saldo
        </Button>
      </CardContent>
    </Card>
  )
}
