import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useCreateCompany } from '@/hooks/useCompanyMutations'
import { useToast } from '@/hooks/useToast'
import { createCompanyWizardSchema, type CreateCompanyWizardData } from './schemas'
import { BasicInfoStep } from './BasicInfoStep'
import { BrazilDataStep } from './BrazilDataStep'
import { PlanAndValuesStep } from './PlanAndValuesStep'
import { WalletStep } from './WalletStep'
import type { CreateCompanyInput } from '@/types/company'

interface CreateCompanyDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const STEPS = [
  { title: 'Informações Básicas', description: 'Dados gerais da empresa' },
  { title: 'Dados Fiscais', description: 'Informações específicas do Brasil' },
  { title: 'Plano e Valores', description: 'Configuração de plano e valores da empresa' },
  { title: 'Carteira', description: 'Orçamento inicial' },
]

export function CreateCompanyDialog({ open, onOpenChange }: CreateCompanyDialogProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const { toast } = useToast()
  const createCompanyMutation = useCreateCompany()

  const form = useForm<CreateCompanyWizardData>({
    // @ts-expect-error - Type compatibility issue between Zod and react-hook-form
    resolver: zodResolver(createCompanyWizardSchema),
    defaultValues: {
      country: 'BR',
      timezone: 'America/Sao_Paulo',
      plan: {
        planType: undefined,
        pricePerUser: 0,
        startDate: new Date().toISOString().split('T')[0],
      },
      initialValues: [
        { title: '', description: '', iconName: 'star', iconColor: '#3B82F6' },
        { title: '', description: '', iconName: 'heart', iconColor: '#EF4444' },
      ],
      initialWalletBudget: 0,
      companyBrazil: {
        cnpj: '',
        razaoSocial: '',
        situacaoCadastral: 'Ativa',
      },
    },
  })

  const handleNext = async () => {
    // Validate current step before proceeding
    let fieldsToValidate: (keyof CreateCompanyWizardData)[] = []

    switch (currentStep) {
      case 0:
        fieldsToValidate = ['name', 'domain', 'country', 'timezone']
        break
      case 1:
        if (form.watch('country') === 'BR') {
          fieldsToValidate = ['companyBrazil']
        }
        break
      case 2:
        fieldsToValidate = ['plan', 'initialValues']
        break
      case 3:
        fieldsToValidate = ['initialWalletBudget']
        break
    }

    const isValid = await form.trigger(fieldsToValidate as any)

    if (isValid) {
      if (currentStep < STEPS.length - 1) {
        setCurrentStep(currentStep + 1)
      }
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const onSubmit = async (data: CreateCompanyWizardData) => {
    try {
      // Transform wizard data to API format
      const input: CreateCompanyInput = {
        name: data.name,
        domain: data.domain,
        country: data.country,
        timezone: data.timezone,
        logoUrl: data.logoUrl || undefined,
        billingEmail: data.billingEmail || undefined,
        plan: data.plan,
        initialValues: data.initialValues,
        initialWalletBudget: data.initialWalletBudget,
      }

      // Add Brazil-specific data if country is BR
      if (data.country === 'BR' && data.companyBrazil?.razaoSocial) {
        input.companyBrazil = {
          cnpj: data.companyBrazil.cnpj || '',
          razaoSocial: data.companyBrazil.razaoSocial,
          inscricaoEstadual: data.companyBrazil.inscricaoEstadual,
          cnaePrincipal: data.companyBrazil.cnaePrincipal,
          naturezaJuridica: data.companyBrazil.naturezaJuridica,
          porteEmpresa: data.companyBrazil.porteEmpresa,
          situacaoCadastral: data.companyBrazil.situacaoCadastral,
        }
      }

      await createCompanyMutation.mutateAsync(input)

      toast({
        title: 'Empresa criada com sucesso!',
        description: `${data.name} foi cadastrada no sistema.`,
        variant: 'default',
      })

      // Reset form and close dialog
      form.reset()
      setCurrentStep(0)
      onOpenChange(false)
    } catch (error) {
      toast({
        title: 'Erro ao criar empresa',
        description: error instanceof Error ? error.message : 'Ocorreu um erro ao criar a empresa',
        variant: 'destructive',
      })
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <BasicInfoStep form={form} />
      case 1:
        return <BrazilDataStep form={form} />
      case 2:
        return <PlanAndValuesStep form={form} />
      case 3:
        return <WalletStep form={form} />
      default:
        return null
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Criar Nova Empresa</DialogTitle>
          <DialogDescription>
            {STEPS[currentStep].description}
          </DialogDescription>
        </DialogHeader>

        {/* Progress Indicator */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            {STEPS.map((step, index) => (
              <div
                key={index}
                className="flex flex-1 items-center"
              >
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors ${
                      index <= currentStep
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-muted bg-muted text-muted-foreground'
                    }`}
                  >
                    {index + 1}
                  </div>
                  <span className="mt-1 text-xs text-center hidden sm:block">{step.title}</span>
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={`h-0.5 flex-1 transition-colors ${
                      index < currentStep ? 'bg-primary' : 'bg-muted'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="min-h-[400px]">{renderStep()}</div>

          <DialogFooter className="mt-6">
            <div className="flex w-full justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 0}
              >
                <i className="ph ph-caret-left mr-2" style={{ fontSize: '1rem' }} />
                Voltar
              </Button>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    form.reset()
                    setCurrentStep(0)
                    onOpenChange(false)
                  }}
                >
                  Cancelar
                </Button>

                {currentStep < STEPS.length - 1 ? (
                  <Button type="button" onClick={handleNext}>
                    Próximo
                    <i className="ph ph-caret-right ml-2" style={{ fontSize: '1rem' }} />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={createCompanyMutation.isPending}
                  >
                    {createCompanyMutation.isPending ? (
                      <>
                        <i className="ph ph-circle-notch animate-spin mr-2" style={{ fontSize: '1rem' }} />
                        Criando...
                      </>
                    ) : (
                      <>
                        <i className="ph ph-check mr-2" style={{ fontSize: '1rem' }} />
                        Criar Empresa
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
