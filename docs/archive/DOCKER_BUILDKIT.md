# 🐳 Docker BuildKit - Guia Rápido

## O que é BuildKit?

BuildKit é o sistema de build moderno do Docker que oferece:

- ✅ **Builds mais rápidos** (cache inteligente, builds paralelos)
- ✅ **Melhor output** (logs mais limpos e informativos)
- ✅ **Recursos avançados** (multi-stage builds otimizados, secrets, SSH)
- ✅ **Menor uso de memória** durante builds

## Por que o aviso "DEPRECATED"?

O Docker está migrando do builder legado para o BuildKit. O aviso aparece porque:

1. O builder legado será removido em versões futuras
2. BuildKit é o padrão recomendado desde Docker 20.10+
3. Cloud Build já usa BuildKit por padrão

## Instalação do Buildx (se necessário)

Se você receber erro `docker: unknown command: docker buildx`, instale manualmente:

### macOS (Apple Silicon / ARM64)

```bash
# 1. Criar diretório para plugins
mkdir -p ~/.docker/cli-plugins

# 2. Baixar buildx
curl -Lo ~/.docker/cli-plugins/docker-buildx \
  "https://github.com/docker/buildx/releases/download/v0.19.3/buildx-v0.19.3.darwin-arm64"

# 3. Tornar executável
chmod +x ~/.docker/cli-plugins/docker-buildx

# 4. Verificar instalação
docker buildx version

# 5. Criar e ativar builder
docker buildx create --name valorize-builder --use --bootstrap

# 6. Verificar builders
docker buildx ls
```

### macOS (Intel / AMD64)

```bash
# Mesmo processo, mas baixe a versão AMD64
curl -Lo ~/.docker/cli-plugins/docker-buildx \
  "https://github.com/docker/buildx/releases/download/v0.19.3/buildx-v0.19.3.darwin-amd64"

chmod +x ~/.docker/cli-plugins/docker-buildx
docker buildx create --name valorize-builder --use --bootstrap
```

### Linux

```bash
# AMD64
curl -Lo ~/.docker/cli-plugins/docker-buildx \
  "https://github.com/docker/buildx/releases/latest/download/buildx-v0.19.3.linux-amd64"

# ARM64
curl -Lo ~/.docker/cli-plugins/docker-buildx \
  "https://github.com/docker/buildx/releases/latest/download/buildx-v0.19.3.linux-arm64"

chmod +x ~/.docker/cli-plugins/docker-buildx
docker buildx create --name valorize-builder --use --bootstrap
```

## Como usar BuildKit

### Método 1: Por comando (Recomendado para scripts)

```bash
# Prefixar cada comando com DOCKER_BUILDKIT=1
DOCKER_BUILDKIT=1 docker build -f apps/dashboard/Dockerfile -t minha-imagem .
```

**Vantagem:** Controle por comando, não afeta outros builds

### Método 2: Ativar globalmente (Permanente)

```bash
# Adicionar ao seu ~/.zshrc ou ~/.bashrc
export DOCKER_BUILDKIT=1

# Aplicar imediatamente
source ~/.zshrc  # ou source ~/.bashrc
```

**Vantagem:** Não precisa prefixar comandos

### Método 3: Configuração do Docker daemon

Editar `~/.docker/config.json`:

```json
{
  "features": {
    "buildkit": true
  }
}
```

**Vantagem:** Configuração permanente no nível do Docker

## Verificar se BuildKit está ativo

```bash
# Fazer um build e ver o output
DOCKER_BUILDKIT=1 docker build .

# Se ver output colorido e moderno = BuildKit ativo ✅
# Se ver output antigo linha por linha = builder legado ❌
```

## Builds Otimizados com BuildKit

### Cache de Camadas

BuildKit usa cache inteligente:

```dockerfile
# ✅ Bom: Copia apenas package.json primeiro (cache eficiente)
COPY package.json pnpm-lock.yaml ./
RUN pnpm install
COPY . .

# ❌ Ruim: Copia tudo de uma vez (invalida cache sempre)
COPY . .
RUN pnpm install
```

### Builds Paralelos

BuildKit executa stages independentes em paralelo:

```dockerfile
# Estes dois FROM rodam em paralelo automaticamente
FROM node:22-alpine AS deps
# ...

FROM node:22-alpine AS builder
# ...
```

### Output Melhorado

```bash
# BuildKit mostra progresso limpo e colorido
[+] Building 45.2s (18/18) FINISHED
 => [internal] load build definition                  0.1s
 => => transferring dockerfile: 1.23kB                0.0s
 => [internal] load .dockerignore                     0.0s
 => [stage-1 1/4] FROM docker.io/library/node:22     12.3s
 => CACHED [stage-2 2/5] WORKDIR /app                 0.0s
 => [stage-2 3/5] COPY package*.json ./               0.5s
 => [stage-2 4/5] RUN pnpm install                   32.1s
```

## Comandos Atualizados no Projeto

