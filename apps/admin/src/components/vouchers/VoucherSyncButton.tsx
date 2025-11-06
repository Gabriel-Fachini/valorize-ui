/**
 * Voucher Sync Button Component
 * Button to sync voucher catalog with Tremendous API
 */

import { Button } from '@/components/ui/button'
import { useVoucherMutations } from '@/hooks/useVoucherMutations'

export const VoucherSyncButton = () => {
  const { syncVouchers } = useVoucherMutations()

  return (
    <Button
      onClick={() => syncVouchers.mutate()}
      disabled={syncVouchers.isPending}
      variant="default"
    >
      <i
        className={`ph ${syncVouchers.isPending ? 'ph-circle-notch' : 'ph-arrows-clockwise'} mr-2`}
        style={{
          animation: syncVouchers.isPending ? 'spin 1s linear infinite' : 'none',
        }}
      />
      {syncVouchers.isPending ? 'Sincronizando...' : 'Sincronizar Catálogo'}
    </Button>
  )
}
