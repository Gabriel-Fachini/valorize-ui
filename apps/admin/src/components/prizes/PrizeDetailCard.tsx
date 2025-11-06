/**
 * Prize Detail Card Component
 * Displays detailed information about a prize
 */

import { type FC } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Prize } from '@/types/prizes'
import { PRIZE_CATEGORIES } from './PrizeForm'

interface PrizeDetailCardProps {
  prize: Prize
}

export const PrizeDetailCard: FC<PrizeDetailCardProps> = ({ prize }) => {
  const getCategoryLabel = (value: string) => {
    const cat = PRIZE_CATEGORIES.find((c) => c.value === value)
    return cat?.label || value
  }

  return (
    <div className="space-y-6">
      {/* Main Prize Information */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Informações do Prêmio</CardTitle>
            {!prize.companyId && (
              <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                <i className="ph ph-globe mr-1" />
                Global
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Image Gallery */}
          {prize.images && prize.images.length > 0 && (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {prize.images.map((image, index) => (
                <div key={index} className="aspect-square overflow-hidden rounded-lg border">
                  <img
                    src={image}
                    alt={`${prize.name} - ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Details Grid */}
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Nome</p>
              <p className="mt-1 font-medium">{prize.name}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">Marca</p>
              <p className="mt-1 font-medium">{prize.brand}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">Categoria</p>
              <Badge variant="secondary" className="mt-1">
                {getCategoryLabel(prize.category)}
              </Badge>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">Preço em Moedas</p>
              <div className="mt-1 flex items-center gap-1">
                <i className="ph ph-coin text-yellow-500 text-lg" />
                <span className="font-bold text-lg">{prize.coinPrice.toLocaleString('pt-BR')}</span>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">Estoque</p>
              <div className="mt-1">
                <span
                  className={`font-bold text-lg ${
                    prize.stock === 0
                      ? 'text-red-600'
                      : prize.stock <= 5
                        ? 'text-yellow-600'
                        : 'text-green-600'
                  }`}
                >
                  {prize.stock}
                </span>
                {prize.stock === 0 && (
                  <Badge variant="destructive" className="ml-2">
                    Esgotado
                  </Badge>
                )}
                {prize.stock > 0 && prize.stock <= 5 && (
                  <Badge variant="outline" className="ml-2 border-yellow-600 text-yellow-600">
                    Estoque Baixo
                  </Badge>
                )}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">Status</p>
              <Badge variant={prize.isActive ? 'default' : 'destructive'} className="mt-1">
                {prize.isActive ? 'Ativo' : 'Inativo'}
              </Badge>
            </div>
          </div>

          {/* Description */}
          <div>
            <p className="text-sm font-medium text-muted-foreground">Descrição</p>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed">{prize.description}</p>
          </div>
        </CardContent>
      </Card>

      {/* Specifications */}
      {prize.specifications && Object.keys(prize.specifications).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Especificações Técnicas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2">
              {Object.entries(prize.specifications).map(([key, value]) => (
                <div key={key} className="flex items-start gap-2 rounded-lg border p-3">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground">{key}</p>
                    <p className="mt-1 text-sm font-medium">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Metadata */}
      <Card>
        <CardHeader>
          <CardTitle>Informações de Sistema</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-muted-foreground">ID</p>
              <p className="mt-1 font-mono text-sm">{prize.id}</p>
            </div>

            {prize.companyId && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">ID da Empresa</p>
                <p className="mt-1 font-mono text-sm">{prize.companyId}</p>
              </div>
            )}

            <div>
              <p className="text-sm font-medium text-muted-foreground">Criado em</p>
              <p className="mt-1 text-sm">{new Date(prize.createdAt).toLocaleString('pt-BR')}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">Atualizado em</p>
              <p className="mt-1 text-sm">{new Date(prize.updatedAt).toLocaleString('pt-BR')}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