Todos os scripts e documentação foram atualizados para usar BuildKit:

### Scripts

```bash
# deploy-dashboard.sh
DOCKER_BUILDKIT=1 docker build -f apps/dashboard/Dockerfile ...

# deploy-landing.sh
DOCKER_BUILDKIT=1 docker build -f apps/landing/Dockerfile ...
```

### Documentação

Todos os exemplos em:
- `docs/DEPLOY_GOOGLE_CLOUD_RUN.md`
- `docs/DEPLOY_MANUAL_CONSOLE_GUI.md`
- `docs/DEPLOY_AUTOMATICO_CI_CD.md`

Foram atualizados com `DOCKER_BUILDKIT=1`

## Cloud Build (CI/CD)

**Boa notícia:** Google Cloud Build já usa BuildKit por padrão! 🎉

Seus arquivos `cloudbuild-*.yaml` não precisam de mudanças. O Cloud Build automaticamente:

- ✅ Usa BuildKit
- ✅ Cache entre builds
- ✅ Builds paralelos
- ✅ Output otimizado

## Troubleshooting

### Erro: "buildkit not supported by daemon"

**Solução:** Atualizar Docker para versão 20.10+

```bash
# macOS
brew upgrade --cask docker

# Verificar versão
docker version
```

### Builds lentos mesmo com BuildKit

**Causas comuns:**

1. **Cache não está sendo usado:**
   ```bash
   # Forçar rebuild sem cache
   DOCKER_BUILDKIT=1 docker build --no-cache .
   
   # Build normal com cache
   DOCKER_BUILDKIT=1 docker build .
   ```

2. **Dockerfile não otimizado:**
   - Copiar arquivos de dependências antes do código
   - Usar multi-stage builds
   - Minimizar camadas

3. **Recursos limitados:**
   ```bash
   # Ver uso de recursos
   docker stats
   
   # Limpar cache antigo
   docker builder prune
   ```

### Reverter para builder legado (não recomendado)

Se realmente precisar usar o builder antigo:

```bash
# Por comando
DOCKER_BUILDKIT=0 docker build .

# Globalmente
export DOCKER_BUILDKIT=0
```

**⚠️ Não recomendado:** Builder legado será removido no futuro

## Comparação de Performance

### Exemplo: Build do Dashboard

**Builder Legado:**
```
Step 1/15 : FROM node:22-alpine AS deps
 ---> abc123def456
Step 2/15 : RUN corepack enable
 ---> Running in xyz789
...
Successfully built in 5m 32s
```

**BuildKit:**
```
[+] Building 3m 12s (18/18) FINISHED
 => [deps 1/3] FROM node:22-alpine         12.3s
 => [builder 1/5] COPY package.json         0.2s
 => [builder 2/5] RUN pnpm install         85.4s
 => [runner 1/2] COPY --from=builder      0.8s
Successfully built in 3m 12s
```

**Resultado:** ~40% mais rápido! 🚀

## Recursos Avançados

### Build Secrets (não expor em camadas)

```dockerfile
# Passar secrets sem deixar no histórico
RUN --mount=type=secret,id=npm_token \
    NPM_TOKEN=$(cat /run/secrets/npm_token) pnpm install
```

```bash
# Usar
DOCKER_BUILDKIT=1 docker build --secret id=npm_token,src=./token.txt .
```

### SSH Agent Forwarding

```dockerfile
# Usar SSH do host (para private repos)
RUN --mount=type=ssh git clone git@github.com:user/repo.git
```

```bash
# Usar
DOCKER_BUILDKIT=1 docker build --ssh default .
```

### Cache Mounts (acelerar installs)

```dockerfile
# Reutilizar cache entre builds
RUN --mount=type=cache,target=/root/.pnpm-store \
    pnpm install --frozen-lockfile
```

## Comandos Úteis

```bash
# Ver info do BuildKit
docker buildx version

# Listar builders disponíveis
docker buildx ls

# Limpar cache do BuildKit
docker builder prune

# Ver uso de cache
docker system df

# Inspecionar build
DOCKER_BUILDKIT=1 docker build --progress=plain .
```

## Recomendações

✅ **Use BuildKit sempre:** Mais rápido, melhor, mais moderno

✅ **Adicione ao .zshrc:**
```bash
echo 'export DOCKER_BUILDKIT=1' >> ~/.zshrc
source ~/.zshrc
```

✅ **Otimize Dockerfiles:** 
- Multi-stage builds
- Cache de dependências
- Ordem inteligente de COPY

✅ **Use cache no CI/CD:**
- Cloud Build já faz isso automaticamente
- GitHub Actions: use `docker/build-push-action@v4`

## Referências

- [BuildKit Documentação Oficial](https://docs.docker.com/build/buildkit/)
- [Dockerfile Best Practices](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/)
- [BuildKit GitHub](https://github.com/moby/buildkit)

---

**🎉 Pronto!** Agora seus builds estão otimizados com BuildKit!
