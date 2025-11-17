import { useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CreateCompanyWizardData } from './schemas'
import {
  consultCNPJ,
  isValidCNPJFormat,
  mapPorteEmpresa,
  mapSituacaoCadastral,
  formatCNPJ,
  formatCNPJWithMask
} from '@/services/cnpj'
import { useToast } from '@/hooks/useToast'

interface BrazilDataStepProps {
  form: UseFormReturn<CreateCompanyWizardData>
}

export function BrazilDataStep({ form }: BrazilDataStepProps) {
  const { register, formState: { errors }, watch, setValue } = form
  const { toast } = useToast()
  const country = watch('country')
  const cnpj = watch('companyBrazil.cnpj')

  const [isLoadingCNPJ, setIsLoadingCNPJ] = useState(false)
  const [cnpjStatus, setCnpjStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [displayCNPJ, setDisplayCNPJ] = useState('')

  // Handle CNPJ input change - format as user types
  const handleCNPJChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = formatCNPJ(e.target.value)
    const maskedValue = formatCNPJWithMask(rawValue)

    setDisplayCNPJ(maskedValue)
    setValue('companyBrazil.cnpj', rawValue)
    setCnpjStatus('idle')
  }

  // Handle paste - clean formatting and apply mask
  const handleCNPJPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedText = e.clipboardData.getData('text')
    const cleanedCNPJ = formatCNPJ(pastedText)
    const maskedCNPJ = formatCNPJWithMask(cleanedCNPJ)

    setDisplayCNPJ(maskedCNPJ)
    setValue('companyBrazil.cnpj', cleanedCNPJ)
    setCnpjStatus('idle')
  }

  const handleConsultCNPJ = async () => {
    if (!cnpj || !isValidCNPJFormat(cnpj)) {
      toast({
        title: 'CNPJ inválido',
        description: 'Digite um CNPJ válido com 14 dígitos',
        variant: 'destructive',
      })
      return
    }

    setIsLoadingCNPJ(true)
    setCnpjStatus('idle')

    try {
      const data = await consultCNPJ(cnpj)

      // Auto-fill form fields
      setValue('companyBrazil.razaoSocial', data.razao_social)
      setValue('companyBrazil.naturezaJuridica', data.natureza_juridica)
      setValue('companyBrazil.cnaePrincipal', `${data.cnae_fiscal}`)

      const porte = mapPorteEmpresa(data.porte)
      if (porte) {
        setValue('companyBrazil.porteEmpresa', porte)
      }

      const situacao = mapSituacaoCadastral(data.situacao_cadastral)
      setValue('companyBrazil.situacaoCadastral', situacao)

      setCnpjStatus('success')
      toast({
        title: 'CNPJ consultado com sucesso!',
        description: `Dados de ${data.razao_social} foram preenchidos`,
        variant: 'default',
      })
    } catch (error) {
      setCnpjStatus('error')
      toast({
        title: 'Erro ao consultar CNPJ',
        description: error instanceof Error ? error.message : 'Ocorreu um erro ao consultar o CNPJ',
        variant: 'destructive',
      })
    } finally {
      setIsLoadingCNPJ(false)
    }
  }

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
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                id="cnpj"
                value={displayCNPJ}
                onChange={handleCNPJChange}
                onPaste={handleCNPJPaste}
                placeholder="00.000.000/0000-00"
                maxLength={18}
                className={
                  cnpjStatus === 'success'
                    ? 'border-green-500'
                    : cnpjStatus === 'error'
                    ? 'border-red-500'
                    : ''
                }
              />
              {cnpjStatus === 'success' && (
                <i
                  className="ph ph-check-circle absolute right-3 top-1/2 -translate-y-1/2 text-green-500"
                  style={{ fontSize: '1.25rem' }}
                />
              )}
              {cnpjStatus === 'error' && (
                <i
                  className="ph ph-x-circle absolute right-3 top-1/2 -translate-y-1/2 text-red-500"
                  style={{ fontSize: '1.25rem' }}
                />
              )}
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={handleConsultCNPJ}
              disabled={isLoadingCNPJ || !cnpj || cnpj.length !== 14}
            >
              {isLoadingCNPJ ? (
                <i className="ph ph-circle-notch animate-spin" style={{ fontSize: '1rem' }} />
              ) : (
                <>
                  <i className="ph ph-magnifying-glass mr-2" style={{ fontSize: '1rem' }} />
                  Consultar
                </>
              )}
            </Button>
          </div>
          {errors.companyBrazil?.cnpj && (
            <p className="text-sm text-destructive">{errors.companyBrazil.cnpj.message}</p>
          )}
          <p className="text-xs text-muted-foreground">
            Cole ou digite o CNPJ. Clique em "Consultar" para preencher automaticamente
          </p>
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
