# Arquitetura AMD64 vs ARM64 no Cloud Run

## 🎯 Problema

Ao fazer deploy de imagens Docker construídas em **Mac com Apple Silicon (ARM64)** para o **Google Cloud Run**, você pode encontrar este erro:

```
Cloud Run does not support image 'gcr.io/valorize-475221/valorize-dashboard@sha256:...'
Container manifest type 'application/vnd.oci.image.index.v1+json' must support amd64/linux.
```

## 🔍 Causa Raiz

- **Seu Mac**: Usa processador ARM64 (Apple Silicon M1/M2/M3)
- **Cloud Run**: Requer imagens Linux **AMD64** (x86_64)
- **Docker buildx**: Por padrão, cria imagens **multi-arquitetura** incluindo ARM64
- **Resultado**: Cloud Run rejeita a imagem porque não encontra o manifest AMD64

## ✅ Solução

### Opção 1: Build com `--platform` (RECOMENDADO)

Use `docker buildx build` com a flag `--platform linux/amd64`:

```bash
docker buildx build \
  --platform linux/amd64 \
  -f apps/dashboard/Dockerfile \
  --build-arg VITE_API_BASE_URL=https://api.valorize.com \
  -t gcr.io/$PROJECT_ID/valorize-dashboard:v1 \
  --push \
  .
```

**Flags importantes:**
- `--platform linux/amd64`: Força build apenas para AMD64
- `--push`: Envia diretamente para o registry (mais rápido)
- `--load`: Use ao invés de `--push` se quiser testar localmente primeiro

### Opção 2: Build e Push Separados

Se preferir separar as etapas:

```bash
# Build para AMD64
docker buildx build \
  --platform linux/amd64 \
  -f apps/dashboard/Dockerfile \
  -t gcr.io/$PROJECT_ID/valorize-dashboard:v1 \
  --load \
  .

# Push para GCR
docker push gcr.io/$PROJECT_ID/valorize-dashboard:v1
```

## 📊 Comparação de Abordagens

| Abordagem | Vantagem | Desvantagem |
|-----------|----------|-------------|
| `docker build` (padrão) | Simples | Cria multi-arch em Apple Silicon |
| `docker buildx --platform` | Cloud Run compatível | Requer buildx configurado |
| `docker buildx --push` | Mais rápido (1 comando) | Não permite teste local |
| `docker buildx --load` | Permite teste local | Requer push separado |

## 🛠️ Configuração do Buildx

Se você não tem o buildx configurado, siga estes passos:

### 1. Verificar se buildx está instalado:

```bash
docker buildx version
# Deve mostrar: github.com/docker/buildx v0.x.x
```

### 2. Criar um builder (se necessário):

```bash
docker buildx create --name valorize-builder --use --bootstrap
```

### 3. Verificar builders disponíveis:

```bash
docker buildx ls
# Deve mostrar valorize-builder com * (ativo)
```

## 🔧 Atualização dos Scripts

Todos os scripts de deploy foram atualizados para usar `--platform linux/amd64`:

### Scripts Atualizados:

- ✅ `/scripts/deploy-dashboard.sh`
- ✅ `/scripts/deploy-landing.sh`
- ✅ `/cloudbuild-dashboard.yaml`
- ✅ `/cloudbuild-landing.yaml`

### Documentação Atualizada:

- ✅ `/docs/DEPLOY_GOOGLE_CLOUD_RUN.md`
- ✅ `/docs/DEPLOY_MANUAL_CONSOLE_GUI.md`
- ✅ `/docs/docker-swc-alpine-fix.md` (problema relacionado)

## 🧪 Como Testar Localmente (Mac ARM64)

Mesmo construindo para AMD64, você pode testar localmente:

```bash
# Build e load para teste local
docker buildx build \
  --platform linux/amd64 \
  -f apps/dashboard/Dockerfile \
  -t valorize-dashboard:test \
  --load \
  .

# Rodar localmente (Docker Desktop emula AMD64)
docker run -p 8080:8080 valorize-dashboard:test

# Testar no navegador
open http://localhost:8080
```

**Nota:** O Docker Desktop emula AMD64 automaticamente no Mac ARM64, então funciona normalmente.

## 📝 Verificando a Arquitetura da Imagem

Para confirmar que a imagem está em AMD64:

```bash
# Inspecionar a imagem
docker manifest inspect gcr.io/$PROJECT_ID/valorize-dashboard:v1

# Deve mostrar:
# "architecture": "amd64"
# "os": "linux"
```

## 🚨 Erro Comum e Solução Rápida

### Erro:
```
Container manifest type 'application/vnd.oci.image.index.v1+json' must support amd64/linux
```

### Solução:
```bash
# Rebuild com plataforma correta e push direto
docker buildx build \
  --platform linux/amd64 \
  -f apps/dashboard/Dockerfile \
  -t gcr.io/$PROJECT_ID/valorize-dashboard:v1 \
  --push \
  .
```

## 📚 Referências

- [Docker Buildx Documentation](https://docs.docker.com/buildx/working-with-buildx/)
- [Multi-platform builds](https://docs.docker.com/build/building/multi-platform/)
- [Cloud Run Container Requirements](https://cloud.google.com/run/docs/container-contract)
- [Apple Silicon and Docker](https://docs.docker.com/desktop/mac/apple-silicon/)

## 💡 Dicas

1. **Sempre use `--platform linux/amd64`** para builds destinados ao Cloud Run
2. **Use `--push`** para economizar tempo (build + push em 1 comando)
3. **Use `--load`** se precisar testar localmente antes do push
4. **Verifique o manifest** com `docker manifest inspect` em caso de dúvida
5. **Em CI/CD**, configure os runners com buildx por padrão

---

**Atualizado em:** 16 de outubro de 2025  
**Status:** ✅ Todos os scripts e documentações atualizados
