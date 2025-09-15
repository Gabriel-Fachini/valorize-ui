/**
 * Base Input Component
 * Input component integrated with react-hook-form and focused on exceptional UX
 */

import { useSpring, animated, config } from '@react-spring/web'
import { BaseInputProps } from '@types'

// Design tokens com contraste otimizado para acessibilidade (WCAG AA)
const inputStyles = {
  base: [
    'absolute w-full px-4 py-3 rounded-lg border relative z-10',
    'bg-gray-800 text-gray-50',
    'placeholder-gray-400',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    'disabled:opacity-70 disabled:cursor-not-allowed disabled:bg-gray-700',
  ].join(' '),
  
  variants: {
    default: [
      'border-gray-600',
      'focus:ring-blue-500 focus:border-blue-500',
    ].join(' '),
    
    error: [
      'border-red-500 bg-red-900/20',
      'focus:ring-red-500 focus:border-red-500',
    ].join(' '),
    
    success: [
      'border-green-500 bg-green-900/20',
      'focus:ring-green-500 focus:border-green-500',
    ].join(' '),
  },
}

const labelStyles = {
  base: 'block text-sm font-semibold mb-2',
  default: 'text-gray-200',
  error: 'text-red-300',
  success: 'text-green-300',
  required: 'after:content-["*"] after:text-red-400 after:ml-1',
}

const helperStyles = {
  base: 'absolute z-0 w-full h-12 text-sm bg-red-900 px-3 pt-5 box-border rounded-lg overflow-hidden flex items-center',
  default: 'text-gray-300',
  error: 'text-red-200',
  success: 'text-green-200',
}

const inputDiv = 'absolute bg-gray-800 w-full px-4 py-3 rounded-lg border relative z-10 text-white'

const errorDiv = 'absolute text-white z-0 w-full h-14 text-sm bg-red-900 px-3 pb-1 box-content rounded-lg overflow-hidden flex items-center font-medium'

// InputProps extends HTML input props with our custom BaseInputProps
export interface InputProps extends BaseInputProps {
  type?: 'text' | 'email' | 'password'
  value?: string
  defaultValue?: string
  autoComplete?: string
  id?: string
  ref?: React.Ref<HTMLInputElement>
  inputMode?: 'none' | 'text' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal' | 'search'
  'aria-describedby'?: string
  'aria-invalid'?: boolean
}

// Base Input Component - React 19 não precisa de forwardRef
export const Input = ({
  type = 'text',
  name,
  label,
  placeholder,
  value,
  defaultValue,
  required = false,
  disabled = false,
  error,
  helperText,
  className = '',
  autoComplete,
  autoFocus = false,
  id,
  ref,
  onChange,
  onBlur,
  ...rest
}: InputProps) => {
  // Determine input state
  const hasError = Boolean(error)
  const variant = hasError ? 'error' : 'default'
  
  // Generate unique ID if not provided
  const inputId = id ?? `input-${name}`
  const errorId = `${inputId}-error`
  const helperId = `${inputId}-helper`
  
  const heights = {
    label: 28, // Height of the label (approx)
    input: 48, // Height of the input field
    error: 40, // Extra space for the error message
  }

  // Animate the container height
  const containerAnimation = useSpring({
    height: hasError 
      ? heights.label + heights.input + heights.error 
      : heights.label + heights.input,
    config: config.gentle,
  })

  // Animações do input (borda e background)
  const inputAnimation = useSpring({
    borderColor: hasError 
      ? 'rgb(220, 38, 38)' // red-600
      : 'rgb(156, 163, 175)', // gray-400
    config: hasError ? config.gentle : config.molasses,
  })
  
  // Animação da mensagem de erro
  const errorAnimation = useSpring({
    paddingTop: hasError ? '20px' : '0px',
    paddingBottom: hasError ? '10px' : '0px',
    height: hasError ? '56px' : '0px',
    transform: hasError ? 'translateY(-15px)' : 'translateY(-50px)',
    opacity: 1,
    config: hasError ? config.gentle : config.default,
  })
  
  // Combine class names
  const inputClassName = [
    inputStyles.base,
    inputStyles.variants[variant],
    className,
  ].join(' ')
  
  const labelClassName = [
    labelStyles.base,
    labelStyles[variant],
    required && labelStyles.required,
  ].filter(Boolean).join(' ')
  
  const helperClassName = [
    helperStyles.base,
    hasError ? helperStyles.error : helperStyles.default,
  ].join(' ')
  
  return (
    <animated.div style={containerAnimation}>
      {/* Label */}
      <label 
        htmlFor={inputId}
        className={labelClassName}
      >
        {label}
      </label>
      
      {/* Input Container */}
      <div className="relative">
        {/* Input */}
        <animated.input
          ref={ref}
          type={type}
          id={inputId}
          name={name}
          value={value}
          defaultValue={defaultValue}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          autoComplete={autoComplete}
          autoFocus={autoFocus}
          className={inputDiv}
          style={inputAnimation}
          onChange={onChange}
          onBlur={onBlur}
          aria-invalid={hasError}
          aria-describedby={[
            helperText && helperId,
            error && errorId,
          ].filter(Boolean).join(' ') || undefined}
          {...rest}
        />
        
        {/* Error Message - Always present, positioned behind input */}
        <animated.div 
          id={errorId}
          className={errorDiv}
          style={errorAnimation}
          role={hasError ? 'alert' : undefined}
          aria-live={hasError ? 'polite' : undefined}
        >
          {error}
        </animated.div>
      </div>
      
      {/* Helper Text */}
      {helperText && !error && (
        <div 
          id={helperId}
          className={helperClassName}
        >
          {helperText}
        </div>
      )}
    </animated.div>
  )
}