import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { urls } from '../../constants/urls'

const trialSchema = z.object({
  email: z
    .string()
    .min(1, 'Email é obrigatório')
    .email('Digite um email válido'),
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

  const onSubmit = async (data: TrialFormData) => {
    try {
      setServerError(null)
      
      const response = await fetch(`${urls.api}/trial-requests`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
          source: 'landing_page',
          timestamp: new Date().toISOString(),
        })
      })
      
      if (!response.ok) {
        throw new Error('Erro ao processar solicitação')
      }

      setIsSuccess(true)
      reset()
      onSuccess?.()
      
      // Analytics tracking
      if (typeof window !== 'undefined' && 'gtag' in window) {
        const gtag = (window as unknown as { gtag: (event: string, action: string, params: Record<string, string>) => void }).gtag
        gtag('event', 'trial_signup_completed', {
          event_category: 'engagement',
          event_label: data.email,
          user_name: data.name
        })
      }
    } catch (error) {
      console.error('Trial signup failed:', error)
      setServerError(error instanceof Error ? error.message : 'Erro interno do servidor')
    }
  }

  if (isSuccess) {
    return (
      <div className="text-center space-y-6">
        <div className="w-16 h-16 bg-valorize-500/10 rounded-full flex items-center justify-center mx-auto">
          <svg className="w-8 h-8 text-valorize-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <div>
          <h3 className="text-xl font-semibold text-zinc-100 mb-2">
            Sucesso! 🎉
          </h3>
          <p className="text-zinc-300 mb-4">
            Recebemos sua solicitação de teste gratuito. Nossa equipe entrará em contato em breve!
          </p>
          <p className="text-sm text-zinc-400">
            Você receberá um email com as próximas etapas em alguns minutos.
          </p>
        </div>
        
        <button 
          onClick={onClose}
          className="w-full px-6 py-3 text-base font-medium text-zinc-300 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500 focus:ring-offset-zinc-900"
        >
          Fechar
        </button>
      </div>
    )
  }

  return (
    <div>
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Teste Gratuito - 14 Dias
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Descubra como o Valorize pode transformar a cultura da sua empresa
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">        
        {serverError && (
          <div 
            className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4"
            role="alert"
            aria-live="polite"
          >
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800 dark:text-red-400">{serverError}</p>
              </div>
            </div>
          </div>
        )}

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Email corporativo
          </label>
          <input
            id="email"
            type="email"
            placeholder="seu@empresa.com"
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            aria-describedby={errors.email ? "email-error" : undefined}
            aria-invalid={errors.email ? "true" : "false"}
            {...register('email')}
          />
          {errors.email && (
            <p 
              id="email-error" 
              className="mt-1 text-sm text-red-600 dark:text-red-400"
              role="alert"
              aria-live="polite"
            >
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-lg text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 dark:focus:ring-offset-gray-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Enviando...
              </>
            ) : (
              'Começar Teste Gratuito'
            )}
          </button>
          
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 text-base font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:focus:ring-offset-gray-800"
          >
            Cancelar
          </button>
        </div>
      </form>

      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Dados protegidos
          </div>
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Sem compromisso
          </div>
        </div>
      </div>
    </div>
  )
}