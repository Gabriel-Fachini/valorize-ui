/**
 * Redemption Detail Card Component
 * Displays comprehensive information about a redemption
 */

import { type FC } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RedemptionStatusBadge } from './RedemptionStatusBadge'
import type { Redemption } from '@/types/redemptions'

interface RedemptionDetailCardProps {
  redemption: Redemption
}

export const RedemptionDetailCard: FC<RedemptionDetailCardProps> = ({ redemption }) => {
  const coinsFormatter = new Intl.NumberFormat('pt-BR')
  const dateFormatter = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const typeLabel: Record<string, string> = {
    voucher: 'Voucher',
    product: 'Produto',
    physical: 'Físico',
  }

  // Extract user data from either direct fields or user object
  const userName = redemption.userName || redemption.user?.name || 'Usuário desconhecido'
  const userEmail = redemption.userEmail || redemption.user?.email || '-'
  const userAvatar = redemption.userAvatar || redemption.user?.avatar || ''

  // Extract prize data from either direct fields or prize object
  const prizeName = redemption.prizeName || redemption.prize?.name || 'Prêmio desconhecido'
  const prizeType = redemption.prizeType || redemption.prize?.type || 'desconhecido'

  return (
    <div className="space-y-6">
      {/* Main Information */}
      <Card>
        <CardHeader>
          <CardTitle>Informações do Resgate</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            {/* ID */}
            <div>
              <p className="text-sm font-medium text-muted-foreground">ID do Resgate</p>
              <p className="mt-1 font-mono text-sm">{redemption.id}</p>
            </div>

            {/* Status */}
            <div>
              <p className="text-sm font-medium text-muted-foreground">Status</p>
              <div className="mt-1">
                <RedemptionStatusBadge status={redemption.status} />
              </div>
            </div>

            {/* Type */}
            <div>
              <p className="text-sm font-medium text-muted-foreground">Tipo de Prêmio</p>
              <p className="mt-1">{typeLabel[String(prizeType).toLowerCase()] || prizeType}</p>
            </div>

            {/* Coins Spent */}
            <div>
              <p className="text-sm font-medium text-muted-foreground">Moedas Gastas</p>
              <div className="mt-1 flex items-center gap-2">
                <i className="ph ph-coin text-yellow-500" />
                <span className="font-medium">{coinsFormatter.format(redemption.coinsSpent)}</span>
              </div>
            </div>

            {/* Redeemed At */}
            {redemption.redeemedAt && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Data de Resgate</p>
                <p className="mt-1 text-sm">{dateFormatter(redemption.redeemedAt)}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* User Information */}
      {(userName || userEmail) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Informações do Usuário</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200">
                <img className='rounded-full' src={userAvatar} alt="User Avatar" />
              </div>
              <div>
                <p className="font-medium">{userName || 'Usuário'}</p>
                <p className="text-sm text-gray-600">{userEmail || '-'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Prize Information */}
      {(prizeName || redemption.prize) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Informações do Prêmio</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {/* Prize Name */}
              <div>
                <p className="text-sm font-medium text-muted-foreground">Nome do Prêmio</p>
                <p className="mt-1 font-medium">{prizeName}</p>
              </div>

              {/* Prize Type */}
              {prizeType && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Tipo de Prêmio</p>
                  <p className="mt-1">{typeLabel[String(prizeType).toLowerCase()] || prizeType}</p>
                </div>
              )}

              {/* Prize Description */}
              {redemption.prize?.description && (
                <div className="md:col-span-2">
                  <p className="text-sm font-medium text-muted-foreground">Descrição</p>
                  <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">{redemption.prize.description}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Voucher Information */}
      {redemption.voucherRedemption && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Informações do Voucher</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {redemption.voucherRedemption.status && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Status do Voucher</p>
                <p className="mt-1 capitalize text-sm">{redemption.voucherRedemption.status}</p>
              </div>
            )}

            {redemption.voucherRedemption.voucherCode && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Código do Voucher</p>
                <p className="mt-1 font-mono text-sm break-all">{redemption.voucherRedemption.voucherCode}</p>
              </div>
            )}

            {redemption.voucherRedemption.voucherLink && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Link do Voucher</p>
                <a
                  href={redemption.voucherRedemption.voucherLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 text-sm text-blue-600 hover:underline break-all"
                >
                  {redemption.voucherRedemption.voucherLink}
                </a>
              </div>
            )}

            {redemption.voucherRedemption.expiresAt && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Data de Expiração</p>
                <p className="mt-1 text-sm">{dateFormatter(redemption.voucherRedemption.expiresAt)}</p>
              </div>
            )}

            {redemption.voucherRedemption.completedAt && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Data de Conclusão</p>
                <p className="mt-1 text-sm">{dateFormatter(redemption.voucherRedemption.completedAt)}</p>
              </div>
            )}

            {redemption.voucherRedemption.redeemedAt && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Data de Resgate</p>
                <p className="mt-1 text-sm">{dateFormatter(redemption.voucherRedemption.redeemedAt)}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Tracking Information */}
      {(redemption.trackingCode || redemption.trackingCarrier) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Rastreamento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {redemption.trackingCode && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Código de Rastreamento</p>
                <p className="mt-1 font-mono text-sm">{redemption.trackingCode}</p>
              </div>
            )}

            {redemption.trackingCarrier && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Transportadora</p>
                <p className="mt-1 capitalize">{redemption.trackingCarrier}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Tracking History & Admin Notes */}
      {redemption.tracking && redemption.tracking.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Histórico de Rastreamento e Notas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {redemption.tracking.map((item) => (
                <div key={item.id} className="border-l-2 border-gray-300 pl-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-sm capitalize">
                        {item.status === 'admin_note' ? 'Nota do Admin' : item.status}
                      </p>
                      <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">{item.notes}</p>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <i className="ph ph-user" />
                      {item.createdBy}
                    </span>
                    <span className="flex items-center gap-1">
                      <i className="ph ph-calendar" />
                      {dateFormatter(item.createdAt)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default RedemptionDetailCard
