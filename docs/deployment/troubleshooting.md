# 🔧 Troubleshooting - Deploy Google Cloud Run

Soluções para problemas comuns durante o deploy.

---

## 🚨 Problemas de Instalação

### ❌ Erro: "gcloud command not found"

**Causa:** Google Cloud SDK não instalado ou não está no PATH.

**Solução:**

```bash
# macOS
brew install --cask google-cloud-sdk

# Adicionar ao PATH (se necessário)
echo 'source /usr/local/Caskroom/google-cloud-sdk/latest/google-cloud-sdk/path.zsh.inc' >> ~/.zshrc
source ~/.zshrc

# Verificar
gcloud --version
```

### ❌ Erro: "Docker is not running"

**Causa:** Docker Desktop não está rodando.

**Solução:**

1. Abra o Docker Desktop
2. Aguarde até o ícone ficar verde
3. Verifique: `docker info`

### ❌ Erro: "docker buildx not found"

**Causa:** Buildx não está instalado ou habilitado.

**Solução:**

```bash
# Verificar se buildx está disponível
docker buildx version

# Se não estiver, instalar (já vem com Docker Desktop moderno)
# Ou habilitar:
docker buildx create --use
```

---

## 🔐 Problemas de Autenticação

### ❌ Erro: "No GCP project configured"

**Causa:** Nenhum projeto configurado no gcloud.

**Solução:**

```bash
# Listar projetos disponíveis
gcloud projects list

# Configurar projeto
gcloud config set project SEU-PROJECT-ID

# Verificar
gcloud config get-value project
```

### ❌ Erro: "unauthorized: You don't have the needed permissions"

**Causa:** Docker não está autenticado com Google Container Registry.

**Solução:**

```bash
# Fazer login novamente
gcloud auth login

# Configurar Docker
gcloud auth configure-docker

# Verificar credenciais
gcloud auth list
```

### ❌ Erro: "Permission denied" ao executar scripts

**Causa:** Scripts não têm permissão de execução.

**Solução:**

```bash
chmod +x scripts/deploy-dashboard.sh
chmod +x scripts/deploy-landing.sh
chmod +x scripts/setup-cicd.sh
```

---

## 🐳 Problemas de Build

### ❌ Erro: "failed to solve with frontend dockerfile.v0"

**Causa:** Erro no Dockerfile ou dependências não encontradas.

**Solução:**

```bash
# 1. Verificar se todos os arquivos existem
ls -la apps/dashboard/Dockerfile
ls -la apps/dashboard/nginx.conf

# 2. Limpar cache do Docker
docker buildx prune -af

# 3. Tentar novamente
./scripts/deploy-dashboard.sh
```

### ❌ Build falha com "SWC segmentation fault"

**Causa:** SWC tem problemas em Alpine Linux (ARM/AMD64).

**Solução:** O projeto já usa `vite.config.docker.ts` com Babel. Se ainda ocorrer:

```bash
# Edite apps/dashboard/Dockerfile
# Certifique-se que está usando node:22-slim no builder stage (não Alpine)
```

### ❌ Erro: "exec format error" no Cloud Run

**Causa:** Imagem foi buildada para arquitetura errada (ARM em vez de AMD64).

**Solução:**

```bash
# Sempre use --platform linux/amd64
docker buildx build \
  --platform linux/amd64 \
  -f apps/dashboard/Dockerfile \
  -t gcr.io/$PROJECT_ID/valorize-dashboard:latest \
  --push \
  .
```

### ❌ Build muito lento

**Causa:** Download repetido de dependências.

**Solução:**

1. Use multi-stage builds (já implementado)
2. Cache de layers do Docker:

```bash
# Verificar cache
docker buildx du

# Limpar apenas caches não usados
docker buildx prune

# Para builds locais, use cache local
docker buildx build --cache-from=type=local,src=/tmp/docker-cache ...
```

---

## ☁️ Problemas de Deploy

