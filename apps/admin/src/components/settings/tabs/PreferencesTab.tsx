import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { useTheme } from '@/hooks/useTheme'

export const PreferencesTab = () => {
  const { isDark, toggleTheme } = useTheme()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Preferências do Sistema</CardTitle>
        <CardDescription>
          Personalize sua experiência no painel administrativo
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="theme-mode" className="text-base">
              Modo Escuro
            </Label>
            <div className="text-sm text-muted-foreground">
              Alterne entre os temas claro e escuro
            </div>
          </div>
          <Switch
            id="theme-mode"
            checked={isDark}
            onCheckedChange={toggleTheme}
          />
        </div>
      </CardContent>
    </Card>
  )
}
