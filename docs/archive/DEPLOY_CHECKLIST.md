# ✅ Checklist de Deploy no Google Cloud Run

Use este checklist para garantir que todos os passos foram seguidos corretamente.

## 🎯 Pré-Deploy (Fazer uma vez)

### 1. Ferramentas Instaladas

- [ ] Google Cloud SDK instalado (`gcloud --version`)
- [ ] Docker instalado e rodando (`docker --version`)
- [ ] Conta Google Cloud ativa

### 2. Configuração do GCP

- [ ] Projeto criado no Console GCP
- [ ] Project ID anotado (ex: `valorize-ui-123456`)
- [ ] APIs ativadas:
  - [ ] Cloud Run API
  - [ ] Cloud Build API
  - [ ] Container Registry API
  - [ ] Artifact Registry API

### 3. Configuração Local

- [ ] `gcloud auth login` executado
- [ ] `gcloud config set project PROJECT_ID` executado
- [ ] `gcloud config set run/region us-central1` executado
- [ ] `gcloud auth configure-docker` executado

### 4. Arquivos do Projeto

- [ ] `.dockerignore` criado na raiz
- [ ] `apps/dashboard/Dockerfile` criado
- [ ] `apps/dashboard/nginx.conf` criado
- [ ] `apps/landing/Dockerfile` criado
- [ ] `apps/landing/nginx.conf` criado
- [ ] `cloudbuild-dashboard.yaml` criado
- [ ] `cloudbuild-landing.yaml` criado
- [ ] `.env.example` copiado para `.env.production` e preenchido

## 🚀 Deploy Manual (Primeira vez)

### Dashboard

- [ ] Testar build local:
  ```bash
  docker build -f apps/dashboard/Dockerfile -t test-dashboard .
  docker run -p 8080:8080 test-dashboard
  # Testar em http://localhost:8080
  ```
- [ ] Build da imagem:
  ```bash
  docker build -f apps/dashboard/Dockerfile \
    --build-arg VITE_API_BASE_URL=https://api.valorize.com \
    -t gcr.io/PROJECT_ID/valorize-dashboard:latest .
  ```
- [ ] Push para GCR:
  ```bash
  docker push gcr.io/PROJECT_ID/valorize-dashboard:latest
  ```
- [ ] Deploy no Cloud Run:
  ```bash
  gcloud run deploy valorize-dashboard \
    --image gcr.io/PROJECT_ID/valorize-dashboard:latest \
    --region us-central1 \
    --allow-unauthenticated
  ```
- [ ] Verificar URL do serviço
- [ ] Testar aplicação no browser

### Landing Page

- [ ] Testar build local:
  ```bash
  docker build -f apps/landing/Dockerfile -t test-landing .
  docker run -p 8081:8080 test-landing
  # Testar em http://localhost:8081
  ```
- [ ] Build da imagem
- [ ] Push para GCR
- [ ] Deploy no Cloud Run
- [ ] Verificar URL do serviço
- [ ] Testar aplicação no browser

## 🤖 Deploy Automatizado (CI/CD)

### Configuração Cloud Build

- [ ] Repositório conectado ao Cloud Build:
  - [ ] Cloud Build > Triggers > Connect Repository
  - [ ] GitHub autenticado
  - [ ] Repositório `valorize-ui` selecionado

### Trigger Dashboard

- [ ] Trigger criado: `deploy-dashboard`
- [ ] Branch configurado: `^main$`
- [ ] Config file: `/cloudbuild-dashboard.yaml`
- [ ] Substitution variables configuradas:
  - [ ] `_REGION`
  - [ ] `_VITE_API_BASE_URL`
  - [ ] `_VITE_API_URL`

### Trigger Landing

- [ ] Trigger criado: `deploy-landing`
- [ ] Branch configurado: `^main$`
- [ ] Config file: `/cloudbuild-landing.yaml`
- [ ] Substitution variables configuradas:
  - [ ] `_REGION`
  - [ ] `_PUBLIC_SITE_URL`

### Permissões

- [ ] Service account do Cloud Build tem permissões:
  - [ ] Cloud Run Admin
  - [ ] Service Account User
  ```bash
  PROJECT_NUMBER=$(gcloud projects describe $(gcloud config get-value project) --format='value(projectNumber)')
  
  gcloud projects add-iam-policy-binding $(gcloud config get-value project) \
    --member=serviceAccount:$PROJECT_NUMBER@cloudbuild.gserviceaccount.com \
    --role=roles/run.admin
  
  gcloud projects add-iam-policy-binding $(gcloud config get-value project) \
    --member=serviceAccount:$PROJECT_NUMBER@cloudbuild.gserviceaccount.com \
    --role=roles/iam.serviceAccountUser
  ```

