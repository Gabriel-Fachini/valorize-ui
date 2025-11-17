import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/useToast'
import { useUpdateCompany } from '@/hooks/useCompanyMutations'
import type { CompanyDetails } from '@/types/company'
import type { UpdateCompanyInput } from '@/types/company'
import { editCompanyOverviewSchema, type EditCompanyOverviewFormData } from './schemas'

interface EditCompanyOverviewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  company: CompanyDetails
}

export function EditCompanyOverviewDialog({
  open,
  onOpenChange,
  company,
}: EditCompanyOverviewDialogProps) {
  const { toast } = useToast()
  const updateMutation = useUpdateCompany(company.id)

  const form = useForm<EditCompanyOverviewFormData>({
    // @ts-expect-error - Type compatibility issue between Zod and react-hook-form
    resolver: zodResolver(editCompanyOverviewSchema),
    defaultValues: {
      name: company.name,
      domain: company.domain,
      billingEmail: company.billingEmail || '',
      country: company.country,
      timezone: company.timezone,
      logoUrl: company.logoUrl || '',
      companyBrazil: company.companyBrazil
        ? {
            cnpj: company.companyBrazil.cnpj || '',
            razaoSocial: company.companyBrazil.razaoSocial || '',
            inscricaoEstadual: company.companyBrazil.inscricaoEstadual || '',
            cnaePrincipal: company.companyBrazil.cnaePrincipal || '',
            naturezaJuridica: company.companyBrazil.naturezaJuridica || '',
            porteEmpresa: (company.companyBrazil.porteEmpresa as any) || '',
            situacaoCadastral: (company.companyBrazil.situacaoCadastral as any) || '',
          }
        : undefined,
    },
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = form

  const country = watch('country')
  const isBrazil = country === 'BR'

  const onSubmit = async (data: EditCompanyOverviewFormData) => {
    try {
      // Preparar dados para envio
      const input: UpdateCompanyInput = {
        name: data.name,
        domain: data.domain,
        country: data.country,
        timezone: data.timezone,
        billingEmail: data.billingEmail || undefined,
        logoUrl: data.logoUrl || undefined,
      }

      // Incluir dados do Brasil se o país for BR
      if (isBrazil && data.companyBrazil) {
        input.companyBrazil = {
          cnpj: data.companyBrazil.cnpj || undefined,
          razaoSocial: data.companyBrazil.razaoSocial || undefined,
          inscricaoEstadual: data.companyBrazil.inscricaoEstadual || undefined,
          cnaePrincipal: data.companyBrazil.cnaePrincipal || undefined,
          naturezaJuridica: data.companyBrazil.naturezaJuridica || undefined,
          porteEmpresa: data.companyBrazil.porteEmpresa || undefined,
          situacaoCadastral: data.companyBrazil.situacaoCadastral || undefined,
        }
      }

      await updateMutation.mutateAsync(input)

      toast({
        title: 'Sucesso!',
        description: 'Empresa atualizada com sucesso.',
        variant: 'default',
      })

      onOpenChange(false)
    } catch (error) {
      toast({
        title: 'Erro ao atualizar empresa',
        description: error instanceof Error ? error.message : 'Ocorreu um erro desconhecido.',
        variant: 'destructive',
      })
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      reset()
    }
    onOpenChange(newOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Visão Geral</DialogTitle>
          <DialogDescription>
            Atualize as informações básicas e dados fiscais da empresa.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Informações Básicas */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Informações Básicas</h3>

            <div className="space-y-2">
              <Label htmlFor="name">
                Nome da Empresa <span className="text-destructive">*</span>
              </Label>
              <Input id="name" {...register('name')} placeholder="Nome da empresa" />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="domain">
                Domínio <span className="text-destructive">*</span>
              </Label>
              <Input id="domain" {...register('domain')} placeholder="exemplo.com" />
              {errors.domain && (
                <p className="text-sm text-destructive">{errors.domain.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="billingEmail">Email de Cobrança</Label>
              <Input
                id="billingEmail"
                type="email"
                {...register('billingEmail')}
                placeholder="contato@empresa.com"
              />
              {errors.billingEmail && (
                <p className="text-sm text-destructive">{errors.billingEmail.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="country">
                  País <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={watch('country')}
                  onValueChange={(value) => setValue('country', value)}
                >
                  <SelectTrigger id="country">
                    <SelectValue placeholder="Selecione o país" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BR">Brasil</SelectItem>
                    <SelectItem value="US">Estados Unidos</SelectItem>
                    <SelectItem value="AR">Argentina</SelectItem>
                    <SelectItem value="CL">Chile</SelectItem>
                    <SelectItem value="CO">Colômbia</SelectItem>
                    <SelectItem value="MX">México</SelectItem>
                    <SelectItem value="PE">Peru</SelectItem>
                    <SelectItem value="UY">Uruguai</SelectItem>
                  </SelectContent>
                </Select>
                {errors.country && (
                  <p className="text-sm text-destructive">{errors.country.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="timezone">
                  Timezone <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={watch('timezone')}
                  onValueChange={(value) => setValue('timezone', value)}
                >
                  <SelectTrigger id="timezone">
                    <SelectValue placeholder="Selecione o timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="America/Sao_Paulo">America/Sao_Paulo</SelectItem>
                    <SelectItem value="America/New_York">America/New_York</SelectItem>
                    <SelectItem value="America/Chicago">America/Chicago</SelectItem>
                    <SelectItem value="America/Los_Angeles">America/Los_Angeles</SelectItem>
                    <SelectItem value="America/Buenos_Aires">America/Buenos_Aires</SelectItem>
                    <SelectItem value="America/Santiago">America/Santiago</SelectItem>
                    <SelectItem value="America/Bogota">America/Bogota</SelectItem>
                    <SelectItem value="America/Mexico_City">America/Mexico_City</SelectItem>
                    <SelectItem value="America/Lima">America/Lima</SelectItem>
                    <SelectItem value="America/Montevideo">America/Montevideo</SelectItem>
                  </SelectContent>
                </Select>
                {errors.timezone && (
                  <p className="text-sm text-destructive">{errors.timezone.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="logoUrl">URL do Logo</Label>
              <Input
                id="logoUrl"
                type="url"
                {...register('logoUrl')}
                placeholder="https://exemplo.com/logo.png"
              />
              {errors.logoUrl && (
                <p className="text-sm text-destructive">{errors.logoUrl.message}</p>
              )}
            </div>
          </div>

          {/* Dados Fiscais do Brasil */}
          {isBrazil && (
            <div className="space-y-4 border-t pt-4">
              <h3 className="text-sm font-semibold">Dados Fiscais (Brasil)</h3>

              <div className="space-y-2">
                <Label htmlFor="cnpj">CNPJ</Label>
                <Input
                  id="cnpj"
                  {...register('companyBrazil.cnpj')}
                  placeholder="00000000000000"
                  maxLength={14}
                />
                {errors.companyBrazil?.cnpj && (
                  <p className="text-sm text-destructive">
                    {errors.companyBrazil.cnpj.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="razaoSocial">Razão Social</Label>
                <Input
                  id="razaoSocial"
                  {...register('companyBrazil.razaoSocial')}
                  placeholder="Razão social da empresa"
                />
                {errors.companyBrazil?.razaoSocial && (
                  <p className="text-sm text-destructive">
                    {errors.companyBrazil.razaoSocial.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="inscricaoEstadual">Inscrição Estadual</Label>
                <Input
                  id="inscricaoEstadual"
                  {...register('companyBrazil.inscricaoEstadual')}
                  placeholder="Inscrição estadual"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cnaePrincipal">CNAE Principal</Label>
                <Input
                  id="cnaePrincipal"
                  {...register('companyBrazil.cnaePrincipal')}
                  placeholder="0000-0/00"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="naturezaJuridica">Natureza Jurídica</Label>
                <Input
                  id="naturezaJuridica"
                  {...register('companyBrazil.naturezaJuridica')}
                  placeholder="Ex: Sociedade Empresária Limitada"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="porteEmpresa">Porte da Empresa</Label>
                  <Select
                    value={watch('companyBrazil.porteEmpresa') || undefined}
                    onValueChange={(value) =>
                      setValue('companyBrazil.porteEmpresa', value as any)
                    }
                  >
                    <SelectTrigger id="porteEmpresa">
                      <SelectValue placeholder="Selecione o porte" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Microempresa">Microempresa</SelectItem>
                      <SelectItem value="Pequena Empresa">Pequena Empresa</SelectItem>
                      <SelectItem value="Média Empresa">Média Empresa</SelectItem>
                      <SelectItem value="Grande Empresa">Grande Empresa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="situacaoCadastral">Situação Cadastral</Label>
                  <Select
                    value={watch('companyBrazil.situacaoCadastral') || undefined}
                    onValueChange={(value) =>
                      setValue('companyBrazil.situacaoCadastral', value as any)
                    }
                  >
                    <SelectTrigger id="situacaoCadastral">
                      <SelectValue placeholder="Selecione a situação" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Ativa">Ativa</SelectItem>
                      <SelectItem value="Suspensa">Suspensa</SelectItem>
                      <SelectItem value="Inapta">Inapta</SelectItem>
                      <SelectItem value="Baixada">Baixada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={updateMutation.isPending}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
