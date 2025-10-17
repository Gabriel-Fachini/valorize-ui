# 🖱️ Deploy Manual via Console do Google Cloud (GUI)

## 📋 Visão Geral

Este guia mostra como fazer o **primeiro deploy manualmente** usando apenas a interface gráfica do Google Cloud Console, **sem usar linha de comando**.

**Por que fazer deploy manual primeiro?**
- ✅ Entender o processo visualmente
- ✅ Criar os serviços no Cloud Run pela primeira vez
- ✅ Configurar tudo via interface gráfica (mais fácil)
- ✅ Depois os deploys automáticos só atualizam os serviços existentes

**Tempo estimado:** 20-30 minutos (primeira vez)

---

## 🎯 Pré-requisitos

Antes de começar, você precisa ter:

- [ ] Conta Google Cloud ativa
- [ ] Projeto criado no GCP
- [ ] Cartão de crédito cadastrado (mesmo no free trial)
- [ ] Docker instalado localmente (para build das imagens)
- [ ] Google Cloud SDK instalado (para enviar imagens)

---

## 📦 Parte 1: Preparar as Imagens Docker Localmente

Antes de usar o Console, precisamos criar e enviar as imagens Docker. Vamos fazer isso via linha de comando (única parte não-GUI necessária).

### Passo 1.1: Configurar gcloud

```bash
# Fazer login
gcloud auth login

# Configurar projeto (substitua pelo seu PROJECT_ID)
gcloud config set project SEU-PROJECT-ID

# Configurar região
gcloud config set run/region us-central1

# Autenticar Docker com GCR
gcloud auth configure-docker
```

### Passo 1.2: Build e Push da Imagem do Dashboard

```bash
# Definir variáveis
export PROJECT_ID=$(gcloud config get-value project)

# Build da imagem do dashboard para AMD64 (Cloud Run)
docker buildx build \
  --platform linux/amd64 \
  -f apps/dashboard/Dockerfile \
  --build-arg VITE_API_BASE_URL=https://api.valorize.com \
  --build-arg VITE_API_URL=https://api.valorize.com \
  -t gcr.io/$PROJECT_ID/valorize-dashboard:v1 \
  --push \
  .
```

**Aguarde:** Este processo leva 3-5 minutos. Você verá o progresso do upload.

### Passo 1.3: Build e Push da Imagem da Landing Page

```bash
# Build da imagem da landing
docker build -f apps/landing/Dockerfile \
  --build-arg PUBLIC_SITE_URL=https://valorize.com \
  -t gcr.io/$PROJECT_ID/valorize-landing:v1 \
  .

# Push para Container Registry
docker push gcr.io/$PROJECT_ID/valorize-landing:v1
```

✅ **Checkpoint:** Ambas as imagens agora estão no Google Container Registry!

---

## 🚀 Parte 2: Deploy do Dashboard via Console

Agora vamos usar **apenas o Console** (interface gráfica) para fazer o deploy.

### Passo 2.1: Acessar Cloud Run

1. **Abra o Console do Google Cloud:**
   - URL: https://console.cloud.google.com
   - Faça login com sua conta Google

2. **Selecione seu projeto:**
   - No topo da página, clique no seletor de projetos
   - Selecione o projeto onde você fez o push das imagens

3. **Navegue até Cloud Run:**
   - No menu lateral (☰), procure por **"Cloud Run"**
   - Ou use a busca no topo: digite "Cloud Run" e clique

### Passo 2.2: Criar Serviço do Dashboard

1. **Iniciar criação:**
   - Clique no botão **"CREATE SERVICE"** (topo da página)
   - Ou clique em **"+ Create Service"**

2. **Aba "Container" - Configurar imagem:**

   **Container image URL:**
   - Clique em **"SELECT"** ao lado do campo
   - Uma janela lateral abrirá com suas imagens
   - Navegue: **Container Registry > [seu-projeto] > valorize-dashboard**
   - Selecione a imagem **v1** (que você fez push)
   - Clique em **"SELECT"**
   
   A URL ficará algo como:
   ```
   gcr.io/SEU-PROJECT-ID/valorize-dashboard:v1
   ```

3. **Service name:**
   ```
   valorize-dashboard
   ```

4. **Region:**
   - Selecione: **us-central1 (Iowa)**
   - Ou escolha a região mais próxima de você

5. **CPU allocation and pricing:**
   - Deixe selecionado: **"CPU is only allocated during request processing"**
   - Isso economiza custos (cobra apenas quando em uso)

6. **Autoscaling:**
   - **Minimum number of instances:** `0`
   - **Maximum number of instances:** `10`

7. **Ingress:**
   - Selecione: **"All"** (permite tráfego de qualquer origem)

