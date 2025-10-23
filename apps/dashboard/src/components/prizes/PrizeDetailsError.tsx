import { type FC } from 'react'
import { PageLayout } from '@/components/layout/PageLayout'
import { Button } from '@/components/ui/button'
import { Alert, AlertIcon, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { usePageEntrance } from '@/hooks/useAnimations'
import { animated } from '@react-spring/web'

interface PrizeDetailsErrorProps {
  title?: string
  message?: string
  onBack: () => void
}

export const PrizeDetailsError: FC<PrizeDetailsErrorProps> = ({
  title = 'Prêmio não encontrado',
  message = 'O prêmio que você está procurando não foi encontrado ou não está mais disponível.',
  onBack,
}) => {
  const fadeIn = usePageEntrance()

  return (
    <PageLayout maxWidth="6xl">
      <animated.div style={fadeIn} className="flex min-h-[60vh] items-center justify-center p-4">
        <Alert variant="error" className="max-w-md">
          <AlertIcon variant="error" />
          <AlertTitle>{title}</AlertTitle>
          <AlertDescription className="mb-4">
            {message}
          </AlertDescription>
          <Button
            onClick={onBack}
            className="bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900"
          >
            <i className="ph ph-storefront mr-2" />
            Voltar para a loja
          </Button>
        </Alert>
      </animated.div>
    </PageLayout>
  )
}
