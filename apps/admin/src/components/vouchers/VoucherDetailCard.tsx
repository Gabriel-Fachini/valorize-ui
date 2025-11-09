/**
 * Voucher Detail Card Component
 * Displays detailed information about a voucher product and its linked prize
 */

import { type FC } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { VoucherProduct } from '@/types/vouchers'

interface VoucherDetailCardProps {
  voucher: VoucherProduct
}

export const VoucherDetailCard: FC<VoucherDetailCardProps> = ({ voucher }) => {
  const formatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: voucher.currency || 'BRL',
  })

  return (
    <div className="space-y-6">
      {/* Main Voucher Product Information */}
      <Card>
        <CardHeader>
          <CardTitle>Informações do Voucher</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Image */}
          {voucher.images && voucher.images.length > 0 && (
            <div className="flex justify-center">
              <img
                src={voucher.images[0]}
                alt={voucher.name}
                className="h-48 w-auto rounded-lg border object-contain"
              />
            </div>
          )}

          {/* Details Grid */}
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Nome</p>
              <p className="mt-1 font-medium">{voucher.name}</p>
            </div>

            {voucher.brand && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Marca</p>
                <p className="mt-1 font-medium">{voucher.brand}</p>
              </div>
            )}

            <div>
              <p className="text-sm font-medium text-muted-foreground">Categoria</p>
              <p className="mt-1 font-medium">{voucher.category}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">Provider</p>
              <p className="mt-1 font-medium capitalize">{voucher.provider}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">Moeda</p>
              <Badge variant="outline">{voucher.currency}</Badge>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">Países Disponíveis</p>
              <div className="mt-1 flex flex-wrap gap-1">
                {voucher.countries.map((country) => (
                  <Badge key={country} variant="outline">
                    {country}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">Valor Mínimo</p>
              <p className="mt-1 font-medium">{formatter.format(voucher.minValue)}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">Valor Máximo</p>
              <p className="mt-1 font-medium">{formatter.format(voucher.maxValue)}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">Status</p>
              <Badge variant={voucher.isActive ? 'default' : 'destructive'} className="mt-1">
                {voucher.isActive ? 'Ativo' : 'Inativo'}
              </Badge>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">Última Sincronização</p>
              <p className="mt-1 text-sm">
                {new Date(voucher.lastSyncAt).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>

          {/* Description */}
          {voucher.description && (
            <div>
              <p className="text-sm font-medium text-muted-foreground">Descrição</p>
              <p className="mt-1 text-sm leading-relaxed">{voucher.description}</p>
            </div>
          )}

          {/* IDs */}
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-muted-foreground">ID</p>
              <p className="mt-1 font-mono text-xs">{voucher.id}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">External ID (Provider)</p>
              <p className="mt-1 font-mono text-xs">{voucher.externalId}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
