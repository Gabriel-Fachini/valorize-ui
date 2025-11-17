import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { PageLayout } from '@/components/layout/PageLayout'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useCreateCompany } from '@/hooks/useCompanyMutations'
import { useToast } from '@/hooks/useToast'
import { createCompanyWizardSchema, type CreateCompanyWizardData } from '@/components/companies/create/schemas'
import { BasicInfoStep } from '@/components/companies/create/BasicInfoStep'
import { BrazilDataStep } from '@/components/companies/create/BrazilDataStep'
import { PlanAndValuesStep } from '@/components/companies/create/PlanAndValuesStep'
import { WalletStep } from '@/components/companies/create/WalletStep'
import type { CreateCompanyInput } from '@/types/company'

const STEPS = [
  { title: 'Informações Básicas', description: 'Dados gerais da empresa' },
  { title: 'Dados Fiscais', description: 'Informações específicas do Brasil' },
  { title: 'Plano e Valores', description: 'Configuração de plano e valores da empresa' },
  { title: 'Carteira', description: 'Orçamento inicial' },
]

export function CreateCompanyPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const navigate = useNavigate()
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
        {
          title: 'Ação de Dono',
          description: 'Agir como dono do negócio, tomando decisões pensando no longo prazo',
          iconName: 'briefcase',
          iconColor: '#3B82F6',
        },
        {
          title: 'Colaboração',
          description: 'Trabalhar em equipe para alcançar objetivos comuns',
          iconName: 'users',
          iconColor: '#10B981',
        },
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
        fieldsToValidate = ['name', 'domain']
        break
      case 1:
        fieldsToValidate = ['companyBrazil']
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (currentStep < STEPS.length - 1) {
        handleNext()
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
        country: 'BR', // Fixed value for MVP
        timezone: 'America/Sao_Paulo', // Fixed value for MVP
        logoUrl: data.logoUrl || undefined,
        billingEmail: data.billingEmail || undefined,
        plan: {
          ...data.plan,
          startDate: new Date(data.plan.startDate).toISOString(),
        },
        initialValues: data.initialValues,
        initialWalletBudget: data.initialWalletBudget,
      }

      // Add Brazil-specific data
      if (data.companyBrazil?.razaoSocial) {
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

      // Navigate back to companies list
      navigate({ to: '/clients' })
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
    <PageLayout
      title="Criar Nova Empresa"
      subtitle={STEPS[currentStep].description}
      action={
        <Button
          variant="outline"
          onClick={() => navigate({ to: '/clients' })}
        >
          <i className="ph ph-x mr-2" style={{ fontSize: '1rem' }} />
          Cancelar
        </Button>
      }
    >
      <div className="mx-auto max-w-4xl">
        {/* Progress Indicator */}
        <Card className="mb-6 p-6">
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => (
              <div
                key={index}
                className="flex flex-1 items-center"
              >
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors ${
                      index <= currentStep
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-muted bg-muted text-muted-foreground'
                    }`}
                  >
                    {index + 1}
                  </div>
                  <span className="mt-2 text-xs text-center font-medium">{step.title}</span>
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
        </Card>

        {/* Step Content */}
        <Card className="p-6">
          <form onSubmit={form.handleSubmit(onSubmit)} onKeyDown={handleKeyDown}>
            <div className="min-h-[250px]">{renderStep()}</div>

            <div className="mt-8 flex justify-between border-t pt-6">
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
          </form>
        </Card>
      </div>
    </PageLayout>
  )
}
