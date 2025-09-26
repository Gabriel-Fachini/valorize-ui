import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'
import { emailSchema, companySchema, employeeCountSchema } from '../../utils/validation'

const trialSchema = z.object({
  email: emailSchema,
  company: companySchema,
  employees: employeeCountSchema,
})

type TrialFormData = z.infer<typeof trialSchema>

interface TrialFormProps {
  onSuccess?: () => void
  onClose?: () => void
}

export const TrialForm: React.FC<TrialFormProps> = ({ onSuccess, onClose }) => {
  const [isSuccess, setIsSuccess] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting },
    reset 
  } = useForm<TrialFormData>({
    resolver: zodResolver(trialSchema)
  })

  const employeeOptions = [
    { value: '1-10', label: '1-10 colaboradores' },
    { value: '11-50', label: '11-50 colaboradores' },
    { value: '51-200', label: '51-200 colaboradores' },
    { value: '200+', label: 'Mais de 200 colaboradores' },
  ]

  const onSubmit = async (data: TrialFormData) => {
    try {
      setServerError(null)
      
      // Simulate API call - replace with actual endpoint
      const response = await fetch('/api/trial', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      })
      
      if (!response.ok) {
        throw new Error('Erro ao processar solicitação')
      }

      const result = await response.json()
      
      if (result.success) {
        setIsSuccess(true)
        reset()
        onSuccess?.()
        
        // Analytics tracking
        if (typeof window !== 'undefined' && 'gtag' in window) {
          const gtag = (window as unknown as { gtag: (event: string, action: string, params: Record<string, string>) => void }).gtag
          gtag('event', 'trial_signup_completed', {
            event_category: 'engagement',
            event_label: data.company,
            employee_count: data.employees
          })
        }
      } else {
        throw new Error(result.message || 'Erro desconhecido')
      }
    } catch (error) {
      console.error('Trial signup failed:', error)
      setServerError(error instanceof Error ? error.message : 'Erro interno do servidor')
    }
  }

  if (isSuccess) {
    return (
      <div className="text-center space-y-6">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Parabéns! 🎉
          </h3>
          <p className="text-gray-600 mb-4">
            Sua conta trial foi criada com sucesso. Verifique seu email para acessar a plataforma.
          </p>
          <p className="text-sm text-gray-500">
            Enviamos as credenciais de acesso para seu email. Se não encontrar, verifique a caixa de spam.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            onClick={onClose}
            variant="outline" 
            className="flex-1"
          >
            Fechar
          </Button>
          <Button 
            onClick={() => setIsSuccess(false)}
            className="flex-1"
          >
            Criar Outra Conta
          </Button>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Comece seu teste gratuito
        </h3>
        <p className="text-gray-600">
          14 dias gratuitos • Sem cartão de crédito • Cancelamento a qualquer momento
        </p>
      </div>

      {serverError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-800">{serverError}</p>
            </div>
          </div>
        </div>
      )}

      <Input
        {...register('email')}
        type="email"
        label="Email corporativo"
        placeholder="seu.email@empresa.com"
        error={errors.email?.message}
        autoComplete="email"
      />

      <Input
        {...register('company')}
        label="Nome da empresa"
        placeholder="Nome da sua empresa"
        error={errors.company?.message}
        autoComplete="organization"
      />

      <Select
        {...register('employees')}
        label="Número de colaboradores"
        options={employeeOptions}
        placeholder="Selecione o tamanho da empresa"
        error={errors.employees?.message}
      />

      <Button 
        type="submit" 
        size="lg"
        loading={isSubmitting}
        className="w-full"
      >
        {isSubmitting ? 'Criando conta...' : 'Começar Teste Gratuito - 14 dias'}
      </Button>

      <p className="text-xs text-gray-500 text-center">
        Ao criar sua conta, você concorda com nossos{' '}
        <a href="/termos" className="text-brand-primary-600 hover:underline">
          Termos de Uso
        </a>{' '}
        e{' '}
        <a href="/privacidade" className="text-brand-primary-600 hover:underline">
          Política de Privacidade
        </a>
        .
      </p>
    </form>
  )
}