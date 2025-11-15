import { PageLayout } from '@/components/layout/PageLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/contexts/AuthContext'

export const HomePage = () => {
  const { user } = useAuth()

  return (
    <PageLayout
      title="Dashboard"
      subtitle={`Bem-vindo de volta, ${user?.name || 'Usuário'}!`}
    >
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardDescription>Clientes Ativos</CardDescription>
            <CardTitle className="text-3xl">0</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Total de empresas com contratos ativos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Receita Mensal</CardDescription>
            <CardTitle className="text-3xl">R$ 0</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Receita recorrente mensal (MRR)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Vouchers Ativos</CardDescription>
            <CardTitle className="text-3xl">0</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Vouchers disponíveis no catálogo
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Contratos</CardDescription>
            <CardTitle className="text-3xl">0</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Total de contratos gerenciados
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Bem-vindo ao Backoffice da Valorize</CardTitle>
            <CardDescription>
              Esta é a interface de gerenciamento do seu negócio
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Use o menu lateral para navegar entre as diferentes seções:
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                <span><strong>Clientes:</strong> Gerencie suas empresas clientes</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                <span><strong>Contratos:</strong> Visualize e administre contratos ativos</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                <span><strong>Vouchers:</strong> Gerencie o catálogo de vouchers oferecidos</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                <span><strong>Métricas:</strong> Acompanhe as métricas relevantes do negócio</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  )
}
