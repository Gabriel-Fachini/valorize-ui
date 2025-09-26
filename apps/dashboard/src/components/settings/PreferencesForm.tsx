import React from 'react'
import { useTheme } from '@/hooks/useTheme'
import { useAccessibility } from '@/hooks/useAccessibility'

export const PreferencesForm: React.FC = () => {
  const { isDark, toggleTheme } = useTheme()
  const { fontScale, setFontScale, highContrast, toggleHighContrast, reduceMotion, toggleReduceMotion, resetDefaults } = useAccessibility()

  return (
    <div className="space-y-6">
      {/* Tema */}
      <section>
        <h3 className="text-md font-semibold mb-2">Tema</h3>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleTheme}
            className={`px-4 py-2 rounded-xl transition-all duration-200 border ${
              isDark
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-transparent'
                : 'bg-white/70 dark:bg-gray-800/70 text-gray-800 dark:text-gray-200 border-white/20 dark:border-gray-700/40'
            }`}
          >
            {isDark ? 'Modo Escuro (ativo)' : 'Modo Claro (ativo)'}
          </button>
        </div>
      </section>

      {/* Acessibilidade */}
      <section>
        <h3 className="text-md font-semibold mb-3">Acessibilidade</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          {/* Tamanho da Fonte */}
          <div className="p-4 rounded-xl border border-white/20 dark:border-gray-700/40 bg-white/60 dark:bg-gray-800/50">
            <div className="mb-2 font-medium">Tamanho da fonte</div>
            <div className="flex flex-wrap gap-2">
              {(['sm', 'md', 'lg', 'xl'] as const).map(scale => (
                <button
                  key={scale}
                  type="button"
                  onClick={() => setFontScale(scale)}
                  className={`px-3 py-1.5 rounded-lg text-sm border transition-all duration-200 ${
                    fontScale === scale
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-transparent'
                      : 'bg-white/70 dark:bg-gray-800/70 text-gray-800 dark:text-gray-200 border-white/20 dark:border-gray-700/40'
                  }`}
                >
                  {scale.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Alto contraste */}
          <div className="p-4 rounded-xl border border-white/20 dark:border-gray-700/40 bg-white/60 dark:bg-gray-800/50">
            <div className="mb-2 font-medium">Alto contraste</div>
            <button
              type="button"
              onClick={toggleHighContrast}
              className={`px-3 py-1.5 rounded-lg text-sm border transition-all duration-200 ${
                highContrast
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-transparent'
                  : 'bg-white/70 dark:bg-gray-800/70 text-gray-800 dark:text-gray-200 border-white/20 dark:border-gray-700/40'
              }`}
            >
              {highContrast ? 'Ativado' : 'Desativado'}
            </button>
          </div>

          {/* Reduzir animações */}
          <div className="p-4 rounded-xl border border-white/20 dark:border-gray-700/40 bg-white/60 dark:bg-gray-800/50">
            <div className="mb-2 font-medium">Reduzir animações</div>
            <button
              type="button"
              onClick={toggleReduceMotion}
              className={`px-3 py-1.5 rounded-lg text-sm border transition-all duration-200 ${
                reduceMotion
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-transparent'
                  : 'bg-white/70 dark:bg-gray-800/70 text-gray-800 dark:text-gray-200 border-white/20 dark:border-gray-700/40'
              }`}
            >
              {reduceMotion ? 'Ativado' : 'Desativado'}
            </button>
          </div>
        </div>

        <div className="mt-3">
          <button
            type="button"
            onClick={resetDefaults}
            className="px-4 py-2 rounded-xl transition-all duration-200 border bg-white/70 dark:bg-gray-800/70 text-gray-800 dark:text-gray-200 border-white/20 dark:border-gray-700/40 hover:bg-white/90 dark:hover:bg-gray-800/90 active:scale-95"
          >
            Restaurar padrão
          </button>
        </div>
      </section>
    </div>
  )
}

export default PreferencesForm