8. **Authentication:**
   - Selecione: **"Allow unauthenticated invocations"**
   - ✅ Marque o checkbox confirmando que entende os riscos
   - (Isso permite acesso público à aplicação)

### Passo 2.3: Configurar Container

1. **Clique em "CONTAINER(S), VOLUMES, NETWORKING, SECURITY"** (expandir seção)

2. **Aba "Container" - Recursos:**
   
   **Container port:**
   ```
   8080
   ```
   
   **Memory:**
   - Selecione: **512 MiB** (suficiente para o dashboard)
   
   **CPU:**
   - Selecione: **1** (1 vCPU)
   
   **Request timeout:**
   - Deixe: **300** segundos (padrão)
   
   **Maximum concurrent requests per instance:**
   - Deixe: **80** (padrão)

3. **Environment Variables:**
   - Clique na aba **"VARIABLES & SECRETS"**
   - Clique em **"+ ADD VARIABLE"**
   
   Adicione estas variáveis (clique "+ ADD VARIABLE" para cada):
   
   | Name | Value |
   |------|-------|
   | `VITE_API_BASE_URL` | `https://api.valorize.com` |
   | `VITE_API_URL` | `https://api.valorize.com` |
   
   ⚠️ **Substitua pelas URLs reais da sua API!**

4. **Startup probe (Health Check):**
   - Role até **"Health checks"**
   - Clique em **"Add startup probe"**
   - **Path:** `/health`
   - **Port:** `8080`
   - Deixe os outros valores padrão

### Passo 2.4: Finalizar Deploy

1. **Revisar configurações:**
   - Role até o final da página
   - Revise o resumo das configurações

2. **Criar serviço:**
   - Clique no botão azul **"CREATE"** no rodapé

3. **Aguardar deploy:**
   - Você será redirecionado para a página do serviço
   - Verá um indicador de progresso
   - **Tempo:** 2-4 minutos
   - Status mudará de "Deploying" → "Ready" ✅

4. **Obter URL:**
   - Quando pronto, uma **URL** aparecerá no topo
   - Exemplo: `https://valorize-dashboard-xxxxx-uc.a.run.app`
   - **Clique na URL** para testar sua aplicação!

✅ **Checkpoint:** Dashboard está no ar! 🎉

---

## 🌐 Parte 3: Deploy da Landing Page via Console

Agora vamos repetir o processo para a landing page.

### Passo 3.1: Criar Serviço da Landing

1. **Voltar para lista de serviços:**
   - Cloud Run > Services
   - Clique em **"CREATE SERVICE"** novamente

2. **Container image URL:**
   - Clique em **"SELECT"**
   - Navegue até: **Container Registry > valorize-landing**
   - Selecione a imagem **v1**
   - Clique em **"SELECT"**

3. **Service name:**
   ```
   valorize-landing
   ```

4. **Region:**
   - Mesma do dashboard: **us-central1**

5. **CPU allocation:**
   - **"CPU is only allocated during request processing"**

6. **Autoscaling:**
   - **Minimum:** `0`
   - **Maximum:** `5` (landing precisa de menos capacidade)

7. **Ingress:**
   - **"All"**

8. **Authentication:**
   - **"Allow unauthenticated invocations"** ✅

### Passo 3.2: Configurar Container da Landing

1. **Expandir:** "CONTAINER(S), VOLUMES, NETWORKING, SECURITY"

2. **Recursos:**
   
   **Container port:**
   ```
   8080
   ```
   
   **Memory:**
   - Selecione: **256 MiB** (landing é mais leve)
   
   **CPU:**
   - Selecione: **1**

3. **Environment Variables:**
   - Aba **"VARIABLES & SECRETS"**
   - **+ ADD VARIABLE:**
   
   | Name | Value |
   |------|-------|
   | `PUBLIC_SITE_URL` | `https://valorize.com` |

4. **Health Check:**
   - **Add startup probe**
   - **Path:** `/health`
   - **Port:** `8080`

### Passo 3.3: Finalizar Deploy da Landing

1. **Clique em "CREATE"**

2. **Aguardar deploy:** 2-3 minutos

3. **Obter URL e testar**

✅ **Checkpoint:** Landing page está no ar! 🎉

---

## 🔍 Parte 4: Verificar e Gerenciar via Console

### Ver Lista de Serviços

1. **Cloud Run > Services**
2. Você verá ambos serviços:
   - ✅ valorize-dashboard
   - ✅ valorize-landing

### Ver Detalhes de um Serviço

Clique em qualquer serviço para ver:

- **URL pública**
- **Status** (Ready, Deploying, etc.)
- **Métricas:**
  - Request count
  - Request latency
  - Container CPU utilization
  - Memory utilization
  - Instance count

### Ver Logs em Tempo Real

