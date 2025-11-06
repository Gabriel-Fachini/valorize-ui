# 🎟️ Documentação de Endpoints - Sistema de Vouchers

Documentação completa dos endpoints para resgate de vouchers digitais na API Valorize.

**Versão:** 2.0 | **Data:** 2025-11-06 | **Provider:** Tremendous API

## ⚡ O que há de novo na v2.0

- 🎯 **Bulk Redemption Administrativa**: Função exclusiva para admins enviarem vouchers em massa
- 💰 **CompanyWallet**: Empresa paga pelos vouchers, usuários recebem gratuitamente
- 🏗️ **Two-Phase Architecture**: Separa operações DB de chamadas API para máxima eficiência
- 🔄 **Rollback Automático**: Devolve dinheiro à empresa se API falhar
- ⚡ **100% Taxa de Sucesso**: Comprovado em teste real com 100 items (25.92s)
- 🔐 **Nova Permissão**: `STORE_BULK_REDEEM_ADMIN` para proteção de rotas administrativas

---

## 📑 Índice

1. [Endpoints de Resgate](#resgate-de-vouchers)
   - [Resgate Individual](#post-apiremptionsredeem)
   - [Resgate em Lote (Bulk)](#post-apiremptionsbulk-redeem)
   - [Listar Resgates](#get-apiremptionsmy-redemptions)
   - [Detalhes do Resgate](#get-apiremptionsmy-redemptionsid)
   - [Cancelar Resgate](#post-apiremptionsmy-redemptionsidcancel)

2. [Endpoints de Admin](#gerenciamento-de-catálogo-admin)
   - [Sincronizar Catálogo](#post-adminvoucher-productssync)
   - [Listar Produtos](#get-adminvoucher-products)
   - [Detalhes do Produto](#get-adminvoucher-productsid)

3. [Modelos de Resposta](#modelos-de-resposta)
4. [Códigos de Erro](#códigos-de-erro)
5. [Exemplos Prático](#exemplos-práticos)

---

## 🎁 Resgate de Vouchers

### POST /api/redemptions/redeem

Resgata um prêmio do tipo voucher. Se o prêmio for um voucher, o sistema cria automaticamente um voucher digital na Tremendous API e retorna o link de acesso.

**Base URL:** `http://localhost:4000/api/redemptions`

**Autenticação:** ✅ Requerida (Bearer Token)

**Método:** `POST`

#### Request

```http
POST /api/redemptions/redeem
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Body Schema:**

```json
{
  "prizeId": "string (required)",
  "variantId": "string (optional)",
  "addressId": "string (required for physical products, optional for vouchers)"
}
```

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `prizeId` | string | ✅ Sim | ID do prêmio a resgatar |
| `variantId` | string | ❌ Não | ID da variante (obrigatório se o prêmio tem variantes) |
| `addressId` | string | ⚠️ Condicional | ID do endereço (obrigatório para produtos, opcional para vouchers) |

#### Response - ✅ Success (201 Created)

```json
{
  "message": "Prize redeemed successfully",
  "redemption": {
    "id": "cmhmw75xm000utpyi4io0fmlq",
    "userId": "user_123",
    "prizeId": "prize_456",
    "status": "completed",
    "createdAt": "2025-11-06T03:54:07.691Z",
    "updatedAt": "2025-11-06T03:54:07.691Z",
    "voucherRedemption": {
      "id": "voucher_redemption_123",
      "provider": "tremendous",
      "providerOrderId": "order_tremendous_123",
      "providerRewardId": "reward_tremendous_456",
      "voucherLink": "https://www.tremendous.com/access?code=ABC123XYZ",
      "voucherCode": "ABC123XYZ",
      "amount": 50.00,
      "currency": "BRL",
      "status": "completed",
      "completedAt": "2025-11-06T03:54:10.000Z",
      "expiresAt": "2026-11-06T03:54:10.000Z",
      "createdAt": "2025-11-06T03:54:07.691Z",
      "updatedAt": "2025-11-06T03:54:07.691Z"
    }
  }
}
```

#### Response - ❌ Error Scenarios

**400 Bad Request - Saldo Insuficiente**
```json
{
  "message": "Insufficient balance. Your balance: 50 coins, Required: 100 coins"
}
```

**400 Bad Request - Variante Obrigatória**
```json
{
  "message": "This prize has variants. You must select a variant to redeem"
}
```

**404 Not Found - Usuário Não Encontrado**
```json
{
  "message": "User not found"
}
```

**409 Conflict - Estoque Insuficiente**
```json
{
  "message": "Prize is out of stock"
}
```

**500 Internal Server Error - Falha no Provider**
```json
{
  "message": "Failed to create voucher on provider (Tremendous API)"
}
```

---

### POST /api/redemptions/bulk-redeem

⭐ **Função ADMINISTRATIVA** - Resgata múltiplos vouchers em uma única requisição. A **EMPRESA paga pelos vouchers**, não os usuários individuais. Os usuários recebem os vouchers gratuitamente como benefícios.

**Base URL:** `http://localhost:4000/api/redemptions`

**Autenticação:** ✅ Requerida (Bearer Token)

**Permissão:** 🔐 `STORE_BULK_REDEEM_ADMIN` (Super Admin ou Company Admin)

**Método:** `POST`

**Modelo de Pagamento:** 💰 CompanyWallet (debita saldo da empresa uma vez por batch)

**Taxa Limite:** 10 requisições/segundo (Tremendous API)

**Máximo de itens:** 100 usuários por requisição

**Processamento:** Two-Phase Architecture

- **Fase 1:** Transação única debita CompanyWallet e cria redemptions (status: `processing`)
- **Fase 2:** Processa vouchers em paralelo (10 por batch) chamando API externa

**Desempenho Real (Teste 100 items - 2025-11-06):**

- ✅ **Taxa de Sucesso:** 100% (100/100 items)
- ⏱️ **Tempo Total:** 25.92s (~259ms por item)
- 🚀 **Throughput:** ~3.86 items/segundo
- 📊 **vs Estimado:** 10% mais rápido (29s estimado)

**Tempo estimado:**
- 10 itens: ~3 segundos (1 batch, sem sleep)
- 50 itens: ~14 segundos (5 batches × 2.5s + 4 sleeps × 1s)
- 100 itens: ~26 segundos (10 batches × 2.5s + 9 sleeps × 1s)

#### Request

```http
POST /api/redemptions/bulk-redeem
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Body Schema:**

```json
{
  "items": [
    {
      "userId": "string (required)",
      "prizeId": "string (required)",
      "addressId": "string (optional)"
    }
  ]
}
```

**Exemplo de Request:**

```json
{
  "items": [
    {
      "userId": "user_001",
      "prizeId": "prize_ifood_50"
    },
    {
      "userId": "user_002",
      "prizeId": "prize_spotify_30"
    },
    {
      "userId": "user_003",
      "prizeId": "prize_ifood_50"
    }
  ]
}
```

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `items` | array | ✅ Sim | Array de resgates (1-100 items) |
| `items[].userId` | string | ✅ Sim | ID do usuário que irá receber o voucher |
| `items[].prizeId` | string | ✅ Sim | ID do prêmio (voucher) a resgatar |
| `items[].addressId` | string | ❌ Não | ID do endereço (para auditoria) |

#### Response - ✅ Success (207 Multi-Status)

```json
{
  "message": "Bulk redemption completed",
  "summary": {
    "total": 3,
    "successful": 3,
    "failed": 0
  },
  "results": [
    {
      "userId": "user_001",
      "prizeId": "prize_ifood_50",
      "success": true,
      "redemptionId": "redemption_001",
      "voucherLink": "https://www.tremendous.com/access?code=ABC123",
      "voucherCode": "ABC123",
      "error": null
    },
    {
      "userId": "user_002",
      "prizeId": "prize_spotify_30",
      "success": true,
      "redemptionId": "redemption_002",
      "voucherLink": "https://www.tremendous.com/access?code=XYZ789",
      "voucherCode": "XYZ789",
      "error": null
    },
    {
      "userId": "user_003",
      "prizeId": "prize_ifood_50",
      "success": false,
      "redemptionId": null,
      "voucherLink": null,
      "voucherCode": null,
      "error": "Prize is out of stock"
    }
  ]
}
```

#### Response - ❌ Error Scenarios

**400 Bad Request - Quantidade Inválida**
```json
{
  "message": "Bulk redemption accepts between 1 and 100 items"
}
```

**400 Bad Request - Estrutura Inválida**
```json
{
  "message": "Items must be an array"
}
```

**400 Bad Request - Items Incompletos**
```json
{
  "message": "Each item must have userId and prizeId"
}
```

**404 Not Found - Usuário Não Encontrado**
```json
{
  "message": "User not found"
}
```

#### Características Especiais

✅ **Função Administrativa** - Empresa paga pelos vouchers, usuários recebem gratuitamente
✅ **Two-Phase Architecture** - Separa operações DB (rápidas) de chamadas API (lentas)
✅ **CompanyWallet** - Debita saldo da empresa uma vez por batch (não dos usuários)
✅ **Rollback Automático** - Se API falhar, devolve dinheiro à empresa automaticamente
✅ **Processamento em Batches** - 10 requisições simultâneas por batch
✅ **Sleep Entre Batches** - 1 segundo de intervalo para respeitar rate limit
✅ **Controle de Carga** - Distribui requisições ao longo do tempo (não pico)
✅ **Idempotência** - Cada resgate usa redemption.id como external_id
✅ **Partial Success** - Continua processando mesmo se alguns itens falham
✅ **Logging Detalhado** - Rastreamento de cada batch com timeline
✅ **Status Tracking** - `processing` → `completed` ou `failed` com rollback

**Desempenho Comprovado (100 items):**

- Sequencial: 100 × 2s = 200s ❌
- Nossa implementação: 25.92s (real) ✅
- **Ganho de performance: 87% mais rápido!**
- **Taxa de sucesso: 100%**
- **Vantagem:** Respeita rate limit, sem lock contention, rollback seguro

---

### GET /api/redemptions/my-redemptions

Lista todos os resgates do usuário autenticado com paginação.

**Base URL:** `http://localhost:4000/api/redemptions`

**Autenticação:** ✅ Requerida (Bearer Token)

**Método:** `GET`

#### Request

```http
GET /api/redemptions/my-redemptions?limit=20&offset=0
Authorization: Bearer <access_token>
```

**Query Parameters:**

| Parâmetro | Tipo | Default | Range | Descrição |
|-----------|------|---------|-------|-----------|
| `limit` | integer | 20 | 1-100 | Quantidade de registros por página |
| `offset` | integer | 0 | ≥0 | Deslocamento para paginação |

#### Response - ✅ Success (200 OK)

```json
{
  "redemptions": [
    {
      "id": "redemption_123",
      "userId": "user_456",
      "prizeId": "prize_789",
      "status": "completed",
      "prize": {
        "id": "prize_789",
        "name": "iFood R$50",
        "category": "voucher",
        "images": ["https://example.com/image.png"]
      },
      "voucherRedemption": {
        "voucherLink": "https://www.tremendous.com/access?code=ABC123",
        "status": "completed",
        "completedAt": "2025-11-06T03:54:10.000Z"
      },
      "createdAt": "2025-11-06T03:54:07.691Z",
      "updatedAt": "2025-11-06T03:54:07.691Z"
    },
    {
      "id": "redemption_124",
      "userId": "user_456",
      "prizeId": "prize_790",
      "status": "completed",
      "prize": {
        "id": "prize_790",
        "name": "Spotify R$30",
        "category": "voucher",
        "images": ["https://example.com/spotify.png"]
      },
      "voucherRedemption": {
        "voucherLink": "https://www.tremendous.com/access?code=XYZ789",
        "status": "completed",
        "completedAt": "2025-11-06T04:00:00.000Z"
      },
      "createdAt": "2025-11-06T04:00:00.000Z",
      "updatedAt": "2025-11-06T04:00:00.000Z"
    }
  ],
  "meta": {
    "limit": 20,
    "offset": 0,
    "count": 2
  }
}
```

#### Response - ❌ Error

**404 Not Found**
```json
{
  "message": "User not found"
}
```

---

### GET /api/redemptions/my-redemptions/:id

Obtém detalhes completos de um resgate específico.

**Base URL:** `http://localhost:4000/api/redemptions`

**Autenticação:** ✅ Requerida (Bearer Token)

**Método:** `GET`

#### Request

```http
GET /api/redemptions/my-redemptions/redemption_123
Authorization: Bearer <access_token>
```

**Path Parameters:**

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `id` | string | ID do resgate |

#### Response - ✅ Success (200 OK)

```json
{
  "redemption": {
    "id": "redemption_123",
    "userId": "user_456",
    "prizeId": "prize_789",
    "status": "completed",
    "prize": {
      "id": "prize_789",
      "name": "iFood R$50",
      "category": "voucher",
      "description": "Crédito de R$50 para usar na plataforma iFood",
      "images": ["https://example.com/ifood.png"],
      "coinPrice": 500,
      "brand": "iFood"
    },
    "voucherRedemption": {
      "id": "voucher_redemption_123",
      "provider": "tremendous",
      "providerOrderId": "order_tremendous_123",
      "providerRewardId": "reward_tremendous_456",
      "voucherLink": "https://www.tremendous.com/access?code=ABC123XYZ",
      "voucherCode": "ABC123XYZ",
      "amount": 50.00,
      "currency": "BRL",
      "status": "completed",
      "completedAt": "2025-11-06T03:54:10.000Z",
      "expiresAt": "2026-11-06T03:54:10.000Z",
      "createdAt": "2025-11-06T03:54:07.691Z",
      "updatedAt": "2025-11-06T03:54:07.691Z"
    },
    "createdAt": "2025-11-06T03:54:07.691Z",
    "updatedAt": "2025-11-06T03:54:07.691Z"
  }
}
```

#### Response - ❌ Error

**404 Not Found**
```json
{
  "message": "Redemption not found"
}
```

---

### POST /api/redemptions/my-redemptions/:id/cancel

Cancela um resgate realizado. Válido apenas se não foi enviado ainda.

**Base URL:** `http://localhost:4000/api/redemptions`

**Autenticação:** ✅ Requerida (Bearer Token)

**Método:** `POST`

#### Request

```http
POST /api/redemptions/my-redemptions/redemption_123/cancel
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Body Schema:**

```json
{
  "reason": "string (required, minLength: 5, maxLength: 500)"
}
```

**Exemplo:**
```json
{
  "reason": "Mudei de ideia sobre o resgate"
}
```

#### Response - ✅ Success (200 OK)

```json
{
  "message": "Redemption cancelled successfully",
  "redemption": {
    "id": "redemption_123",
    "userId": "user_456",
    "prizeId": "prize_789",
    "status": "cancelled",
    "cancellationReason": "Changed my mind about the product",
    "cancelledAt": "2025-11-06T04:30:00.000Z",
    "createdAt": "2025-11-06T03:54:07.691Z",
    "updatedAt": "2025-11-06T04:30:00.000Z"
  }
}
```

#### Response - ❌ Error

**400 Bad Request - Razão Inválida**
```json
{
  "message": "Reason must be between 5 and 500 characters"
}
```

**400 Bad Request - Pedido Já Enviado**
```json
{
  "message": "Cannot cancel order that has been shipped or delivered"
}
```

**400 Bad Request - Período Expirado**
```json
{
  "message": "Cancellation period expired (max 3 days)"
}
```

**404 Not Found**
```json
{
  "message": "Redemption not found"
}
```

---

## 🛠️ Gerenciamento de Catálogo (Admin)

### POST /admin/voucher-products/sync

Sincroniza o catálogo de produtos de vouchers do provider (Tremendous) com o banco de dados local. Busca novos produtos e marca como inativos os que não estão mais disponíveis.

**Base URL:** `http://localhost:4000/admin`

**Autenticação:** ✅ Requerida (Bearer Token)

**Permissão:** 🔐 Admin/Gerente

**Método:** `POST`

**Tempo médio:** ~5-10 segundos

#### Request

```http
POST /admin/voucher-products/sync
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Body:** Vazio

#### Response - ✅ Success (200 OK)

```json
{
  "success": true,
  "message": "Catalog synced successfully",
  "result": {
    "synced": 38,
    "deactivated": 2,
    "total": 40
  }
}
```

| Campo | Descrição |
|-------|-----------|
| `synced` | Produtos criados ou atualizados |
| `deactivated` | Produtos marcados como inativos (não disponíveis no provider) |
| `total` | Total de produtos ativos no banco |

#### Response - ❌ Error

**500 Internal Server Error**
```json
{
  "success": false,
  "message": "Failed to fetch products from Tremendous API"
}
```

---

### GET /admin/voucher-products

Lista todos os produtos de vouchers com filtros opcionais.

**Base URL:** `http://localhost:4000/admin`

**Autenticação:** ✅ Requerida (Bearer Token)

**Permissão:** 🔐 Admin/Gerente

**Método:** `GET`

#### Request

```http
GET /admin/voucher-products?limit=10&offset=0&provider=tremendous&currency=BRL&isActive=true
Authorization: Bearer <access_token>
```

**Query Parameters:**

| Parâmetro | Tipo | Descrição | Exemplo |
|-----------|------|-----------|---------|
| `provider` | string | Filtrar por provider | `tremendous` |
| `category` | string | Filtrar por categoria | `merchant_card`, `gift-cards` |
| `currency` | string | Filtrar por moeda | `BRL`, `USD` |
| `country` | string | Filtrar por país | `BR`, `US` |
| `isActive` | boolean | Filtrar por status | `true`, `false` |
| `limit` | integer | Quantidade de registros | `10` (default: 50, max: 250) |
| `offset` | integer | Deslocamento | `0` |

#### Response - ✅ Success (200 OK)

```json
{
  "success": true,
  "items": [
    {
      "id": "cmhmw75xm000utpyi4io0fmlq",
      "provider": "tremendous",
      "externalId": "PLWHYP0TS3QV",
      "name": "iFood R$50",
      "description": "Crédito de R$50 para usar na plataforma iFood",
      "category": "merchant_card",
      "brand": "iFood",
      "images": [
        "https://testflight.tremendous.com/product_images/PLWHYP0TS3QV/card",
        "https://testflight.tremendous.com/product_images/PLWHYP0TS3QV/logo"
      ],
      "minValue": 50,
      "maxValue": 250,
      "currency": "BRL",
      "countries": ["BR"],
      "isActive": true,
      "lastSyncAt": "2025-11-06T03:54:07.690Z",
      "createdAt": "2025-11-06T03:54:07.691Z",
      "updatedAt": "2025-11-06T03:54:07.691Z"
    }
  ],
  "total": 38
}
```

#### Response - ❌ Error

**500 Internal Server Error**
```json
{
  "success": false,
  "message": "Failed to list products"
}
```

---

### GET /admin/voucher-products/:id

Obtém detalhes completos de um produto de voucher específico.

**Base URL:** `http://localhost:4000/admin`

**Autenticação:** ✅ Requerida (Bearer Token)

**Permissão:** 🔐 Admin/Gerente

**Método:** `GET`

#### Request

```http
GET /admin/voucher-products/cmhmw75xm000utpyi4io0fmlq
Authorization: Bearer <access_token>
```

**Path Parameters:**

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `id` | string | ID do produto no banco de dados |

#### Response - ✅ Success (200 OK)

```json
{
  "success": true,
  "product": {
    "id": "cmhmw75xm000utpyi4io0fmlq",
    "provider": "tremendous",
    "externalId": "PLWHYP0TS3QV",
    "name": "iFood R$50",
    "description": "Crédito de R$50 para usar na plataforma iFood. Válido por 12 meses.",
    "category": "merchant_card",
    "brand": "iFood",
    "images": [
      "https://testflight.tremendous.com/product_images/PLWHYP0TS3QV/card",
      "https://testflight.tremendous.com/product_images/PLWHYP0TS3QV/logo"
    ],
    "minValue": 50,
    "maxValue": 250,
    "currency": "BRL",
    "countries": ["BR"],
    "isActive": true,
    "lastSyncAt": "2025-11-06T03:54:07.690Z",
    "createdAt": "2025-11-06T03:54:07.691Z",
    "updatedAt": "2025-11-06T03:54:07.691Z"
  }
}
```

#### Response - ❌ Error

**404 Not Found**
```json
{
  "success": false,
  "message": "Product not found"
}
```

**500 Internal Server Error**
```json
{
  "success": false,
  "message": "Failed to get product"
}
```

---

## 📋 Modelos de Resposta

### Redemption

Representa um resgate de prêmio na plataforma.

```typescript
interface Redemption {
  id: string;                           // ID único do resgate
  userId: string;                       // ID do usuário
  prizeId: string;                      // ID do prêmio resgatado
  variantId?: string | null;            // ID da variante (se aplicável)
  addressId?: string | null;            // ID do endereço (opcional)
  status: "pending" | "completed" | "failed" | "cancelled";
  coinsSpent: number;                   // Moedas gastas no resgate
  createdAt: Date;
  updatedAt: Date;
  voucherRedemption?: VoucherRedemption;  // Dados do voucher (se for voucher)
}
```

### VoucherRedemption

Dados específicos do resgate de voucher.

```typescript
interface VoucherRedemption {
  id: string;
  redemptionId: string;                 // FK: Redemption.id
  provider: string;                     // Ex: "tremendous"
  providerOrderId?: string | null;      // ID da order no provider
  providerRewardId?: string | null;     // ID da reward no provider
  voucherLink?: string | null;          // Link para acessar voucher
  voucherCode?: string | null;          // Código do voucher
  amount: Decimal;                      // Valor do voucher
  currency: string;                     // Moeda (ex: "BRL")
  status: "pending" | "completed" | "failed";
  errorMessage?: string | null;         // Mensagem de erro (se failed)
  completedAt?: Date | null;            // Data de conclusão
  expiresAt?: Date | null;              // Data de expiração
  createdAt: Date;
  updatedAt: Date;
}
```

### VoucherProduct

Produto de voucher disponível no catálogo.

```typescript
interface VoucherProduct {
  id: string;
  provider: string;                     // Ex: "tremendous"
  externalId: string;                   // ID no provider
  name: string;                         // Nome do produto
  description?: string;                 // Descrição
  category: string;                     // Ex: "merchant_card"
  brand?: string | null;                // Ex: "iFood"
  images: string[];                     // URLs das imagens
  minValue: Decimal;                    // Valor mínimo
  maxValue: Decimal;                    // Valor máximo
  currency: string;                     // Ex: "BRL"
  countries: string[];                  // Países (ex: ["BR"])
  isActive: boolean;                    // Disponível?
  lastSyncAt: Date;                     // Última sincronização
  createdAt: Date;
  updatedAt: Date;
}
```

---

## ❌ Códigos de Erro

### HTTP Status Codes

| Código | Significado | Caso de Uso |
|--------|-------------|-----------|
| `200 OK` | Sucesso | GET, listagens |
| `201 Created` | Recurso criado com sucesso | POST /redeem |
| `207 Multi-Status` | Sucesso parcial | POST /bulk-redeem |
| `400 Bad Request` | Erro na requisição | Saldo insuficiente, validação |
| `404 Not Found` | Recurso não encontrado | Resgate/Produto não existe |
| `409 Conflict` | Conflito de estado | Estoque esgotado |
| `500 Internal Server Error` | Erro no servidor | Falha na API do provider |

### Error Codes (Aplicação)

| Code | HTTP | Descrição |
|------|------|-----------|
| `InsufficientBalanceError` | 400 | Saldo de moedas insuficiente |
| `InsufficientStockError` | 409 | Estoque do prêmio esgotado |
| `VariantRequiredError` | 400 | Prêmio requer seleção de variante |
| `CannotCancelShippedOrderError` | 400 | Pedido já foi enviado |
| `CancellationPeriodExpiredError` | 400 | Período de cancelamento expirou (3 dias) |

---

## 💡 Exemplos Práticos

### Exemplo 1: Resgatar um Voucher Individual

**Passo 1: Login**
```bash
curl -X POST http://localhost:4000/auth/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "senha123"
  }'
```

**Resposta:**
```json
{
  "success": true,
  "data": {
    "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expires_in": 86400
  }
}
```

**Passo 2: Resgatar o Voucher**
```bash
TOKEN="eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..."

curl -X POST http://localhost:4000/api/redemptions/redeem \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "prizeId": "prize_ifood_50",
    "addressId": "addr_123"
  }'
```

**Resposta:**
```json
{
  "message": "Prize redeemed successfully",
  "redemption": {
    "id": "redemption_xyz789",
    "status": "completed",
    "voucherRedemption": {
      "voucherLink": "https://www.tremendous.com/access?code=ABC123XYZ",
      "voucherCode": "ABC123XYZ",
      "amount": 50,
      "status": "completed",
      "expiresAt": "2026-11-06T03:54:10.000Z"
    }
  }
}
```

---

### Exemplo 2: Resgate em Lote (10 Usuários)

```bash
TOKEN="eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..."

curl -X POST http://localhost:4000/api/redemptions/bulk-redeem \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {"userId": "user_001", "prizeId": "prize_ifood_50"},
      {"userId": "user_002", "prizeId": "prize_spotify_30"},
      {"userId": "user_003", "prizeId": "prize_ifood_50"},
      {"userId": "user_004", "prizeId": "prize_netflix_30"},
      {"userId": "user_005", "prizeId": "prize_ifood_100"},
      {"userId": "user_006", "prizeId": "prize_spotify_30"},
      {"userId": "user_007", "prizeId": "prize_ifood_50"},
      {"userId": "user_008", "prizeId": "prize_amazon_50"},
      {"userId": "user_009", "prizeId": "prize_ifood_50"},
      {"userId": "user_010", "prizeId": "prize_spotify_30"}
    ]
  }'
```

**Resposta:**
```json
{
  "message": "Bulk redemption completed",
  "summary": {
    "total": 10,
    "successful": 9,
    "failed": 1
  },
  "results": [
    {
      "userId": "user_001",
      "prizeId": "prize_ifood_50",
      "success": true,
      "redemptionId": "redemption_001",
      "voucherLink": "https://www.tremendous.com/access?code=ABC123"
    },
    {
      "userId": "user_010",
      "prizeId": "prize_spotify_30",
      "success": false,
      "error": "Prize is out of stock"
    }
  ]
}
```

**Tempo Total:** ~1 segundo (10 items × 100ms de delay)

---

### Exemplo 3: Sincronizar Catálogo

```bash
TOKEN="eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..."

curl -X POST http://localhost:4000/admin/voucher-products/sync \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

**Resposta:**
```json
{
  "success": true,
  "message": "Catalog synced successfully",
  "result": {
    "synced": 38,
    "deactivated": 2,
    "total": 40
  }
}
```

---

### Exemplo 4: Listar Vouchers Disponíveis

```bash
TOKEN="eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..."

curl -X GET "http://localhost:4000/admin/voucher-products?currency=BRL&limit=5&isActive=true" \
  -H "Authorization: Bearer $TOKEN"
```

**Resposta:**
```json
{
  "success": true,
  "items": [
    {
      "id": "cmhmw75xm000utpyi4io0fmlq",
      "name": "iFood R$50",
      "minValue": 50,
      "maxValue": 250,
      "currency": "BRL",
      "isActive": true
    },
    {
      "id": "cmhmw75xc0009tpyieqni1k4k",
      "name": "Spotify R$30",
      "minValue": 30,
      "maxValue": 30,
      "currency": "BRL",
      "isActive": true
    }
  ],
  "total": 38
}
```

---

## 📊 Fluxo de Bulk Redemption (Detalhado)

```
POST /api/redemptions/bulk-redeem
  ↓
[Validação]
  ├─ Token válido?
  ├─ Permissão STORE_BULK_REDEEM_ADMIN?
  ├─ Items é array?
  ├─ 1-100 items?
  └─ Cada item tem userId + prizeId?
  ↓
[Processamento Two-Phase com Batches de 10 + Sleep de 1s]
  │
  ├─ BATCH 1 (0-0.5s)
  │   │
  │   ├─ FASE 1: Transação Única (~500ms)
  │   │   ├─ Buscar Prize (1 query)
  │   │   ├─ Calcular custo total (10 items × 300 coins × R$ 0.06 = R$ 18.00)
  │   │   ├─ Debitar CompanyWallet UMA VEZ (R$ 18.00)
  │   │   ├─ Criar 10 Redemptions (status: 'processing')
  │   │   └─ Criar 10 RedemptionTracking
  │   │
  │   ├─ FASE 2: Processamento Paralelo (~2s)
  │   │   └─ Para cada item (10 em paralelo):
  │   │       ├─ Chamar Tremendous API (createVoucher)
  │   │       ├─ Se SUCESSO:
  │   │       │   ├─ Criar VoucherRedemption (status: 'completed')
  │   │       │   └─ Atualizar Redemption (status: 'completed')
  │   │       └─ Se FALHA:
  │   │           ├─ ROLLBACK: Devolver R$ 1.80 à CompanyWallet
  │   │           ├─ Criar VoucherRedemption (status: 'failed')
  │   │           └─ Atualizar Redemption (status: 'failed')
  │
  ├─ SLEEP: 1 segundo (rate limit)
  │
  ├─ BATCH 2 (3-5.5s)
  │   ├─ FASE 1: Transação (~500ms) - debita R$ 18.00
  │   └─ FASE 2: 10 parallel API calls (~2s)
  │
  ├─ SLEEP: 1 segundo
  │
  └─ ... (até BATCH 10)
  │
  └─ [Aguarda TODOS os batches completarem]

  ↓
[Resposta HTTP 207 Multi-Status]
{
  "message": "Bulk redemption completed",
  "summary": {
    "total": 100,
    "successful": 100,
    "failed": 0
  },
  "results": [...]
}
```

**Timeline Real (100 items - Teste 2025-11-06):**

```
0s ───┬─ BATCH 1 (Fase 1: 500ms DB + Fase 2: 2s API paralelo)
      │  └─ 10 vouchers criados ✅
      │
2.5s ─┼─ SLEEP 1s (rate limit)
      │
3.5s ─┬─ BATCH 2 (Fase 1: 500ms + Fase 2: 2s)
      │  └─ 10 vouchers criados ✅
      │
6s ───┼─ SLEEP 1s
      │
7s ───┬─ BATCH 3 (Fase 1: 500ms + Fase 2: 2s)
      │  └─ 10 vouchers criados ✅
      │
      ... (batches 4-9)
      │
21s ──┬─ BATCH 10 (Fase 1: 500ms + Fase 2: 2s)
      │  └─ 10 vouchers criados ✅
      │
25.92s ─┴─ ✅ COMPLETO (100/100 items com sucesso!)
```

**Resultados Comprovados:**

- ✅ **Taxa de Sucesso:** 100% (100/100)
- ⏱️ **Tempo Real:** 25.92 segundos
- 📊 **Tempo Estimado:** 29 segundos
- 🚀 **10% mais rápido que estimado**
- 💰 **CompanyWallet:** Debitou R$ 180.00 total (100 × 300 coins × R$ 0.06)
- 🔄 **Rollbacks:** 0 (nenhuma falha)
- 📈 **Throughput:** 3.86 vouchers/segundo
- vs Sequencial: 100 × 2s = 200 segundos
- **Ganho: 87% mais rápido!**
- **Benefícios:** Sem lock contention, rollback automático, respeita rate limit

---

## 🔒 Autenticação e Autorização

Todos os endpoints requerem **Bearer Token** obtido via login:

```bash
# Login e obter token
curl -X POST http://localhost:4000/auth/admin/login \
  -d '{"email": "user@example.com", "password": "pwd"}'

# Usar token em próximas requisições
curl -H "Authorization: Bearer <token>" \
  http://localhost:4000/api/redemptions/my-redemptions
```

### Permissões

| Endpoint | Público | Autenticado | Admin | Permissão Requerida |
|----------|---------|-------------|-------|---------------------|
| POST /redeem | ❌ | ✅ | ✅ | `STORE_REDEEM_PRIZES` |
| POST /bulk-redeem | ❌ | ❌ | ✅ | `STORE_BULK_REDEEM_ADMIN` |
| GET /my-redemptions | ❌ | ✅ | ✅ | Autenticado |
| GET /my-redemptions/:id | ❌ | ✅ | ✅ | Autenticado |
| POST /my-redemptions/:id/cancel | ❌ | ✅ | ✅ | Autenticado |
| POST /admin/voucher-products/sync | ❌ | ❌ | ✅ | Admin |
| GET /admin/voucher-products | ❌ | ❌ | ✅ | Admin |
| GET /admin/voucher-products/:id | ❌ | ❌ | ✅ | Admin |

**Nota:** `/bulk-redeem` é exclusivamente para administradores (Super Admin ou Company Admin) pois debita o saldo da empresa, não dos usuários individuais.

---

## 📞 Referências

- **Documentação Tremendous API:** https://developers.tremendous.com/docs/introduction
- **Análise de Bulk Operations:** `TREMENDOUS_BULK_API_ANALYSIS.md`
- **Implementação Técnica:**
  - `src/lib/voucher-providers/adapters/tremendous/TremendousAdapter.ts`
  - `src/features/prizes/redemptions/redemption.service.ts`
  - `src/features/wallets/company-wallet.model.ts`
- **Schema Banco de Dados:** `schema.prisma`
- **Collection Postman:** `Valorize_API.postman_collection.json`
- **Script de Teste:** `src/lib/voucher-providers/test-bulk-redemption.ts`

## 🎯 Resultados de Performance

**Teste Real - 100 Vouchers (2025-11-06 15:02 UTC):**

```json
{
  "totalItems": 100,
  "successCount": 100,
  "failureCount": 0,
  "successRate": 100,
  "totalTimeSec": 25.92,
  "averageTimePerItem": 259.22
}
```

**Métricas Técnicas:**

- CompanyWallet debitado: R$ 180.00
- Transações DB: 10 (uma por batch)
- Chamadas API Tremendous: 100 (10 por batch, em paralelo)
- Lock contention: Zero (CompanyWallet única por batch)
- Rollbacks executados: Zero (100% sucesso)

---

**Versão:** 2.0 | **Última atualização:** 2025-11-06 | **Autor:** Dev Team
