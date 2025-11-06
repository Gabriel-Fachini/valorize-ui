# Novas Funcionalidades de Vouchers e Prêmios

## 📋 Sumário

Este documento descreve as duas novas rotas implementadas para gerenciamento de vouchers e prêmios no catálogo:

1. **Enviar Voucher Único para Usuário** - Ação administrativa onde a empresa envia um voucher de presente para um usuário
2. **Atualizar Prêmio no Catálogo** - Permite atualizar nome, descrição e status (isActive) de um prêmio

---

## 1. Enviar Voucher Único para Usuário

### Rota
```
POST /redemptions/send-to-user
```

### Permissão Requerida
```
STORE_BULK_REDEEM_ADMIN
```

### Descrição
Ação **administrativa** que envia um voucher para um usuário específico. A empresa paga pelo voucher (débito na CompanyWallet), e o usuário recebe de **graça**.

Diferente da redenção normal (onde o usuário paga com suas moedas), esta rota permite que a empresa distribua vouchers como **brindes ou promoções**.

### Headers
```
Authorization: Bearer <AUTH_TOKEN>
Content-Type: application/json
```

### Body
```json
{
  "userId": "user-id-aqui",
  "prizeId": "prize-id-voucher-aqui"
}
```

### Response (202 Accepted)
```json
{
  "message": "Voucher is being sent to user",
  "redemptionId": "redemption-uuid",
  "userId": "user-id-aqui",
  "prizeId": "prize-id-voucher-aqui",
  "status": "processing",
  "notes": "Voucher is being created. Check status later for completion."
}
```

### Códigos de Status
| Código | Significado |
|--------|-------------|
| `202`  | Aceito - Voucher está sendo processado em background |
| `400`  | Erro - Campos obrigatórios faltando ou validação falhou |
| `404`  | Não encontrado - Usuário do admin não encontrado |

### Erros Possíveis
```json
{
  "message": "Prize not found or is not active"
}
```

```json
{
  "message": "Prize is not a voucher"
}
```

```json
{
  "message": "Insufficient balance in company wallet"
}
```

```json
{
  "message": "User not found: user-id-aqui"
}
```

### Fluxo de Processamento

#### Fase 1 (Síncrono - Resposta Imediata)
1. Valida prize existe e está ativo
2. Valida que é um voucher
3. **Debita do saldo da empresa** (CompanyWallet)
4. Cria registro de Redemption com status `processing`
5. Retorna `202 Accepted` imediatamente

#### Fase 2 (Assíncrono - Background)
1. Chama API do provider (Tremendous) para criar voucher
2. Se sucesso: atualiza status para `completed`, armazena link e código
3. Se erro: faz rollback do débito, marca como `failed`

### Como Checar o Status

Use o endpoint existente para ver detalhes da redemption:

```
GET /redemptions/my-redemptions/{redemptionId}
```

Respostas incluem status e link do voucher quando pronto.

### Exemplo Completo

**Request:**
```bash
curl -X POST http://localhost:3000/redemptions/send-to-user \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user_12345",
    "prizeId": "prize_voucher_amazon_100"
  }'
```

**Response (202):**
```json
{
  "message": "Voucher is being sent to user",
  "redemptionId": "redemption_abc123xyz",
  "userId": "user_12345",
  "prizeId": "prize_voucher_amazon_100",
  "status": "processing",
  "notes": "Voucher is being created. Check status later for completion."
}
```

**Depois (em alguns segundos), consulte:**
```bash
curl -X GET http://localhost:3000/redemptions/my-redemptions/redemption_abc123xyz \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
```

**Response:**
```json
{
  "redemption": {
    "id": "redemption_abc123xyz",
    "userId": "user_12345",
    "prizeId": "prize_voucher_amazon_100",
    "status": "completed",
    "coinsSpent": 100,
    "redeemedAt": "2024-11-06T10:30:45.123Z",
    "voucherRedemption": {
      "voucherCode": "AMAZON-VOUCHER-CODE-123",
      "voucherLink": "https://tremendous.com/redeem/...",
      "status": "completed",
      "expiresAt": "2025-01-06T23:59:59.000Z"
    }
  }
}
```

---

## 2. Atualizar Prêmio no Catálogo

### Rota
```
PATCH /prizes/{prizeId}
```

### Permissão Requerida
Nenhuma permissão especial, mas o prêmio deve pertencer à empresa do usuário logado.

### Descrição
Permite atualizar propriedades de um prêmio já existente no catálogo. Você pode:
- ✅ Atualizar nome
- ✅ Atualizar descrição
- ✅ Ativar/desativar (controla visibilidade no catálogo)

**Importante:** Quando `isActive = false`, o prêmio **desaparece do catálogo** automaticamente.

### Headers
```
Authorization: Bearer <AUTH_TOKEN>
Content-Type: application/json
```

### URL Parameters
```
{prizeId} = ID do prêmio a atualizar
```

### Body (Todos Opcionais)
```json
{
  "name": "Novo Nome do Prêmio",
  "description": "Nova descrição com detalhes de uso",
  "isActive": true
}
```

**Nota:** Pelo menos um campo deve ser fornecido.

### Response (200 OK)
```json
{
  "message": "Prize updated successfully",
  "prize": {
    "id": "prize_voucher_amazon_100",
    "name": "Vale Amazon R$ 100",
    "description": "Voucher de R$ 100 para usar na Amazon. Válido por 1 ano.",
    "category": "voucher",
    "coinPrice": 1667,
    "brand": "Amazon",
    "images": ["https://..."],
    "stock": 999,
    "isActive": true,
    "createdAt": "2024-10-01T15:23:45.000Z",
    "updatedAt": "2024-11-06T10:45:30.123Z"
  }
}
```

