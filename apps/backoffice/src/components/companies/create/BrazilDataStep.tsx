import { UseFormReturn } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CreateCompanyWizardData } from './schemas'

interface BrazilDataStepProps {
  form: UseFormReturn<CreateCompanyWizardData>
}

export function BrazilDataStep({ form }: BrazilDataStepProps) {
  const { register, formState: { errors }, watch, setValue } = form
  const country = watch('country')

  // Only show if country is Brazil
  if (country !== 'BR') {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <p className="text-muted-foreground">
          Dados fiscais são aplicáveis apenas para empresas do Brasil
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="cnpj">CNPJ *</Label>
          <Input
            id="cnpj"
            {...register('companyBrazil.cnpj')}
            placeholder="00000000000000"
            maxLength={14}
          />
          {errors.companyBrazil?.cnpj && (
            <p className="text-sm text-destructive">{errors.companyBrazil.cnpj.message}</p>
          )}
          <p className="text-xs text-muted-foreground">Apenas números, sem pontuação</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="inscricaoEstadual">Inscrição Estadual</Label>
          <Input
            id="inscricaoEstadual"
            {...register('companyBrazil.inscricaoEstadual')}
            placeholder="000000000000"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="razaoSocial">Razão Social *</Label>
        <Input
          id="razaoSocial"
          {...register('companyBrazil.razaoSocial')}
          placeholder="Ex: Acme Corporation LTDA"
        />
        {errors.companyBrazil?.razaoSocial && (
          <p className="text-sm text-destructive">{errors.companyBrazil.razaoSocial.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="cnaePrincipal">CNAE Principal</Label>
        <Input
          id="cnaePrincipal"
          {...register('companyBrazil.cnaePrincipal')}
          placeholder="Ex: 6201-5/00"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="naturezaJuridica">Natureza Jurídica</Label>
        <Input
          id="naturezaJuridica"
          {...register('companyBrazil.naturezaJuridica')}
          placeholder="Ex: Sociedade Limitada"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="porteEmpresa">Porte da Empresa</Label>
          <Select
            value={watch('companyBrazil.porteEmpresa') || ''}
            onValueChange={(value) => setValue('companyBrazil.porteEmpresa', value as any)}
          >
            <SelectTrigger>
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
            value={watch('companyBrazil.situacaoCadastral') || 'Ativa'}
            onValueChange={(value) => setValue('companyBrazil.situacaoCadastral', value as any)}
          >
            <SelectTrigger>
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
  )
}
