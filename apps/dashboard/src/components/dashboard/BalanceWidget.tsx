import { useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { usePraisesData } from '@/hooks/usePraisesData'

export const BalanceWidget = () => {
  const navigate = useNavigate()
  const { userBalance } = usePraisesData()

  return (
    <div className="bg-white/70 dark:bg-[#2a2a2a]/80 backdrop-blur-xl border border-white/30 dark:border-neutral-700/30 rounded-2xl p-6 shadow-xl">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center justify-center w-10 h-10 bg-primary-600 rounded-xl shadow-lg">
          <i className="ph-duotone ph-coins text-white" style={{ fontSize: '20px' }}></i>
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
            Seu Saldo
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Moedas disponíveis
          </p>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        {/* Compliment Balance */}
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <i className="ph-duotone ph-coins text-white" style={{ fontSize: '16px' }}></i>
              <span className="text-sm font-medium text-white">
                Moedas para Elogios
              </span>
            </div>
            <span className="text-lg font-bold text-white">
              {userBalance.complimentBalance}
            </span>
          </div>
          <p className="text-xs text-white/80">
            Use para enviar elogios aos colegas
          </p>
        </div>

        {/* Redeemable Balance */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <i className="ph-duotone ph-gift text-white" style={{ fontSize: '16px' }}></i>
              <span className="text-sm font-medium text-white">
                Moedas para Resgatar
              </span>
            </div>
            <span className="text-lg font-bold text-white">
              {userBalance.redeemableBalance}
            </span>
          </div>
          <p className="text-xs text-white/80">
            Use para resgatar prêmios na loja
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate({ to: '/elogios' })}
          className="w-full justify-start text-sm"
        >
          <i className="ph-duotone ph-coins mr-2" style={{ fontSize: '16px' }}></i>
          Enviar Elogio
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate({ to: '/prizes' })}
          className="w-full justify-start text-sm"
        >
          <i className="ph-duotone ph-gift mr-2" style={{ fontSize: '16px' }}></i>
          Explorar Prêmios
        </Button>
      </div>
    </div>
  )
}