1. **Dentro do serviço, clique na aba "LOGS"**
2. Você verá todos os logs do container
3. Use filtros para:
   - Filtrar por severidade (INFO, WARNING, ERROR)
   - Buscar texto específico
   - Filtrar por timestamp

### Ver Revisões (Versions)

1. **Aba "REVISIONS"**
2. Mostra todas as versões deployadas
3. Você pode:
   - Ver diferenças entre revisões
   - Fazer rollback para versão anterior
   - Gerenciar tráfego entre versões (A/B testing)

### Editar Configuração do Serviço

1. **Clique em "EDIT & DEPLOY NEW REVISION"** (topo)
2. Você pode alterar:
   - Imagem do container
   - Variáveis de ambiente
   - Recursos (CPU, memória)
   - Autoscaling
   - Health checks
3. **Clique em "DEPLOY"** para aplicar mudanças

---

## 🌍 Parte 5: Configurar Domínio Customizado (Opcional)

Se você quiser usar seu próprio domínio (ex: `app.valorize.com` em vez da URL do Cloud Run).

### Passo 5.1: Verificar Domínio

1. **Cloud Run > Domain Mappings**
2. Clique em **"ADD MAPPING"**
3. Clique em **"Verify a new domain"**
4. Siga as instruções:
   - Adicione registro TXT no seu DNS
   - Aguarde verificação (~15 min)
   - Clique em **"VERIFY"**

### Passo 5.2: Mapear Domínio ao Dashboard

1. **Ainda em Domain Mappings, clique "ADD MAPPING"**
2. **Service:** Selecione `valorize-dashboard`
3. **Domain:** Digite seu domínio
   - Para dashboard: `app.valorize.com`
   - Ou subdomínio de sua escolha
4. **Clique em "CONTINUE"**
5. **Configure DNS:**
   - Google fornecerá um registro CNAME
   - Exemplo:
     ```
     app.valorize.com  CNAME  ghs.googlehosted.com
     ```
   - Adicione este registro no seu provedor de DNS
6. **Aguarde propagação:** 1-48 horas (geralmente 1-2h)
7. **Certificado SSL:** Provisionado automaticamente pelo Google

### Passo 5.3: Mapear Domínio à Landing

Repita o processo acima para a landing page:
- Domínio: `www.valorize.com` ou `valorize.com`

---

## 📊 Parte 6: Monitorar via Console

### Dashboard de Métricas

1. **Cloud Run > Services > [seu-serviço]**
2. **Aba "METRICS"**
3. Veja gráficos de:
   - 📈 Request count (requisições por minuto)
   - ⏱️ Request latency (tempo de resposta)
   - 🖥️ CPU utilization
   - 💾 Memory utilization
   - 📊 Instance count (quantos containers rodando)

### Configurar Alertas

1. **Na página de métricas, clique "CREATE ALERT"**
2. Configure alertas para:
   - CPU > 80%
   - Memory > 90%
   - Error rate > 5%
   - Latency > 1000ms

### Cloud Logging

1. **Menu ☰ > Logging > Logs Explorer**
2. Filtrar por recurso:
   ```
   resource.type="cloud_run_revision"
   resource.labels.service_name="valorize-dashboard"
   ```
3. Ver logs agregados de todas as instâncias

### Cloud Monitoring

1. **Menu ☰ > Monitoring > Dashboards**
2. Criar dashboard customizado
3. Adicionar gráficos de métricas importantes

---

## 💰 Parte 7: Gerenciar Custos

### Ver Custos no Console

1. **Menu ☰ > Billing > Cost table**
2. Filtrar por:
   - **Product:** Cloud Run
   - **Date range:** Last 30 days
3. Veja breakdown de custos por serviço

### Configurar Budget Alerts

1. **Billing > Budgets & alerts**
2. **CREATE BUDGET**
3. Configure:
   - **Name:** Cloud Run Budget
   - **Budget amount:** $20/month (ajuste conforme necessário)
   - **Threshold:** 50%, 90%, 100%
4. **Email notifications** para alertas

### Otimizar Custos

**Estratégias:**

1. **Min instances = 0:** Não paga quando não há tráfego
2. **Requests per instance:** Aumentar para usar menos instâncias
3. **CPU allocation:** "During request processing" (mais barato)
4. **Memory:** Ajustar para o mínimo necessário

---

## 🔄 Parte 8: Atualizar Aplicação

Quando você quiser fazer **novo deploy** (atualizar código):

### Via Console (GUI)

1. **Build nova imagem localmente (AMD64):**
   ```bash
   # Nova versão para Cloud Run (AMD64)
   docker buildx build \
     --platform linux/amd64 \
     -f apps/dashboard/Dockerfile \
     --build-arg VITE_API_BASE_URL=https://api.valorize.com \
     -t gcr.io/$PROJECT_ID/valorize-dashboard:v2 \
     --push \
     .
   ```

