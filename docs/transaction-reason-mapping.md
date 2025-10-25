# Transaction Reason Mapping Documentation

## Overview

O sistema de transações agora possui mapeamento automático dos valores de `reason` retornados pela API para descrições amigáveis em português, facilitando a compreensão do usuário.

## Arquivo Criado

- **`src/helpers/transactionReasonMapper.ts`** - Helper que mapeia os valores de `reason` da API para texto em português

## Como Funciona

### 1. Helper `mapTransactionReason`

O helper recebe quatro parâmetros:
- `reason` (string) - O valor retornado pela API
- `transactionType` (TransactionType) - O tipo da transação (CREDIT, DEBIT, RESET)
- `balanceType` (BalanceType) - O tipo de saldo (COMPLIMENT, REDEEMABLE)
- `metadata` (Record<string, unknown> | null) - Metadados com informações contextuais

E retorna um objeto com:
```typescript
{
  title: string              // Título traduzido e simplificado
  sourceIcon: string         // Ícone Phosphor para a origem
  sourceLabel: string        // Label da origem (Elogio, Prêmio, Sistema)
  sourceBgColor: string      // Classes Tailwind para fundo do badge
  sourceIconColor: string    // Classes Tailwind para cor do ícone
}
```

### 2. Mapeamentos Implementados

#### Transações de Elogios

**Com informações contextuais do metadata:**
- **API**: `"Received compliment"` + `metadata.senderName` → **UI**: `"Elogio de João Silva"`
- **API**: `"Sent compliment"` + `metadata.receiverName` → **UI**: `"Elogio para Maria Santos"`
- **Fallback**: Sem metadata → `"Elogio Recebido"` / `"Elogio Enviado"`
- **Ícone**: `ph-heart` (coração)
- **Badge**: Rosa

**Campos do metadata usados:**
- `senderName` - Nome de quem enviou o elogio (em transações CREDIT)
- `receiverName` - Nome de quem recebeu o elogio (em transações DEBIT)

#### Transações de Prêmios

**Com informações contextuais do metadata:**
- **API**: `"Prize redeemed"` + `metadata.prizeName` → **UI**: `"Prêmio Resgatado: Fone Bluetooth"`
- **API**: `"Redemption cancelled"` + `metadata.prizeName` → **UI**: `"Resgate Cancelado: Fone Bluetooth"`
- **Fallback**: Sem metadata → `"Prêmio Resgatado"` / `"Resgate Cancelado"`
- **Ícone**: `ph-gift` (presente)
- **Badge**: Roxo

**Campos do metadata usados:**
- `prizeName` - Nome do prêmio resgatado (em transações DEBIT/CREDIT de REDEEMABLE)

#### Transações do Sistema
- **API**: `"Monthly allowance"` → **UI**: `"Mesada Mensal"`
  - **Ícone**: `ph-calendar-check`
  
- **API**: `"Weekly reset"` → **UI**: `"Reset Semanal"`
  - **Ícone**: `ph-arrow-clockwise`
  
- **API**: `"Admin adjustment"` → **UI**: `"Ajuste Administrativo"`
  - **Ícone**: `ph-shield-check`
  
- **API**: `"Balance correction"` → **UI**: `"Correção de Saldo"`
  - **Ícone**: `ph-gear`

- **Badge**: Azul para todas as transações do sistema

### 3. Fallbacks Inteligentes

Caso o `reason` não seja reconhecido, o helper utiliza fallbacks baseados em:

1. **Tipo de transação** (CREDIT/DEBIT/RESET)
2. **Tipo de saldo** (COMPLIMENT/REDEEMABLE)

Exemplos de fallback:
- CREDIT + COMPLIMENT → "Moedas Recebidas"
- DEBIT + COMPLIMENT → "Moedas Gastas"
- CREDIT + REDEEMABLE → "Saldo Adicionado"
- DEBIT + REDEEMABLE → "Saldo Deduzido"
- RESET → "Reset de Saldo"

## Componentes Atualizados

### TransactionCard.tsx

O componente `TransactionCard` foi atualizado para usar o novo helper:

```typescript
// Antes - Lógica complexa inline
const reasonLower = (reason || '').toLowerCase()
if (reasonLower.includes('prize') || ...) {
  // múltiplas condições
}

// Agora - Simples e limpo
const reasonInfo = mapTransactionReason(reason, transactionType, balanceType)
```

## Adicionando Novos Mapeamentos

Para adicionar novos mapeamentos de `reason`, edite o arquivo `transactionReasonMapper.ts`:

```typescript
// Adicione uma nova seção no início da função
if (reasonLower.includes('novo_reason_da_api')) {
  return {
    title: 'Novo Título em Português',
    sourceIcon: 'ph-icon-name',
    sourceLabel: 'Label da Origem',
    sourceBgColor: 'bg-color-100 dark:bg-color-900/20',
    sourceIconColor: 'text-color-600 dark:text-color-400',
  }
}
```

## Benefícios

✅ **UX Melhorada** - Textos claros em português para os usuários
✅ **Manutenibilidade** - Lógica centralizada em um único arquivo
✅ **Escalabilidade** - Fácil adicionar novos mapeamentos
✅ **Type-Safe** - TypeScript garante tipos corretos
✅ **Consistência** - Mesma lógica para todas as transações
✅ **Fallbacks** - Sempre mostra algo útil, mesmo com valores inesperados

## Referências da API

Valores de `reason` documentados na API (`/wallets/transactions`):
- `"Received compliment"` - Elogio recebido
- `"Sent compliment"` - Elogio enviado
- `"Prize redeemed"` - Prêmio resgatado
- `"Redemption cancelled"` - Resgate cancelado
- `"Monthly allowance"` - Mesada mensal
- `"Weekly reset"` - Reset semanal
- `"Admin adjustment"` - Ajuste administrativo
- `"Balance correction"` - Correção de saldo

## Testes Recomendados

Para testar os mapeamentos com informações contextuais:

1. **Envie um elogio** - Verifique:
   - Remetente: `"Elogio para [Nome do Destinatário]"`
   - Destinatário: `"Elogio de [Seu Nome]"`
   
2. **Resgate um prêmio** - Verifique:
   - `"Prêmio Resgatado: [Nome do Prêmio]"`
   
3. **Cancele um resgate** - Verifique:
   - `"Resgate Cancelado: [Nome do Prêmio]"`
   
4. **Transações sem metadata** - Verifique fallbacks genéricos:
   - `"Elogio Recebido"`, `"Elogio Enviado"`, etc.

5. **Reset semanal** - Verifique `"Reset Semanal"`

6. **Teste com admin** - Ajustes administrativos

## Notas Técnicas

- O helper é **case-insensitive** (ignora maiúsculas/minúsculas)
- Suporta valores em **inglês e português** da API
- Usa **pattern matching** para flexibilidade
- Totalmente compatível com **dark mode**
