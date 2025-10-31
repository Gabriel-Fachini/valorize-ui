import { type FC, useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { SimpleInput } from '@/components/ui/simple-input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { coinEconomySchema, type CoinEconomyFormData, type Company, WEEKDAY_OPTIONS } from '@/types/company'
import { companyService } from '@/services/company'

interface CoinEconomyTabProps {
  company?: Company
  onUpdate: (updatedCompany: Company) => void
}

export const CoinEconomyTab: FC<CoinEconomyTabProps> = ({ company, onUpdate }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | undefined>()

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
    reset,
  } = useForm<CoinEconomyFormData>({
    resolver: zodResolver(coinEconomySchema),
    defaultValues: {
      weekly_renewal_amount: 100,
      renewal_day: 1,
    },
  })

  const weeklyRenewalAmount = watch('weekly_renewal_amount')
  const renewalDay = watch('renewal_day')

  // Reset form when company data arrives
  useEffect(() => {
    if (company) {
      console.log('✅ CoinEconomyTab: Resetting form with company data:', {
        weekly_renewal_amount: company.weekly_renewal_amount,
        renewal_day: company.renewal_day,
      })
      reset({
        weekly_renewal_amount: company.weekly_renewal_amount,
        renewal_day: company.renewal_day,
      })
    }
  }, [company, reset])

  const onSubmit = async (data: CoinEconomyFormData) => {
    setIsLoading(true)
    setSuccessMessage(undefined)

    try {
      const updatedCompany = await companyService.updateCoinEconomy({
        weekly_renewal_amount: data.weekly_renewal_amount,
        renewal_day: data.renewal_day,
      })

      onUpdate(updatedCompany)
      setSuccessMessage('Configurações de economia atualizadas com sucesso!')

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(undefined), 3000)
    } catch (error) {
      console.error('Error updating coin economy:', error)
      alert('Erro ao atualizar configurações. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const selectedWeekday = WEEKDAY_OPTIONS.find((day) => day.value === renewalDay)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <i className="ph ph-coin text-xl" />
          Economia de Moedas
        </CardTitle>
        <CardDescription>
          Configure a quantidade de moedas que cada colaborador recebe semanalmente para enviar elogios.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Info Box */}
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-start gap-3">
              <i className="ph ph-info text-blue-600 dark:text-blue-400 text-xl mt-0.5" />
              <div className="text-sm text-blue-700 dark:text-blue-300">
                <p className="font-semibold mb-1">Saldo de Elogios</p>
                <p>
                  Cada colaborador recebe um saldo de moedas semanalmente para enviar elogios aos colegas.
                  Configure aqui a quantidade e o dia da renovação.
                </p>
              </div>
            </div>
          </div>

          {/* Weekly Renewal Amount */}
          <div className="space-y-2">
            <Label htmlFor="weekly_renewal_amount">
              Quantidade de Renovação Semanal <span className="text-red-500">*</span>
            </Label>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <SimpleInput
                  id="weekly_renewal_amount"
                  type="number"
                  min={50}
                  max={500}
                  step={10}
                  {...register('weekly_renewal_amount', { valueAsNumber: true })}
                  aria-invalid={errors.weekly_renewal_amount ? 'true' : 'false'}
                />
              </div>
              <span className="text-sm text-muted-foreground font-medium">moedas</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Mínimo: 50 | Máximo: 500 | Padrão: 100 moedas
            </p>
            {errors.weekly_renewal_amount && (
              <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                <i className="ph ph-warning-circle" />
                {errors.weekly_renewal_amount.message}
              </p>
            )}

            {/* Preview */}
            <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 text-sm">
                <i className="ph ph-coins text-primary text-lg" />
                <span className="text-muted-foreground">Preview:</span>
                <span className="font-semibold text-primary">
                  {weeklyRenewalAmount} moedas
                </span>
                <span className="text-muted-foreground">por colaborador/semana</span>
              </div>
            </div>
          </div>

          {/* Renewal Day */}
          <div className="space-y-2">
            <Label htmlFor="renewal_day">
              Dia da Renovação Semanal <span className="text-red-500">*</span>
            </Label>
            <Controller
              name="renewal_day"
              control={control}
              render={({ field }) => {
                console.log('📅 Select renewal_day value:', field.value)
                return (
                  <Select
                    value={field.value?.toString() || '1'}
                    onValueChange={(value) => {
                      console.log('📅 Select onChange:', value)
                      field.onChange(parseInt(value))
                    }}
                  >
                    <SelectTrigger id="renewal_day">
                      <SelectValue placeholder="Selecione o dia da semana" />
                    </SelectTrigger>
                    <SelectContent>
                      {WEEKDAY_OPTIONS.map((day) => (
                        <SelectItem key={day.value} value={day.value.toString()}>
                          {day.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )
              }}
            />
            <p className="text-xs text-muted-foreground">
              O saldo de elogios será renovado toda {selectedWeekday?.label.toLowerCase()}
            </p>
            {errors.renewal_day && (
              <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                <i className="ph ph-warning-circle" />
                {errors.renewal_day.message}
              </p>
            )}
          </div>

          {/* Summary Card */}
          <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
            <div className="flex items-start gap-3">
              <i className="ph ph-calendar-check text-primary text-xl mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold text-foreground mb-1">Resumo da Configuração</p>
                <p className="text-muted-foreground">
                  Cada colaborador receberá <strong className="text-primary">{weeklyRenewalAmount} moedas</strong> toda{' '}
                  <strong className="text-primary">{selectedWeekday?.label}</strong> para enviar elogios aos colegas.
                </p>
              </div>
            </div>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-700 dark:text-green-300 flex items-center gap-2">
              <i className="ph ph-check-circle text-xl" />
              {successMessage}
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end pt-4 border-t">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <i className="ph ph-circle-notch animate-spin mr-2" />
                  Salvando...
                </>
              ) : (
                <>
                  <i className="ph ph-check mr-2" />
                  Salvar Configurações
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
