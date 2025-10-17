# 🚀 Deploy no Google Cloud Run - Guia Completo

> **Status do Deploy:** ✅ Dashboard está rodando em produção!  
> **Tempo estimado:** 15-30 minutos (primeira vez)

---

## 📋 Sumário

1. [Visão Geral](#visão-geral)
2. [Antes de Começar](#antes-de-começar)
3. [Método 1: Deploy Rápido (CLI)](#método-1-deploy-rápido-cli)
4. [Método 2: Deploy via Console (GUI)](#método-2-deploy-via-console-gui)
5. [Método 3: Deploy Automático (CI/CD)](#método-3-deploy-automático-cicd)
6. [Atualizando o Deploy](#atualizando-o-deploy)
7. [Troubleshooting](#troubleshooting)

---

## Visão Geral

Este projeto possui **2 aplicações** que podem ser deployadas independentemente:

| Aplicação | Descrição | Porta | Build |
|-----------|-----------|-------|-------|
| **Dashboard** | App React com Vite | 8080 | `apps/dashboard/` |
| **Landing** | Site Astro estático | 8080 | `apps/landing/` |

Ambas são servidas via **Nginx** em containers Docker otimizados.

---

## Antes de Começar

### 1️⃣ Ferramentas Necessárias

```bash
# Google Cloud SDK
brew install --cask google-cloud-sdk

# Docker Desktop
brew install --cask docker

# Verificar instalações
gcloud --version
docker --version
docker buildx version  # Necessário para builds
```

### 2️⃣ Configuração Inicial

```bash
# 1. Login no Google Cloud
gcloud auth login

# 2. Configurar projeto
gcloud config set project valorize-475221

# 3. Habilitar APIs necessárias
gcloud services enable \
  containerregistry.googleapis.com \
  run.googleapis.com \
  cloudbuild.googleapis.com

# 4. Configurar Docker com GCR
gcloud auth configure-docker gcr.io

# 5. Verificar configuração
export PROJECT_ID=$(gcloud config get-value project)
echo "Project ID: $PROJECT_ID"
```

### 3️⃣ Importante: Arquitetura AMD64

> ⚠️ **Se você usa Mac Apple Silicon (M1/M2/M3):** O Cloud Run requer imagens AMD64. Todos os comandos já estão configurados com `--platform linux/amd64`.

---

## Método 1: Deploy Rápido (CLI)

### Dashboard

```bash
# 1. Navegar para o projeto
cd /caminho/para/valorize-ui

# 2. Executar script de deploy
./scripts/deploy-dashboard.sh

# Ou manualmente:
export PROJECT_ID=$(gcloud config get-value project)

# Build e push da imagem (AMD64 para Cloud Run)
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
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 8080 \
  --memory 512Mi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 10
```

### Landing Page

```bash
# Executar script
./scripts/deploy-landing.sh

# Ou manualmente:
docker buildx build \
  --platform linux/amd64 \
  -f apps/landing/Dockerfile \
  --build-arg PUBLIC_SITE_URL=https://valorize.com \
  -t gcr.io/$PROJECT_ID/valorize-landing:latest \
  --push \
  .

gcloud run deploy valorize-landing \
  --image gcr.io/$PROJECT_ID/valorize-landing:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 8080 \
  --memory 256Mi \
  --cpu 1
```

### ✅ Sucesso!

Após o deploy, o Cloud Run exibirá a URL pública:

```
Service URL: https://valorize-dashboard-xxxxx-uc.a.run.app
```

---

## Método 2: Deploy via Console (GUI)

### Passo 1: Build da Imagem Localmente

```bash
# Definir variáveis
export PROJECT_ID=$(gcloud config get-value project)

# Build da imagem (AMD64)
docker buildx build \
  --platform linux/amd64 \
  -f apps/dashboard/Dockerfile \
  --build-arg VITE_API_BASE_URL=https://api.valorize.com \
  --build-arg VITE_API_URL=https://api.valorize.com \
  -t gcr.io/$PROJECT_ID/valorize-dashboard:v1 \
  --push \
  .
```

### Passo 2: Deploy via Console

1. **Acesse:** https://console.cloud.google.com/run
2. **Clique em:** "Criar Serviço"
3. **Configurar:**
   - **Container Image URL:** `gcr.io/valorize-475221/valorize-dashboard:v1`
   - **Service name:** `valorize-dashboard`
   - **Region:** `us-central1`
   - **Authentication:** "Allow unauthenticated invocations"
   - **Container port:** `8080`
   - **Memory:** `512 MiB`
   - **CPU:** `1`
   - **Min instances:** `0`
   - **Max instances:** `10`
4. **Clique em:** "Criar"

### Passo 3: Aguardar Deploy

O Cloud Run levará 1-2 minutos para fazer o deploy. Você verá a URL pública ao finalizar.

---

## Método 3: Deploy Automático (CI/CD)

### Configuração do CI/CD (Uma vez)

```bash
# 1. Conectar repositório GitHub
# Acesse: https://console.cloud.google.com/cloud-build/triggers

# 2. Criar Trigger para Dashboard
# - Nome: deploy-dashboard
# - Event: Push to branch
# - Branch: ^main$
# - Build configuration: Cloud Build configuration file
# - Location: /cloudbuild-dashboard.yaml

# 3. Criar Trigger para Landing
# - Nome: deploy-landing
# - Event: Push to branch
# - Branch: ^main$
# - Build configuration: Cloud Build configuration file
# - Location: /cloudbuild-landing.yaml

# 4. Configurar variáveis (Substitution variables)
# Dashboard:
#   _VITE_API_BASE_URL: https://api.valorize.com
#   _VITE_API_URL: https://api.valorize.com
#   _REGION: us-central1
#
# Landing:
#   _PUBLIC_SITE_URL: https://valorize.com
#   _REGION: us-central1
```

### Como Funciona

Após a configuração, **cada push para `main`** vai:

1. ✅ Fazer build da imagem Docker (AMD64)
2. ✅ Enviar para Google Container Registry
3. ✅ Fazer deploy no Cloud Run
4. ✅ Enviar notificação (opcional)

```bash
# Fazer deploy agora:
git add .
git commit -m "feat: nova funcionalidade"
git push origin main

# Acompanhar build:
# https://console.cloud.google.com/cloud-build/builds
```

---

## Atualizando o Deploy

### Atualizar via CLI

```bash
# 1. Build nova versão
docker buildx build \
  --platform linux/amd64 \
  -f apps/dashboard/Dockerfile \
  -t gcr.io/$PROJECT_ID/valorize-dashboard:v2 \
  --push \
  .

# 2. Deploy nova versão
gcloud run deploy valorize-dashboard \
  --image gcr.io/$PROJECT_ID/valorize-dashboard:v2 \
  --region us-central1
```

### Atualizar via Console

1. Acesse o serviço: https://console.cloud.google.com/run
2. Clique em "Editar e implantar nova revisão"
3. Altere a imagem para a nova versão
4. Clique em "Implantar"

### Rollback (Voltar Versão)

```bash
# Listar revisões
gcloud run revisions list --service valorize-dashboard --region us-central1

# Voltar para revisão anterior
gcloud run services update-traffic valorize-dashboard \
  --to-revisions valorize-dashboard-00001-abc=100 \
  --region us-central1
```

---

## Troubleshooting

### 🔴 Erro: "Container manifest must support amd64/linux"

**Causa:** Imagem construída para ARM64 (Mac Apple Silicon) ao invés de AMD64.

**Solução:** Adicionar `--platform linux/amd64` no build:

```bash
docker buildx build --platform linux/amd64 -f apps/dashboard/Dockerfile -t image:tag --push .
```

### 🔴 Erro: "SIGSEGV (Segmentation fault)" durante build

**Causa:** SWC (compilador Rust) não funciona com Alpine Linux (musl libc).

**Solução:** O Dockerfile já usa `node:22-slim` (Debian) no builder stage. Se o erro persistir:

```bash
# Limpar cache do Docker
docker buildx prune -af

# Rebuild do zero
docker buildx build --no-cache --platform linux/amd64 -f apps/dashboard/Dockerfile -t image:tag --push .
```

### 🔴 Erro: "docker: unknown command: docker buildx"

**Causa:** Docker buildx não está instalado.

**Solução:**

```bash
# Verificar versão do Docker (precisa 19.03+)
docker --version

# Criar builder
docker buildx create --name valorize-builder --use --bootstrap

# Verificar
docker buildx ls
```

### 🔴 Erro: "Failed to push image to gcr.io"

**Causa:** Docker não está autenticado com GCR.

**Solução:**

```bash
# Reconfigurar autenticação
gcloud auth login
gcloud auth configure-docker gcr.io

# Tentar push novamente
docker push gcr.io/$PROJECT_ID/valorize-dashboard:latest
```

### 🔴 Deploy muito lento ou falhando

**Possíveis causas:**

1. **Memória insuficiente:** Aumentar para 512Mi ou 1Gi
2. **Cold start:** Configurar min-instances > 0
3. **Timeout:** Aumentar request timeout (padrão 300s)

**Solução:**

```bash
gcloud run services update valorize-dashboard \
  --memory 1Gi \
  --min-instances 1 \
  --timeout 600 \
  --region us-central1
```

### 🔴 Build local funciona mas falha no Cloud Build

**Causa:** Cloud Build pode ter configurações diferentes.

**Solução:**

1. Verificar `cloudbuild-dashboard.yaml` tem `--platform linux/amd64`
2. Verificar substitution variables estão corretas
3. Verificar service account tem permissões necessárias

```bash
# Ver logs do Cloud Build
gcloud builds list --limit 5
gcloud builds log <BUILD_ID>
```

### 🔴 App não carrega / Página em branco

**Possíveis causas:**

1. **Variáveis de ambiente incorretas**
2. **Porta errada** (deve ser 8080)
3. **Nginx não configurado para SPA**

**Solução:**

```bash
# 1. Verificar logs
gcloud run services logs read valorize-dashboard --region us-central1 --limit 50

# 2. Verificar variáveis
gcloud run services describe valorize-dashboard --region us-central1 --format=json | grep -A 10 "env"

# 3. Testar localmente
docker run -p 8080:8080 gcr.io/$PROJECT_ID/valorize-dashboard:latest
curl http://localhost:8080
```

### 🔴 Erro 403 Forbidden

**Causa:** Service account não tem permissões ou serviço requer autenticação.

**Solução:**

```bash
# Permitir acesso público
gcloud run services add-iam-policy-binding valorize-dashboard \
  --region us-central1 \
  --member "allUsers" \
  --role "roles/run.invoker"
```

### 🔴 Build muito lento (>10 minutos)

**Otimizações:**

```bash
# 1. Usar cache do Docker
docker buildx build --cache-from gcr.io/$PROJECT_ID/valorize-dashboard:latest ...

# 2. Reduzir tamanho do contexto (verificar .dockerignore)
# 3. Multi-stage build já otimizado nos Dockerfiles
```

---

## 📊 Recursos e Custos

### Configurações Recomendadas

| Ambiente | Memory | CPU | Min Instances | Max Instances | Custo/mês* |
|----------|--------|-----|---------------|---------------|------------|
| Dev/Test | 256Mi | 1 | 0 | 5 | ~$0-5 |
| Staging | 512Mi | 1 | 0 | 10 | ~$5-20 |
| Production | 512Mi-1Gi | 1-2 | 1 | 50 | ~$20-100 |

*Estimativa para ~10k requests/mês

### Monitoramento

**Ver métricas:**
```bash
# Logs em tempo real
gcloud run services logs tail valorize-dashboard --region us-central1

# Métricas no console
# https://console.cloud.google.com/run/detail/us-central1/valorize-dashboard/metrics
```

---

## 🎯 Checklist Rápido

- [ ] Google Cloud SDK instalado e configurado
- [ ] Docker Desktop rodando
- [ ] Buildx instalado e configurado (`docker buildx ls`)
- [ ] Projeto GCP criado e selecionado
- [ ] APIs habilitadas (Cloud Run, Container Registry, Cloud Build)
- [ ] Docker autenticado com GCR (`gcloud auth configure-docker gcr.io`)
- [ ] Variáveis de ambiente definidas (VITE_API_BASE_URL, etc)
- [ ] Build local testado e funcionando
- [ ] Imagem enviada para GCR
- [ ] Serviço deployado no Cloud Run
- [ ] URL pública acessível e funcionando

---

## 📚 Arquivos Importantes

```
valorize-ui/
├── apps/
│   ├── dashboard/
│   │   ├── Dockerfile          # Build config do Dashboard
│   │   └── nginx.conf          # Configuração Nginx
│   └── landing/
│       ├── Dockerfile          # Build config da Landing
│       └── nginx.conf          # Configuração Nginx
├── scripts/
│   ├── deploy-dashboard.sh    # Deploy automatizado Dashboard
│   └── deploy-landing.sh      # Deploy automatizado Landing
├── cloudbuild-dashboard.yaml  # CI/CD Dashboard
├── cloudbuild-landing.yaml    # CI/CD Landing
└── .dockerignore              # Arquivos ignorados no build
```

---

## 🆘 Precisa de Ajuda?

1. **Logs do Cloud Run:**
   ```bash
   gcloud run services logs read valorize-dashboard --region us-central1 --limit 100
   ```

2. **Status do serviço:**
   ```bash
   gcloud run services describe valorize-dashboard --region us-central1
   ```

3. **Listar imagens no GCR:**
   ```bash
   gcloud container images list --repository=gcr.io/$PROJECT_ID
   ```

4. **Testar localmente:**
   ```bash
   docker run -p 8080:8080 gcr.io/$PROJECT_ID/valorize-dashboard:latest
   open http://localhost:8080
   ```

---

**✨ Sucesso!** Seu app está rodando no Cloud Run! 🎉

Para configurações avançadas, consulte a [documentação oficial do Cloud Run](https://cloud.google.com/run/docs).