### Teste de Deploy Automático

- [ ] Push de teste realizado
- [ ] Build iniciou automaticamente no Cloud Build
- [ ] Build concluído com sucesso
- [ ] Serviço atualizado no Cloud Run
- [ ] Aplicação funcionando corretamente

## 🌐 Domínio Customizado (Opcional)

### Verificação de Domínio

- [ ] Domínio verificado no GCP
- [ ] Registro TXT adicionado no DNS
- [ ] Verificação confirmada

### Mapeamento Dashboard

- [ ] Domínio mapeado (ex: `app.valorize.com`)
- [ ] Registro CNAME adicionado no DNS:
  ```
  app.valorize.com CNAME ghs.googlehosted.com
  ```
- [ ] Certificado SSL provisionado automaticamente
- [ ] Domínio acessível e funcional

### Mapeamento Landing

- [ ] Domínio mapeado (ex: `www.valorize.com` ou `valorize.com`)
- [ ] Registro CNAME adicionado no DNS
- [ ] Certificado SSL provisionado
- [ ] Domínio acessível e funcional

## 📊 Pós-Deploy

### Monitoramento

- [ ] Logs verificados:
  ```bash
  gcloud run services logs read valorize-dashboard --region us-central1
  ```
- [ ] Métricas verificadas no Console (CPU, Memory, Requests)
- [ ] Health check funcionando

### Performance

- [ ] Tempo de cold start aceitável (< 3s)
- [ ] Latência de resposta aceitável (< 500ms)
- [ ] Assets estáticos servidos corretamente
- [ ] Gzip/Brotli compression funcionando

### SEO (Landing Page)

- [ ] Sitemap acessível
- [ ] Robots.txt configurado
- [ ] Meta tags verificadas
- [ ] Open Graph tags verificadas

### Segurança

- [ ] HTTPS funcionando
- [ ] Security headers configurados (verificar nginx.conf)
- [ ] CORS configurado corretamente
- [ ] Secrets não expostos em logs

## 🔄 Manutenção

### Updates Regulares

- [ ] Dependências atualizadas mensalmente:
  ```bash
  pnpm update --latest
  ```
- [ ] Imagens Docker atualizadas (base: node:22-alpine)
- [ ] Logs monitorados semanalmente

### Backups

- [ ] Logs exportados para Cloud Storage (opcional)
- [ ] Configuração versionada no Git
- [ ] Variáveis de ambiente documentadas

### Custos

- [ ] Billing alerts configurados
- [ ] Uso mensal monitorado
- [ ] Otimizações aplicadas se necessário

## 📝 Notas

- **Cold start**: Com `min-instances=0`, primeira requisição pode levar 2-3s
  - Considere `min-instances=1` para aplicações críticas (custo adicional)
  
- **Recursos**: Ajuste `memory` e `cpu` conforme necessidade
  - Dashboard: 512Mi / 1 CPU é suficiente para maioria dos casos
  - Landing: 256Mi / 1 CPU é suficiente (apenas servir arquivos estáticos)

- **Auto-scaling**: Cloud Run escala automaticamente entre min/max instances
  - Cada instância pode lidar com até 80 requisições simultâneas (padrão)

- **Custos**: Monitore em Cloud Console > Billing
  - Free tier cobre a maioria dos projetos pequenos
  - Pay-as-you-go após free tier

---

## 🆘 Problemas Comuns

### Build falha

- [ ] Verificar logs no Cloud Build
- [ ] Testar build local
- [ ] Verificar Dockerfile syntax

### Deploy falha

- [ ] Verificar permissões do Cloud Build
- [ ] Verificar variáveis de ambiente
- [ ] Verificar se APIs estão ativadas

### Container crasha

- [ ] Verificar logs: `gcloud run services logs read SERVICE_NAME`
- [ ] Verificar port 8080 exposto
- [ ] Verificar health check endpoint

### Domínio não resolve

- [ ] Aguardar propagação DNS (até 48h)
- [ ] Verificar registros DNS com `dig DOMAIN`
- [ ] Limpar cache DNS local

---

**📖 Documentação completa**: [`docs/DEPLOY_GOOGLE_CLOUD_RUN.md`](../docs/DEPLOY_GOOGLE_CLOUD_RUN.md)

**🛠️ Scripts auxiliares**: [`scripts/README.md`](../scripts/README.md)
