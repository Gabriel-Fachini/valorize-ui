import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface FilterButtonGroupProps<T> {
  label: string
  options: Array<{ 
    label: string
    value: T
    icon?: string
  }>
  value: T
  onChange: (value: T) => void
  disabled?: boolean
  className?: string
}

export function FilterButtonGroup<T>({
  label,
  options,
  value,
  onChange,
  disabled = false,
  className,
}: FilterButtonGroupProps<T>) {
  return (
    <div className={cn('space-y-3', className)}>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <Button
            key={String(option.value)}
            onClick={() => onChange(option.value)}
            variant={value === option.value ? 'default' : 'outline'}
            size="sm"
            disabled={disabled}
            className={cn(
              'flex items-center gap-2',
              value === option.value
                ? 'bg-green-600 hover:bg-green-700 text-white border-green-600'
                : 'bg-white dark:bg-neutral-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-neutral-600 hover:bg-gray-100 dark:hover:bg-neutral-700',
            )}
          >
            {option.icon && (
              <i className={cn('text-base', option.icon)} />
            )}
            {option.label}
          </Button>
        ))}
      </div>
    </div>
  )
}