### ❌ Erro: "Service ... not found"

**Causa:** Primeira vez fazendo deploy do serviço.

**Solução:** Normal! O gcloud vai criar o serviço automaticamente. Continue com o deploy.

### ❌ Erro: "RESOURCE_EXHAUSTED" ou "quota exceeded"

**Causa:** Limite de recursos atingido.

**Solução:**

```bash
# Verificar quotas
gcloud compute regions describe us-central1

# Aumentar limites (se necessário)
# Console > IAM & Admin > Quotas
# https://console.cloud.google.com/iam-admin/quotas

# Ou usar região diferente
REGION=southamerica-east1 ./scripts/deploy-dashboard.sh
```

### ❌ Erro: "Cloud Build API has not been used"

**Causa:** APIs não foram ativadas.

**Solução:**

```bash
gcloud services enable \
  cloudbuild.googleapis.com \
  run.googleapis.com \
  containerregistry.googleapis.com
```

### ❌ Deploy funciona mas app não carrega (erro 404 nos assets)

**Causa:** Base path incorreto no Vite.

**Solução:** Já corrigido! Verifique `apps/dashboard/vite.config.ts`:

```typescript
export default defineConfig({
  base: './', // ← Deve estar presente
  // ...
})
```

Se ainda ocorrer:

```bash
# Rebuild e redeploy
pnpm build:dashboard
./scripts/deploy-dashboard.sh
```

---

## 🔥 Problemas de Runtime

### ❌ App carrega mas API não funciona

**Causa:** Variáveis de ambiente incorretas.

**Solução:**

```bash
# Verificar variáveis atuais
gcloud run services describe valorize-dashboard \
  --region us-central1 \
  --format='value(spec.template.spec.containers[0].env)'

# Atualizar
gcloud run services update valorize-dashboard \
  --region us-central1 \
  --set-env-vars VITE_API_BASE_URL=https://api-correta.com
```

### ❌ Erro 502 Bad Gateway

**Causas possíveis:**

1. **App não está escutando na porta 8080**

```bash
# Verificar logs
gcloud run services logs read valorize-dashboard --region us-central1

# Confirme que nginx está na porta 8080 (já configurado)
```

2. **Healthcheck falhando**

```dockerfile
# Verificar Dockerfile (já implementado)
HEALTHCHECK --interval=30s --timeout=3s \
  CMD curl -f http://localhost:8080/ || exit 1
```

3. **Timeout no startup**

```bash
# Aumentar timeout
gcloud run services update valorize-dashboard \
  --region us-central1 \
  --timeout=300
```

### ❌ Performance ruim / app lento

**Soluções:**

```bash
# 1. Aumentar recursos
gcloud run services update valorize-dashboard \
  --region us-central1 \
  --memory 1Gi \
  --cpu 2

# 2. Manter instâncias warm (evita cold start)
gcloud run services update valorize-dashboard \
  --region us-central1 \
  --min-instances 1  # Cuidado: isso gera custo mesmo sem tráfego

# 3. Verificar se assets estão comprimidos
# (já implementado: gzip + brotli)
```

---

## 🤖 Problemas de CI/CD

### ❌ Trigger não dispara automaticamente

**Causas:**

1. **Repository não conectado**

```bash
# Console > Cloud Build > Triggers > Connect Repository
# Autorize GitHub e selecione o repositório
```

2. **Branch filter incorreto**

```yaml
# cloudbuild-dashboard.yaml deve estar em:
# - Repository root
# - Branch: main
# Included files: apps/dashboard/**
```

3. **Permissões faltando**

```bash
# Executar novamente
./scripts/setup-cicd.sh
```

### ❌ Build do Cloud Build falha mas local funciona

**Causa comum:** Variáveis de ambiente faltando.

**Solução:**

1. Verifique as substitution variables no trigger:
   - `_REGION`
   - `_VITE_API_BASE_URL`
   - `_VITE_API_URL` (dashboard)
   - `_PUBLIC_SITE_URL` (landing)

