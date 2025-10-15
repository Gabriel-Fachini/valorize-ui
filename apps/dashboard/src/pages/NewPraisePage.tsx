import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { animated } from '@react-spring/web'
import { sendCompliment } from '@/services/compliments'
import { useUser } from '@/hooks/useUser'
import { usePraisesData, type PraiseUser, type PraiseCompanyValue } from '@/hooks/usePraisesData'
import type { SendComplimentData } from '@/types'
import { 
  usePageEntrance,
  useCardEntrance,
  useSuccessTransition,
} from '@/hooks/useAnimations'
import { PageLayout } from '@/components/layout/PageLayout'

// Skeleton Loading Component
const NewPraiseSkeleton = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div>
        <div className="mb-6 flex items-center space-x-2">
          <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded"></div>
          <div className="w-40 h-5 bg-gray-300 dark:bg-gray-600 rounded"></div>
        </div>
        
        <div className="mb-6">
          <div className="w-64 h-10 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
          <div className="w-48 h-6 bg-gray-300 dark:bg-gray-600 rounded"></div>
        </div>

        {/* Progress Bar Skeleton */}
        <div className="flex space-x-2">
          {[...Array(5)].map((_, index) => (
            <div
              key={index}
              className="flex-1 h-2 bg-gray-300 dark:bg-gray-600 rounded-full"
            />
          ))}
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="space-y-6">
        <div>
          <div className="w-96 h-8 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
          <div className="w-80 h-5 bg-gray-300 dark:bg-gray-600 rounded"></div>
        </div>
        
        {/* Search Input Skeleton */}
        <div className="w-full h-14 bg-gray-300 dark:bg-gray-600 rounded-xl"></div>

        {/* Cards Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="p-5 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-[#262626] flex items-center space-x-4"
            >
              <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-full flex-shrink-0"></div>
              <div className="flex-1 space-y-2">
                <div className="w-32 h-5 bg-gray-300 dark:bg-gray-600 rounded"></div>
                <div className="w-24 h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons Skeleton */}
      <div className="flex justify-between items-center pt-8 border-t border-gray-300 dark:border-gray-600">
        <div className="w-32 h-14 bg-gray-300 dark:bg-gray-600 rounded-xl"></div>
        <div className="w-32 h-14 bg-gray-300 dark:bg-gray-600 rounded-xl"></div>
      </div>
    </div>
  )
}

// Error State Component
const NewPraiseError = ({ error, onRetry }: { error: string; onRetry: () => void }) => {
  const navigate = useNavigate()
  
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="max-w-md w-full text-center">
        <div className="w-24 h-24 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <i className="ph-bold ph-warning-circle text-red-500 text-6xl"></i>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
          Erro ao Carregar Dados
        </h2>
        
        <p className="text-base text-gray-600 dark:text-gray-400 mb-6">
          {error || 'Não foi possível carregar os dados necessários para enviar um elogio. Tente novamente.'}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={onRetry}
            className="px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl font-bold hover:from-primary-700 hover:to-primary-800 transition-all shadow-lg flex items-center justify-center gap-2"
          >
            <i className="ph-bold ph-arrow-clockwise text-lg"></i>
            Tentar Novamente
          </button>
          
          <button
            onClick={() => navigate({ to: '/elogios' })}
            className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-xl font-bold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
          >
            Voltar para Elogios
          </button>
        </div>
      </div>
    </div>
  )
}

