# 🚀 Guia Completo de Deploy no Google Cloud Run

Este guia fornece instruções detalhadas para fazer deploy do monorepo Valorize UI no Google Cloud Platform usando Cloud Run.

## 📋 Índice

1. [Pré-requisitos](#pré-requisitos)
2. [Configuração Inicial do GCP](#configuração-inicial-do-gcp)
3. [Preparação do Projeto](#preparação-do-projeto)
4. [Deploy Manual (Primeira vez)](#deploy-manual-primeira-vez)
5. [Deploy Automatizado com Cloud Build](#deploy-automatizado-com-cloud-build)
6. [Configuração de Domínio Customizado](#configuração-de-domínio-customizado)
7. [Monitoramento e Logs](#monitoramento-e-logs)
8. [Troubleshooting](#troubleshooting)

---

## 🎯 Pré-requisitos

### 1. Ferramentas Necessárias

```bash
# Instalar Google Cloud SDK
# macOS:
brew install --cask google-cloud-sdk

# Ou baixar de: https://cloud.google.com/sdk/docs/install

# Verificar instalação
gcloud --version

# Instalar Docker
# macOS:
brew install --cask docker

# Verificar Docker
docker --version
```

### 2. Conta Google Cloud

- Acesse [console.cloud.google.com](https://console.cloud.google.com)
- Se for primeira vez, ative o free trial ($300 de crédito por 90 dias)
- Tenha um cartão de crédito cadastrado (mesmo no free trial)

---

## ⚙️ Configuração Inicial do GCP

### Passo 1: Criar Projeto no Console

1. Acesse [console.cloud.google.com](https://console.cloud.google.com)
2. Clique no seletor de projetos (topo da página)
3. Clique em **"Novo Projeto"**
4. Preencha:
   - **Nome do projeto**: `valorize-ui` (ou nome de sua escolha)
   - **Organização**: Deixe em branco se não tiver
   - **Localização**: Deixe como está
5. Clique em **"Criar"**
6. Aguarde a criação (leva ~30 segundos)
7. **IMPORTANTE**: Anote o **Project ID** (ex: `valorize-ui-123456`)

### Passo 2: Ativar APIs Necessárias

No Console do GCP:

1. Vá em **"APIs & Services" > "Library"** (menu lateral)
2. Ative as seguintes APIs (pesquise e clique em "Enable"):
   - ✅ **Cloud Run API**
   - ✅ **Cloud Build API**
   - ✅ **Container Registry API**
   - ✅ **Artifact Registry API** (recomendado, substitui Container Registry)

Ou via CLI (mais rápido):

```bash
# Configurar projeto
gcloud config set project SEU-PROJECT-ID

# Ativar APIs
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable containerregistry.googleapis.com
gcloud services enable artifactregistry.googleapis.com
```

### Passo 3: Configurar gcloud CLI

```bash
# Fazer login
gcloud auth login

# Configurar projeto padrão
gcloud config set project SEU-PROJECT-ID

# Configurar região padrão (escolha a mais próxima de você)
gcloud config set run/region us-central1

# Regiões disponíveis:
# - us-central1 (Iowa, USA) - recomendada, mais estável
# - us-east1 (Carolina do Sul, USA)
# - southamerica-east1 (São Paulo, Brasil) - menor latência para BR
# - europe-west1 (Bélgica)

# Verificar configuração
gcloud config list
```

### Passo 4: Configurar Docker para GCR

```bash
# Autenticar Docker com Google Container Registry
gcloud auth configure-docker

# Verificar autenticação
docker info | grep Username
```

---

## 🔧 Preparação do Projeto

### 1. Variáveis de Ambiente

Crie um arquivo `.env.production` na raiz do projeto:

```bash
# apps/dashboard/.env.production
VITE_API_BASE_URL=https://api.valorize.com
VITE_API_URL=https://api.valorize.com
```

**⚠️ IMPORTANTE**: Nunca commite arquivos `.env` no Git!

### 2. Testar Build Local

Antes de fazer deploy, teste se os Dockerfiles funcionam localmente:

```bash
# Testar build do dashboard (especificando AMD64 para Cloud Run)
docker buildx build \
  --platform linux/amd64 \
  -f apps/dashboard/Dockerfile \
  --build-arg VITE_API_BASE_URL=https://api.valorize.com \
  --build-arg VITE_API_URL=https://api.valorize.com \
  -t valorize-dashboard:test \
  --load \
  .

# Testar rodando localmente
docker run -p 8080:8080 valorize-dashboard:test

# Abra http://localhost:8080 e teste

# Parar container
docker stop $(docker ps -q --filter ancestor=valorize-dashboard:test)

# Testar build da landing
DOCKER_BUILDKIT=1 docker build -f apps/landing/Dockerfile \
  --build-arg PUBLIC_SITE_URL=https://valorize.com \
  -t valorize-landing:test .

# Testar rodando
docker run -p 8081:8080 valorize-landing:test

# Abra http://localhost:8081
```

---

## 🚀 Deploy Manual (Primeira vez)

Use este método para o primeiro deploy ou para testar mudanças.

### Deploy do Dashboard

```bash
# 1. Definir variáveis
export PROJECT_ID=$(gcloud config get-value project)
export REGION=us-central1

# 2. Build da imagem para AMD64 (Cloud Run requer esta arquitetura)
docker buildx build \
  --platform linux/amd64 \
  -f apps/dashboard/Dockerfile \
  --build-arg VITE_API_BASE_URL=https://api.valorize.com \
  --build-arg VITE_API_URL=https://api.valorize.com \
  -t gcr.io/$PROJECT_ID/valorize-dashboard:latest \
  --push \
  .

# 4. Deploy no Cloud Run
gcloud run deploy valorize-dashboard \
  --image gcr.io/$PROJECT_ID/valorize-dashboard:latest \
  --region $REGION \
  --platform managed \
  --allow-unauthenticated \
  --port 8080 \
  --memory 512Mi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 10 \
  --set-env-vars VITE_API_BASE_URL=https://api.valorize.com,VITE_API_URL=https://api.valorize.com

# 5. Obter URL do serviço
gcloud run services describe valorize-dashboard --region $REGION --format 'value(status.url)'
```

### Deploy da Landing Page

```bash
# 1. Build da imagem
DOCKER_BUILDKIT=1 docker build -f apps/landing/Dockerfile \
  --build-arg PUBLIC_SITE_URL=https://valorize.com \
  -t gcr.io/$PROJECT_ID/valorize-landing:latest .

# 2. Push para Container Registry
docker push gcr.io/$PROJECT_ID/valorize-landing:latest

# 3. Deploy no Cloud Run
gcloud run deploy valorize-landing \
  --image gcr.io/$PROJECT_ID/valorize-landing:latest \
  --region $REGION \
  --platform managed \
  --allow-unauthenticated \
  --port 8080 \
  --memory 256Mi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 5 \
  --set-env-vars PUBLIC_SITE_URL=https://valorize.com

# 4. Obter URL
gcloud run services describe valorize-landing --region $REGION --format 'value(status.url)'
```

---

## 🤖 Deploy Automatizado com Cloud Build

Configure CI/CD para deploy automático quando fizer push no GitHub.

### Passo 1: Conectar GitHub ao Cloud Build

1. No Console GCP, vá em **Cloud Build > Triggers**
2. Clique em **"Connect Repository"**
3. Selecione **"GitHub"** como fonte
4. Autentique com sua conta GitHub
5. Selecione o repositório **"Gabriel-Fachini/valorize-ui"**
6. Clique em **"Connect"**

### Passo 2: Criar Trigger para Dashboard

1. Ainda em **Cloud Build > Triggers**, clique em **"Create Trigger"**
2. Configure:
   - **Nome**: `deploy-dashboard`
   - **Descrição**: `Deploy dashboard on push to main`
   - **Evento**: `Push to a branch`
   - **Source**: Selecione seu repositório
   - **Branch**: `^main$` (regex para branch main)
   - **Included files filter (opcional)**: `apps/dashboard/**`
   - **Configuration**: `Cloud Build configuration file (yaml or json)`
   - **Cloud Build configuration file location**: `/cloudbuild-dashboard.yaml`
3. Clique em **"Advanced" > "Substitution variables"** e adicione:
   - `_REGION`: `us-central1`
   - `_VITE_API_BASE_URL`: `https://api.valorize.com`
   - `_VITE_API_URL`: `https://api.valorize.com`
4. Clique em **"Create"**

### Passo 3: Criar Trigger para Landing

1. Clique em **"Create Trigger"** novamente
2. Configure:
   - **Nome**: `deploy-landing`
   - **Descrição**: `Deploy landing page on push to main`
   - **Evento**: `Push to a branch`
   - **Branch**: `^main$`
   - **Included files filter (opcional)**: `apps/landing/**`
   - **Configuration file**: `/cloudbuild-landing.yaml`
3. Substitution variables:
   - `_REGION`: `us-central1`
   - `_PUBLIC_SITE_URL`: `https://valorize.com`
4. Clique em **"Create"**

### Passo 4: Conceder Permissões ao Cloud Build

O Cloud Build precisa de permissões para fazer deploy no Cloud Run:

```bash
# Obter o número do projeto
PROJECT_NUMBER=$(gcloud projects describe $PROJECT_ID --format='value(projectNumber)')

# Conceder permissão Cloud Run Admin
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member=serviceAccount:$PROJECT_NUMBER@cloudbuild.gserviceaccount.com \
  --role=roles/run.admin

# Conceder permissão Service Account User (necessário para assumir identity do Cloud Run)
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member=serviceAccount:$PROJECT_NUMBER@cloudbuild.gserviceaccount.com \
  --role=roles/iam.serviceAccountUser
```

Ou via Console:

1. Vá em **IAM & Admin > IAM**
2. Encontre a service account `[PROJECT_NUMBER]@cloudbuild.gserviceaccount.com`
3. Clique em **"Edit"** (ícone de lápis)
4. Clique em **"Add Another Role"**
5. Adicione: `Cloud Run Admin` e `Service Account User`
6. Clique em **"Save"**

### Passo 5: Testar Deploy Automático

```bash
# Fazer uma mudança pequena
echo "# Deploy test" >> README.md

# Commit e push
git add .
git commit -m "test: trigger cloud build"
git push origin main

# Acompanhar build no console:
# https://console.cloud.google.com/cloud-build/builds
```

---

## 🌐 Configuração de Domínio Customizado

### Passo 1: Verificar Domínio (Primeira vez)

1. No Console GCP, vá em **Cloud Run > Domain Mappings**
2. Clique em **"Add Mapping"**
3. Clique em **"Verify a new domain"**
4. Siga as instruções para verificar propriedade do domínio
   - Adicione um registro TXT no seu DNS com código fornecido
   - Aguarde propagação (~15 min)
   - Clique em **"Verify"**

### Passo 2: Mapear Domínio para Dashboard

1. Vá em **Cloud Run > Services > valorize-dashboard**
2. Clique na aba **"Manage Custom Domains"**
3. Clique em **"Add Mapping"**
4. Selecione o serviço: `valorize-dashboard`
5. Escolha o domínio: `app.valorize.com` (ou subdomínio de sua escolha)
6. Clique em **"Continue"**
7. O GCP fornecerá registros DNS para adicionar:
   ```
   CNAME app.valorize.com -> ghs.googlehosted.com
   ```
8. Adicione no seu provedor de DNS (ex: Cloudflare, GoDaddy, etc.)
9. Aguarde propagação DNS (~1 hora)
10. O certificado SSL será provisionado automaticamente

### Passo 3: Mapear Domínio para Landing

Repita o processo acima para `valorize-landing` com domínio `www.valorize.com` ou `valorize.com`

---

## 📊 Monitoramento e Logs

### Ver Logs do Cloud Run

```bash
# Logs do dashboard
gcloud run services logs read valorize-dashboard --region us-central1 --limit 100

# Logs em tempo real (tail)
gcloud run services logs tail valorize-dashboard --region us-central1

# Logs da landing
gcloud run services logs read valorize-landing --region us-central1 --limit 100
```

### Console Web

1. Vá em **Cloud Run > Services > [seu-servico]**
2. Clique na aba **"Logs"**
3. Use filtros para depurar problemas

### Métricas

1. Vá em **Cloud Run > Services > [seu-servico]**
2. Clique na aba **"Metrics"**
3. Veja:
   - Request count
   - Request latency
   - Container CPU utilization
   - Container memory utilization
   - Instance count

---

## 🔧 Troubleshooting

### Problema: Build falha com "out of memory"

**Solução**: Aumentar recursos da máquina de build no `cloudbuild.yaml`:

```yaml
options:
  machineType: 'E2_HIGHCPU_8'  # ou N1_HIGHCPU_32 para builds pesados
```

### Problema: Deploy falha com "Permission denied"

**Solução**: Verificar permissões do Cloud Build:

```bash
PROJECT_NUMBER=$(gcloud projects describe $(gcloud config get-value project) --format='value(projectNumber)')

gcloud projects add-iam-policy-binding $(gcloud config get-value project) \
  --member=serviceAccount:$PROJECT_NUMBER@cloudbuild.gserviceaccount.com \
  --role=roles/run.admin

gcloud projects add-iam-policy-binding $(gcloud config get-value project) \
  --member=serviceAccount:$PROJECT_NUMBER@cloudbuild.gserviceaccount.com \
  --role=roles/iam.serviceAccountUser
```

### Problema: Container crasha ao iniciar

**Solução**: Verificar logs e healthcheck:

```bash
# Ver logs de erro
gcloud run services logs read valorize-dashboard --region us-central1 --limit 50

# Testar localmente
docker build -f apps/dashboard/Dockerfile -t test .
docker run -p 8080:8080 test
curl http://localhost:8080/health
```

### Problema: Variáveis de ambiente não funcionam

**Solução**: Verificar se estão definidas corretamente:

```bash
# Ver variáveis configuradas
gcloud run services describe valorize-dashboard --region us-central1 --format 'value(spec.template.spec.containers[0].env)'

# Atualizar variáveis
gcloud run services update valorize-dashboard \
  --region us-central1 \
  --set-env-vars VITE_API_BASE_URL=https://nova-api.com
```

### Problema: DNS não resolve após adicionar domínio

**Solução**:

1. Verificar se registros DNS estão corretos:
   ```bash
   dig app.valorize.com CNAME
   ```
2. Aguardar propagação (pode levar até 48h, geralmente 1-2h)
3. Limpar cache DNS local:
   ```bash
   sudo dscacheutil -flushcache  # macOS
   ```

---

## 💰 Custos Estimados

Cloud Run cobra apenas pelo uso efetivo:

- **Dashboard**:
  - Estimativa: $5-10/mês para 10k requests/dia
  - Free tier: 2 milhões de requests/mês
  
- **Landing**:
  - Estimativa: $2-5/mês (consumo menor)

**Total estimado**: $7-15/mês (muito provavelmente dentro do free tier)

---

## 🎯 Próximos Passos

Após deploy bem-sucedido:

1. ✅ Configurar alertas de uptime no Cloud Monitoring
2. ✅ Configurar backup de logs no Cloud Storage
3. ✅ Implementar CDN (Cloud CDN) para assets estáticos
4. ✅ Configurar autoscaling avançado se necessário
5. ✅ Implementar Blue-Green deployment para zero downtime

---

## 📚 Recursos Adicionais

- [Documentação Cloud Run](https://cloud.google.com/run/docs)
- [Cloud Build Quickstart](https://cloud.google.com/build/docs/quickstart-build)
- [Container Registry Best Practices](https://cloud.google.com/container-registry/docs/best-practices)
- [Cloud Run Pricing](https://cloud.google.com/run/pricing)

---

## 🆘 Suporte

Se encontrar problemas:

1. Verifique os logs: `gcloud run services logs read valorize-dashboard --region us-central1`
2. Consulte este guia na seção [Troubleshooting](#troubleshooting)
3. Verifique o status do GCP: [status.cloud.google.com](https://status.cloud.google.com)
