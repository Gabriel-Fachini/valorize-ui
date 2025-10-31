import { type FC } from 'react'
import { cn } from '@/lib/utils'

interface ColorPickerProps {
  value?: string
  onChange: (color: string) => void
  className?: string
}

const PRESET_COLORS = [
  { name: 'Verde Valorize', color: '#00D959' },
  { name: 'Rosa Valorize', color: '#D9004F' },
  { name: 'Azul', color: '#3B82F6' },
  { name: 'Roxo', color: '#8B5CF6' },
  { name: 'Laranja', color: '#F97316' },
  { name: 'Vermelho', color: '#EF4444' },
  { name: 'Amarelo', color: '#EAB308' },
  { name: 'Verde Água', color: '#14B8A6' },
  { name: 'Índigo', color: '#6366F1' },
  { name: 'Pink', color: '#EC4899' },
  { name: 'Cinza', color: '#6B7280' },
  { name: 'Preto', color: '#000000' },
]

export const ColorPicker: FC<ColorPickerProps> = ({ value = '#00D959', onChange, className }) => {
  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center gap-3">
        <label htmlFor="custom-color" className="text-sm font-medium">
          Cor Personalizada:
        </label>
        <div className="flex items-center gap-2">
          <input
            id="custom-color"
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="h-10 w-20 rounded border border-border cursor-pointer"
          />
          <span className="text-sm text-muted-foreground font-mono">{value}</span>
        </div>
      </div>

      <div>
        <label className="text-sm font-medium block mb-2">Cores Pré-definidas:</label>
        <div className="grid grid-cols-6 gap-2">
          {PRESET_COLORS.map((preset) => (
            <button
              key={preset.color}
              type="button"
              onClick={() => onChange(preset.color)}
              className={cn(
                'h-10 w-full rounded border-2 transition-all hover:scale-110',
                value === preset.color ? 'border-primary ring-2 ring-primary/20' : 'border-border'
              )}
              style={{ backgroundColor: preset.color }}
              title={preset.name}
              aria-label={preset.name}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
