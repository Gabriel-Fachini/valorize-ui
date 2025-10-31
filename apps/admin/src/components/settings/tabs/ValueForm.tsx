import { type FC, useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/Input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { IconPickerDialog } from './IconPickerDialog'
import type { CompanyValue } from '@/types/companyValues'
import { cn } from '@/lib/utils'

interface ValueFormProps {
  value?: CompanyValue | null
  onSave: (value: Partial<CompanyValue>) => void
  onCancel: () => void
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export const ValueForm: FC<ValueFormProps> = ({ value, onSave, onCancel, open = false, onOpenChange }) => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [example, setExample] = useState('')
  const [iconName, setIconName] = useState('lightbulb')
  const [iconColor, setIconColor] = useState('#00D959')
  const [isIconPickerOpen, setIsIconPickerOpen] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    if (value) {
      setTitle(value.title)
      setDescription(value.description || '')
      setExample(value.example || '')
      setIconName(value.iconName || 'lightbulb')
      setIconColor(value.iconColor || '#00D959')
    } else {
      setTitle('')
      setDescription('')
      setExample('')
      setIconName('lightbulb')
      setIconColor('#00D959')
    }
  }, [value])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError(null)
    try {
      await onSave({ id: value?.id, title, description, example, iconName, iconColor })
    } catch (err) {
      const anyErr = err as { message?: string } | undefined
      const message = anyErr?.message || 'Erro ao salvar valor. Tente novamente.'
      setSubmitError(message)
    }
  }

  const handleIconConfirm = (selectedIconName: string, selectedIconColor: string) => {
    setIconName(selectedIconName)
    setIconColor(selectedIconColor)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{value ? 'Editar Valor' : 'Adicionar Valor'}</DialogTitle>
            <DialogDescription>Preencha os campos abaixo e salve para aplicar</DialogDescription>
          </DialogHeader>
          {submitError && (
            <div className="rounded-md border border-red-500/30 bg-red-500/10 text-red-500 px-3 py-2 text-sm">
              {submitError}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input id="title" name="title" label="Título" placeholder="Ex: 'Visão de Negócios'" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>

            {/* Seletor de Ícone */}
            <div>
              <label className="text-sm font-medium mb-2 block">Ícone</label>
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsIconPickerOpen(true)}
                  className="flex items-center gap-2"
                >
                  <i
                    className={cn('ph-duotone', `ph-${iconName}`)}
                    style={{ color: iconColor, fontSize: '24px' }}
                  />
                  <span>Selecionar Ícone</span>
                </Button>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="font-mono">{iconName}</span>
                  <div
                    className="w-6 h-6 rounded border border-border"
                    style={{ backgroundColor: iconColor }}
                    title={iconColor}
                  />
                </div>
              </div>
            </div>

            <div>
              <Input id="description" name="description" label="Descrição" placeholder="Ex: Ter uma visão de negócios clara e alinhada com a missão da empresa" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <div>
              <Input id="example" name="example" label="Exemplo de uso" placeholder="Ex: 'Hoje na entrega da sprint, você demonstrou uma excelente visão de negócios'" value={example} onChange={(e) => setExample(e.target.value)} />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
              <Button type="submit">Salvar</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <IconPickerDialog
        open={isIconPickerOpen}
        onOpenChange={setIsIconPickerOpen}
        selectedIcon={iconName}
        selectedColor={iconColor}
        onConfirm={handleIconConfirm}
      />
    </>
  )
}
