import { type FC } from 'react'
import { useParams, useNavigate } from '@tanstack/react-router'
import { usePrizeById } from '@/hooks/usePrizes'
import { usePrizeDetails } from '@/hooks/usePrizeDetails'
import { ImageCarousel } from '@/components/prizes/ImageCarousel'
import { PrizeSpecifications } from '@/components/prizes/PrizeSpecifications'
import { PrizeVariantSelector } from '@/components/prizes/PrizeVariantSelector'
import { PrizePricingCard } from '@/components/prizes/PrizePricingCard'
import { PrizeHeader } from '@/components/prizes/PrizeHeader'
import { PrizeDetailsLoading } from '@/components/prizes/PrizeDetailsLoading'
import { PrizeDetailsError } from '@/components/prizes/PrizeDetailsError'
import { BackButton } from '@/components/ui/BackButton'
import { PageLayout } from '@/components/layout/PageLayout'
import { usePageEntrance } from '@/hooks/useAnimations'
import { animated } from '@react-spring/web'

export const PrizeDetailsPage: FC = () => {
  const { prizeId } = useParams({ strict: false })
  const navigate = useNavigate()
  const { data: prize, isLoading, error } = usePrizeById(prizeId)

  const {
    selectedVariantId,
    handleVariantChange,
    handleProceedToConfirm,
    canProceed,
  } = usePrizeDetails({ prize: prize ?? undefined })

  const fadeIn = usePageEntrance()

  // Loading state
  if (isLoading) {
    return <PrizeDetailsLoading />
  }

  // Error state
  if (error || !prize) {
    return <PrizeDetailsError onBack={() => navigate({ to: '/prizes' })} />
  }

  return (
    <PageLayout maxWidth="6xl">
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <animated.div style={fadeIn as any} className="relative mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <BackButton onClick={() => navigate({ to: '/prizes' })} />
        
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left Column */}
          <div>
            
            <ImageCarousel images={prize.images} title={prize.name} />
            {prize.specifications && Object.keys(prize.specifications).length > 0 && (
              <PrizeSpecifications specifications={prize.specifications} />
            )}
          </div>
          
          {/* Right Column */}
          <div className="space-y-6">
            {/* Header Info */}
            <PrizeHeader 
              name={prize.name}
              category={prize.category}
              brand={prize.brand}
              description={prize.description}
            />
            
            {/* Variants */}
            {prize.variants && prize.variants.length > 0 && (
              <PrizeVariantSelector
                variants={prize.variants}
                selectedId={selectedVariantId}
                onSelect={handleVariantChange}
                required
              />
            )}
            
            {/* Pricing and Action */}
            <PrizePricingCard
              coinPrice={prize.coinPrice}
              stock={prize.stock}
              onAction={handleProceedToConfirm}
              disabled={!canProceed}
            />
          </div>
        </div>
      </animated.div>
    </PageLayout>
  )
}