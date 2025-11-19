/**
 * Voucher Detail Page
 * Detailed view of a voucher product with edit and toggle status functionality
 */

import { useState } from 'react'
import { useParams, useNavigate } from '@tanstack/react-router'
import { PageLayout } from '@/components/layout/PageLayout'
import { Button } from '@/components/ui/button'
import { BackButton } from '@/components/ui/BackButton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/Skeleton'
import { Badge } from '@/components/ui/badge'
import { EditVoucherDialog } from '@/components/vouchers/EditVoucherDialog'
import { ToggleVoucherStatusDialog } from '@/components/vouchers/ToggleVoucherStatusDialog'
import { useVoucher } from '@/hooks/useVouchers'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export function VoucherDetailPage() {
  const { id } = useParams({ from: '/vouchers/$id' })
  const navigate = useNavigate()
  const { voucher, isLoading, error } = useVoucher(id)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [toggleStatusDialogOpen, setToggleStatusDialogOpen] = useState(false)

  if (isLoading) {
    return (
      <PageLayout>
        <div className="space-y-6">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </PageLayout>
    )
  }

  if (error || !voucher) {
    return (
      <PageLayout>
        <div className="flex flex-col items-center justify-center py-12">
          <i className="ph ph-ticket text-6xl text-muted-foreground" />
          <h2 className="mt-4 text-2xl font-bold">Voucher não encontrado</h2>
          <p className="mt-2 text-muted-foreground">
            O voucher que você está procurando não existe ou foi removido.
          </p>
          <Button onClick={() => navigate({ to: '/vouchers' })} className="mt-6">
            <i className="ph ph-arrow-left mr-2" style={{ fontSize: '1rem' }} />
            Voltar para lista
          </Button>
        </div>
      </PageLayout>
    )
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: voucher.currency || 'BRL',
    }).format(value)
  }

  const formatDate = (date: string) => {
    return formatDistanceToNow(new Date(date), {
      addSuffix: true,
      locale: ptBR,
    })
  }

  return (
    <PageLayout>
      <div className="space-y-6">
        {/* Back Button */}
        <div>
          <BackButton to="/vouchers" />
        </div>

        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-3xl font-bold tracking-tight">{voucher.name}</h1>
            <div className="mt-2 flex items-center gap-2">
              <Badge variant={voucher.isActive ? 'default' : 'destructive'}>
                {voucher.isActive ? 'Ativo' : 'Inativo'}
              </Badge>
              <span className="text-muted-foreground">•</span>
              <span className="text-sm text-muted-foreground">{voucher.category}</span>
              {voucher.brand && (
                <>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-sm text-muted-foreground">{voucher.brand}</span>
                </>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setEditDialogOpen(true)}
            >
              <i className="ph ph-pencil mr-2" style={{ fontSize: '1rem' }} />
              Editar
            </Button>
            <Button
              variant={voucher.isActive ? 'destructive' : 'default'}
              onClick={() => setToggleStatusDialogOpen(true)}
            >
              <i className={voucher.isActive ? 'ph ph-x-circle mr-2' : 'ph ph-check-circle mr-2'} style={{ fontSize: '1rem' }} />
              {voucher.isActive ? 'Desativar' : 'Ativar'}
            </Button>
          </div>
        </div>

        {/* Image Gallery */}
        {voucher.images && voucher.images.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Imagens</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 flex-wrap">
                {voucher.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${voucher.name} - ${index + 1}`}
                    className="h-40 w-64 rounded-lg object-cover border"
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Informações Básicas */}
        <Card>
          <CardHeader>
            <CardTitle>Informações Básicas</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Nome</p>
              <p className="font-medium">{voucher.name}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Categoria</p>
              <p className="font-medium">{voucher.category}</p>
            </div>

            {voucher.brand && (
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Marca</p>
                <p className="font-medium">{voucher.brand}</p>
              </div>
            )}

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Provedor</p>
              <p className="font-medium capitalize">{voucher.provider}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">ID Externo</p>
              <p className="font-mono text-sm">{voucher.externalId}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge variant={voucher.isActive ? 'default' : 'destructive'}>
                {voucher.isActive ? 'Ativo' : 'Inativo'}
              </Badge>
            </div>

            {voucher.description && (
              <div className="space-y-1 md:col-span-2">
                <p className="text-sm text-muted-foreground">Descrição</p>
                <p className="text-sm whitespace-pre-wrap">{voucher.description}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Valores e Moeda */}
        <Card>
          <CardHeader>
            <CardTitle>Valores e Moeda</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-3">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Valor Mínimo</p>
              <p className="text-2xl font-bold">{formatCurrency(voucher.minValue)}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Valor Máximo</p>
              <p className="text-2xl font-bold">{formatCurrency(voucher.maxValue)}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Moeda</p>
              <Badge variant="outline" className="text-lg">
                {voucher.currency}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Informações de Sistema */}
        <Card>
          <CardHeader>
            <CardTitle>Informações de Sistema</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-3">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Criado</p>
              <p className="text-sm">{formatDate(voucher.createdAt)}</p>
              <p className="text-xs text-muted-foreground">
                {new Date(voucher.createdAt).toLocaleString('pt-BR')}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Última Atualização</p>
              <p className="text-sm">{formatDate(voucher.updatedAt)}</p>
              <p className="text-xs text-muted-foreground">
                {new Date(voucher.updatedAt).toLocaleString('pt-BR')}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Última Sincronização</p>
              <p className="text-sm">{formatDate(voucher.lastSyncAt)}</p>
              <p className="text-xs text-muted-foreground">
                {new Date(voucher.lastSyncAt).toLocaleString('pt-BR')}
              </p>
            </div>

            {voucher.prizeId && (
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">ID do Prêmio</p>
                <p className="font-mono text-sm">{voucher.prizeId}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Dialogs */}
        <EditVoucherDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          voucher={voucher}
        />

        <ToggleVoucherStatusDialog
          open={toggleStatusDialogOpen}
          onOpenChange={setToggleStatusDialogOpen}
          voucher={voucher}
        />
      </div>
    </PageLayout>
  )
}