2. **Atualizar no Console:**
   - Cloud Run > Services > valorize-dashboard
   - Clique em **"EDIT & DEPLOY NEW REVISION"**
   - Em **"Container image URL"**, clique em **"SELECT"**
   - Escolha a nova versão (**v2**)
   - Clique em **"DEPLOY"**

3. **Rollback (se necessário):**
   - Aba **"REVISIONS"**
   - Encontre revisão anterior
   - Clique nos **3 pontos (⋮)** → **"Manage traffic"**
   - Aloque 100% do tráfego para revisão antiga
   - Clique em **"SAVE"**

### Traffic Splitting (A/B Testing)

1. **Aba "REVISIONS"**
2. Clique em **"MANAGE TRAFFIC"**
3. Configure split:
   - v1 → 50%
   - v2 → 50%
4. **SAVE**

Útil para testar novas features com parte dos usuários!

---

## 🛡️ Parte 9: Segurança e Boas Práticas

### Service Account

Por padrão, Cloud Run usa service account padrão. Para produção:

1. **IAM & Admin > Service Accounts**
2. **CREATE SERVICE ACCOUNT**
3. **Name:** `cloud-run-valorize`
4. Conceda apenas permissões necessárias
5. **Cloud Run > Service > Edit:**
   - Aba **"SECURITY"**
   - **Service account:** Selecione a criada

### Secrets Manager

Para variáveis sensíveis (API keys, senhas):

1. **Security > Secret Manager**
2. **CREATE SECRET**
3. **Name:** `api-key`
4. **Secret value:** Sua API key
5. **CREATE**

6. **Cloud Run > Service > Edit:**
   - Aba **"VARIABLES & SECRETS"**
   - Clique em **"REFERENCE A SECRET"**
   - Selecione seu secret
   - Será exposto como variável de ambiente

### Limitar Acesso por IP (se necessário)

Use **Cloud Armor** ou **Identity-Aware Proxy** para restringir acesso.

---

## 🆘 Troubleshooting via Console

### Container não inicia

1. **Ver logs:**
   - Cloud Run > Service > Aba "LOGS"
   - Procurar por erros (vermelho)

2. **Problemas comuns:**
   - ❌ **Port incorreto:** Verificar se container expõe porta 8080
   - ❌ **Health check falha:** Verificar se endpoint `/health` existe
   - ❌ **Timeout:** Container demora muito para iniciar

### 502 Bad Gateway

- Container crashou após iniciar
- Ver logs para encontrar erro
- Geralmente: variável de ambiente faltando

### 504 Gateway Timeout

- Request demora mais que o timeout configurado
- Aumentar **Request timeout** nas configurações

### High CPU/Memory

1. **Metrics > CPU/Memory graph**
2. Se consistentemente alto:
   - Aumentar recursos alocados
   - Ou otimizar código

---

## ✅ Checklist Final

Após completar este guia, você deve ter:

- [x] 2 imagens Docker no Container Registry
- [x] Serviço `valorize-dashboard` rodando
- [x] Serviço `valorize-landing` rodando
- [x] Ambos acessíveis via URLs públicas
- [x] Variáveis de ambiente configuradas
- [x] Health checks configurados
- [x] Logs visíveis no Console
- [x] Métricas sendo coletadas

---

## 🎯 Próximos Passos

Agora que você fez o primeiro deploy manual:

1. ✅ **Configure CI/CD automático:** [docs/DEPLOY_AUTOMATICO_CI_CD.md](./DEPLOY_AUTOMATICO_CI_CD.md)
2. ✅ **Configure domínio customizado** (se ainda não fez)
3. ✅ **Configure alertas de monitoramento**
4. ✅ **Configure backup de logs**

---

## 📚 Recursos Úteis

**Console Links:**
- Cloud Run Services: https://console.cloud.google.com/run
- Container Registry: https://console.cloud.google.com/gcr
- Cloud Build: https://console.cloud.google.com/cloud-build
- Logs Explorer: https://console.cloud.google.com/logs
- Monitoring: https://console.cloud.google.com/monitoring
- Billing: https://console.cloud.google.com/billing

**Documentação:**
- [Cloud Run Console Quickstart](https://cloud.google.com/run/docs/quickstarts/deploy-container)
- [Managing Services](https://cloud.google.com/run/docs/managing/services)
- [Custom Domains](https://cloud.google.com/run/docs/mapping-custom-domains)

---

**🎉 Parabéns!** Você fez deploy manual completo via Console do Google Cloud!

Agora você entende o processo visualmente e pode automatizar com CI/CD. 🚀
