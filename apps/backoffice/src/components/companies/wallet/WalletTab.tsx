import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/Skeleton'
import { useCompanyWallet } from '@/hooks/useCompanies'
import { WalletMetricsCards } from './WalletMetricsCards'
import { WalletRedemptionsBreakdown } from './WalletRedemptionsBreakdown'
import { AddCreditsDialog } from './AddCreditsDialog'
import { RemoveCreditsDialog } from './RemoveCreditsDialog'
import { FreezeWalletDialog } from './FreezeWalletDialog'

interface WalletTabProps {
  companyId: string
}

export function WalletTab({ companyId }: WalletTabProps) {
  const { data: wallet, isLoading, error } = useCompanyWallet(companyId)
  const [addCreditsOpen, setAddCreditsOpen] = useState(false)
  const [removeCreditsOpen, setRemoveCreditsOpen] = useState(false)
  const [freezeDialogOpen, setFreezeDialogOpen] = useState(false)

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    )
  }

  if (error || !wallet) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <i className="ph ph-wallet text-6xl text-muted-foreground" />
        <h2 className="mt-4 text-2xl font-bold">Erro ao carregar carteira</h2>
        <p className="mt-2 text-muted-foreground">
          Não foi possível carregar as informações da carteira.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-2">
        <Button variant="outline" onClick={() => setAddCreditsOpen(true)}>
          <i className="ph ph-plus-circle mr-2" style={{ fontSize: '1rem' }} />
          Adicionar Créditos
        </Button>
        <Button
          variant="outline"
          onClick={() => setRemoveCreditsOpen(true)}
          disabled={wallet.balance === 0}
        >
          <i className="ph ph-minus-circle mr-2" style={{ fontSize: '1rem' }} />
          Remover Créditos
        </Button>
        <Button variant="outline" onClick={() => setFreezeDialogOpen(true)}>
          {wallet.isFrozen ? (
            <>
              <i className="ph ph-fire mr-2" style={{ fontSize: '1rem' }} />
              Descongelar
            </>
          ) : (
            <>
              <i className="ph ph-snowflake mr-2" style={{ fontSize: '1rem' }} />
              Congelar
            </>
          )}
        </Button>
      </div>

      {/* Metrics Cards */}
      <WalletMetricsCards wallet={wallet} />

      {/* Redemptions and Financial Breakdown */}
      <WalletRedemptionsBreakdown wallet={wallet} />

      {/* Dialogs */}
      <AddCreditsDialog
        open={addCreditsOpen}
        onOpenChange={setAddCreditsOpen}
        companyId={companyId}
        currentWallet={wallet}
      />

      <RemoveCreditsDialog
        open={removeCreditsOpen}
        onOpenChange={setRemoveCreditsOpen}
        companyId={companyId}
        currentWallet={wallet}
      />

      <FreezeWalletDialog
        open={freezeDialogOpen}
        onOpenChange={setFreezeDialogOpen}
        companyId={companyId}
        currentWallet={wallet}
      />
    </div>
  )
}
