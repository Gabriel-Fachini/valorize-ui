import { useState, useEffect, useMemo, useCallback, memo } from 'react'
import { useSearch, Navigate } from '@tanstack/react-router'
import { animated } from '@react-spring/web'
import { useAuth } from '@/hooks/useAuth'
import { usePraisesData, type PraiseUser, type PraiseCompanyValue } from '@/hooks/usePraisesData'
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

const MemoizedUserSelectionStep = memo(UserSelectionStep)
const MemoizedValueSelectionStep = memo(ValueSelectionStep)
const MemoizedCoinSelectionStep = memo(CoinSelectionStep)
const MemoizedMessageStep = memo(MessageStep)
const MemoizedConfirmationStep = memo(ConfirmationStep)

export const NewPraisePage = () => {
  const searchParams = useSearch({ strict: false }) as { userId?: string }
  const { user, isLoading: authLoading } = useAuth()
  
  const { users, companyValues, loading, computed, actions } = usePraisesData()
  
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

  const { currentStepInfo, totalSteps } = useStepInfo(currentStep)

  // Search state for user selection
  const [searchQuery, setSearchQuery] = useState('')

  const selectedUser = useMemo(() => 
    users.find(u => u.id === formData.userId) ?? null,
    [users, formData.userId],
  )
  
  const selectedValue = useMemo(() => 
    companyValues.find(v => v.id === formData.valueId) ?? null,
    [companyValues, formData.valueId],
  )

  const isLoadingData = useMemo(() => 
    computed.isUsersLoading || computed.isValuesLoading,
    [computed.isUsersLoading, computed.isValuesLoading],
  )
  
  const hasDataError = useMemo(() => {
    if (isLoadingData) return false
    
    if (computed.hasAnyError) return true
    
    if (!computed.hasUsers && !computed.isUsersLoading) return true
    if (!computed.hasCompanyValues && !computed.isValuesLoading) return true
    
    return false
  }, [isLoadingData, computed.hasAnyError, computed.hasUsers, computed.hasCompanyValues, computed.isUsersLoading, computed.isValuesLoading])

  // Memoized error message to avoid recreation on every render
  const dataErrorMessage = useMemo(() => {
    if (computed.combinedErrorMessage) return computed.combinedErrorMessage
    if (!computed.hasUsers) return 'Nenhum usuário disponível para receber elogios.'
    if (!computed.hasCompanyValues) return 'Nenhum valor da empresa configurado.'
    return 'Erro ao carregar dados necessários.'
  }, [computed.combinedErrorMessage, computed.hasUsers, computed.hasCompanyValues])

  const handleRetry = useCallback(() => {
    actions.invalidateCache()
    
    setTimeout(() => {
      if (computed.hasAnyError) {
        actions.refreshUsers()
        actions.refreshValues()
      }
    }, 2000)
  }, [actions, computed.hasAnyError])

  // Memoized form handlers to prevent re-creation
  const handleUserSelect = useCallback((user: PraiseUser) => {
    updateFormValue('userId', user.id)
  }, [updateFormValue])

  const handleValueSelect = useCallback((value: PraiseCompanyValue) => {
    updateFormValue('valueId', value.id)
  }, [updateFormValue])

  const handleCoinChange = useCallback((amount: number) => {
    updateFormValue('coins', amount)
  }, [updateFormValue])

  const handleMessageChange = useCallback((message: string) => {
    updateFormValue('message', message)
  }, [updateFormValue])

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query)
  }, [])

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

  useEffect(() => {
    if (computed.hasAnyError && !isLoadingData) {
      console.warn('Data loading failed, attempting auto-recovery...')
      
      const recoveryTimeout = setTimeout(() => {
        if (computed.hasAnyError) {
          console.log('Auto-recovery: refreshing data...')
          actions.invalidateCache()
        }
      }, 3000)
      
      return () => clearTimeout(recoveryTimeout)
    }
    
    return undefined
  }, [computed.hasAnyError, isLoadingData, actions])

  const pageAnimation = usePageEntrance()
  const cardAnimation = useCardEntrance()

  const renderCurrentStep = useMemo(() => {
    switch (currentStep) {
      case 0:
        return (
          <MemoizedUserSelectionStep
            selectedItem={selectedUser}
            onSelect={handleUserSelect}
            items={users}
            loading={loading.users}
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            onNext={goToNextStep}
            onPrev={goToPrevStep}
            onCancel={cancelForm}
            isSubmitting={isSubmitting}
          />
        )
      
      case 1:
        return (
          <MemoizedValueSelectionStep
            selectedItem={selectedValue}
            onSelect={handleValueSelect}
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
          <MemoizedCoinSelectionStep
            coinAmount={formData.coins}
            onCoinChange={handleCoinChange}
            onNext={goToNextStep}
            onPrev={goToPrevStep}
            onCancel={cancelForm}
            isSubmitting={isSubmitting}
          />
        )
      
      case 3:
        return (
          <MemoizedMessageStep
            value={formData.message}
            onChange={handleMessageChange}
            error={errors.message?.message}
            onNext={goToNextStep}
            onPrev={goToPrevStep}
            onCancel={cancelForm}
            isSubmitting={isSubmitting}
          />
        )
      
      case 4:
        return (
          <MemoizedConfirmationStep
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
  }, [
    currentStep,
    selectedUser,
    selectedValue,
    formData,
    errors.message?.message,
    users,
    companyValues,
    loading.users,
    loading.values,
    searchQuery,
    handleUserSelect,
    handleValueSelect,
    handleCoinChange,
    handleMessageChange,
    handleSearchChange,
    goToNextStep,
    goToPrevStep,
    cancelForm,
    submitForm,
    isSubmitting,
  ])

  if (authLoading) {
    return (
      <PageLayout maxWidth="5xl">
        <NewPraiseSkeleton />
      </PageLayout>
    )
  }
  
  if (!user) {
    return <Navigate to="/login" />
  }

  return (
    <PageLayout maxWidth="5xl">
      <animated.div style={pageAnimation} className="space-y-6">
        {/* Show skeleton while loading */}
        {isLoadingData && <NewPraiseSkeleton />}
        
        {/* Show error if data failed to load */}
        {!isLoadingData && hasDataError && (
          <NewPraiseError 
            error={dataErrorMessage} 
            onRetry={handleRetry}
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
              {renderCurrentStep}
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