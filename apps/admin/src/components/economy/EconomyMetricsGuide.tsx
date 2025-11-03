/**
 * Economy Metrics Guide Component
 * Collapsible educational section explaining the dual-coin system
 */

import type { FC } from 'react'
import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'

const STORAGE_KEY = 'valorize:economy-guide-expanded'

/**
 * EconomyMetricsGuide - Educational collapsible section
 *
 * Features:
 * - Explains dual-coin system
 * - Shows healthy metric ranges
 * - Persists open/closed state
 * - Clean, scannable layout
 */
export const EconomyMetricsGuide: FC = () => {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'true') {
      setIsOpen(true)
    }
  }, [])

  const handleToggle = () => {
    const newState = !isOpen
    setIsOpen(newState)
    localStorage.setItem(STORAGE_KEY, String(newState))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleToggle()
    }
  }

  return (
    <Card className="border-dashed border-2" role="region" aria-labelledby="guide-title">
      <CardContent className="pt-6">
        <button
          className="w-full justify-between p-0 h-auto hover:bg-transparent focus:outline-none focus:ring-2 focus:ring-primary rounded flex items-center gap-2 cursor-pointer transition-colors hover:opacity-80"
          onClick={handleToggle}
          onKeyDown={handleKeyDown}
          aria-expanded={isOpen}
          aria-controls="guide-content"
          type="button"
        >
          <div className="flex items-center gap-2">
            <i className="ph ph-book-open text-xl text-primary" aria-hidden="true" />
            <h3 className="text-base font-semibold" id="guide-title">
              Guia Rápido: Como Interpretar as Métricas
            </h3>
          </div>
          <i
            className={`ph ph-caret-${isOpen ? 'up' : 'down'} text-xl transition-transform`}
            aria-hidden="true"
          />
        </button>

        {isOpen && (
          <div className="mt-6 space-y-6 text-sm animate-in slide-in-from-top-2 duration-300" id="guide-content">
            <div>
              <h4 className="font-semibold text-base mb-3 flex items-center gap-2">
                <i className="ph ph-coin-vertical text-primary" />
                Sistema de Moedas Duplas
              </h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2 p-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
                  <div className="flex items-center gap-2">
                    <i className="ph ph-heart-fill text-emerald-600" />
                    <h5 className="font-semibold text-emerald-900 dark:text-emerald-100">
                      1️⃣ Moedas de Elogios
                    </h5>
                  </div>
                  <ul className="space-y-1 text-xs text-emerald-800 dark:text-emerald-200 ml-6 list-disc">
                    <li>100 moedas por usuário/semana (renováveis)</li>
                    <li>Usadas APENAS para enviar elogios</li>
                    <li>NÃO convertem em dinheiro</li>
                    <li>Expiram toda semana (não acumulam)</li>
                    <li className="font-semibold">Objetivo: Incentivar cultura de reconhecimento</li>
                  </ul>
                </div>

                <div className="space-y-2 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-2">
                    <i className="ph ph-gift-fill text-blue-600" />
                    <h5 className="font-semibold text-blue-900 dark:text-blue-100">
                      2️⃣ Moedas de Resgate
                    </h5>
                  </div>
                  <ul className="space-y-1 text-xs text-blue-800 dark:text-blue-200 ml-6 list-disc">
                    <li>Recebidas quando alguém te elogia (acumulativas)</li>
                    <li>CONVERTEM em prêmios reais</li>
                    <li>Expiram em 18 meses</li>
                    <li>Cada moeda = R$ 0,06 de custo</li>
                    <li className="font-semibold">Objetivo: Recompensar contribuições</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="p-4 bg-muted/50 rounded-lg border">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <i className="ph ph-arrow-right text-primary" />
                Fluxo Financeiro
              </h4>
              <p className="text-xs text-muted-foreground">
                Você carrega saldo (pré-pago) → Colaboradores resgatam prêmios → Sistema deduz do saldo automaticamente
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <i className="ph ph-chart-line text-primary" />
                Métricas Saudáveis
              </h4>
              <div className="grid md:grid-cols-2 gap-3">
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-mono bg-emerald-100 dark:bg-emerald-900/30 px-2 py-1 rounded text-emerald-700 dark:text-emerald-300">
                    &gt; 70%
                  </span>
                  <span className="text-muted-foreground">Uso de Moedas de Elogios</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-mono bg-emerald-100 dark:bg-emerald-900/30 px-2 py-1 rounded text-emerald-700 dark:text-emerald-300">
                    25-40%
                  </span>
                  <span className="text-muted-foreground">Conversão em Recompensas</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-mono bg-emerald-100 dark:bg-emerald-900/30 px-2 py-1 rounded text-emerald-700 dark:text-emerald-300">
                    &gt; 45 dias
                  </span>
                  <span className="text-muted-foreground">Tempo de Cobertura</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-mono bg-emerald-100 dark:bg-emerald-900/30 px-2 py-1 rounded text-emerald-700 dark:text-emerald-300">
                    120-150%
                  </span>
                  <span className="text-muted-foreground">Índice de Cobertura</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <h4 className="font-semibold mb-2 text-blue-900 dark:text-blue-100 flex items-center gap-2">
                <i className="ph ph-lightbulb text-blue-600" />
                Quando Agir
              </h4>
              <ul className="space-y-1.5 text-xs text-blue-800 dark:text-blue-200 ml-6 list-disc">
                <li>
                  <strong>Tempo de Cobertura &lt; 15 dias:</strong> Carregar saldo urgentemente
                </li>
                <li>
                  <strong>Uso de Elogios &lt; 50%:</strong> Campanhas de incentivo ao reconhecimento
                </li>
                <li>
                  <strong>Conversão &lt; 15%:</strong> Revisar atratividade do catálogo de prêmios
                </li>
                <li>
                  <strong>Índice de Cobertura &lt; 80%:</strong> Risco de não honrar resgates
                </li>
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
