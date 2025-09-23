# Hook useUser - Documentação

O hook `useUser` centraliza o gerenciamento de dados do usuário, incluindo saldos, com keys descritivas para invalidação eficiente quando há movimentação de saldo.

## Características

- **Keys Descritivas**: `['user', userId, 'balance']` para facilitar invalidação
- **Cache Otimizado**: 2 minutos para saldos (mais agressivo que outros dados)
- **Invalidação Inteligente**: Invalida queries relacionadas automaticamente
- **TypeScript Completo**: Tipos exportados para facilitar uso

## Uso Básico

### Hook Completo (useUser)

```tsx
import { useUser } from '@/hooks/useUser'

const MyComponent = () => {
  const { 
    user,                    // Dados básicos do usuário
    balance,                 // { complimentBalance, redeemableBalance }
    isLoadingBalance,        // Loading state do saldo
    onBalanceMovement,       // Função para invalidar após movimentação
    refreshBalance,          // Força refresh do saldo
    invalidateUserData,      // Invalida todos os dados do usuário
  } = useUser()

  return (
    <div>
      <p>Moedas para Elogiar: {balance.complimentBalance}</p>
      <p>Moedas Resgatáveis: {balance.redeemableBalance}</p>
    </div>
  )
}
```

### Hook Simplificado (useUserBalance)

```tsx
import { useUserBalance } from '@/hooks/useUser'

const BalanceDisplay = () => {
  const { 
    balance,              // Saldos do usuário
    isLoading,           // Loading state
    onBalanceMovement,   // Invalidação após movimentação
  } = useUserBalance()

  if (isLoading) return <div>Carregando...</div>

  return (
    <div>
      <p>Saldo: {balance.complimentBalance}</p>
    </div>
  )
}
```

## Invalidação de Cache

### Após Envio de Elogio

```tsx
import { useUser } from '@/hooks/useUser'
import { sendCompliment } from '@/services/compliments'

const SendPraiseComponent = () => {
  const { onBalanceMovement } = useUser()

  const handleSendPraise = async (data) => {
    try {
      await sendCompliment(data)
      
      // Invalida saldo e histórico automaticamente
      onBalanceMovement()
      
    } catch (error) {
      console.error('Erro ao enviar elogio:', error)
    }
  }
}
```

### Após Resgate de Prêmio

```tsx
import { useUser } from '@/hooks/useUser'
import { redeemPrize } from '@/services/prize'

const RedeemComponent = () => {
  const { onBalanceMovement } = useUser()

  const handleRedeem = async (prizeId) => {
    try {
      await redeemPrize(prizeId)
      
      // Invalida saldo após resgate
      onBalanceMovement()
      
    } catch (error) {
      console.error('Erro ao resgatar prêmio:', error)
    }
  }
}
```

## Keys de Cache

O hook utiliza as seguintes keys para o React Query:

- **Saldo**: `['user', userId, 'balance']`
- **Invalidação relacionada**:
  - `['praises', 'history']` (histórico de elogios)
  - `['transactions']` (transações futuras)

## Funcionalidades Avançadas

### Invalidação Manual

```tsx
const { invalidateBalance, invalidateUserData } = useUser()

// Invalida apenas o saldo
const handleRefreshBalance = () => {
  invalidateBalance()
}

// Invalida todos os dados do usuário
const handleRefreshAll = () => {
  invalidateUserData()
}
```

### Refresh Forçado

```tsx
const { refreshBalance } = useUser()

// Força uma nova requisição
const handleForceRefresh = async () => {
  const result = await refreshBalance()
  console.log('Novo saldo:', result.data)
}
```

## Benefícios

1. **Performance**: Cache otimizado com invalidação inteligente
2. **Consistência**: Dados sempre atualizados após movimentações
3. **Simplicidade**: API clara e fácil de usar
4. **TypeScript**: Tipagem completa e segura
5. **Flexibilidade**: Hooks específicos para diferentes necessidades

## Migração de Hooks Antigos

### De usePraisesData para useUser

```tsx
// ❌ Antes
const { userBalance } = usePraisesData()

// ✅ Depois
const { balance } = useUserBalance()
```

### De hooks customizados para useUser

```tsx
// ❌ Antes (hook específico)
const useNavbarBalance = () => {
  return useQuery({
    queryKey: ['navbar', 'balance'],
    // ...
  })
}

// ✅ Depois
const { balance } = useUserBalance()
```