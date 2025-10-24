import { useState, useCallback, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { sendCompliment } from '@/services/compliments'
import { useUser } from '@/hooks/useUser'
import { newPraiseSchema, type NewPraiseFormData, type PraiseStep } from '@/types/praise.types'
import type { SendComplimentData } from '@/types'

export const useNewPraiseForm = () => {
  const navigate = useNavigate()
  const { onBalanceMovement } = useUser()
  
  const [currentStep, setCurrentStep] = useState<PraiseStep>(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

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

  const formData = watch()

  const fieldsForStep = useMemo(() => ({
    0: ['userId'] as const,
    1: ['valueId'] as const,
    2: ['coins'] as const,
    3: ['message'] as const,
    4: ['userId', 'valueId', 'coins', 'message'] as const,
  }), [])

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

  const goToNextStep = useCallback(async () => {
    if (currentStep < 4) {
      const fieldsToValidate = fieldsForStep[currentStep]
      const isValidStep = await trigger(fieldsToValidate)
      
      if (isValidStep) {
        const nextStep = (currentStep + 1) as PraiseStep
        setCurrentStep(nextStep)
        setError(null)
      }
    }
  }, [currentStep, trigger, fieldsForStep])

  const goToPrevStep = useCallback(() => {
    if (currentStep > 0) {
      const prevStep = (currentStep - 1) as PraiseStep
      setCurrentStep(prevStep)
      setError(null)
    }
  }, [currentStep])

  const cancelForm = useCallback(() => {
    navigate({ to: '/elogios' })
  }, [navigate])

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
      
      onBalanceMovement()
      setShowSuccess(true)
      
    } catch (err) {
      setIsSubmitting(false)
      const errorMessage = err instanceof Error ? err.message : 'Erro inesperado ao enviar elogio'
      setError(errorMessage)
    }
  }, [isValid, formData, onBalanceMovement])


  const updateFormValue = useCallback((
    field: keyof NewPraiseFormData,
    value: string | number,
  ) => {
    setValue(field, value as string | number)
    setError(null)
  }, [setValue])

  const resetForm = useCallback(() => {
    form.reset()
    setCurrentStep(0)
    setShowSuccess(false)
    setError(null)
  }, [form])

  return useMemo(() => ({
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
    resetForm,
    canProceed,
    
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
    resetForm,
    canProceed,
  ])
}

export const useStepInfo = (currentStep: PraiseStep) => {
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
