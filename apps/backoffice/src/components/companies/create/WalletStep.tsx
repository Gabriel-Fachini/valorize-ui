import { UseFormReturn } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CreateCompanyWizardData } from './schemas'

interface WalletStepProps {
  form: UseFormReturn<CreateCompanyWizardData>
}

export function WalletStep({ form }: WalletStepProps) {
  const { register, formState: { errors }, watch } = form
  const walletBudget = watch('initialWalletBudget') || 0

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border bg-muted/50 p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <i className="ph ph-wallet text-primary" style={{ fontSize: '1.5rem' }} />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Carteira Digital</h3>
            <p className="text-sm text-muted-foreground">
              Configure o orçamento inicial da empresa
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="initialWalletBudget">Orçamento Inicial (R$)</Label>
            <Input
              id="initialWalletBudget"
              type="number"
              step="0.01"
              min="0"
              {...register('initialWalletBudget', { valueAsNumber: true })}
              placeholder="0.00"
            />
            {errors.initialWalletBudget && (
              <p className="text-sm text-destructive">{errors.initialWalletBudget.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Você pode deixar em R$ 0,00 e adicionar créditos depois
            </p>
          </div>

          {walletBudget > 0 && (
            <div className="rounded-lg bg-background p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Saldo Inicial:</span>
                <span className="text-2xl font-bold text-primary">
                  {formatCurrency(walletBudget)}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950/50">
        <div className="flex gap-3">
          <i className="ph ph-info text-blue-600 dark:text-blue-400" style={{ fontSize: '1.25rem' }} />
          <div className="flex-1">
            <h4 className="mb-1 text-sm font-semibold text-blue-900 dark:text-blue-200">
              Sobre a Carteira Digital
            </h4>
            <p className="text-xs text-blue-800 dark:text-blue-300">
              A carteira digital é usada para resgatar prêmios e vouchers. O saldo pode ser
              gerenciado a qualquer momento através da página de detalhes da empresa.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
