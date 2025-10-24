/**
 * Email Input Component
 * Specialized email input component with domain suggestions and optimized UX
 */

import { useState, useCallback } from 'react'
import { Input } from './Input'
import { EmailInputProps } from '@types'
import { COMMON_EMAIL_DOMAINS, suggestEmailDomain } from '@/lib'

export const EmailInput = ({
  showDomainSuggestions = true,
  commonDomains: _commonDomains = [...COMMON_EMAIL_DOMAINS],
  ref,
  onChange,
  onBlur,
  onKeyDown,
  ...props
}: EmailInputProps & { ref?: React.Ref<HTMLInputElement> }) => {
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [inputValue, setInputValue] = useState<string>(props.value ?? props.defaultValue ?? '')
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1)

  // Handle input change with domain suggestions
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(value)
    setSelectedSuggestionIndex(-1) // Reset selection when typing
    
    // Generate domain suggestions
    if (showDomainSuggestions && value.includes('@')) {
      const domainSuggestions = suggestEmailDomain(value)
      setSuggestions(domainSuggestions)
      setShowSuggestions(domainSuggestions.length > 0)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
    
    // Call parent onChange
    onChange?.(e)
  }, [showDomainSuggestions, onChange])

  // Handle suggestion selection
  const handleSuggestionClick = useCallback((domain: string) => {
    const atIndex = inputValue.indexOf('@')
    if (atIndex !== -1) {
      const newValue = inputValue.slice(0, atIndex + 1) + domain
      setInputValue(newValue)
      setShowSuggestions(false)
      setSuggestions([])
      setSelectedSuggestionIndex(-1)
      
      // Create synthetic event for parent onChange
      const syntheticEvent = {
        target: { value: newValue, name: props.name },
        currentTarget: { value: newValue, name: props.name },
      } as React.ChangeEvent<HTMLInputElement>
      
      onChange?.(syntheticEvent)
    }
  }, [inputValue, props.name, onChange])

  // Handle blur to hide suggestions
  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    // Delay hiding suggestions to allow clicking on them
    setTimeout(() => {
      setShowSuggestions(false)
    }, 150)
    onBlur?.(e)
  }, [onBlur])

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || suggestions.length === 0) {
      // If no suggestions are shown, just call the parent onKeyDown
      onKeyDown?.(e)
      return
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedSuggestionIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0,
        )
        break
      
      case 'ArrowUp':
        e.preventDefault()
        setSelectedSuggestionIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1,
        )
        break
        
      case 'Tab':
        e.preventDefault()
        setSelectedSuggestionIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0,
        )
        break
      
      case 'Enter':
        e.preventDefault()
        if (selectedSuggestionIndex >= 0 && selectedSuggestionIndex < suggestions.length) {
          handleSuggestionClick(suggestions[selectedSuggestionIndex])
        }
        break
      
      
      case 'Escape':
        e.preventDefault()
        setShowSuggestions(false)
        setSuggestions([])
        setSelectedSuggestionIndex(-1)
        break
      
      default:
        // For any other key, call the parent onKeyDown
        onKeyDown?.(e)
        break
    }
  }, [showSuggestions, suggestions, selectedSuggestionIndex, handleSuggestionClick, onKeyDown])

  return (
    <div className="relative">
      <Input
        ref={ref}
        type="email"
        autoComplete="email"
        inputMode="email"
        {...props}
        value={inputValue}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
      />
      
      {/* Domain Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-30 top-20 w-full bg-white dark:bg-[#262626] border border-gray-300 dark:border-[#404040] rounded-lg shadow-lg max-h-40 overflow-y-auto">
          {suggestions.map((domain, index) => {
            const atIndex = inputValue.indexOf('@')
            const userPart = inputValue.slice(0, atIndex + 1)
            const fullSuggestion = userPart + domain
            const isSelected = index === selectedSuggestionIndex
            
            return (
              <button
                key={domain}
                type="button"
                className={`w-full px-4 py-2 text-left first:rounded-t-lg last:rounded-b-lg focus:outline-none ${
                  isSelected 
                    ? 'bg-gray-100 dark:bg-[#171717] text-[#171717] dark:text-[#f5f5f5]' 
                    : 'hover:bg-gray-50 dark:hover:bg-[#262626] focus:bg-gray-50 dark:focus:bg-[#262626]'
                }`}
                onClick={() => handleSuggestionClick(domain)}
                onMouseDown={(e) => e.preventDefault()} // Prevent blur before click
                onMouseEnter={() => setSelectedSuggestionIndex(index)} // Update selection on hover
              >
                <div className="flex items-center">
                  <span className={`font-medium ${
                    isSelected 
                      ? 'text-[#171717] dark:text-[#f5f5f5]' 
                      : 'text-[#171717] dark:text-[#f5f5f5]'
                  }`}>
                    {fullSuggestion}
                  </span>
                  <span className={`ml-2 text-xs ${
                    isSelected 
                      ? 'text-[#525252] dark:text-[#d4d4d4]' 
                      : 'text-[#525252] dark:text-[#a3a3a3]'
                  }`}>
                    @{domain}
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}