# 🚀 Deploy - Google Cloud Run

Guia completo para fazer deploy do Valorize UI no Google Cloud Run.

---

## 📋 Visão Geral

Este projeto possui **2 apps independentes**:

| App | Tech Stack | Dockerfile | Script |
|-----|------------|------------|--------|
| **Dashboard** | React 19 + Vite + Nginx | `apps/dashboard/Dockerfile` | `./scripts/deploy-dashboard.sh` |
| **Landing** | Astro SSG + Nginx | `apps/landing/Dockerfile` | `./scripts/deploy-landing.sh` |

Ambos rodam na porta **8080** e usam **multi-stage builds** para otimização.

---

## ⚡ Início Rápido

**Já tem Docker e gcloud instalados?**

```bash
# Configure o projeto
gcloud config set project SEU-PROJECT-ID

# Deploy dashboard
./scripts/deploy-dashboard.sh

# Deploy landing
./scripts/deploy-landing.sh
```

👉 **Primeira vez?** Veja [`quick-start.md`](./quick-start.md)

---

## 🛠️ Configuração Inicial (Primeira Vez)

### 1. Instalar Ferramentas

```bash
# macOS
brew install --cask google-cloud-sdk docker

# Linux
# Google Cloud SDK: https://cloud.google.com/sdk/docs/install
# Docker: https://docs.docker.com/engine/install/
```

### 2. Autenticação

```bash
# Login no GCP
gcloud auth login

# Configurar projeto (substitua pelo seu project ID)
gcloud config set project valorize-475221

# Autenticar Docker com GCR
gcloud auth configure-docker
```

### 3. Ativar APIs

```bash
gcloud services enable \
  containerregistry.googleapis.com \
  run.googleapis.com \
  cloudbuild.googleapis.com
```

---

## 📦 Deploy Manual

### Dashboard

```bash
# Opção 1: Script automatizado (recomendado)
./scripts/deploy-dashboard.sh

# Opção 2: Comandos manuais
export PROJECT_ID=$(gcloud config get-value project)

# Build para AMD64 (requisito do Cloud Run)
docker buildx build \
  --platform linux/amd64 \
  -f apps/dashboard/Dockerfile \
  --build-arg VITE_API_BASE_URL=https://api.valorize.com \
  --build-arg VITE_API_URL=https://api.valorize.com \
  -t gcr.io/$PROJECT_ID/valorize-dashboard:latest \
  --push \
  .

# Deploy no Cloud Run
gcloud run deploy valorize-dashboard \
  --image gcr.io/$PROJECT_ID/valorize-dashboard:latest \
  --region us-central1 \
  --platform managed \
  --allow-unauthenticated \
  --port 8080 \
  --memory 512Mi \
  --cpu 1 \
  --set-env-vars VITE_API_BASE_URL=https://api.valorize.com
```

### Landing Page

```bash
# Script automatizado
./scripts/deploy-landing.sh

# Ou manualmente (similar ao dashboard)
docker buildx build \
  --platform linux/amd64 \
  -f apps/landing/Dockerfile \
  --build-arg PUBLIC_SITE_URL=https://valorize.com \
  -t gcr.io/$PROJECT_ID/valorize-landing:latest \
  --push \
  .

gcloud run deploy valorize-landing \
  --image gcr.io/$PROJECT_ID/valorize-landing:latest \
  --region us-central1 \
  --platform managed \
  --allow-unauthenticated \
  --port 8080 \
  --memory 256Mi
```

---

## 🤖 Deploy Automático (CI/CD)

Configure deploy automático via GitHub Actions + Cloud Build.

### Passo 1: Configurar Permissões

```bash
# Execute o script de setup
./scripts/setup-cicd.sh
```

Este script:
- ✅ Ativa APIs necessárias
- ✅ Configura permissões do Cloud Build
- ✅ Mostra instruções para criar triggers

### Passo 2: Criar Triggers no Console

