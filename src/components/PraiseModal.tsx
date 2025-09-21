import { useState } from 'react'
import { animated, useTransition } from '@react-spring/web'
import { sendCompliment } from '@/services/compliments'
import type { SendComplimentData } from '@/types'
import type { PraiseUser, PraiseCompanyValue } from '@/hooks/usePraisesData'

interface PraiseModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (data: { user: PraiseUser; value: PraiseCompanyValue; coins: number; message: string }) => void
  users: PraiseUser[]
  companyValues: PraiseCompanyValue[]
}

export const PraiseModal = ({ isOpen, onClose, onSuccess, users, companyValues }: PraiseModalProps) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedUser, setSelectedUser] = useState<PraiseUser | null>(null)
  const [selectedValue, setSelectedValue] = useState<PraiseCompanyValue | null>(null)
  const [coinAmount, setCoinAmount] = useState(25)
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const steps = ['Usuário', 'Valor', 'Moedas', 'Mensagem', 'Confirmar']
  
  // Filter users based on search
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.department.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Modal transitions
  const modalTransition = useTransition(isOpen, {
    from: { opacity: 0, transform: 'scale(0.9)' },
    enter: { opacity: 1, transform: 'scale(1)' },
    leave: { opacity: 0, transform: 'scale(0.9)' },
    config: { tension: 300, friction: 20 },
  })

  // Reset modal state
  const resetModal = () => {
    setCurrentStep(0)
    setSearchQuery('')
    setSelectedUser(null)
    setSelectedValue(null)
    setCoinAmount(25)
    setMessage('')
    setIsSubmitting(false)
    setError(null)
  }

  const closeModal = () => {
    onClose()
    setTimeout(resetModal, 300) // Wait for animation
  }

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
      setError(null) // Clear error when moving to next step
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      setError(null) // Clear error when moving to previous step
    }
  }

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

  const handleSubmit = async () => {
    if (!selectedUser || !selectedValue) return
    
    setIsSubmitting(true)
    
    try {
      // Convert UI types to API types
      const complimentData: SendComplimentData = {
        receiverId: selectedUser.id,
        valueId: parseInt(selectedValue.id),
        message,
        coins: coinAmount,
      }

      // Send compliment via API
      await sendCompliment(complimentData)
      
      setIsSubmitting(false)
      onSuccess({
        user: selectedUser,
        value: selectedValue,
        coins: coinAmount,
        message,
      })
      
      closeModal()
    } catch (error) {
      setIsSubmitting(false)
      const errorMessage = error instanceof Error ? error.message : 'Erro inesperado ao enviar elogio'
      setError(errorMessage)
    }
  }

  return modalTransition((style, item) =>
    item ? (
      <animated.div
        style={style}
        className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/50 backdrop-blur-sm"
      >
        <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border border-white/30 dark:border-gray-700/30 rounded-2xl sm:rounded-3xl max-w-xs sm:max-w-lg lg:max-w-2xl w-full shadow-2xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden">
          
          {/* Modal Header */}
          <div className="p-4 sm:p-6 border-b border-gray-200/50 dark:border-gray-700/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg sm:rounded-xl flex items-center justify-center">
                  <span className="text-white text-lg sm:text-xl">✨</span>
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">
                    Enviar Elogio
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                    {steps[currentStep]} ({currentStep + 1}/{steps.length})
                  </p>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Progress Bar */}
            <div className="mt-4">
              <div className="flex space-x-2">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={`flex-1 h-2 rounded-full transition-all duration-300 ${
                      index <= currentStep
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600'
                        : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Modal Content */}
          <div className="p-4 sm:p-6 overflow-y-auto max-h-[50vh] sm:max-h-[60vh]">
            
            {/* Step 0: Select User */}
            {currentStep === 0 && (
              <div className="space-y-4">
                <h4 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Quem você gostaria de elogiar?
                </h4>
                
                {/* Search Input */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Buscar por nome ou departamento..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/80 dark:bg-gray-700/80 border border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl text-sm sm:text-base text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    autoFocus
                  />
                  <svg className="absolute right-3 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>

                {/* Users List */}
                <div className="space-y-2 max-h-48 sm:max-h-60 overflow-y-auto">
                  {filteredUsers.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => setSelectedUser(user)}
                      className={`w-full p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 transition-all duration-200 flex items-center space-x-3 ${
                        selectedUser?.id === user.id
                          ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                          : 'border-gray-200 dark:border-gray-600 hover:border-purple-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                      }`}
                    >
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-white font-semibold text-sm">
                          {user.name.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1 text-left min-w-0">
                        <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm sm:text-base truncate">{user.name}</p>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{user.department}</p>
                      </div>
                      {selectedUser?.id === user.id && (
                        <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 1: Select Value */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <h4 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Qual valor {selectedUser?.name} demonstrou?
                </h4>
                
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                  {companyValues.map((value) => (
                    <button
                      key={value.id}
                      onClick={() => setSelectedValue(value)}
                      className={`p-4 sm:p-6 rounded-xl sm:rounded-2xl border-2 transition-all duration-200 ${
                        selectedValue?.id === value.id
                          ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 scale-105'
                          : 'border-gray-200 dark:border-gray-600 hover:border-purple-300 hover:scale-102'
                      }`}
                    >
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r ${value.color} rounded-lg sm:rounded-xl flex items-center justify-center mx-auto mb-2 sm:mb-3 shadow-lg`}>
                        <span className="text-lg sm:text-2xl">{value.icon}</span>
                      </div>
                      <h5 className="font-bold text-gray-900 dark:text-gray-100 mb-1 sm:mb-2 text-sm sm:text-base">{value.name}</h5>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 text-center leading-tight">{value.description}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Select Coins */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h4 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Quantas moedas você quer enviar?
                </h4>
                
                <div className="text-center">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-xl">
                    <span className="text-3xl sm:text-4xl">💰</span>
                  </div>
                  <div className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    {coinAmount}
                  </div>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">moedas</p>
                </div>

                {/* Coin Slider */}
                <div className="space-y-4">
                  <input
                    type="range"
                    min="5"
                    max="100"
                    step="5"
                    value={coinAmount}
                    onChange={(e) => setCoinAmount(Number(e.target.value))}
                    className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, rgb(147 51 234) 0%, rgb(79 70 229) ${((coinAmount - 5) / 95) * 100}%, rgb(229 231 235) ${((coinAmount - 5) / 95) * 100}%, rgb(229 231 235) 100%)`,
                    }}
                  />
                  
                  {/* Quick Select Buttons */}
                  <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
                    {[10, 25, 50, 75, 100].map((amount) => (
                      <button
                        key={amount}
                        onClick={() => setCoinAmount(amount)}
                        className={`px-3 py-2 sm:px-4 sm:py-2 rounded-lg font-semibold text-sm sm:text-base transition-all duration-200 ${
                          coinAmount === amount
                            ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
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
              <div className="space-y-4">
                <h4 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Escreva uma mensagem especial
                </h4>
                
                <div className="space-y-4">
                  <textarea
                    placeholder="Conte o que tornou essa pessoa especial e por que ela merece esse reconhecimento..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={6}
                    maxLength={500}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/80 dark:bg-gray-700/80 border border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl text-sm sm:text-base text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    autoFocus
                  />
                  
                  <div className="flex justify-between items-center">
                    <span className={`text-sm ${
                      message.length >= 10 ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {message.length}/500 caracteres {message.length >= 10 ? '✓' : '(mín. 10)'}
                    </span>
                    
                    {/* Message Suggestions */}
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setMessage('Excelente trabalho! Sua dedicação e qualidade são inspiradoras.')}
                        className="text-xs px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors"
                      >
                        💼 Profissional
                      </button>
                      <button
                        onClick={() => setMessage('Obrigado por sempre estar disposto a ajudar! Sua colaboração faz toda diferença.')}
                        className="text-xs px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
                      >
                        🤝 Colaborativo
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Confirm */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Confirme seu elogio
                </h4>
                
                {/* Preview Card */}
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border border-purple-200 dark:border-purple-700/50 rounded-2xl p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white font-semibold">
                        {selectedUser?.name.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-semibold text-gray-900 dark:text-gray-100">Para:</span>
                        <span className="text-gray-700 dark:text-gray-200">{selectedUser?.name}</span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-200 mb-3">{message}</p>
                      <div className="flex items-center justify-between">
                        <div className={`inline-flex items-center px-3 py-1.5 bg-gradient-to-r ${selectedValue?.color} rounded-full shadow-lg`}>
                          <span className="text-white text-sm font-semibold flex items-center space-x-1">
                            <span>{selectedValue?.icon}</span>
                            <span>{selectedValue?.name}</span>
                          </span>
                        </div>
                        <div className="flex items-center space-x-1 bg-yellow-100 dark:bg-yellow-900/30 px-3 py-1.5 rounded-full">
                          <span className="text-yellow-600 dark:text-yellow-400 text-sm">💰</span>
                          <span className="text-yellow-700 dark:text-yellow-300 font-semibold text-sm">
                            +{coinAmount}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="p-6 border-t border-gray-200/50 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-800/50">
            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700/50 rounded-lg">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}
            
            <div className="flex justify-between">
              <button
                onClick={currentStep === 0 ? closeModal : prevStep}
                disabled={isSubmitting}
                className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
              >
                {currentStep === 0 ? 'Cancelar' : 'Voltar'}
              </button>
              
              <button
                onClick={currentStep === steps.length - 1 ? handleSubmit : nextStep}
                disabled={!canProceed() || isSubmitting}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Enviando...</span>
                  </>
                ) : (
                  <span>{currentStep === steps.length - 1 ? 'Enviar Elogio' : 'Próximo'}</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </animated.div>
    ) : null,
  )
}
