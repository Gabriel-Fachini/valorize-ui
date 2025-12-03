import React from 'react'
import { cn } from '../../utils/cn'

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  hint?: string
  options: Array<{ value: string; label: string }>
  placeholder?: string
}

export const Select: React.FC<SelectProps> = ({ 
  label, 
  error, 
  hint, 
  options,
  placeholder,
  className, 
  id, 
  ...props 
}) => {
  const selectId = id || label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={selectId} className="text-sm font-medium text-zinc-300">
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={cn(
          'flex h-10 w-full rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-2 text-sm text-zinc-100 transition-all duration-200 focus:border-valorize-500 focus:outline-none focus:ring-2 focus:ring-valorize-500/20 disabled:cursor-not-allowed disabled:opacity-50',
          error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
          className
        )}
        {...props}
      >
        {placeholder && (
          <option value="" className="bg-zinc-900 text-zinc-500">{placeholder}</option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value} className="bg-zinc-900 text-zinc-100">
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
      {hint && !error && (
        <p className="text-sm text-zinc-500">{hint}</p>
      )}
    </div>
  )
}