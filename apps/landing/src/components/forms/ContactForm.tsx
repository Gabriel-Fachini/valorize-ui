import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { emailSchema, nameSchema, companySchema, phoneSchema } from '../../utils/validation'

const contactSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  company: companySchema,
  phone: phoneSchema.optional(),
  message: z.string()
    .min(10, 'Mensagem deve ter pelo menos 10 caracteres')
    .max(1000, 'Mensagem deve ter no máximo 1000 caracteres'),
})

type ContactFormData = z.infer<typeof contactSchema>

interface ContactFormProps {
  onSuccess?: () => void
}

export const ContactForm: React.FC<ContactFormProps> = ({ onSuccess }) => {
  const [isSuccess, setIsSuccess] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting },
    reset 
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema)
  })

  const onSubmit = async (data: ContactFormData) => {
    try {
      setServerError(null)
      
      // Simulate API call - replace with actual endpoint
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      })
      
      if (!response.ok) {
        throw new Error('Erro ao enviar mensagem')
      }

      const result = await response.json()
      
      if (result.success) {
        setIsSuccess(true)
        reset()
        onSuccess?.()
        
        // Analytics tracking
        if (typeof window !== 'undefined' && 'gtag' in window) {
          const gtag = (window as unknown as { gtag: (event: string, action: string, params: Record<string, string>) => void }).gtag
          gtag('event', 'contact_form_submitted', {
            event_category: 'engagement',
            event_label: data.company
          })
        }
      } else {
        throw new Error(result.message || 'Erro desconhecido')
      }
    } catch (error) {
      console.error('Contact form submission failed:', error)
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
            Mensagem enviada! 📧
          </h3>
          <p className="text-zinc-300 mb-4">
            Recebemos sua mensagem e entraremos em contato em até 24 horas.
          </p>
          <p className="text-sm text-zinc-400">
            Nossa equipe está ansiosa para ajudar sua empresa a crescer com a Valorize.
          </p>
        </div>
        
        <Button 
          onClick={() => setIsSuccess(false)}
          variant="outline"
        >
          Enviar Outra Mensagem
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Entre em contato
        </h3>
        <p className="text-gray-600">
          Fale conosco e descubra como o Valorize pode transformar sua empresa.
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          {...register('name')}
          label="Nome completo"
          placeholder="Seu nome"
          error={errors.name?.message}
          autoComplete="name"
        />

        <Input
          {...register('email')}
          type="email"
          label="Email"
          placeholder="seu.email@empresa.com"
          error={errors.email?.message}
          autoComplete="email"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          {...register('company')}
          label="Empresa"
          placeholder="Nome da sua empresa"
          error={errors.company?.message}
          autoComplete="organization"
        />

        <Input
          {...register('phone')}
          type="tel"
          label="Telefone (opcional)"
          placeholder="(11) 99999-9999"
          error={errors.phone?.message}
          autoComplete="tel"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
          Mensagem
        </label>
        <textarea
          {...register('message')}
          id="message"
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary-100 focus:border-brand-primary-500 resize-none"
          placeholder="Conte-nos sobre sua empresa e como podemos ajudar..."
        />
        {errors.message && (
          <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
        )}
      </div>

      <Button 
        type="submit" 
        size="lg"
        loading={isSubmitting}
        className="w-full"
      >
        {isSubmitting ? 'Enviando...' : 'Enviar Mensagem'}
      </Button>

      <p className="text-xs text-gray-500 text-center">
        Ao enviar esta mensagem, você concorda em receber comunicações da Valorize.
      </p>
    </form>
  )
}