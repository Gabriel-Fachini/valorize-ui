/**
 * Password Input Component
 * Password input component with visibility toggle and Caps Lock detection
 */

import { useState, useCallback, useEffect } from 'react'
import { Input } from './Input'
import { PasswordInputProps } from '../../../types/forms'

// Ícones SVG para toggle de visibilidade
const EyeIcon = ({ className, title }: { className?: string; title?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    aria-label={title}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
    />
  </svg>
)

const EyeOffIcon = ({ className, title }: { className?: string; title?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    aria-label={title}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
    />
  </svg>
)

const CapsLockIcon = ({ className, title }: { className?: string; title?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    aria-label={title}
  >
    {/* Rounded rectangle — the key border */}
    <rect x="2" y="2" width="20" height="20" rx="4" ry="4" />
    {/* Arrow head — upward pointing triangle */}
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 6l-5 5h3v3h4v-3h3z"
    />
    {/* Horizontal bar at the bottom of the arrow stem — caps lock indicator */}
    <line x1="9" y1="17" x2="15" y2="17" strokeLinecap="round" />
  </svg>
)

// React 19: Componente sem forwardRef, ref como prop
export const PasswordInput = ({
  showToggleVisibility = true,
  showCapsLockWarning = true,
  className = '',
  ref,
  ...props
}: PasswordInputProps & { ref?: React.Ref<HTMLInputElement> }) => {
  const [isVisible, setIsVisible] = useState(false)
  const [capsLockOn, setCapsLockOn] = useState(false)

  // Toggle password visibility
  const toggleVisibility = useCallback(() => {
    setIsVisible(prev => !prev)
  }, [])

  // Detect Caps Lock
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (showCapsLockWarning) {
      // Detect Caps Lock based on key press
      const char = e.key
      if (char.length === 1) {
        const isShiftPressed = e.shiftKey
        const isUpperCase = char === char.toUpperCase()
        const isLowerCase = char === char.toLowerCase()
        
        // Caps Lock is likely on if:
        // - Character is alphabetic
        // - Character is uppercase
        // - Shift is not pressed
        // - Character has both upper and lower case versions
        if (isUpperCase && !isShiftPressed && isUpperCase !== isLowerCase) {
          setCapsLockOn(true)
        } else if (isLowerCase && isShiftPressed && isUpperCase !== isLowerCase) {
          setCapsLockOn(true)
        } else if (isUpperCase !== isLowerCase) {
          setCapsLockOn(false)
        }
      }
    }
    
    props.onKeyDown?.(e)
  }, [showCapsLockWarning, props])

  // Clear Caps Lock warning on blur
  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    setCapsLockOn(false)
    props.onBlur?.(e)
  }, [props])

  // Reset Caps Lock state when component unmounts
  useEffect(() => {
    return () => {
      setCapsLockOn(false)
    }
  }, [])

  // Combine container classes
  const containerClassName = `relative ${className}`

  return (
    <div className={containerClassName}>
      <Input
        ref={ref}
        type={isVisible ? 'text' : 'password'}
        autoComplete="current-password"
        {...props}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        rightAdornment={(
          <>
            {/* Caps Lock Warning Icon */}
            {showCapsLockWarning && capsLockOn && (
              <div className="auth-caps-lock-indicator pointer-events-none inline-flex items-center text-amber-500 dark:text-amber-400">
                <CapsLockIcon
                  className="h-5 w-5"
                  title="Caps Lock está ativado"
                />
              </div>
            )}

            {/* Toggle Visibility Button */}
            {showToggleVisibility && (
              <button
                type="button"
                onClick={toggleVisibility}
                className="auth-password-toggle inline-flex h-9 w-9 items-center justify-center rounded-md text-gray-400 transition-colors duration-150 hover:cursor-pointer hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-200"
                aria-label={isVisible ? 'Ocultar senha' : 'Mostrar senha'}
                title={isVisible ? 'Ocultar senha' : 'Mostrar senha'}
                tabIndex={0}
              >
                {isVisible ? (
                  <EyeOffIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            )}
          </>
        )}
      />
      
      {/* Caps Lock Warning Message */}
      {showCapsLockWarning && capsLockOn && (
        <div className="mt-2 text-sm text-amber-600 dark:text-amber-400 flex items-center">
          <CapsLockIcon className="w-4 h-4 mr-1" />
          Caps Lock está ativado
        </div>
      )}
    </div>
  )
}
