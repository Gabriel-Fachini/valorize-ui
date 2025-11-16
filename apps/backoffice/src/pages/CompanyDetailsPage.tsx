import { useParams } from '@tanstack/react-router'
import { PageLayout } from '@/components/layout/PageLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/Skeleton'
import { CompanyStatusBadge } from '@/components/companies/CompanyStatusBadge'
import { CompanyPlanBadge } from '@/components/companies/CompanyPlanBadge'
import { useCompany } from '@/hooks/useCompanies'

export function CompanyDetailsPage() {
  const { id } = useParams({ from: '/clients/$id' })
  const { data: company, isLoading, error } = useCompany(id)

  if (isLoading) {
    return (
      <PageLayout title="Carregando...">
        <div className="space-y-6">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </PageLayout>
    )
  }

  if (error || !company) {
    return (
      <PageLayout title="Erro">
        <Card>
          <CardContent className="flex min-h-[400px] items-center justify-center">
            <div className="text-center">
              <i className="ph ph-buildings mx-auto mb-4 text-muted-foreground" style={{ fontSize: '4rem' }} />
              <h3 className="mb-2 text-lg font-semibold">Empresa não encontrada</h3>
              <p className="mb-6 text-sm text-muted-foreground">
                A empresa que você está procurando não existe ou foi removida.
              </p>
              <Button onClick={() => (window.location.href = '/clients')}>
                <i className="ph ph-arrow-left mr-2" style={{ fontSize: '1rem' }} />
                Voltar para Lista
              </Button>
            </div>
          </CardContent>
        </Card>
      </PageLayout>
    )
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  return (
    <PageLayout
      title={company.name}
      subtitle={company.domain}
      action={
        <Button variant="outline" onClick={() => (window.location.href = '/clients')}>
          <i className="ph ph-arrow-left mr-2" style={{ fontSize: '1rem' }} />
          Voltar
        </Button>
      }
    >
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
              <CompanyPlanBadge planType={company.currentPlan.planType} />
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
          <TabsTrigger value="contacts">Contatos</TabsTrigger>
          <TabsTrigger value="domains">Domínios SSO</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
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
            </CardContent>
          </Card>
        </TabsContent>

        {/* Wallet Tab */}
        <TabsContent value="wallet">
          <Card>
            <CardHeader>
              <CardTitle>Carteira Digital</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <span className="text-sm text-muted-foreground">Saldo Atual:</span>
                  <p className="text-2xl font-bold">{formatCurrency(company.wallet.balance)}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Total Depositado:</span>
                  <p className="text-2xl font-bold">
                    {formatCurrency(company.wallet.totalDeposited)}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Total Gasto:</span>
                  <p className="text-2xl font-bold">{formatCurrency(company.wallet.totalSpent)}</p>
                </div>
              </div>
              <div className="mt-6 flex gap-2">
                <Button>Adicionar Créditos</Button>
                <Button variant="outline">Remover Créditos</Button>
                <Button variant="outline">
                  {company.wallet.isFrozen ? 'Descongelar' : 'Congelar'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Plan Tab */}
        <TabsContent value="plan">
          <Card>
            <CardHeader>
              <CardTitle>Plano e Cobrança</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-6 grid gap-4 md:grid-cols-3">
                <div>
                  <span className="text-sm text-muted-foreground">Plano Atual:</span>
                  <p className="text-xl font-bold">{company.currentPlan.planType}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Preço por Usuário:</span>
                  <p className="text-xl font-bold">
                    {formatCurrency(Number(company.currentPlan.pricePerUser))}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Data de Início:</span>
                  <p className="text-xl font-bold">
                    {new Date(company.currentPlan.startDate).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
              <Button>Alterar Plano</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Metrics Tab */}
        <TabsContent value="metrics">
          <Card>
            <CardHeader>
              <CardTitle>Métricas e Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Métricas detalhadas serão exibidas aqui em breve.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contacts Tab */}
        <TabsContent value="contacts">
          <Card>
            <CardHeader>
              <CardTitle>Contatos da Empresa</CardTitle>
            </CardHeader>
            <CardContent>
              {company.contacts.length === 0 ? (
                <p className="text-muted-foreground">Nenhum contato cadastrado.</p>
              ) : (
                <div className="space-y-3">
                  {company.contacts.map((contact) => (
                    <div key={contact.id} className="flex items-center justify-between border-b pb-3">
                      <div>
                        <p className="font-medium">{contact.user?.name}</p>
                        <p className="text-sm text-muted-foreground">{contact.user?.email}</p>
                        {contact.role && (
                          <p className="text-sm text-muted-foreground">{contact.role}</p>
                        )}
                      </div>
                      {contact.isPrimary && (
                        <span className="rounded bg-primary px-2 py-1 text-xs text-primary-foreground">
                          Primário
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-6">
                <Button>Adicionar Contato</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Domains Tab */}
        <TabsContent value="domains">
          <Card>
            <CardHeader>
              <CardTitle>Domínios SSO Permitidos</CardTitle>
            </CardHeader>
            <CardContent>
              {company.allowedDomains.length === 0 ? (
                <p className="text-muted-foreground">Nenhum domínio adicional configurado.</p>
              ) : (
                <div className="space-y-2">
                  {company.allowedDomains.map((domain) => (
                    <div key={domain.id} className="flex items-center justify-between border-b pb-2">
                      <span className="font-medium">{domain.domain}</span>
                      <Button variant="ghost" size="sm">
                        Remover
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-6">
                <Button>Adicionar Domínio</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PageLayout>
  )
}