Acesse: [Cloud Build Triggers](https://console.cloud.google.com/cloud-build/triggers)

#### Trigger 1: Dashboard

- **Name:** `deploy-dashboard`
- **Event:** Push to branch
- **Branch:** `^main$`
- **Build configuration:** Cloud Build file
- **Location:** `/cloudbuild-dashboard.yaml`
- **Included files:** `apps/dashboard/**`
- **Substitution variables:**
  - `_REGION` = `us-central1`
  - `_VITE_API_BASE_URL` = `https://api.valorize.com`
  - `_VITE_API_URL` = `https://api.valorize.com`

#### Trigger 2: Landing

- **Name:** `deploy-landing`
- **Event:** Push to branch
- **Branch:** `^main$`
- **Build configuration:** `/cloudbuild-landing.yaml`
- **Included files:** `apps/landing/**`
- **Substitution variables:**
  - `_REGION` = `us-central1`
  - `_PUBLIC_SITE_URL` = `https://valorize.com`

### Passo 3: Primeiro Deploy Manual

Antes de ativar os triggers, faça o primeiro deploy manual:

```bash
./scripts/deploy-dashboard.sh
./scripts/deploy-landing.sh
```

### Passo 4: Testar CI/CD

```bash
# Faça uma mudança em qualquer arquivo dentro de apps/dashboard/
echo "// test" >> apps/dashboard/src/App.tsx

# Commit e push
git add .
git commit -m "test: trigger CI/CD"
git push origin main

# Acompanhe o build
# https://console.cloud.google.com/cloud-build/builds
```

---

## 🔧 Variáveis de Ambiente

### Dashboard

| Variável | Descrição | Padrão |
|----------|-----------|--------|
| `VITE_API_BASE_URL` | URL base da API | `https://api.valorize.com` |
| `VITE_API_URL` | URL da API (proxy) | `https://api.valorize.com` |
| `REGION` | Região do Cloud Run | `us-central1` |

### Landing

| Variável | Descrição | Padrão |
|----------|-----------|--------|
| `PUBLIC_SITE_URL` | URL pública do site | `https://valorize.com` |
| `REGION` | Região do Cloud Run | `us-central1` |

### Regiões Disponíveis

- `us-central1` - Iowa, USA (recomendada)
- `us-east1` - Carolina do Sul, USA
- `southamerica-east1` - São Paulo, Brasil
- `europe-west1` - Bélgica
- `asia-east1` - Taiwan

[Lista completa](https://cloud.google.com/run/docs/locations)

---

## 🔄 Atualizar Deploy Existente

### Atualizar Código

```bash
# Faça suas mudanças e rode o script novamente
./scripts/deploy-dashboard.sh
# ou
./scripts/deploy-landing.sh
```

### Atualizar Variáveis de Ambiente

```bash
# Via CLI
gcloud run services update valorize-dashboard \
  --region us-central1 \
  --set-env-vars VITE_API_BASE_URL=https://nova-api.com

# Via Console
# https://console.cloud.google.com/run
# Selecione o serviço > Edit & Deploy New Revision > Variables
```

### Rollback para Versão Anterior

```bash
# Listar revisões
gcloud run revisions list --service valorize-dashboard --region us-central1

# Fazer rollback
gcloud run services update-traffic valorize-dashboard \
  --region us-central1 \
  --to-revisions REVISION-NAME=100
```

---

## 🗑️ Limpar Recursos

```bash
# Deletar serviço
gcloud run services delete valorize-dashboard --region us-central1
gcloud run services delete valorize-landing --region us-central1

# Deletar imagens antigas
gcloud container images list-tags gcr.io/$PROJECT_ID/valorize-dashboard
gcloud container images delete gcr.io/$PROJECT_ID/valorize-dashboard:TAG
```

---

## 📊 Monitoramento

### Ver Logs

```bash
# Via CLI
gcloud run services logs read valorize-dashboard --region us-central1

# Via Console
# https://console.cloud.google.com/run
# Selecione o serviço > Logs
```

### Métricas e Alertas

Acesse: [Cloud Run Console](https://console.cloud.google.com/run)
- Requisições/segundo
- Latência
- Erros
- Uso de memória/CPU

---

## 🔒 Segurança

### Autenticação (Opcional)

Por padrão, os serviços são públicos (`--allow-unauthenticated`). Para restringir:

```bash
gcloud run services update valorize-dashboard \
  --region us-central1 \
  --no-allow-unauthenticated
```

### Domínio Customizado

```bash
# Mapear domínio
gcloud run domain-mappings create \
  --service valorize-dashboard \
  --domain dashboard.valorize.com \
  --region us-central1

# Configurar DNS (adicione os registros mostrados no comando acima)
```

---

## 💰 Custos

Cloud Run cobra apenas pelo tempo de execução:

- **Tier Gratuito:** 2 milhões de requisições/mês
- **Preço:** ~$0.40 por milhão de requisições
- **Sem tráfego = $0** (min-instances=0)

[Calculadora de preços](https://cloud.google.com/products/calculator)

---

## ❓ Problemas Comuns

Veja [`troubleshooting.md`](./troubleshooting.md) para soluções detalhadas.

**Problemas frequentes:**

- ❌ Erro "gcloud command not found"
- ❌ Erro "Docker is not running"
- ❌ Erro "unauthorized: You don't have the needed permissions"
- ❌ Build falha no Cloud Build
- ❌ App não carrega assets (404)

---

## 📚 Referências

- [Documentação Cloud Run](https://cloud.google.com/run/docs)
- [Guia Docker Multi-Stage Builds](https://docs.docker.com/build/building/multi-stage/)
- [Vite Production Build](https://vitejs.dev/guide/build.html)
- [Nginx Best Practices](https://www.nginx.com/blog/nginx-best-practices/)

---

## 🆘 Suporte

- **Issues:** [GitHub Issues](https://github.com/Gabriel-Fachini/valorize-ui/issues)
- **Docs GCP:** [cloud.google.com/run/docs](https://cloud.google.com/run/docs)
- **Stack Overflow:** Tag `google-cloud-run`
