/**
 * Prize Detail Page
 * Page for viewing and managing a prize
 */

import { type FC, useState } from 'react'
import { useParams, Link } from '@tanstack/react-router'
import { PageLayout } from '@/components/layout/PageLayout'
import { Button } from '@/components/ui/button'
import { BackButton } from '@/components/ui/BackButton'
import { SkeletonText, SkeletonCard } from '@/components/ui/Skeleton'
import { Badge } from '@/components/ui/badge'
import { usePrizeDetail } from '@/hooks/usePrizeDetail'
import { PrizeDetailCard } from '@/components/prizes/PrizeDetailCard'
import { PrizeEditDialog } from '@/components/prizes/PrizeEditDialog'
import { PrizeDeleteDialog } from '@/components/prizes/PrizeDeleteDialog'

export const PrizeDetailPage: FC = () => {
  const params = useParams({ strict: false })
  const prizeId = String(params?.prizeId || '')

  // Fetch prize
  const { prize, isLoading, isError } = usePrizeDetail(prizeId)

  // Dialog states
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  // Check if prize is global
  const isGlobal = prize && !prize.companyId

  // Loading state
  if (isLoading) {
    return (
      <PageLayout maxWidth="5xl">
        <div className="space-y-6">
          <SkeletonText width="sm" height="md" />
          <SkeletonCard>
            <div className="space-y-4">
              <SkeletonText width="lg" height="lg" />
              <SkeletonText width="full" height="md" />
              <SkeletonText width="full" height="md" />
            </div>
          </SkeletonCard>
        </div>
      </PageLayout>
    )
  }

  // Not found state
  if (isError || !prize) {
    return (
      <PageLayout maxWidth="5xl">
        <div className="flex flex-col items-center justify-center py-12">
          <i className="ph ph-gift text-6xl text-muted-foreground" />
          <h2 className="mt-4 text-2xl font-bold">Prêmio não encontrado</h2>
          <p className="mt-2 text-muted-foreground">
            O prêmio que você está procurando não existe ou foi removido.
          </p>
          <Button asChild className="mt-6">
            <Link to="/prizes">
              <i className="ph ph-arrow-left mr-2" />
              Voltar para lista
            </Link>
          </Button>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout maxWidth="5xl">
      <div className="space-y-6">
        {/* Back Button */}
        <BackButton to="/prizes" />

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">{prize.name}</h1>
              {isGlobal && (
                <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  <i className="ph ph-globe mr-1" />
                  Global
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{prize.brand}</p>
          </div>

          {/* Action Buttons - Only if not global */}
          {!isGlobal && (
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(true)}>
                <i className="ph ph-pencil-simple mr-2" />
                Editar
              </Button>
              <Button
                variant={prize.isActive ? "destructive" : "default"}
                onClick={() => setIsDeleteDialogOpen(true)}
              >
                <i className={`ph ${prize.isActive ? 'ph-x-circle' : 'ph-check-circle'} mr-2`} />
                {prize.isActive ? 'Desativar' : 'Ativar'}
              </Button>
            </div>
          )}

          {/* Show message if global */}
          {isGlobal && (
            <div className="text-sm text-muted-foreground">
              <i className="ph ph-info mr-1" />
              Prêmios globais não podem ser editados
            </div>
          )}
        </div>

        {/* Prize Detail Card */}
        <PrizeDetailCard prize={prize} />

        {/* Dialogs */}
        {!isGlobal && (
          <>
            <PrizeEditDialog
              prize={prize}
              open={isEditDialogOpen}
              onOpenChange={setIsEditDialogOpen}
            />
            <PrizeDeleteDialog
              prize={prize}
              open={isDeleteDialogOpen}
              onOpenChange={setIsDeleteDialogOpen}
            />
          </>
        )}
      </div>
    </PageLayout>
  )
}
