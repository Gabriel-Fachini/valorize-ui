import { useState } from 'react'
import { useParams, useNavigate } from '@tanstack/react-router'
import { PageLayout } from '@/components/layout/PageLayout'
import { Button } from '@/components/ui/button'
import { BackButton } from '@/components/ui/BackButton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/Skeleton'
import { Badge } from '@/components/ui/badge'
import { CompanyStatusBadge } from '@/components/companies/CompanyStatusBadge'
import { CompanyPlanBadge } from '@/components/companies/CompanyPlanBadge'
import { EditCompanyOverviewDialog } from '@/components/companies/edit/EditCompanyOverviewDialog'
import { WalletTab } from '@/components/companies/wallet/WalletTab'
import { PlanTab } from '@/components/companies/plan/PlanTab'
import { MetricsTab } from '@/components/companies/metrics/MetricsTab'
import { AddDomainDialog } from '@/components/companies/domains/AddDomainDialog'
import { DeleteDomainDialog } from '@/components/companies/domains/DeleteDomainDialog'
import { useCompany } from '@/hooks/useCompanies'
import type { AllowedDomain } from '@/types/company'

export function CompanyDetailsPage() {
  const { id } = useParams({ from: '/clients/$id' })
  const navigate = useNavigate()
  const { data: company, isLoading, error } = useCompany(id)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [addDomainDialogOpen, setAddDomainDialogOpen] = useState(false)
  const [deleteDomainDialogOpen, setDeleteDomainDialogOpen] = useState(false)
  const [domainToDelete, setDomainToDelete] = useState<AllowedDomain | null>(null)

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

  if (error || !company) {
    return (
      <PageLayout>
        <div className="flex flex-col items-center justify-center py-12">
          <i className="ph ph-buildings text-6xl text-muted-foreground" />
          <h2 className="mt-4 text-2xl font-bold">Empresa não encontrada</h2>
          <p className="mt-2 text-muted-foreground">A empresa que você está procurando não existe ou foi removida.</p>
          <Button onClick={() => navigate({ to: '/clients' })} className="mt-6">
            <i className="ph ph-arrow-left mr-2" style={{ fontSize: '1rem' }} />
            Voltar para lista
          </Button>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <div className="space-y-6">
        {/* Back Button */}
        <div>
          <BackButton to="/clients" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{company.name}</h1>
            <p className="text-muted-foreground">{company.domain}</p>
          </div>
        </div>

        {/* Company Header */}
      <Card className="mb-6">
        <CardContent className="flex items-start gap-6 pt-6">
          {company.logoUrl ? (
            <img
              src={company.logoUrl}
              alt={company.name}
              className="h-20 w-20 rounded-lg object-cover"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-muted">
              <i className="ph ph-buildings text-muted-foreground" style={{ fontSize: '2.5rem' }} />
            </div>
          )}

          <div className="flex-1">
            <div className="mb-2 flex items-center gap-3">
              <h2 className="text-2xl font-bold">{company.name}</h2>
              <CompanyStatusBadge status={company.isActive} />
              {company.currentPlan && <CompanyPlanBadge planType={company.currentPlan.planType} />}
            </div>

            <div className="grid gap-4 text-sm md:grid-cols-3">
              <div>
                <span className="text-muted-foreground">Domínio:</span>
                <p className="font-medium">{company.domain}</p>
              </div>
              <div>
                <span className="text-muted-foreground">País:</span>
                <p className="font-medium">{company.country}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Timezone:</span>
                <p className="font-medium">{company.timezone}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="wallet">Carteira</TabsTrigger>
          <TabsTrigger value="plan">Plano</TabsTrigger>
          <TabsTrigger value="metrics">Métricas</TabsTrigger>
          <TabsTrigger value="domains">Domínios SSO</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Header with Edit Button */}
          <div className="flex items-center justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditDialogOpen(true)}
            >
              <i className="ph ph-pencil mr-2" style={{ fontSize: '0.875rem' }} />
              Editar Visão Geral
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Informações Básicas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Nome:</span>
                  <p className="font-medium">{company.name}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Domínio:</span>
                  <p className="font-medium">{company.domain}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Email de Cobrança:</span>
                  <p className="font-medium">{company.billingEmail || 'Não informado'}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">País:</span>
                  <p className="font-medium">{company.country}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Fuso Horário:</span>
                  <p className="font-medium">{company.timezone}</p>
                </div>
              </CardContent>
            </Card>

            {company.companyBrazil && (
              <Card>
                <CardHeader>
                  <CardTitle>Dados Fiscais (Brasil)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">CNPJ:</span>
                    <p className="font-medium">{company.companyBrazil.cnpj}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Razão Social:</span>
                    <p className="font-medium">{company.companyBrazil.razaoSocial}</p>
                  </div>
                  {company.companyBrazil.cnaePrincipal && (
                    <div>
                      <span className="text-muted-foreground">CNAE:</span>
                      <p className="font-medium">{company.companyBrazil.cnaePrincipal}</p>
                    </div>
                  )}
                  {company.companyBrazil.porteEmpresa && (
                    <div>
                      <span className="text-muted-foreground">Porte:</span>
                      <p className="font-medium">{company.companyBrazil.porteEmpresa}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Valores da Empresa</CardTitle>
            </CardHeader>
            <CardContent>
              {company.values && company.values.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {company.values.map((value) => (
                    <div
                      key={value.id}
                      className="flex items-start gap-3 rounded-lg border p-4"
                    >
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-full"
                        style={{ backgroundColor: value.iconColor || '#3B82F6' }}
                      >
                        <span className="text-lg text-white">{value.iconName || '⭐'}</span>
                      </div>
                      <div>
                        <h4 className="font-semibold">{value.title}</h4>
                        {value.description && (
                          <p className="text-sm text-muted-foreground">{value.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-4">
                  Nenhum valor cadastrado.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Wallet Tab */}
        <TabsContent value="wallet">
          <WalletTab companyId={id} />
        </TabsContent>

        {/* Plan Tab */}
        <TabsContent value="plan">
          <PlanTab companyId={id} />
        </TabsContent>

        {/* Metrics Tab */}
        <TabsContent value="metrics">
          <MetricsTab companyId={id} />
        </TabsContent>

        {/* Domains Tab */}
        <TabsContent value="domains">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Domínios SSO Permitidos</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Usuários com email de qualquer domínio listado abaixo podem fazer login na empresa.
                </p>
              </div>
              <Button onClick={() => setAddDomainDialogOpen(true)}>
                <i className="ph ph-plus-circle mr-2" />
                Adicionar Domínio
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {/* Domínio Principal */}
                <div className="flex items-center justify-between p-4 rounded-lg border-2 border-primary/20 bg-primary/5">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-mono font-bold text-lg">{company.domain}</p>
                      <Badge variant="default" className="bg-primary">
                        <i className="ph ph-star-fill mr-1" style={{ fontSize: '0.75rem' }} />
                        Domínio Principal
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Este é o domínio principal da empresa e não pode ser removido
                    </p>
                  </div>
                  <div className="text-muted-foreground">
                    <i className="ph ph-lock text-2xl" />
                  </div>
                </div>

                {/* Domínios Adicionais */}
                {company.allowedDomains && company.allowedDomains.length > 0 ? (
                  <>
                    <div className="pt-2">
                      <p className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                        <i className="ph ph-plus-circle" />
                        Domínios Adicionais ({company.allowedDomains.length})
                      </p>
                    </div>
                    {company.allowedDomains.map((domain) => (
                      <div
                        key={domain.id}
                        className="flex items-center justify-between p-3 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex-1">
                          <p className="font-mono font-semibold text-base">{domain.domain}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Adicionado em: {new Date(domain.createdAt).toLocaleDateString('pt-BR', {
                              day: '2-digit',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setDomainToDelete(domain)
                            setDeleteDomainDialogOpen(true)
                          }}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <i className="ph ph-trash mr-1" />
                          Remover
                        </Button>
                      </div>
                    ))}
                  </>
                ) : (
                  <div className="text-center py-8 border border-dashed rounded-lg">
                    <i className="ph ph-globe text-4xl text-muted-foreground/50" />
                    <p className="text-muted-foreground mt-2 font-medium">Nenhum domínio adicional configurado</p>
                    <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
                      Você pode adicionar domínios adicionais para permitir que usuários de múltiplos domínios acessem esta empresa.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>

      {/* Edit Company Overview Dialog */}
      <EditCompanyOverviewDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        company={company}
      />

      {/* Add Domain Dialog */}
      <AddDomainDialog
        open={addDomainDialogOpen}
        onOpenChange={setAddDomainDialogOpen}
        companyId={company.id}
        primaryDomain={company.domain}
        additionalDomains={company.allowedDomains?.map((d) => d.domain) || []}
      />

      {/* Delete Domain Dialog */}
      <DeleteDomainDialog
        open={deleteDomainDialogOpen}
        onOpenChange={setDeleteDomainDialogOpen}
        companyId={company.id}
        domain={domainToDelete}
      />
    </PageLayout>
  )
}
