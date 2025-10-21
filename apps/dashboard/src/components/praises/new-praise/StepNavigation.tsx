import { animated, useSpring } from '@react-spring/web'
import type { StepComponentProps } from '@/types/praise.types'

interface StepNavigationProps extends StepComponentProps {
  currentStep: number
  isLastStep?: boolean
}

export const StepNavigation = ({
  currentStep,
  isLastStep = false,
  onNext,
  onPrev,
  onCancel,
  isSubmitting = false,
}: StepNavigationProps) => {
  const buttonAnimation = useSpring({
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0px)' },
    config: { tension: 300, friction: 30 },
  })

  const handleNext = () => {
    if (isLastStep) {
      onNext() // Submit
    } else {
      onNext() // Next step
    }
  }

  const handlePrev = () => {
    if (currentStep === 0) {
      onCancel()
    } else {
      onPrev()
    }
  }

  return (
    <animated.div 
      style={buttonAnimation}
      className="flex justify-between items-center pt-8 border-t border-[#e5e5e5] dark:border-[#404040]"
    >
      <button
        onClick={handlePrev}
        disabled={isSubmitting}
        className="px-8 py-4 bg-[#f5f5f5] dark:bg-[#404040] text-[#404040] dark:text-[#e5e5e5] rounded-xl font-bold text-lg hover:bg-[#e5e5e5] dark:hover:bg-[#525252] disabled:opacity-50 flex items-center gap-2 transition-colors"
      >
        <i className="ph-bold ph-arrow-left"></i>
        {currentStep === 0 ? 'Cancelar' : 'Voltar'}
      </button>
      
      <button
        onClick={handleNext}
        disabled={isSubmitting}
        className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold text-lg hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 shadow-lg hover:shadow-xl transition-all"
      >
        {isSubmitting ? (
          <>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>Enviando...</span>
          </>
        ) : (
          <>
            <span>{isLastStep ? 'Enviar Elogio' : 'Próximo'}</span>
            <i className="ph-bold ph-arrow-right"></i>
          </>
        )}
      </button>
    </animated.div>
  )
}
