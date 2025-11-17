import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/Skeleton'
import { useCompanyPlan, useCompanyBilling } from '@/hooks/useCompanies'
import { UpdatePlanDialog } from './UpdatePlanDialog'
import { CompanyPlanBadge } from '@/components/companies/CompanyPlanBadge'
import { PlanType } from '@/types/company'

interface PlanTabProps {
  companyId: string
}

export function PlanTab({ companyId }: PlanTabProps) {
  const { data: plan, isLoading: planLoading } = useCompanyPlan(companyId)
  const { data: billing, isLoading: billingLoading } = useCompanyBilling(companyId)
  const [updatePlanOpen, setUpdatePlanOpen] = useState(false)

  const isLoading = planLoading || billingLoading

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-40 ml-auto" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Action Button */}
      <div className="flex items-center justify-end">
        <Button onClick={() => setUpdatePlanOpen(true)}>
          <i className="ph ph-swap mr-2" style={{ fontSize: '1rem' }} />
          {plan ? 'Alterar Plano' : 'Definir Plano'}
        </Button>
      </div>

      {/* Current Plan Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <i className="ph ph-file-text" style={{ fontSize: '1.5rem' }} />
            Plano Atual
          </CardTitle>
          <CardDescription>
            Informações sobre o plano contratado pela empresa
          </CardDescription>
        </CardHeader>
        <CardContent>
          {plan ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div>
                <span className="text-sm text-muted-foreground">Tipo de Plano</span>
                <div className="mt-2">
                  <CompanyPlanBadge planType={plan.planType} />
                </div>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Preço por Usuário</span>
                <p className="mt-2 text-2xl font-bold">
                  {formatCurrency(Number(plan.pricePerUser))}
                </p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Data de Início</span>
                <p className="mt-2 text-lg font-semibold">
                  {formatDate(plan.startDate)}
                </p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Status</span>
                <div className="mt-2">
                  {plan.isActive ? (
                    <span className="inline-flex items-center gap-1 text-green-600 font-medium">
                      <i className="ph ph-check-circle" />
                      Ativo
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-red-600 font-medium">
                      <i className="ph ph-x-circle" />
                      Inativo
                    </span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8">
              <i className="ph ph-warning-circle text-5xl text-amber-500" />
              <p className="mt-4 text-lg font-medium">Nenhum plano definido</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Configure um plano para esta empresa
              </p>
              <Button onClick={() => setUpdatePlanOpen(true)} className="mt-4">
                <i className="ph ph-plus-circle mr-2" />
                Definir Plano
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Billing Information Card */}
      {billing && plan && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <i className="ph ph-currency-circle-dollar" style={{ fontSize: '1.5rem' }} />
              Informações de Cobrança
            </CardTitle>
            <CardDescription>
              Métricas de receita e cobrança baseadas no plano atual
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div>
                <span className="text-sm text-muted-foreground">MRR (Receita Mensal)</span>
                <p className="mt-2 text-2xl font-bold text-green-600">
                  {formatCurrency(billing.currentMRR)}
                </p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Usuários Ativos</span>
                <p className="mt-2 text-2xl font-bold">{billing.activeUsers}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Valor Mensal Estimado</span>
                <p className="mt-2 text-2xl font-bold">
                  {formatCurrency(billing.estimatedMonthlyAmount)}
                </p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Próxima Cobrança</span>
                <p className="mt-2 text-lg font-semibold">
                  {billing.nextBillingDate ? formatDate(billing.nextBillingDate) : 'N/A'}
                </p>
              </div>
            </div>

            {billing.billingEmail && (
              <div className="mt-6 pt-6 border-t">
                <span className="text-sm text-muted-foreground">Email de Cobrança</span>
                <p className="mt-2 font-medium">{billing.billingEmail}</p>
              </div>
            )}

            <div className="mt-6 p-4 rounded-lg bg-muted">
              <div className="flex items-start gap-2">
                <i className="ph ph-info text-blue-600 mt-0.5" style={{ fontSize: '1.25rem' }} />
                <div className="flex-1">
                  <p className="text-sm font-medium">Cálculo do MRR</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    MRR = {billing.activeUsers} usuários × {formatCurrency(billing.pricePerUser)} = {formatCurrency(billing.currentMRR)}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Plan Features Comparison Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <i className="ph ph-list-checks" style={{ fontSize: '1.5rem' }} />
            Comparação de Planos
          </CardTitle>
          <CardDescription>
            Características e benefícios de cada plano disponível
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            {/* Essential Plan */}
            <div className="rounded-lg border p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">Essential</h3>
                <CompanyPlanBadge planType={PlanType.ESSENTIAL} />
              </div>
              <div className="text-3xl font-bold text-green-600">
                R$ 14<span className="text-sm text-muted-foreground font-normal">/usuário</span>
              </div>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-sm">
                  <i className="ph ph-check-circle text-green-600 mt-0.5" />
                  <span>Ideal para 50-200 colaboradores</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <i className="ph ph-check-circle text-green-600 mt-0.5" />
                  <span>Funcionalidades essenciais</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <i className="ph ph-check-circle text-green-600 mt-0.5" />
                  <span>Suporte padrão</span>
                </li>
              </ul>
            </div>

            {/* Professional Plan */}
            <div className="rounded-lg border p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">Professional</h3>
                <CompanyPlanBadge planType={PlanType.PROFESSIONAL} />
              </div>
              <div className="text-3xl font-bold text-blue-600">
                R$ 18<span className="text-sm text-muted-foreground font-normal">/usuário</span>
              </div>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-sm">
                  <i className="ph ph-check-circle text-blue-600 mt-0.5" />
                  <span>Ideal para 200-1000 colaboradores</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <i className="ph ph-check-circle text-blue-600 mt-0.5" />
                  <span>Todas as funcionalidades</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <i className="ph ph-check-circle text-blue-600 mt-0.5" />
                  <span>Suporte prioritário</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <i className="ph ph-check-circle text-blue-600 mt-0.5" />
                  <span>Preço reduzido por volume</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Update Plan Dialog */}
      <UpdatePlanDialog
        open={updatePlanOpen}
        onOpenChange={setUpdatePlanOpen}
        companyId={companyId}
        currentPlan={plan}
      />
    </div>
  )
}
