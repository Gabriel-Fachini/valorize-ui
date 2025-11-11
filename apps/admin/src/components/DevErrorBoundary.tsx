import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface ErrorComponentProps {
  error: Error
  info?: { componentStack: string }
  reset: () => void
}

/**
 * DevErrorBoundary - Componente de erro para development apenas
 * Exibe informações detalhadas sobre erros para facilitar debugging
 *
 * Props do TanStack Router:
 * - error: O erro lançado
 * - info: { componentStack: string } - Stack do React
 * - reset: () => void - Função para resetar o erro
 */
export const DevErrorBoundary = ({ error, info, reset }: ErrorComponentProps) => {
  const [expandedStack, setExpandedStack] = useState(false)
  const [expandedComponentStack, setExpandedComponentStack] = useState(false)

  const handleCopyError = () => {
    const fullError = `
ERROR: ${error.name}
MESSAGE: ${error.message}

STACK TRACE:
${error.stack}

${info?.componentStack ? `COMPONENT STACK:\n${info.componentStack}` : ''}

URL: ${window.location.href}
TIME: ${new Date().toISOString()}
    `.trim()

    navigator.clipboard.writeText(fullError).then(() => {
      // Brief visual feedback
      const button = document.querySelector('[data-copy-button]') as HTMLButtonElement
      if (button) {
        const originalText = button.textContent
        button.textContent = 'Copiado!'
        setTimeout(() => {
          button.textContent = originalText
        }, 2000)
      }
    })
  }

  const handleReload = () => {
    window.location.reload()
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-orange-50 p-4">
      <Card className="w-full max-w-2xl border-2 border-red-300 shadow-xl">
        <CardHeader className="bg-red-50 border-b-2 border-red-300">
          <div className="flex items-center gap-3">
            <div className="text-4xl">
              <i className="ph ph-bug text-red-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <CardTitle className="text-2xl text-red-700">
                  {error.name || 'Error'}
                </CardTitle>
                {import.meta.env.DEV && (
                  <Badge variant="destructive" className="uppercase text-xs">
                    Development
                  </Badge>
                )}
              </div>
              <CardDescription className="text-red-600">
                Uma exceção foi lançada durante a renderização da rota
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-6 space-y-4">
          {/* Error Message */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Mensagem do Erro</h3>
            <div className="bg-red-50 border border-red-200 rounded-md p-3 text-sm text-red-800">
              {error.message || 'Nenhuma mensagem de erro disponível'}
            </div>
          </div>

          {/* Error Info */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600 font-semibold">URL Atual</p>
              <p className="text-gray-800 break-all font-mono text-xs">
                {window.location.href}
              </p>
            </div>
            <div>
              <p className="text-gray-600 font-semibold">Timestamp</p>
              <p className="text-gray-800 font-mono text-xs">
                {new Date().toISOString()}
              </p>
            </div>
          </div>

          {/* Stack Trace */}
          {error.stack && (
            <div>
              <button
                onClick={() => setExpandedStack(!expandedStack)}
                className={cn(
                  'flex items-center gap-2 w-full text-left p-3 rounded-md',
                  'bg-gray-100 hover:bg-gray-200 transition-colors',
                  'text-sm font-semibold text-gray-700 cursor-pointer'
                )}
              >
                <i className={`ph ${expandedStack ? 'ph-caret-down' : 'ph-caret-right'}`} />
                Stack Trace ({error.stack.split('\n').length} linhas)
              </button>
              {expandedStack && (
                <div className="mt-2 bg-gray-900 text-gray-100 p-4 rounded-md overflow-auto max-h-64 border border-gray-700">
                  <pre className="font-mono text-xs whitespace-pre-wrap break-words">
                    {error.stack}
                  </pre>
                </div>
              )}
            </div>
          )}

          {/* Component Stack */}
          {info?.componentStack && (
            <div>
              <button
                onClick={() => setExpandedComponentStack(!expandedComponentStack)}
                className={cn(
                  'flex items-center gap-2 w-full text-left p-3 rounded-md',
                  'bg-blue-100 hover:bg-blue-200 transition-colors',
                  'text-sm font-semibold text-blue-700 cursor-pointer'
                )}
              >
                <i className={`ph ${expandedComponentStack ? 'ph-caret-down' : 'ph-caret-right'}`} />
                React Component Stack
              </button>
              {expandedComponentStack && (
                <div className="mt-2 bg-blue-50 p-4 rounded-md overflow-auto max-h-64 border border-blue-200">
                  <pre className="font-mono text-xs whitespace-pre-wrap break-words text-blue-900">
                    {info.componentStack}
                  </pre>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-4 border-t border-gray-200">
            <Button onClick={reset} variant="default" className="flex-1">
              <i className="ph ph-arrow-clockwise" />
              Tentar Novamente
            </Button>
            <Button
              onClick={handleCopyError}
              data-copy-button
              variant="outline"
              className="flex-1"
            >
              <i className="ph ph-copy" />
              Copiar Erro
            </Button>
            <Button onClick={handleReload} variant="outline" className="flex-1">
              <i className="ph ph-arrow-u-up-left" />
              Recarregar Página
            </Button>
          </div>

          {/* Development Info */}
          <div className="mt-6 p-3 bg-yellow-50 border border-yellow-200 rounded-md text-xs text-yellow-800">
            <i className="ph ph-info text-yellow-600 mr-2" />
            Este componente de erro está visível apenas durante o desenvolvimento.
            Em produção, um erro genérico será exibido ao usuário.
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