export const NewPraisePage = () => {
  const navigate = useNavigate()
  const { onBalanceMovement } = useUser()
  const { users, companyValues, loading, computed, actions } = usePraisesData()

  // Step management
  const [currentStep, setCurrentStep] = useState(0)
  const steps = ['Usuário', 'Valor', 'Moedas', 'Mensagem', 'Confirmar']

  // Form state
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedUser, setSelectedUser] = useState<PraiseUser | null>(null)
  const [selectedValue, setSelectedValue] = useState<PraiseCompanyValue | null>(null)
  const [coinAmount, setCoinAmount] = useState(25)
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Success state
  const [showSuccess, setShowSuccess] = useState(false)

  // Animations
  const pageAnimation = usePageEntrance()
  const cardAnimation = useCardEntrance()
  const successTransition = useSuccessTransition(showSuccess)

  // Filter users based on search
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.department.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const canProceed = () => {
    switch (currentStep) {
      case 0: return selectedUser !== null
      case 1: return selectedValue !== null
      case 2: return coinAmount > 0
      case 3: return message.trim().length >= 10
      case 4: return true
      default: return false
    }
  }

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
      setError(null)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      setError(null)
    }
  }

  const handleCancel = () => {
    navigate({ to: '/elogios' })
  }

  const handleSubmit = async () => {
    if (!selectedUser || !selectedValue) return
    
    setIsSubmitting(true)
    
    try {
      const complimentData: SendComplimentData = {
        receiverId: selectedUser.id,
        valueId: parseInt(selectedValue.id),
        message,
        coins: coinAmount,
      }

      await sendCompliment(complimentData)
      
      // Invalidate balance and show success
      onBalanceMovement()
      
      // Show success animation
      setShowSuccess(true)
      
      // Redirect after success animation
      setTimeout(() => {
        navigate({ to: '/elogios' })
      }, 2500)
      
    } catch (error) {
      setIsSubmitting(false)
      const errorMessage = error instanceof Error ? error.message : 'Erro inesperado ao enviar elogio'
      setError(errorMessage)
    }
  }

  // Check if we're loading data
  const isLoadingData = loading.users || loading.values
  const hasDataError = computed.hasAnyError || !computed.hasUsers || !computed.hasCompanyValues
  
  const getDataErrorMessage = () => {
    if (computed.combinedErrorMessage) return computed.combinedErrorMessage
    if (!computed.hasUsers) return 'Nenhum usuário disponível para receber elogios.'
    if (!computed.hasCompanyValues) return 'Nenhum valor da empresa configurado.'
    return 'Erro ao carregar dados necessários.'
  }
  
  const dataErrorMessage = getDataErrorMessage()

  return (
    <PageLayout maxWidth="5xl">
      <animated.div style={pageAnimation} className="space-y-6">
        {/* Show skeleton while loading */}
        {isLoadingData && <NewPraiseSkeleton />}
        
        {/* Show error if data failed to load */}
        {!isLoadingData && hasDataError && (
          <NewPraiseError 
            error={dataErrorMessage} 
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
            onClick={handleCancel}
            className="mb-6 flex items-center space-x-2 text-[#525252] dark:text-[#a3a3a3] hover:text-[#171717] dark:hover:text-[#f5f5f5] transition-colors"
          >
            <i className="ph-bold ph-arrow-left text-xl"></i>
            <span className="font-medium">Voltar para Elogios</span>
          </button>
          
          <div className="mb-6">
            <h1 className="mb-2 text-4xl font-bold text-[#171717] dark:text-[#f5f5f5]">
              Enviar Elogio
            </h1>
            <p className="text-lg text-[#525252] dark:text-[#a3a3a3]">
              {steps[currentStep]} • Etapa {currentStep + 1} de {steps.length}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="flex space-x-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`flex-1 h-2 rounded-full transition-all duration-300 ${
                  index <= currentStep
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600'
                    : 'bg-[#e5e5e5] dark:bg-[#404040]'
                }`}
              />
            ))}
          </div>
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

        {/* Main Content - Full Page */}
        <animated.div style={cardAnimation}>
          
          {/* Step 0: Select User */}
          {currentStep === 0 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-[#171717] dark:text-[#f5f5f5] mb-2">
                  Quem você gostaria de elogiar?
                </h2>
                <p className="text-[#525252] dark:text-[#a3a3a3]">
                  Selecione um colega para enviar seu reconhecimento
                </p>
              </div>
              
              {/* Search Input */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar por nome ou departamento..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-4 bg-white dark:bg-[#262626] border border-[#d4d4d4] dark:border-[#525252] rounded-xl text-base text-[#171717] dark:text-[#f5f5f5] placeholder-[#737373] dark:placeholder-[#a3a3a3] focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  autoFocus
                />
                <i className="ph-bold ph-magnifying-glass absolute right-4 top-5 text-xl text-[#a3a3a3]"></i>
              </div>

              {/* Users List */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredUsers.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => setSelectedUser(user)}
                    className={`p-5 rounded-xl border-2 flex items-center space-x-4 transition-all ${
                      selectedUser?.id === user.id
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20 scale-[1.02] shadow-lg shadow-green-500/20'
                        : 'border-[#e5e5e5] dark:border-[#404040] bg-white dark:bg-[#262626] hover:border-green-300 hover:bg-[#fafafa] dark:hover:bg-[#404040]/50'
                    }`}
                  >
                    <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
                      <i className="ph-bold ph-user text-white text-xl"></i>
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <p className="font-bold text-[#171717] dark:text-[#f5f5f5] text-base truncate">{user.name}</p>
                      <p className="text-sm text-[#525252] dark:text-[#a3a3a3] truncate">{user.department}</p>
                    </div>
                    {selectedUser?.id === user.id && (
                      <div className="w-7 h-7 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <i className="ph-bold ph-check text-white text-base"></i>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 1: Select Value */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-[#171717] dark:text-[#f5f5f5] mb-2">
                  Qual valor {selectedUser?.name} demonstrou?
                </h2>
                <p className="text-[#525252] dark:text-[#a3a3a3]">
                  Escolha o valor da empresa que melhor representa esta ação
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {companyValues.map((value) => (
                  <button
                    key={value.id}
                    onClick={() => setSelectedValue(value)}
                    className={`p-6 rounded-2xl border-2 transition-all ${
                      selectedValue?.id === value.id
                        ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/20 scale-[1.02] shadow-lg shadow-pink-500/20'
                        : 'border-[#e5e5e5] dark:border-[#404040] bg-white dark:bg-[#262626] hover:border-pink-300 hover:scale-[1.01]'
                    }`}
                  >
                    <div className={`w-16 h-16 bg-gradient-to-r ${value.color} rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                      <span className="text-3xl">{value.icon}</span>
                    </div>
                    <h5 className="font-bold text-[#171717] dark:text-[#f5f5f5] mb-2 text-lg">{value.name}</h5>
                    <p className="text-sm text-[#525252] dark:text-[#a3a3a3] text-center leading-relaxed">{value.description}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Select Coins */}
          {currentStep === 2 && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-[#171717] dark:text-[#f5f5f5] mb-2">
                  Quantas moedas você quer enviar?
                </h2>
                <p className="text-[#525252] dark:text-[#a3a3a3]">
                  Quanto maior o valor, maior o reconhecimento
                </p>
              </div>
              
              <div className="text-center py-8">
                <div className="w-32 h-32 bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                  <i className="ph-fill ph-coins text-white text-7xl"></i>
                </div>
                <div className="text-7xl font-bold text-[#171717] dark:text-[#f5f5f5] mb-2">
                  {coinAmount}
                </div>
                <p className="text-xl text-[#525252] dark:text-[#a3a3a3]">moedas</p>
              </div>

              {/* Coin Slider */}
              <div className="space-y-6 max-w-2xl mx-auto">
                <input
                  type="range"
                  min="5"
                  max="100"
                  step="5"
                  value={coinAmount}
                  onChange={(e) => setCoinAmount(Number(e.target.value))}
                  className="w-full h-4 bg-[#e5e5e5] dark:bg-[#404040] rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, rgb(5 150 105) 0%, rgb(16 185 129) ${((coinAmount - 5) / 95) * 100}%, rgb(226 232 240) ${((coinAmount - 5) / 95) * 100}%, rgb(226 232 240) 100%)`,
                  }}
                />
                
                {/* Quick Select Buttons */}
                <div className="flex flex-wrap justify-center gap-3">
                  {[10, 25, 50, 75, 100].map((amount) => (
                    <button
                      key={amount}
                      onClick={() => setCoinAmount(amount)}
                      className={`px-6 py-3 rounded-xl font-bold text-lg transition-all ${
                        coinAmount === amount
                          ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg scale-110'
                          : 'bg-[#f5f5f5] dark:bg-[#404040] text-[#404040] dark:text-[#d4d4d4] hover:bg-[#e5e5e5] dark:hover:bg-[#525252]'
                      }`}
                    >
                      {amount}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Write Message */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-[#171717] dark:text-[#f5f5f5] mb-2">
                  Escreva uma mensagem especial
                </h2>
                <p className="text-[#525252] dark:text-[#a3a3a3]">
                  Conte o que tornou essa pessoa especial (mínimo 10 caracteres)
                </p>
              </div>
              
              <div className="space-y-4 max-w-3xl mx-auto">
                <textarea
                  placeholder="Conte o que tornou essa pessoa especial e por que ela merece esse reconhecimento..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={8}
                  maxLength={500}
                  className="w-full px-4 py-4 bg-white dark:bg-[#262626] border border-[#d4d4d4] dark:border-[#525252] rounded-xl text-base text-[#171717] dark:text-[#f5f5f5] placeholder-[#737373] dark:placeholder-[#a3a3a3] focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none transition-all"
                  autoFocus
                />
                
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <span className={`text-sm flex items-center gap-2 ${
                    message.length >= 10 ? 'text-green-600 dark:text-green-400' : 'text-[#737373] dark:text-[#a3a3a3]'
                  }`}>
                    {message.length >= 10 && <i className="ph-bold ph-check-circle"></i>}
                    {message.length}/500 caracteres {message.length < 10 && '(mín. 10)'}
                  </span>
                  
                  {/* Message Suggestions */}
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setMessage('Excelente trabalho! Sua dedicação e qualidade são inspiradoras.')}
                      className="text-sm px-4 py-2 bg-[#f5f5f5] dark:bg-[#404040]/50 text-[#404040] dark:text-[#d4d4d4] rounded-full hover:bg-[#e5e5e5] dark:hover:bg-[#525252] flex items-center gap-2 transition-colors"
                    >
                      <i className="ph-bold ph-briefcase"></i>
                      Profissional
                    </button>
                    <button
                      onClick={() => setMessage('Obrigado por sempre estar disposto a ajudar! Sua colaboração faz toda diferença.')}
                      className="text-sm px-4 py-2 bg-[#f5f5f5] dark:bg-[#404040]/50 text-[#404040] dark:text-[#d4d4d4] rounded-full hover:bg-[#e5e5e5] dark:hover:bg-[#525252] flex items-center gap-2 transition-colors"
                    >
                      <i className="ph-bold ph-handshake"></i>
                      Colaborativo
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Confirm */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-[#171717] dark:text-[#f5f5f5] mb-2">
                  Confirme seu elogio
                </h2>
                <p className="text-[#525252] dark:text-[#a3a3a3]">
                  Revise as informações antes de enviar
                </p>
              </div>
              
              {/* Preview Card */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-200 dark:border-green-700/50 rounded-2xl p-8 max-w-3xl mx-auto">
                <div className="flex items-start space-x-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
                    <i className="ph-bold ph-user text-white text-3xl"></i>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-3">
                      <span className="font-bold text-[#171717] dark:text-[#f5f5f5]">Para:</span>
                      <span className="text-lg text-[#404040] dark:text-[#e5e5e5]">{selectedUser?.name}</span>
                    </div>
                    <p className="text-[#404040] dark:text-[#e5e5e5] mb-4 text-lg leading-relaxed">{message}</p>
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div className={`inline-flex items-center px-4 py-2 bg-gradient-to-r ${selectedValue?.color} rounded-full shadow-lg`}>
                        <span className="text-white font-bold flex items-center space-x-2">
                          <span className="text-xl">{selectedValue?.icon}</span>
                          <span>{selectedValue?.name}</span>
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 bg-green-100 dark:bg-green-900/30 px-4 py-2 rounded-full">
                        <i className="ph-fill ph-coins text-green-600 dark:text-green-400 text-xl"></i>
                        <span className="text-green-700 dark:text-green-300 font-bold text-lg">
                          +{coinAmount}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center pt-8 border-t border-[#e5e5e5] dark:border-[#404040]">
            <button
              onClick={currentStep === 0 ? handleCancel : prevStep}
              disabled={isSubmitting}
              className="px-8 py-4 bg-[#f5f5f5] dark:bg-[#404040] text-[#404040] dark:text-[#e5e5e5] rounded-xl font-bold text-lg hover:bg-[#e5e5e5] dark:hover:bg-[#525252] disabled:opacity-50 flex items-center gap-2 transition-colors"
            >
              <i className="ph-bold ph-arrow-left"></i>
              {currentStep === 0 ? 'Cancelar' : 'Voltar'}
            </button>
            
            <button
              onClick={currentStep === steps.length - 1 ? handleSubmit : nextStep}
              disabled={!canProceed() || isSubmitting}
              className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold text-lg hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 shadow-lg hover:shadow-xl transition-all"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Enviando...</span>
                </>
              ) : (
                <>
                  <span>{currentStep === steps.length - 1 ? 'Enviar Elogio' : 'Próximo'}</span>
                  <i className="ph-bold ph-arrow-right"></i>
                </>
              )}
            </button>
          </div>
        </animated.div>

        {/* Success Animation - Full Screen */}
        {successTransition((style, item) =>
          item ? (
            <animated.div
              style={style}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
            >
              <div className="bg-white dark:bg-[#262626] rounded-3xl p-12 max-w-lg shadow-2xl text-center">
                <div className="w-28 h-28 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                  <i className="ph-bold ph-check text-white text-7xl"></i>
                </div>
                <h3 className="text-3xl font-bold text-[#171717] dark:text-[#f5f5f5] mb-4">
                  Elogio Enviado!
                </h3>
                <p className="text-lg text-[#525252] dark:text-[#d4d4d4] mb-4">
                  {selectedUser?.name} receberá sua mensagem especial
                </p>
                <div className="flex items-center justify-center space-x-2 bg-green-100 dark:bg-green-900/30 px-6 py-3 rounded-full inline-flex">
                  <i className="ph-fill ph-coins text-green-600 dark:text-green-400 text-2xl"></i>
                  <span className="text-green-700 dark:text-green-300 text-xl font-bold">+{coinAmount} moedas</span>
                </div>
              </div>
            </animated.div>
          ) : null,
        )}
        </>
        )}
      </animated.div>
    </PageLayout>
  )
}
