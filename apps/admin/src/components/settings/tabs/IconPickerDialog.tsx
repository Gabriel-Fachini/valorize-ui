import { type FC, useState, useMemo } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/button'
import { ColorPicker } from '@/components/ui/ColorPicker'
import { phosphorIcons, iconCategories, type IconCategory } from '@/data/phosphorIcons'
import { cn } from '@/lib/utils'

interface IconPickerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedIcon?: string
  selectedColor?: string
  onConfirm: (iconName: string, color: string) => void
}

export const IconPickerDialog: FC<IconPickerDialogProps> = ({
  open,
  onOpenChange,
  selectedIcon = 'lightbulb',
  selectedColor = '#00D959',
  onConfirm,
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<IconCategory | 'all'>('all')
  const [tempIcon, setTempIcon] = useState(selectedIcon)
  const [tempColor, setTempColor] = useState(selectedColor)

  // Filtrar ícones com base na busca e categoria
  const filteredIcons = useMemo(() => {
    let icons = phosphorIcons

    // Filtrar por categoria
    if (selectedCategory !== 'all') {
      icons = icons.filter((icon) => icon.category === selectedCategory)
    }

    // Filtrar por busca
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      icons = icons.filter((icon) => {
        return (
          icon.name.toLowerCase().includes(query) ||
          icon.label.toLowerCase().includes(query) ||
          icon.keywords.some((keyword) => keyword.toLowerCase().includes(query))
        )
      })
    }

    return icons
  }, [searchQuery, selectedCategory])

  const handleConfirm = () => {
    onConfirm(tempIcon, tempColor)
    onOpenChange(false)
  }

  const handleCancel = () => {
    setTempIcon(selectedIcon)
    setTempColor(selectedColor)
    setSearchQuery('')
    setSelectedCategory('all')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Selecionar Ícone</DialogTitle>
          <DialogDescription>
            Escolha um ícone e uma cor para representar este valor
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Preview do ícone selecionado */}
          <div className="flex items-center gap-4 p-4 border rounded-lg bg-muted/30">
            <div className="flex items-center justify-center w-20 h-20 bg-background rounded-lg border">
              <i
                className={cn('ph-duotone', `ph-${tempIcon}`)}
                style={{ color: tempColor, fontSize: '48px' }}
              />
            </div>
            <div>
              <p className="text-sm font-medium">Preview do Ícone</p>
              <p className="text-sm text-muted-foreground">
                {phosphorIcons.find((i) => i.name === tempIcon)?.label || tempIcon}
              </p>
            </div>
          </div>

          {/* Seletor de Cor */}
          <div>
            <ColorPicker value={tempColor} onChange={setTempColor} />
          </div>

          {/* Campo de Busca */}
          <div>
            <Input
              id="icon-search"
              name="icon-search"
              label="Buscar Ícone"
              placeholder="Digite para buscar (ex: lâmpada, foguete, coração...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Filtro de Categorias */}
          <div>
            <label className="text-sm font-medium block mb-3">Filtrar por Categoria:</label>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className={cn(
                  'px-3 py-1.5 rounded-full text-sm font-medium transition-all',
                  selectedCategory === 'all'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted hover:bg-muted/80 text-muted-foreground'
                )}
              >
                Todos
              </button>
              {iconCategories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setSelectedCategory(category.id)}
                  className={cn(
                    'px-3 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-1.5',
                    selectedCategory === category.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted hover:bg-muted/80 text-muted-foreground'
                  )}
                >
                  <i className={`ph-duotone ph-${category.icon}`} style={{ fontSize: '16px' }} />
                  <span>{category.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Grid de Ícones */}
          <div>
            <p className="text-sm font-medium mb-3">
              {filteredIcons.length} {filteredIcons.length === 1 ? 'ícone disponível' : 'ícones disponíveis'}
            </p>
            {filteredIcons.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <i className="ph ph-magnifying-glass text-4xl mb-2 block" />
                <p>Nenhum ícone encontrado</p>
                <p className="text-sm">Tente buscar por outro termo</p>
              </div>
            ) : (
              <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2 max-h-96 overflow-y-auto p-2 border rounded-lg">
                {filteredIcons.map((icon) => (
                  <button
                    key={icon.name}
                    type="button"
                    onClick={() => setTempIcon(icon.name)}
                    className={cn(
                      'flex items-center justify-center h-14 w-full rounded border-2 transition-all hover:scale-110 hover:border-primary/50 bg-background',
                      tempIcon === icon.name
                        ? 'border-primary ring-2 ring-primary/20 bg-primary/5'
                        : 'border-border'
                    )}
                    title={icon.label}
                    aria-label={icon.label}
                  >
                    <i
                      className={cn('ph-duotone', `ph-${icon.name}`)}
                      style={{ color: tempColor, fontSize: '32px' }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Botões de Ação */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancelar
            </Button>
            <Button type="button" onClick={handleConfirm}>
              Confirmar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
