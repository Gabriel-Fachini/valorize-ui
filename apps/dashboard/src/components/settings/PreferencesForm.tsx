import React from 'react'
import { useTheme } from '@/hooks/useTheme'
import { useAccessibility } from '@/hooks/useAccessibility'
import { Button } from '@/components/ui/button'

export const PreferencesForm: React.FC = () => {
  const { isDark, toggleTheme } = useTheme()
  const { fontScale, setFontScale, highContrast, toggleHighContrast, reduceMotion, toggleReduceMotion, resetDefaults } = useAccessibility()

  return (
    <div className="space-y-6">
      {/* Tema */}
      <section>
        <h3 className="text-md font-semibold mb-2 text-gray-900 dark:text-white">Tema</h3>
        <div className="flex items-center gap-3">
          <Button
            type="button"
            onClick={toggleTheme}
            variant={isDark ? 'default' : 'outline'}
            className={isDark ? 'bg-green-600 hover:bg-green-700 text-white' : ''}
            aria-pressed={isDark}
          >
            {isDark ? 'Modo Escuro (ativo)' : 'Modo Claro (ativo)'}
          </Button>
        </div>
      </section>

      {/* Acessibilidade */}
      <section>
        <h3 className="text-md font-semibold mb-3 text-gray-900 dark:text-white">Acessibilidade</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          {/* Tamanho da Fonte */}
          <div className="p-4 rounded-xl border border-[#4a4a4a] dark:border-[#424242] bg-white/60 dark:bg-neutral-800/50">
            <div className="mb-2 font-medium text-gray-900 dark:text-white">Tamanho da fonte</div>
            <div className="flex flex-wrap gap-2">
              {(['sm', 'md', 'lg', 'xl'] as const).map(scale => (
                <Button
                  key={scale}
                  type="button"
                  onClick={() => setFontScale(scale)}
                  variant="ghost"
                  size="sm"
                  className={
                    fontScale === scale 
                      ? 'bg-white dark:bg-neutral-900 text-gray-900 dark:text-white border border-[#4a4a4a] dark:border-[#424242] shadow-lg hover:bg-white/90 dark:hover:bg-neutral-900/90' 
                      : 'bg-white/50 dark:bg-neutral-800/50 text-gray-700 dark:text-gray-300 border border-[#5a5a5a] dark:border-[#3a3a3a] hover:bg-white/70 dark:hover:bg-neutral-800/70'
                  }
                  aria-pressed={fontScale === scale}
                  aria-current={fontScale === scale ? 'true' : 'false'}
                >
                  {scale.toUpperCase()}
                </Button>
              ))}
            </div>
          </div>

          {/* Alto contraste */}
          <div className="p-4 rounded-xl border border-[#4a4a4a] dark:border-[#3a3a3a] bg-white/60 dark:bg-neutral-800/50">
            <div className="mb-2 font-medium text-gray-900 dark:text-white">Alto contraste</div>
            <Button
              type="button"
              onClick={toggleHighContrast}
              variant="ghost"
              size="sm"
              className={
                highContrast 
                  ? 'bg-white dark:bg-neutral-900 text-gray-900 dark:text-white border border-[#4a4a4a] dark:border-[#424242] shadow-lg hover:bg-white/90 dark:hover:bg-neutral-900/90' 
                  : 'bg-white/50 dark:bg-neutral-800/50 text-gray-700 dark:text-gray-300 border border-[#5a5a5a] dark:border-[#3a3a3a] hover:bg-white/70 dark:hover:bg-neutral-800/70'
              }
              aria-pressed={highContrast}
            >
              {highContrast ? 'Ativado' : 'Desativado'}
            </Button>
          </div>

          {/* Reduzir animações */}
          <div className="p-4 rounded-xl border border-[#4a4a4a] dark:border-[#3a3a3a] bg-white/60 dark:bg-neutral-800/50">
            <div className="mb-2 font-medium text-gray-900 dark:text-white">Reduzir animações</div>
            <Button
              type="button"
              onClick={toggleReduceMotion}
              variant="ghost"
              size="sm"
              className={
                reduceMotion 
                  ? 'bg-white dark:bg-neutral-900 text-gray-900 dark:text-white border border-[#4a4a4a] dark:border-[#424242] shadow-lg hover:bg-white/90 dark:hover:bg-neutral-900/90' 
                  : 'bg-white/50 dark:bg-neutral-800/50 text-gray-700 dark:text-gray-300 border border-[#5a5a5a] dark:border-[#3a3a3a] hover:bg-white/70 dark:hover:bg-neutral-800/70'
              }
              aria-pressed={reduceMotion}
            >
              {reduceMotion ? 'Ativado' : 'Desativado'}
            </Button>
          </div>
        </div>

        <div className="mt-4">
          <Button
            type="button"
            onClick={resetDefaults}
            variant="ghost"
            size="sm"
            className="bg-white dark:bg-neutral-900 text-gray-900 dark:text-white border border-[#4a4a4a] dark:border-[#424242] shadow-lg hover:bg-white/90 dark:hover:bg-neutral-900/90"
          >
            Restaurar padrão
          </Button>
        </div>
      </section>
    </div>
  )
}
