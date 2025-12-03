import React from 'react'
import { cn } from '../../utils/cn'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

export const Input: React.FC<InputProps> = ({ 
  label, 
  error, 
  hint, 
  className, 
  id, 
  ...props 
}) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-zinc-300">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={cn(
          'flex h-10 w-full rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 transition-all duration-200 focus:border-valorize-500 focus:outline-none focus:ring-2 focus:ring-valorize-500/20 disabled:cursor-not-allowed disabled:opacity-50',
          error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
      {hint && !error && (
        <p className="text-sm text-zinc-500">{hint}</p>
      )}
    </div>
  )
}