### Códigos de Status
| Código | Significado |
|--------|-------------|
| `200`  | OK - Prêmio atualizado com sucesso |
| `400`  | Erro - Validação falhou (campo vazio, nenhum campo fornecido, etc) |
| `403`  | Proibido - Prêmio não pertence à sua empresa |
| `404`  | Não encontrado - Prêmio não existe ou usuário não encontrado |

### Erros Possíveis

**Nenhum campo fornecido:**
```json
{
  "message": "At least one field (name, description, or isActive) must be provided"
}
```

**Nome vazio:**
```json
{
  "message": "Prize name cannot be empty"
}
```

**Descrição vazia:**
```json
{
  "message": "Prize description cannot be empty"
}
```

**Prêmio não pertence à empresa:**
```json
{
  "message": "Prize does not belong to this company"
}
```

**Prêmio não encontrado:**
```json
{
  "message": "Prize not found"
}
```

### Exemplos

#### Desativar Prêmio do Catálogo
```bash
curl -X PATCH http://localhost:3000/prizes/prize_voucher_amazon_100 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
  -H "Content-Type: application/json" \
  -d '{
    "isActive": false
  }'
```

**Response:**
```json
{
  "message": "Prize updated successfully",
  "prize": {
    "id": "prize_voucher_amazon_100",
    "name": "Vale Amazon R$ 100",
    "isActive": false,
    ...
  }
}
```

#### Atualizar Nome e Descrição
```bash
curl -X PATCH http://localhost:3000/prizes/prize_voucher_amazon_100 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Vale Amazon R$ 100 - BLACK FRIDAY",
    "description": "Promoção especial Black Friday! Voucher Amazon de R$ 100. Válido até 31/12/2024."
  }'
```

**Response:**
```json
{
  "message": "Prize updated successfully",
  "prize": {
    "id": "prize_voucher_amazon_100",
    "name": "Vale Amazon R$ 100 - BLACK FRIDAY",
    "description": "Promoção especial Black Friday! Voucher Amazon de R$ 100. Válido até 31/12/2024.",
    "isActive": true,
    ...
  }
}
```

#### Reativar Prêmio no Catálogo
```bash
curl -X PATCH http://localhost:3000/prizes/prize_voucher_amazon_100 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
  -H "Content-Type: application/json" \
  -d '{
    "isActive": true
  }'
```

---

## 📊 Fluxo de Uso Típico

### Cenário 1: Promover Voucher com Brinde Automático

```
1. Admin cria campanha de promoção
2. Admin envia voucher para top users via POST /redemptions/send-to-user
3. Usuários recebem notificação de novo voucher
4. Usuários veem voucher na tela de "Minhas Redemptions"
5. Usuários clicam no link para usar o voucher
```

### Cenário 2: Gerenciar Catálogo de Vouchers

```
1. Admin quer esconder promoção expirada
2. Admin faz PATCH /prizes/{id} com isActive: false
3. Prêmio desaparece do catálogo (/prizes/catalog)
4. Usuários não veem mais a opção para resgatar
5. Depois, admin pode reativar com isActive: true
```

---

## 🔑 Campos Importantes

### Prize
- `id`: ID único do prêmio
- `name`: Nome exibido no catálogo
- `description`: Descrição e instruções de uso
- `category`: "voucher", "experience", ou "product"
- `coinPrice`: Preço em moedas virtuais
- `stock`: Quantidade disponível (sempre 999 para vouchers)
- **`isActive`**: `true` = visível no catálogo, `false` = oculto
- `createdAt`: Data de criação
- `updatedAt`: Última atualização

### VoucherRedemption (dentro de Redemption)
- `voucherLink`: URL para resgatar o voucher
- `voucherCode`: Código para usar (se não houver link)
- `status`: "completed", "failed", "processing"
- `expiresAt`: Data de expiração do voucher
- `amount`: Valor do voucher
- `currency`: Moeda (ex: "BRL")

---

## ⚠️ Notas Importantes

1. **Débito Reversível**: Se a criação do voucher falhar na Fase 2, o débito da empresa é **automaticamente revertido**.

2. **Processamento Assíncrono**: A resposta é imediata (202), mas o voucher é criado em background. Sempre consulte o status depois.

3. **isActive vs Stock**:
   - `isActive = false` → Prêmio oculto do catálogo
   - `stock = 0` → Prêmio sem disponibilidade (raro para vouchers)

4. **Permissões**: Apenas usuários com `STORE_BULK_REDEEM_ADMIN` podem enviar vouchers. Qualquer usuário autenticado pode atualizar seus próprios prêmios.

5. **Validações**:
   - Prize deve estar ativo (isActive: true)
   - Prize deve ser do tipo "voucher"
   - Empresa deve ter saldo suficiente
   - Usuário deve existir no sistema

---

## 🚀 Próximos Passos para o Frontend

1. Adicione UI para enviar vouchers (POST /redemptions/send-to-user)
2. Adicione controles para gerenciar catálogo (PATCH /prizes/:id)
3. Implemente polling ou WebSocket para acompanhar status do voucher
4. Mostre notificações quando voucher estiver pronto
5. Integre com tela de "Meus Vouchers" existente

---

## 📞 Suporte

Para dúvidas sobre as implementações, consulte:
- `src/features/prizes/redemptions/redemption.service.ts` - Lógica de vouchers
- `src/features/prizes/prize.service.ts` - Lógica de prêmios
- `src/features/prizes/redemptions/redemption.routes.ts` - Rotas de redemption
- `src/features/prizes/prize.routes.ts` - Rotas de prizes
