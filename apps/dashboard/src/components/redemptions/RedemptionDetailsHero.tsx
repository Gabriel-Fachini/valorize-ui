import React, { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RedemptionStatusBadge } from './RedemptionStatusBadge'
import { 
  getPrizeImage, 
  getPrizeName, 
  getPrizeCategory, 
  getVariantInfo,
  formatRedemptionDate,
  formatCoinsAmount,
} from '@/lib/redemptionUtils'
import type { Redemption } from '@/types/redemption.types'

interface RedemptionDetailsHeroProps {
  redemption: Redemption
  className?: string
}

export const RedemptionDetailsHero: React.FC<RedemptionDetailsHeroProps> = ({
  redemption,
  className,
}) => {
  const navigate = useNavigate()
  const [imageError, setImageError] = useState(false)
  
  const prizeImage = getPrizeImage(redemption)
  const prizeName = getPrizeName(redemption)
  const prizeCategory = getPrizeCategory(redemption)
  const variantInfo = getVariantInfo(redemption)

  const handlePrizeClick = () => {
    navigate({ to: `/prizes/${redemption.prizeId}` })
  }

  const handleImageError = () => {
    setImageError(true)
  }

  return (
    <Card className={`overflow-hidden border-gray-200 dark:border-neutral-700 ${className}`}>
      <div className="p-6 sm:p-8 bg-white dark:bg-neutral-900">
        <div className="flex flex-col sm:flex-row gap-6">
          {/* Prize Image */}
          <div className="shrink-0">
            <div className="relative h-32 w-32 sm:h-40 sm:w-40 rounded-xl overflow-hidden bg-gray-100 dark:bg-neutral-800 border-2 border-gray-200 dark:border-neutral-700">
              {!imageError ? (
                <img
                  src={prizeImage}
                  alt={prizeName}
                  className="h-full w-full object-cover"
                  onError={handleImageError}
                />
              ) : (
                <div className="h-full w-full flex flex-col items-center justify-center gap-2">
                  <i className="ph-bold ph-gift text-4xl text-gray-400 dark:text-gray-600" />
                  <span className="text-xs text-gray-500 dark:text-gray-500 font-medium">Sem imagem</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Prize Info */}
          <div className="flex-1 space-y-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <RedemptionStatusBadge 
                  status={redemption.status}
                  size="lg"
                  showIcon={true}
                />
              </div>
              
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                {prizeName}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 text-gray-700 dark:text-gray-300">
                <div className="flex items-center gap-2">
                  <i className="ph-bold ph-tag text-lg text-green-600 dark:text-green-400" />
                  <span className="font-medium">{prizeCategory}</span>
                </div>
                
                {variantInfo && (
                  <>
                    <span className="text-gray-400">•</span>
                    <div className="flex items-center gap-2">
                      <i className="ph-bold ph-package text-lg text-green-600 dark:text-green-400" />
                      <span className="font-medium">{variantInfo}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
            
            {/* Redemption Details */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-3 bg-gray-50 dark:bg-neutral-800 rounded-xl px-4 py-3 border border-gray-200 dark:border-neutral-700">
                <div className="p-2 bg-red-100 dark:bg-red-950 rounded-lg">
                  <i className="ph-bold ph-coins text-xl text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">Valor Gasto</p>
                  <p className="text-lg font-bold text-red-600 dark:text-red-400">
                    {formatCoinsAmount(redemption.coinsSpent)} moedas
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 bg-gray-50 dark:bg-neutral-800 rounded-xl px-4 py-3 border border-gray-200 dark:border-neutral-700">
                <div className="p-2 bg-blue-100 dark:bg-blue-950 rounded-lg">
                  <i className="ph-bold ph-calendar-blank text-xl text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">Data do Resgate</p>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">
                    {formatRedemptionDate(redemption.redeemedAt)}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 pt-2">
              <Button
                onClick={handlePrizeClick}
                variant="outline"
                size="lg"
                className="flex items-center gap-2 font-semibold bg-gray-50 dark:bg-neutral-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-neutral-600 hover:bg-gray-100 dark:hover:bg-neutral-700"
              >
                <i className="ph-bold ph-gift text-lg" />
                Ver detalhes do prêmio
                <i className="ph-bold ph-arrow-up-right text-base" />
              </Button>
              
              {redemption.trackingCode && (
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800">
                  <i className="ph-bold ph-barcode text-lg text-green-700 dark:text-green-400" />
                  <code className="text-sm font-mono font-semibold text-green-700 dark:text-green-300">
                    {redemption.trackingCode}
                  </code>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Redemption ID Footer */}
      <div className="bg-gray-50 dark:bg-neutral-900 px-6 sm:px-8 py-4 border-t border-gray-200 dark:border-neutral-700">
        <div className="flex items-center justify-between gap-4 text-sm">
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <i className="ph-bold ph-hash text-base" />
            <span className="font-medium">ID do Resgate:</span>
          </div>
          <code className="px-3 py-1.5 bg-gray-200 dark:bg-neutral-800 rounded-lg font-mono text-gray-900 dark:text-white font-semibold">
            {redemption.id}
          </code>
        </div>
      </div>
    </Card>
  )
}
