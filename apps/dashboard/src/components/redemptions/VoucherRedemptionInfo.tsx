import React from 'react'
import { Card } from '@/components/ui/card'
import { MarkdownContent } from '@/components/ui/MarkdownContent'
import type { Redemption } from '@/types/redemption.types'

interface VoucherRedemptionInfoProps {
  redemption: Redemption
  className?: string
}

export const VoucherRedemptionInfo: React.FC<VoucherRedemptionInfoProps> = ({
  redemption,
  className,
}) => {
  const isSent = redemption.status.toLowerCase() === 'sent'
  const isFailed = redemption.status.toLowerCase() === 'failed'
  const hasInstructions = redemption.prize?.description

  return (
    <Card className={`border-gray-200 dark:border-neutral-700 ${className}`}>
      <div className="p-6 space-y-5">
        {isSent && (
          <div className="rounded-xl bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800/50 p-5">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 mt-0.5">
                <div className="p-2.5 bg-green-100 dark:bg-green-900/50 rounded-lg">
                  <i className="ph-fill ph-envelope-simple text-3xl text-green-600 dark:text-green-400" />
                </div>
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-lg text-green-900 dark:text-green-100 mb-2">
                  Voucher enviado com sucesso!
                </h4>
                <p className="text-sm text-green-800 dark:text-green-200 leading-relaxed mb-3">
                  O código do seu voucher foi enviado para o email cadastrado na sua conta.
                  Verifique sua caixa de entrada e também a pasta de spam.
                </p>
                <div className="flex items-start gap-2 text-xs text-green-700 dark:text-green-300 bg-green-100/50 dark:bg-green-900/30 rounded-lg p-3">
                  <i className="ph-bold ph-info text-base mt-0.5" />
                  <p>
                    <strong>Importante:</strong> Guarde o código do voucher em local seguro.
                    Em caso de dúvidas sobre o uso, entre em contato com o suporte.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {isFailed && (
          <div className="rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/50 p-5">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 mt-0.5">
                <div className="p-2.5 bg-red-100 dark:bg-red-900/50 rounded-lg">
                  <i className="ph-fill ph-warning-circle text-3xl text-red-600 dark:text-red-400" />
                </div>
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-lg text-red-900 dark:text-red-100 mb-2">
                  Falha no envio do voucher
                </h4>
                <p className="text-sm text-red-800 dark:text-red-200 leading-relaxed mb-3">
                  Não foi possível enviar o código do voucher para o seu email.
                  Isso pode ter ocorrido devido a um problema temporário no sistema.
                </p>
                <div className="flex items-start gap-2 text-xs text-red-700 dark:text-red-300 bg-red-100/50 dark:bg-red-900/30 rounded-lg p-3">
                  <i className="ph-bold ph-headset text-base mt-0.5" />
                  <p>
                    <strong>O que fazer:</strong> Entre em contato com o suporte informando o ID do resgate
                    para que possamos reenviar o voucher ou resolver o problema.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Instruções de uso do voucher */}
        {hasInstructions && (
          <div className="rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/50 p-5">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 mt-0.5">
                <div className="p-2.5 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                  <i className="ph-fill ph-info text-3xl text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-lg text-blue-900 dark:text-blue-100 mb-3">
                  Instruções de Uso
                </h4>
                <div className="text-sm text-blue-900 dark:text-blue-100">
                  <MarkdownContent content={redemption.prize?.description || ''} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
