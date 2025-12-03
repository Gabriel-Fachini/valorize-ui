import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Modal } from '../ui/Modal'
import { TrialForm } from './TrialForm'

const newsletterSchema = z.object({
  email: z.string().min(1, 'Email é obrigatório').email('Email inválido'),
})

type NewsletterFormData = z.infer<typeof newsletterSchema>

interface NewsletterFormProps {
  className?: string
  placeholder?: string
  buttonText?: string
}

export const NewsletterForm: React.FC<NewsletterFormProps> = ({ 
  className = '',
  placeholder = 'seu.email@empresa.com',
  buttonText = 'Inscrever-se'
}) => {
  const [isSuccess, setIsSuccess] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [showTrialModal, setShowTrialModal] = useState(false)

  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting },
    reset 
  } = useForm<NewsletterFormData>({
    resolver: zodResolver(newsletterSchema)
  })

  const onSubmit = async (data: NewsletterFormData) => {
    try {
      setServerError(null)
      
      // Simulate API call - replace with actual endpoint
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      })
      
      if (!response.ok) {
        throw new Error('Erro ao inscrever-se na newsletter')
      }

      const result = await response.json()
      
      if (result.success) {
        setIsSuccess(true)
        reset()
        
        // Show trial modal after successful newsletter signup
        setTimeout(() => {
          setShowTrialModal(true)
        }, 1500)
        
        // Analytics tracking
        if (typeof window !== 'undefined' && 'gtag' in window) {
          const gtag = (window as unknown as { gtag: (event: string, action: string, params: Record<string, string>) => void }).gtag
          gtag('event', 'newsletter_signup', {
            event_category: 'engagement',
            event_label: 'newsletter'
          })
        }
      } else {
        throw new Error(result.message || 'Erro desconhecido')
      }
    } catch (error) {
      console.error('Newsletter signup failed:', error)
      setServerError(error instanceof Error ? error.message : 'Erro interno do servidor')
    }
  }

  const handleTrialSuccess = () => {
    setShowTrialModal(false)
    // Redirect to dashboard or show another success message
  }

  if (isSuccess) {
    return (
      <div className={`text-center space-y-4 ${className}`}>
        <div className="flex items-center justify-center space-x-2 text-valorize-500">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="font-semibold">Inscrição realizada com sucesso!</span>
        </div>
        <p className="text-sm text-zinc-400">
          Você receberá nossas novidades e dicas sobre cultura empresarial.
        </p>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setIsSuccess(false)}
        >
          Inscrever outro email
        </Button>
      </div>
    )
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className={className}>
        {serverError && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-800">{serverError}</p>
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <Input
              {...register('email')}
              type="email"
              placeholder={placeholder}
              error={errors.email?.message}
              autoComplete="email"
              className="h-12"
            />
          </div>
          <Button 
            type="submit" 
            size="lg"
            loading={isSubmitting}
            className="sm:w-auto"
          >
            {isSubmitting ? 'Inscrevendo...' : buttonText}
          </Button>
        </div>
        
        <p className="text-xs text-gray-500 mt-2">
          Sem spam. Cancele a qualquer momento.
        </p>
      </form>

      {/* Trial Modal */}
      <Modal 
        isOpen={showTrialModal}
        onClose={() => setShowTrialModal(false)}
        className="max-w-lg"
      >
        <TrialForm 
          onSuccess={handleTrialSuccess}
          onClose={() => setShowTrialModal(false)}
        />
      </Modal>
    </>
  )
}