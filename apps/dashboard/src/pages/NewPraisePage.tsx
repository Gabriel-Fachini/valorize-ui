/**
 * New Praise Page
 * Página refatorada seguindo padrões de PraisesPage com componentes extraídos
 */

import { useState, useEffect } from 'react'
import { useSearch } from '@tanstack/react-router'
import { animated } from '@react-spring/web'
import { usePraisesData } from '@/hooks/usePraisesData'
import { useNewPraiseForm, useStepInfo } from '@/hooks/useNewPraiseForm'
import { usePageEntrance, useCardEntrance } from '@/hooks/useAnimations'
import { PageLayout } from '@/components/layout/PageLayout'
import { SuccessOverlay } from '@/components/ui/SuccessOverlay'
import {
  NewPraiseSkeleton,
  NewPraiseError,
  ProgressBar,
  StepHeader,
  StepNavigation,
  UserSelectionStep,
  ValueSelectionStep,
  CoinSelectionStep,
  MessageStep,
  ConfirmationStep,
} from '@/components/praises/new-praise'

export const NewPraisePage = () => {
  const searchParams = useSearch({ strict: false }) as { userId?: string }
  const { users, companyValues, loading, computed, actions } = usePraisesData()
  
  // Form management
  const {
    currentStep,
    isSubmitting,
    showSuccess,
    error,
    formData,
    errors,
    goToNextStep,
    goToPrevStep,
    cancelForm,
    submitForm,
    updateFormValue,
  } = useNewPraiseForm()

  // Step info
  const { currentStepInfo, totalSteps } = useStepInfo(currentStep)

  // Search state for user selection
  const [searchQuery, setSearchQuery] = useState('')

  // Pre-select user from URL params if provided
  useEffect(() => {
    if (searchParams?.userId && users.length > 0 && !formData.userId) {
      const preSelectedUser = users.find(u => u.id === searchParams.userId)
      if (preSelectedUser) {
        updateFormValue('userId', preSelectedUser.id)
        // Move to next step (Value selection)
        if (currentStep === 0) {
          goToNextStep()
        }
      }
    }
  }, [searchParams?.userId, users, formData.userId, currentStep, updateFormValue, goToNextStep])

  // Animations
  const pageAnimation = usePageEntrance()
  const cardAnimation = useCardEntrance()

  // Data loading states
  const isLoadingData = loading.users || loading.values
  const hasDataError = computed.hasAnyError || !computed.hasUsers || !computed.hasCompanyValues
  
  const getDataErrorMessage = () => {
    if (computed.combinedErrorMessage) return computed.combinedErrorMessage
    if (!computed.hasUsers) return 'Nenhum usuário disponível para receber elogios.'
    if (!computed.hasCompanyValues) return 'Nenhum valor da empresa configurado.'
    return 'Erro ao carregar dados necessários.'
  }

  // Get selected items for display
  const selectedUser = users.find(u => u.id === formData.userId) || null
  const selectedValue = companyValues.find(v => v.id === formData.valueId) || null

  // Render current step
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <UserSelectionStep
            selectedItem={selectedUser}
            onSelect={(user) => updateFormValue('userId', user.id)}
            items={users}
            loading={loading.users}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onNext={goToNextStep}
            onPrev={goToPrevStep}
            onCancel={cancelForm}
            isSubmitting={isSubmitting}
          />
        )
      
      case 1:
        return (
          <ValueSelectionStep
            selectedItem={selectedValue}
            onSelect={(value) => updateFormValue('valueId', value.id)}
            items={companyValues}
            loading={loading.values}
            selectedUserName={selectedUser?.name}
            onNext={goToNextStep}
            onPrev={goToPrevStep}
            onCancel={cancelForm}
            isSubmitting={isSubmitting}
          />
        )
      
      case 2:
        return (
          <CoinSelectionStep
            coinAmount={formData.coins}
            onCoinChange={(amount) => updateFormValue('coins', amount)}
            onNext={goToNextStep}
            onPrev={goToPrevStep}
            onCancel={cancelForm}
            isSubmitting={isSubmitting}
          />
        )
      
      case 3:
        return (
          <MessageStep
            value={formData.message}
            onChange={(message) => updateFormValue('message', message)}
            error={errors.message?.message}
            onNext={goToNextStep}
            onPrev={goToPrevStep}
            onCancel={cancelForm}
            isSubmitting={isSubmitting}
          />
        )
      
      case 4:
        return (
          <ConfirmationStep
            formData={formData}
            selectedUser={selectedUser}
            selectedValue={selectedValue}
            onNext={submitForm}
            onPrev={goToPrevStep}
            onCancel={cancelForm}
            isSubmitting={isSubmitting}
          />
        )
      
      default:
        return null
    }
  }

  return (
    <PageLayout maxWidth="5xl">
      <animated.div style={pageAnimation} className="space-y-6">
        {/* Show skeleton while loading */}
        {isLoadingData && <NewPraiseSkeleton />}
        
        {/* Show error if data failed to load */}
        {!isLoadingData && hasDataError && (
          <NewPraiseError 
            error={getDataErrorMessage()} 
            onRetry={() => {
              actions.refreshUsers()
              actions.refreshValues()
            }} 
          />
        )}
        
        {/* Show form only when data is loaded successfully */}
        {!isLoadingData && !hasDataError && (
          <>
            {/* Header */}
            <div>
              <button
                onClick={cancelForm}
                className="mb-6 flex items-center space-x-2 text-[#525252] dark:text-[#a3a3a3] hover:text-[#171717] dark:hover:text-[#f5f5f5] transition-colors"
              >
                <i className="ph-bold ph-arrow-left text-xl"></i>
                <span className="font-medium">Voltar para Elogios</span>
              </button>
              
              <StepHeader
                title={currentStepInfo.name}
                description={currentStepInfo.description}
                stepNumber={currentStep + 1}
                totalSteps={totalSteps}
              />

              <ProgressBar
                currentStep={currentStep}
                totalSteps={totalSteps}
              />
            </div>

            {/* Error Message */}
            {error && (
              <animated.div 
                style={cardAnimation}
                className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700/50 rounded-xl"
              >
                <div className="flex items-center space-x-2">
                  <i className="ph-bold ph-warning-circle text-red-500 text-xl"></i>
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              </animated.div>
            )}

            {/* Main Content */}
            <animated.div style={cardAnimation}>
              {renderCurrentStep()}
            </animated.div>

            {/* Navigation Buttons */}
            <StepNavigation
              currentStep={currentStep}
              isLastStep={currentStep === 4}
              onNext={currentStep === 4 ? submitForm : goToNextStep}
              onPrev={goToPrevStep}
              onCancel={cancelForm}
              isSubmitting={isSubmitting}
            />
          </>
        )}

        {/* Success Overlay */}
        <SuccessOverlay
          isVisible={showSuccess}
          coinAmount={formData.coins}
          userName={selectedUser?.name}
          valueName={selectedValue?.name}
          valueIcon={selectedValue?.icon}
          valueColor={selectedValue?.color}
        />
      </animated.div>
    </PageLayout>
  )
}