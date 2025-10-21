/**
 * New Praise Form Hook
 * Manages the state and validation of the multi-step praise form
 */

import { useState, useCallback, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { sendCompliment } from '@/services/compliments'
import { useUser } from '@/hooks/useUser'
import { newPraiseSchema, type NewPraiseFormData, type PraiseStep } from '@/types/praise.types'
import type { SendComplimentData } from '@/types'

/**
 * Hook para gerenciar formulário de novo elogio
 */
export const useNewPraiseForm = () => {
  const navigate = useNavigate()
  const { onBalanceMovement } = useUser()
  
  // Estado do step atual
  const [currentStep, setCurrentStep] = useState<PraiseStep>(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Configuração do react-hook-form
  const form = useForm<NewPraiseFormData>({
    resolver: zodResolver(newPraiseSchema),
    mode: 'onChange',
    defaultValues: {
      userId: '',
      valueId: '',
      coins: 25,
      message: '',
    },
  })

  const { watch, setValue, trigger, formState: { errors, isValid } } = form

  // Valores atuais do formulário
  const formData = watch()

  // Memoized field validation map to avoid recreation
  const fieldsForStep = useMemo(() => ({
    0: ['userId'] as const,
    1: ['valueId'] as const,
    2: ['coins'] as const,
    3: ['message'] as const,
    4: ['userId', 'valueId', 'coins', 'message'] as const,
  }), [])

  /**
   * Valida se o step atual pode prosseguir - memoizado
   */
  const canProceed = useMemo(() => {
    switch (currentStep) {
      case 0:
        return Boolean(formData.userId)
      case 1:
        return Boolean(formData.valueId)
      case 2:
        return formData.coins >= 5 && formData.coins <= 100
      case 3:
        return formData.message.length >= 10
      case 4:
        return isValid
      default:
        return false
    }
  }, [currentStep, formData, isValid])

  /**
   * Navega para o próximo step - otimizado
   */
  const goToNextStep = useCallback(async () => {
    if (currentStep < 4) {
      // Valida o step atual antes de prosseguir
      const fieldsToValidate = fieldsForStep[currentStep]
      const isValidStep = await trigger(fieldsToValidate)
      
      if (isValidStep) {
        setCurrentStep((prev) => (prev + 1) as PraiseStep)
        setError(null)
      }
    }
  }, [currentStep, trigger, fieldsForStep])

  /**
   * Navega para o step anterior
   */
  const goToPrevStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((prev) => (prev - 1) as PraiseStep)
      setError(null)
    }
  }, [currentStep])

  /**
   * Cancela o formulário e volta para a página de elogios
   */
  const cancelForm = useCallback(() => {
    navigate({ to: '/elogios' })
  }, [navigate])

  /**
   * Submete o formulário
   */
  const submitForm = useCallback(async () => {
    if (!isValid) return

    setIsSubmitting(true)
    setError(null)

    try {
      const complimentData: SendComplimentData = {
        receiverId: formData.userId,
        valueId: parseInt(formData.valueId),
        message: formData.message,
        coins: formData.coins,
      }

      await sendCompliment(complimentData)
      
      // Invalida o saldo e mostra sucesso
      onBalanceMovement()
      setShowSuccess(true)
      
      // Redireciona após animação de sucesso
      setTimeout(() => {
        navigate({ to: '/elogios' })
      }, 2500)
      
    } catch (err) {
      setIsSubmitting(false)
      const errorMessage = err instanceof Error ? err.message : 'Erro inesperado ao enviar elogio'
      setError(errorMessage)
    }
  }, [isValid, formData, onBalanceMovement, navigate])


  /**
   * Atualiza um valor do formulário
   */
  const updateFormValue = useCallback((
    field: keyof NewPraiseFormData,
    value: string | number,
  ) => {
    setValue(field, value as string | number)
    setError(null)
  }, [setValue])

  // Retorno memoizado para evitar re-renders desnecessários
  return useMemo(() => ({
    // Estado
    currentStep,
    isSubmitting,
    showSuccess,
    error,
    formData,
    
    // Form methods
    form,
    errors,
    isValid,
    
    // Ações
    goToNextStep,
    goToPrevStep,
    cancelForm,
    submitForm,
    updateFormValue,
    canProceed,
    
    // Helpers
    setError,
  }), [
    currentStep,
    isSubmitting,
    showSuccess,
    error,
    formData,
    form,
    errors,
    isValid,
    goToNextStep,
    goToPrevStep,
    cancelForm,
    submitForm,
    updateFormValue,
    canProceed,
  ])
}

/**
 * Hook para obter informações do step atual - OTIMIZADO
 */
export const useStepInfo = (currentStep: PraiseStep) => {
  // Memoized steps array to avoid recreation
  const steps = useMemo(() => [
    { name: 'Usuário', description: 'Selecione quem você quer elogiar' },
    { name: 'Valor', description: 'Escolha o valor demonstrado' },
    { name: 'Moedas', description: 'Defina a quantidade de moedas' },
    { name: 'Mensagem', description: 'Escreva sua mensagem' },
    { name: 'Confirmar', description: 'Revise e envie o elogio' },
  ], [])

  return useMemo(() => ({
    currentStepInfo: steps[currentStep],
    totalSteps: steps.length,
    progress: ((currentStep + 1) / steps.length) * 100,
  }), [steps, currentStep])
}
