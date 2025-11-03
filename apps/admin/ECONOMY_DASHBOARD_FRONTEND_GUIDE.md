# Guia de Implementação - Economy Dashboard Frontend

Complemento às instruções do issue FAC-93 no Linear. Este documento descreve as rotas criadas no backend e seus retornos para facilitar a implementação do frontend.

---

## 📋 Sumário

1. [Autenticação](#autenticação)
2. [Rotas Disponíveis](#rotas-disponíveis)
3. [Estrutura de Respostas](#estrutura-de-respostas)
4. [Exemplos de Uso](#exemplos-de-uso)
5. [Tratamento de Erros](#tratamento-de-erros)
6. [Estados e Cores](#estados-e-cores)
7. [Constantes do Sistema](#constantes-do-sistema)

---

## 🔐 Autenticação

Todas as rotas requerem:
- **Header**: `Authorization: Bearer {access_token}`
- **Permissão**: `ADMIN_VIEW_ANALYTICS`

A roupa utiliza o `access_token` JWT para extrair o `auth0Id` do usuário e então buscar seu `companyId` no banco de dados. Não é possível forjar o `companyId` - ele é derivado automaticamente do usuário autenticado.

---

## 🚀 Rotas Disponíveis

### 1. GET `/admin/dashboard/economy`

**Descrição**: Retorna o dashboard completo com 5 cards de métricas, alertas, histórico recente e sugestão de aporte.

**Headers Obrigatórios**:
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Query Parameters**: Nenhum

**Resposta**: `200 OK`

```json
{
  "wallet_balance": { ... },
  "prize_fund": { ... },
  "redeemable_coins": { ... },
  "compliment_engagement": { ... },
  "redemption_rate": { ... },
  "alerts": [ ... ],
  "deposit_history": [ ... ],
  "suggested_deposit": { ... } | null
}
```

---

### 2. GET `/admin/dashboard/economy/wallet-history`

**Descrição**: Retorna o histórico paginado de aportes para a carteira da empresa.

**Headers Obrigatórios**:
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Query Parameters**:

| Parâmetro | Tipo   | Padrão | Descrição                                  |
|-----------|--------|--------|-------------------------------------------|
| `limit`   | number | 20     | Quantidade máxima de registros a retornar |

**Exemplo**:
```
GET /admin/dashboard/economy/wallet-history?limit=50
```

**Resposta**: `200 OK`

```json
{
  "deposits": [
    {
      "id": "uuid",
      "amount": 5000.00,
      "status": "completed",
      "payment_method": "PIX",
      "deposited_at": "2025-11-02T14:30:00Z",
      "resulting_balance": 42655.00
    }
  ],
  "total": 3
}
```

---

## 📊 Estrutura de Respostas

### Card 1: Wallet Balance (Saldo da Carteira)

Representa o saldo atual da carteira da empresa em R$ (reais).

```typescript
{
  "total_loaded": 50000.00,           // Total já carregado na carteira (R$)
  "total_spent": 12345.00,            // Total já gasto (R$)
  "available_balance": 37655.00,      // Saldo disponível (R$)
  "overdraft_limit": 45186.00,        // Limite de saque permitido (R$)
  "percentage_of_ideal": 83.7,        // % do saldo ideal para funcionar
  "status": "healthy"                 // "healthy" | "warning" | "critical" | "excess"
}
```

**O que renderizar**:
- Mostrar `available_balance` em destaque como o saldo atual
- Usar `total_loaded` e `total_spent` para mostrar histórico resumido
- Usar `status` para colorir o card (verde/amarelo/vermelho)
- Mostrar `percentage_of_ideal` como barra de progresso

---

### Card 2: Prize Fund (Fundo de Prêmios)

Análise de saúde do fundo de prêmios com projeção de runway.

```typescript
{
  "current_balance": 37655.00,        // Saldo atual em R$ (mesmo do card 1)
  "avg_monthly_consumption": 4100.00, // Consumo médio mensal (R$)
  "runway_days": 275,                 // Quantos dias dura o fundo
  "status": "healthy"                 // "healthy" | "warning" | "critical"
}
```

**O que renderizar**:
- Mostrar `runway_days` como destaque principal (ex: "275 dias")
- Adicionar badge de status (verde = > 45 dias, amarelo = 30-45, vermelho = < 15)
- Mostrar `avg_monthly_consumption` como contexto
- Usar a duração para calcular data estimada de falta de saldo

**Cálculo do Runway**:
```
runway_days = (current_balance / avg_monthly_consumption) × 30
```

---

### Card 3: Redeemable Coins (Moedas Resgatáveis)

Indicador de cobertura: quanto em R$ equivalem as moedas em circulação.

```typescript
{
  "total_in_circulation": 15000,      // Total de moedas em circulação
  "equivalent_in_brl": 900.00,        // Equivalente em R$ (taxa: 1 moeda = R$ 0,06)
  "coverage_index": 95.2,             // % de cobertura (quanto do saldo cobre as moedas)
  "status": "healthy"                 // "healthy" | "warning" | "critical"
}
```

**O que renderizar**:
- Mostrar `coverage_index` como métrica principal
- Adicionar contexto: "X moedas em circulação = R$ Y"
- Badge de status: verde = > 80%, amarelo = 50-80%, vermelho = < 50%
- Alertar se o coverage_index for baixo (pode faltar R$ para resgates)

**Cálculo do Coverage Index**:
```
taxa = 1 moeda = R$ 0.06
total_em_reais = total_in_circulation × 0.06
coverage_index = (available_balance / total_em_reais) × 100
```

---

### Card 4: Compliment Engagement (Engajamento de Elogios)

Taxa de utilização de moedas distribuídas nesta semana.

```typescript
{
  "distributed_this_week": 5000,      // Moedas distribuídas esta semana
  "used": 3500,                       // Moedas usadas (resgatadas)
  "wasted": 1500,                     // Moedas que expiram sem uso
  "usage_rate": 70,                   // % de taxa de uso
  "status": "healthy"                 // "healthy" | "warning" | "critical"
}
```

**O que renderizar**:
- Mostrar `usage_rate` como percentage principal
- Gráfico pizza ou barras: distribuídas vs usadas vs desperdiçadas
- Status: verde = > 70%, amarelo = 50-70%, vermelho = < 50%
- Nota: alta taxa de desperdício indica desengajamento

**Cálculo da Usage Rate**:
```
usage_rate = (used / distributed_this_week) × 100
wasted = distributed_this_week - used
```

---

### Card 5: Redemption Rate (Taxa de Resgate)

Indicador de reengajamento: quantas moedas emitidas este mês foram resgatadas.

```typescript
{
  "coins_redeemed_this_month": 8500,  // Moedas resgatadas este mês
  "coins_issued_this_month": 12000,   // Moedas emitidas este mês
  "redemption_percentage": 70.8,      // % de resgate
  "status": "healthy"                 // "healthy" | "warning" | "critical"
}
```

**O que renderizar**:
- Mostrar `redemption_percentage` como número principal
- Contexto: "X de Y moedas resgatadas"
- Status: verde = > 60%, amarelo = 40-60%, vermelho = < 40%
- Anomalia detectada: se cair subitamente (sinal de desengajamento)

**Cálculo**:
```
redemption_percentage = (coins_redeemed_this_month / coins_issued_this_month) × 100
```

---

### 🚨 Alertas (Alerts)

Lista dinâmica de alertas priorizados por severidade.

```typescript
[
  {
    "id": "alert-001",
    "priority": "critical",              // "critical" | "warning" | "info"
    "title": "Saldo crítico",
    "description": "O fundo de prêmios tem apenas 12 dias de cobertura",
    "recommended_action": "Efetue um aporte de R$ 15.000 para atingir 45 dias",
    "dismissible": true                  // Pode ser fechado pelo usuário
  }
]
```

**Exemplos de Alertas Gerados Automaticamente**:

| Situação | Prioridade | Exemplo |
|----------|-----------|---------|
| Runway < 15 dias | critical | "Saldo crítico - apenas X dias de cobertura" |
| Runway 15-30 dias | warning | "Atenção - fundo de prêmios com X dias de cobertura" |
| Coverage < 50% | critical | "Sem cobertura para resgates - retire moedas da circulação" |
| Usage rate < 50% | warning | "Baixo engajamento de elogios esta semana" |
| Redemption < 40% | warning | "Taxa de resgate em declínio - considere revisar prêmios" |

**O que renderizar**:
- Ordenar por prioridade (critical → warning → info)
- Usar cores: vermelho (critical), amarelo (warning), azul/cinza (info)
- Mostrar `recommended_action` como sugestão
- Implementar dismiss: ao fechar, remover do estado local (não persiste no backend)

---

### 💰 Sugestão de Aporte (Suggested Deposit)

Sugestão inteligente de quanto aportar para atingir saúde financeira.

```typescript
{
  "amount": 15000.00,                 // Valor sugerido a aportar (R$)
  "reason": "Atingir 45 dias de cobertura do fundo de prêmios",
  "target_runway_days": 45            // Meta de dias de cobertura
}
```

**Quando aparece**:
- Somente quando `runway_days < 30` dias
- `null` caso contrário

**O que renderizar**:
- Mostrar como "Sugestão de Aporte"
- Usar `amount` para sugerir valor a depositar
- Contexto: `reason` e `target_runway_days`
- Link para funcionalidade de depositar/aporte (quando implementada)

---

### 📜 Histórico de Aportes (Deposit History)

Lista de transações de aporte à carteira.

```typescript
{
  "deposits": [
    {
      "id": "uuid-1",
      "amount": 5000.00,
      "status": "completed",           // "completed" | "pending" | "failed"
      "payment_method": "PIX",         // "PIX", "boleto", etc
      "deposited_at": "2025-11-02T14:30:00Z",
      "resulting_balance": 42655.00   // Saldo após o aporte
    },
    {
      "id": "uuid-2",
      "amount": 15000.00,
      "status": "pending",
      "payment_method": "boleto",
      "deposited_at": "2025-11-01T10:15:00Z",
      "resulting_balance": null       // Não afetou saldo ainda
    }
  ],
  "total": 3
}
```

**O que renderizar**:
- Tabela com colunas: Data | Valor | Método | Status | Saldo Resultante
- Filtrar por status: completed (verde), pending (amarelo), failed (vermelho)
- Ordenar por data descrescente (mais recentes primeiro)
- Formatar datas com timezone do usuário
- Paginação com botão "Carregar mais" usando parâmetro `limit`

---

## 🔗 Exemplos de Uso

### Exemplo 1: Buscar Dashboard Completo

**Request**:
```bash
curl -X GET http://localhost:3000/admin/dashboard/economy \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json"
```

**Response** (200 OK):
```json
{
  "wallet_balance": {
    "total_loaded": 50000,
    "total_spent": 12345,
    "available_balance": 37655,
    "overdraft_limit": 45186,
    "percentage_of_ideal": 83.7,
    "status": "healthy"
  },
  "prize_fund": {
    "current_balance": 37655,
    "avg_monthly_consumption": 4100,
    "runway_days": 275,
    "status": "healthy"
  },
  "redeemable_coins": {
    "total_in_circulation": 15000,
    "equivalent_in_brl": 900,
    "coverage_index": 95.2,
    "status": "healthy"
  },
  "compliment_engagement": {
    "distributed_this_week": 5000,
    "used": 3500,
    "wasted": 1500,
    "usage_rate": 70,
    "status": "healthy"
  },
  "redemption_rate": {
    "coins_redeemed_this_month": 8500,
    "coins_issued_this_month": 12000,
    "redemption_percentage": 70.8,
    "status": "healthy"
  },
  "alerts": [
    {
      "id": "alert-low-engagement",
      "priority": "info",
      "title": "Engajamento baixo",
      "description": "Taxa de uso de elogios caiu para 65% esta semana",
      "recommended_action": "Considere incentivar mais distribuição de moedas",
      "dismissible": true
    }
  ],
  "deposit_history": [
    {
      "id": "deposit-001",
      "amount": 5000,
      "status": "completed",
      "payment_method": "PIX",
      "deposited_at": "2025-11-02T14:30:00Z",
      "resulting_balance": 37655
    }
  ],
  "suggested_deposit": null
}
```

### Exemplo 2: Buscar Histórico de Aportes

**Request**:
```bash
curl -X GET "http://localhost:3000/admin/dashboard/economy/wallet-history?limit=50" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json"
```

**Response** (200 OK):
```json
{
  "deposits": [
    {
      "id": "deposit-001",
      "amount": 5000,
      "status": "completed",
      "payment_method": "PIX",
      "deposited_at": "2025-11-02T14:30:00Z",
      "resulting_balance": 37655
    },
    {
      "id": "deposit-002",
      "amount": 15000,
      "status": "completed",
      "payment_method": "boleto",
      "deposited_at": "2025-10-28T09:00:00Z",
      "resulting_balance": 32655
    },
    {
      "id": "deposit-003",
      "amount": 30000,
      "status": "completed",
      "payment_method": "PIX",
      "deposited_at": "2025-10-15T16:45:00Z",
      "resulting_balance": 17655
    }
  ],
  "total": 3
}
```

---

## ❌ Tratamento de Erros

Ambas as rotas retornam `500 Internal Server Error` em caso de falha:

```json
{
  "error": "Internal server error",
  "message": "Failed to retrieve economy dashboard"
}
```

**Possíveis causas**:
- Token expirado ou inválido → trata no middleware de auth
- Usuário não encontrado no banco → verificar Auth0 sync
- CompanyId inválido → verificar relacionamento user-company

**O que fazer no frontend**:
1. Mostrar mensagem genérica: "Erro ao carregar dashboard"
2. Adicionar retry button com exponential backoff
3. Registrar erro no Sentry/logging
4. Se erro persistir, exibir fallback UI

---

## 🎨 Estados e Cores

### Cores Recomendadas por Status

| Status     | Cor       | Significa |
|------------|-----------|-----------|
| healthy   | Verde     | Tudo bem, acima do esperado |
| warning   | Amarelo   | Atenção necessária |
| critical  | Vermelho  | Ação urgente requerida |
| excess    | Azul      | Acima do ideal |

### Mapeamento de Status por Card

#### Wallet Balance
- `healthy`: % ≥ 75%
- `warning`: 50% ≤ % < 75%
- `critical`: % < 50%
- `excess`: % > 100%

#### Prize Fund (Runway)
- `healthy`: > 45 dias
- `warning`: 30-45 dias
- `critical`: < 15 dias

#### Redeemable Coins (Coverage Index)
- `healthy`: ≥ 80%
- `warning`: 50-80%
- `critical`: < 50%

#### Compliment Engagement (Usage Rate)
- `healthy`: ≥ 70%
- `warning`: 50-70%
- `critical`: < 50%

#### Redemption Rate
- `healthy`: ≥ 60%
- `warning`: 40-60%
- `critical`: < 40%

---

## ⚙️ Constantes do Sistema

Estas constantes são usadas no cálculo das métricas no backend:

| Constante | Valor | Uso |
|-----------|-------|-----|
| `COIN_TO_BRL_RATE` | 0.06 | 1 moeda = R$ 0,06 |
| `IDEAL_RUNWAY_DAYS` | 45 | Meta de dias de cobertura |
| `WARNING_RUNWAY_DAYS` | 30 | Limiar de alerta para runway |
| `CRITICAL_RUNWAY_DAYS` | 15 | Limiar crítico para runway |

---

## 📱 Responsividade Recomendada

### Desktop (1920px+)
- 5 cards em grid 2-3-1 ou 2x2+1
- Tabela de histórico com scroll horizontal
- Alertas em sidebar

### Tablet (768px-1024px)
- Cards em grid 1-2-2
- Tabela com colunas prioritárias
- Alertas em accordion

### Mobile (< 768px)
- Cards em stack vertical (1 por linha)
- Tabela em accordion por linha
- Alertas como toast notifications

---

## 🔄 Fluxo de Atualização Recomendado

1. **On Mount**: Buscar `/admin/dashboard/economy`
2. **On Interval** (recomendado: 60s): Refetch do dashboard
3. **On Focus**: Se aba estava perdida, refetch
4. **On Dismiss Alert**: Remover alert do estado local (não fazer request)

---

## 📝 Notas Importantes

- ✅ Todas as moedas são em "moedas virtuais" da Valorize, não R$ real
- ✅ O saldo da carteira é sempre em R$ (reais)
- ✅ Histórico retorna até 20 registros por padrão
- ✅ Timestamps estão em ISO 8601 (UTC)
- ✅ Sugestão de aporte aparece automaticamente quando necessário
- ✅ Alertas são gerados dinamicamente cada requisição
- ✅ Dismiss de alertas é local (não persiste no backend)

---

## 🎯 Checklist de Implementação

Frontend deve implementar:

- [ ] Componente Card genérico para os 5 cards de métrica
- [ ] Componente de Status Badge (verde/amarelo/vermelho)
- [ ] Componente de Alert com priorização
- [ ] Tabela de Histórico com paginação
- [ ] Barra de Progresso para percentage_of_ideal
- [ ] Gráfico (pizza ou barras) para compliment_engagement
- [ ] Loading states durante requisição
- [ ] Error boundary para falhas
- [ ] Retry logic com exponential backoff
- [ ] Formatação de datas e moedas (pt-BR locale)
- [ ] Responsividade mobile-first
- [ ] Testes unitários dos componentes
- [ ] Testes E2E com Postman/Playwright

---

**Criado em**: 2 de novembro de 2025  
**Versão**: 1.0  
**Mantido por**: Equipe de Backend
