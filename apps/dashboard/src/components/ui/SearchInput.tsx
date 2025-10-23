import { useState, useCallback, useEffect, type ChangeEvent } from 'react'
import { cn } from '@/lib/utils'
import { useDebounce } from '@/hooks/useDebounce'

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  label?: string
  debounceMs?: number
  disabled?: boolean
  className?: string
  id?: string
}

export const SearchInput = ({ 
  value, 
  onChange, 
  placeholder = 'Buscar...', 
  label,
  debounceMs = 0,
  disabled = false,
  className,
  id = 'search-input',
}: SearchInputProps) => {
  const [internalValue, setInternalValue] = useState(value)
  const debouncedValue = useDebounce(internalValue, debounceMs)

  // Sync debounced value with parent (only when debounced value changes)
  useEffect(() => {
    if (debounceMs > 0) {
      onChange(debouncedValue)
    }
  }, [debouncedValue, onChange, debounceMs])

  // Sync external value changes (only when external value changes, not internal)
  useEffect(() => {
    setInternalValue(value)
  }, [value])

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setInternalValue(newValue)
    
    // If no debounce, update immediately
    if (debounceMs === 0) {
      onChange(newValue)
    }
  }, [onChange, debounceMs])

  return (
    <div className={cn('w-full', className)}>
      {label && (
        <label 
          htmlFor={id}
          className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <i 
          className="ph-bold ph-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-xl text-gray-400 dark:text-gray-500" 
          aria-hidden="true"
        />
        <input
          id={id}
          type="search"
          value={internalValue}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          aria-label={label ?? placeholder}
          aria-describedby={`${id}-description`}
          role="searchbox"
          autoComplete="off"
          className="w-full rounded-lg border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 pl-12 pr-4 py-3 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>
      <span id={`${id}-description`} className="sr-only">
        {debounceMs > 0 
          ? `A busca será realizada automaticamente após ${debounceMs}ms de inatividade`
          : 'A busca será realizada em tempo real'
        }
      </span>
    </div>
  )
}
