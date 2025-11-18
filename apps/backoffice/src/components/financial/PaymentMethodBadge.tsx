import { Badge } from '@/components/ui/badge'
import type { PaymentMethod } from '@/types/financial'

interface PaymentMethodBadgeProps {
  paymentMethod: PaymentMethod | null | undefined
}

const METHOD_LABELS: Record<PaymentMethod, string> = {
  BOLETO: 'Boleto',
  PIX: 'PIX',
  CREDIT_CARD: 'Cartão de Crédito',
}

const METHOD_VARIANTS: Record<PaymentMethod, 'default' | 'secondary' | 'info'> = {
  BOLETO: 'secondary',
  PIX: 'info',
  CREDIT_CARD: 'default',
}

export function PaymentMethodBadge({ paymentMethod }: PaymentMethodBadgeProps) {
  if (!paymentMethod) {
    return (
      <Badge variant="outline" className="text-muted-foreground">
        Não definido
      </Badge>
    )
  }

  return <Badge variant={METHOD_VARIANTS[paymentMethod]}>{METHOD_LABELS[paymentMethod]}</Badge>
}