2. Console > Cloud Build > Triggers > [seu-trigger] > Edit

### ❌ Erro: "Service account does not have permission"

**Causa:** Cloud Build service account sem permissões.

**Solução:**

```bash
PROJECT_NUMBER=$(gcloud projects describe $(gcloud config get-value project) --format='value(projectNumber)')
SERVICE_ACCOUNT="$PROJECT_NUMBER@cloudbuild.gserviceaccount.com"

# Adicionar permissões
gcloud projects add-iam-policy-binding $(gcloud config get-value project) \
  --member="serviceAccount:${SERVICE_ACCOUNT}" \
  --role="roles/run.admin"

gcloud projects add-iam-policy-binding $(gcloud config get-value project) \
  --member="serviceAccount:${SERVICE_ACCOUNT}" \
  --role="roles/iam.serviceAccountUser"
```

---

## 🔍 Debug Avançado

### Ver logs em tempo real

```bash
# Dashboard
gcloud run services logs tail valorize-dashboard --region us-central1

# Landing
gcloud run services logs tail valorize-landing --region us-central1
```

### Acessar container localmente

```bash
# Build local
docker buildx build \
  --platform linux/amd64 \
  -f apps/dashboard/Dockerfile \
  --build-arg VITE_API_BASE_URL=http://localhost:3001 \
  -t valorize-dashboard:test \
  --load \
  .

# Rodar localmente
docker run -p 8080:8080 valorize-dashboard:test

# Testar
open http://localhost:8080
```

### Ver detalhes do serviço

```bash
# Informações completas
gcloud run services describe valorize-dashboard \
  --region us-central1 \
  --format yaml

# Ver todas as revisões
gcloud run revisions list \
  --service valorize-dashboard \
  --region us-central1
```

### Verificar tamanho da imagem

```bash
# Listar imagens
gcloud container images list-tags gcr.io/$(gcloud config get-value project)/valorize-dashboard

# Ver tamanho
gcloud container images describe gcr.io/$(gcloud config get-value project)/valorize-dashboard:latest
```

---

## 🆘 Ainda com Problemas?

### Checklist Final

- [ ] Docker está rodando
- [ ] gcloud autenticado (`gcloud auth login`)
- [ ] Projeto configurado (`gcloud config get-value project`)
- [ ] APIs habilitadas
- [ ] Docker autenticado com GCR (`gcloud auth configure-docker`)
- [ ] Build funciona localmente
- [ ] Variáveis de ambiente corretas
- [ ] Arquitetura AMD64 (`--platform linux/amd64`)

### Resetar e Começar do Zero

```bash
# 1. Limpar tudo
docker system prune -af
gcloud run services delete valorize-dashboard --region us-central1 --quiet
gcloud run services delete valorize-landing --region us-central1 --quiet

# 2. Reconfigurar
gcloud auth login
gcloud config set project SEU-PROJECT-ID
gcloud auth configure-docker

# 3. Rodar setup
./scripts/setup-cicd.sh

# 4. Deploy manual
./scripts/deploy-dashboard.sh
./scripts/deploy-landing.sh
```

### Obter Ajuda

- **Logs detalhados:** Adicione `--verbosity=debug` em comandos gcloud
- **Cloud Build logs:** https://console.cloud.google.com/cloud-build/builds
- **Stack Overflow:** Tag `google-cloud-run`
- **GitHub Issues:** [Reporte bugs aqui](https://github.com/Gabriel-Fachini/valorize-ui/issues)

---

## 📚 Referências Úteis

- [Cloud Run Troubleshooting Guide](https://cloud.google.com/run/docs/troubleshooting)
- [Docker Build Troubleshooting](https://docs.docker.com/build/troubleshooting/)
- [gcloud CLI Reference](https://cloud.google.com/sdk/gcloud/reference)
