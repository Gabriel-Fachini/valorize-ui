import { animated, useSpring } from '@react-spring/web'
import type { InputStepProps } from '@/types/praise.types'

interface MessageStepProps extends InputStepProps {
  suggestions?: Array<{
    id: string
    label: string
    icon: string
    text: string
  }>
}

export const MessageStep = ({
  value,
  onChange,
  maxLength = 500,
  minLength = 10,
  suggestions = [
    {
      id: 'professional',
      label: 'Profissional',
      icon: 'ph-bold ph-briefcase',
      text: 'Excelente trabalho! Sua dedicação e qualidade são inspiradoras.',
    },
    {
      id: 'collaborative',
      label: 'Colaborativo',
      icon: 'ph-bold ph-handshake',
      text: 'Obrigado por sempre estar disposto a ajudar! Sua colaboração faz toda diferença.',
    },
  ],
}: MessageStepProps) => {
  const textareaAnimation = useSpring({
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0px)' },
    config: { tension: 300, friction: 30 },
  })

  const suggestionsAnimation = useSpring({
    from: { opacity: 0, transform: 'translateY(10px)' },
    to: { opacity: 1, transform: 'translateY(0px)' },
    config: { tension: 300, friction: 30 },
    delay: 200,
  })

  const isMessageValid = value.length >= minLength

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#171717] dark:text-[#f5f5f5] mb-2">
          Escreva uma mensagem especial
        </h2>
        <p className="text-[#525252] dark:text-[#a3a3a3]">
          Conte o que tornou essa pessoa especial (mínimo {minLength} caracteres)
        </p>
      </div>
      
      <animated.div style={textareaAnimation} className="space-y-4 max-w-3xl mx-auto">
        <textarea
          placeholder="Conte o que tornou essa pessoa especial e por que ela merece esse reconhecimento..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={8}
          maxLength={maxLength}
          className="w-full px-4 py-4 bg-white dark:bg-[#262626] border border-[#d4d4d4] dark:border-[#525252] rounded-xl text-base text-[#171717] dark:text-[#f5f5f5] placeholder-[#737373] dark:placeholder-[#a3a3a3] focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none transition-all"
          autoFocus
        />
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <span className={`text-sm flex items-center gap-2 ${
            isMessageValid ? 'text-green-600 dark:text-green-400' : 'text-[#737373] dark:text-[#a3a3a3]'
          }`}>
            {isMessageValid && <i className="ph-bold ph-check-circle"></i>}
            {value.length}/{maxLength} caracteres {!isMessageValid && `(mín. ${minLength})`}
          </span>
          
          {/* Message Suggestions */}
          <animated.div style={suggestionsAnimation} className="flex flex-wrap gap-2">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion.id}
                onClick={() => onChange(suggestion.text)}
                className="text-sm px-4 py-2 bg-[#f5f5f5] dark:bg-[#404040]/50 text-[#404040] dark:text-[#d4d4d4] rounded-full hover:bg-[#e5e5e5] dark:hover:bg-[#525252] flex items-center gap-2 transition-colors"
              >
                <i className={suggestion.icon}></i>
                {suggestion.label}
              </button>
            ))}
          </animated.div>
        </div>
      </animated.div>
    </div>
  )
}
