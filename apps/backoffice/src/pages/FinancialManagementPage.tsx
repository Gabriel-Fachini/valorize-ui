import { useState } from 'react'
import { PageLayout } from '@/components/layout/PageLayout'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import { StatCard } from '@/components/companies/StatCard'
import { useCharges } from '@/hooks/useCharges'
import { useDeleteCharge } from '@/hooks/useChargeMutations'
import { useToast } from '@/hooks/useToast'
import { chargesTableConfig } from '@/config/tables'
import { CreateChargeDialog } from '@/components/financial/CreateChargeDialog'
import { RegisterPaymentDialog } from '@/components/financial/RegisterPaymentDialog'
import { CancelChargeDialog } from '@/components/financial/CancelChargeDialog'
import type { ChargeListItem, ChargeStatus } from '@/types/financial'

interface ChargesFiltersState extends Record<string, unknown> {
  search: string
  status: string
}

export function FinancialManagementPage() {
  const { toast } = useToast()
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [filters, setFilters] = useState<ChargesFiltersState>({
    search: '',
    status: 'all',
  })

  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [registerPaymentDialog, setRegisterPaymentDialog] = useState<{
    open: boolean
    chargeId: string
    chargeDescription: string
    chargeAmount: number
    currentBalance?: number
  }>({
    open: false,
    chargeId: '',
    chargeDescription: '',
    chargeAmount: 0,
  })
  const [cancelDialog, setCancelDialog] = useState<{
    open: boolean
    chargeId: string
    chargeDescription: string
  }>({
    open: false,
    chargeId: '',
    chargeDescription: '',
  })

  const deleteChargeMutation = useDeleteCharge()

  // Prepare query params
  const queryFilters = {
    search: filters.search || undefined,
    status: filters.status !== 'all' ? (filters.status as ChargeStatus) : undefined,
  }

  const { data, isLoading, isFetching } = useCharges(
    queryFilters,
    { page, pageSize },
    { sortBy: 'dueDate', sortOrder: 'desc' }
  )

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  const handleRowAction = async (actionId: string, charge: ChargeListItem) => {
    switch (actionId) {
      case 'view':
        // TODO: Implement view details dialog
        console.log('View charge details:', charge.id)
        break
      case 'edit':
        // TODO: Implement edit dialog
        console.log('Edit charge:', charge.id)
        break
      case 'register-payment':
        setRegisterPaymentDialog({
          open: true,
          chargeId: charge.id,
          chargeDescription: charge.description,
          chargeAmount: charge.amount,
        })
        break
      case 'upload-attachment':
        // TODO: Implement upload attachment dialog
        console.log('Upload attachment for charge:', charge.id)
        break
      case 'cancel':
        setCancelDialog({
          open: true,
          chargeId: charge.id,
          chargeDescription: charge.description,
        })
        break
      case 'delete':
        if (window.confirm('Tem certeza que deseja excluir esta cobrança?')) {
          try {
            const result = await deleteChargeMutation.mutateAsync(charge.id)
            if (!result.success) {
              throw new Error(result.error || 'Erro ao excluir cobrança')
            }
            toast({
              title: 'Sucesso!',
              description: 'Cobrança excluída com sucesso!',
              variant: 'default',
            })
          } catch (error) {
            toast({
              title: 'Erro ao excluir cobrança',
              description: error instanceof Error ? error.message : 'Ocorreu um erro desconhecido.',
              variant: 'destructive',
            })
          }
        }
        break
    }
  }

  return (
    <>
      <PageLayout
        title="Gestão Financeira"
        subtitle="Gerencie cobranças e pagamentos das empresas"
        action={
          <Button onClick={() => setCreateDialogOpen(true)}>
            <i className="ph ph-plus mr-2" style={{ fontSize: '1rem' }} />
            Nova Cobrança
          </Button>
        }
      >
        {/* Stats Cards */}
        <div className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Valor Total"
            value={formatCurrency(data?.aggregations?.totalAmount || 0)}
            description="Soma de todas as cobranças"
            icon={<i className="ph ph-currency-circle-dollar" style={{ fontSize: '1rem' }} />}
            isLoading={isLoading}
          />
          <StatCard
            title="Pendente"
            value={formatCurrency(data?.aggregations?.pendingAmount || 0)}
            description="Cobranças aguardando pagamento"
            icon={<i className="ph ph-clock" style={{ fontSize: '1rem' }} />}
            isLoading={isLoading}
          />
          <StatCard
            title="Pago"
            value={formatCurrency(data?.aggregations?.paidAmount || 0)}
            description="Valores já recebidos"
            icon={<i className="ph ph-check-circle" style={{ fontSize: '1rem' }} />}
            isLoading={isLoading}
          />
          <StatCard
            title="Vencido"
            value={formatCurrency(data?.aggregations?.overdueAmount || 0)}
            description="Cobranças em atraso"
            icon={<i className="ph ph-warning-circle" style={{ fontSize: '1rem' }} />}
            isLoading={isLoading}
          />
        </div>

        {/* Table with DataTable */}
        <DataTable<ChargeListItem>
          config={chargesTableConfig}
          data={data?.data || []}
          isLoading={isLoading && !data}
          isFetching={isFetching}
          totalCount={data?.pagination?.total || 0}
          pageCount={data?.pagination?.totalPages || 1}
          currentPage={page}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
          sortState={{ columnId: 'dueDate', order: 'desc' }}
          filters={filters}
          onFiltersChange={(newFilters) => {
            setFilters(newFilters as ChargesFiltersState)
            setPage(1) // Reset to first page when filters change
          }}
          onRowAction={handleRowAction}
          getRowId={(row) => row.id}
        />
      </PageLayout>

      {/* Dialogs */}
      <CreateChargeDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />

      <RegisterPaymentDialog
        open={registerPaymentDialog.open}
        onOpenChange={(open) =>
          setRegisterPaymentDialog((prev) => ({ ...prev, open }))
        }
        chargeId={registerPaymentDialog.chargeId}
        chargeDescription={registerPaymentDialog.chargeDescription}
        chargeAmount={registerPaymentDialog.chargeAmount}
        currentBalance={registerPaymentDialog.currentBalance}
      />

      <CancelChargeDialog
        open={cancelDialog.open}
        onOpenChange={(open) => setCancelDialog((prev) => ({ ...prev, open }))}
        chargeId={cancelDialog.chargeId}
        chargeDescription={cancelDialog.chargeDescription}
      />
    </>
  )
}
