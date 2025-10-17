# 📚 Guias de Deploy - Índice Completo

Bem-vindo ao centro de documentação de deploy do Valorize UI no Google Cloud Run!

---

## 🎯 Por Onde Começar?

Escolha o guia baseado na sua preferência:

### 🖱️ Prefere Interface Gráfica (GUI)?

👉 **[Deploy Manual via Console (GUI)](./docs/DEPLOY_MANUAL_CONSOLE_GUI.md)**

- ✅ Passo a passo com interface visual
- ✅ Sem necessidade de conhecer linha de comando (quase)
- ✅ Ideal para primeira vez
- ✅ Entender o processo visualmente
- ⏱️ Tempo: 20-30 minutos

### 💻 Prefere Linha de Comando (CLI)?

👉 **[Deploy Manual via Scripts](./docs/DEPLOY_GOOGLE_CLOUD_RUN.md#deploy-manual-primeira-vez)**

- ✅ Mais rápido que GUI
- ✅ Scripts prontos para usar
- ✅ Automação local
- ⏱️ Tempo: 10-15 minutos

### 🤖 Quer Deploy Automático (CI/CD)?

👉 **[Setup de CI/CD](./SETUP_CI_CD.md)** (guia rápido)

👉 **[Guia Completo de CI/CD](./docs/DEPLOY_AUTOMATICO_CI_CD.md)** (detalhado)

- ✅ Deploy automático no `git push`
- ✅ Configurar triggers no Google Cloud Build
- ✅ Integração com GitHub
- ⏱️ Setup inicial: 15-20 minutos
- ⏱️ Deploys futuros: Automáticos!

---

## 📖 Guias Disponíveis

### 1. 🖱️ Deploy Manual via Console (GUI)

**Arquivo:** [`docs/DEPLOY_MANUAL_CONSOLE_GUI.md`](./docs/DEPLOY_MANUAL_CONSOLE_GUI.md)

**O que você aprende:**
- Como usar a interface gráfica do Google Cloud
- Criar serviços no Cloud Run visualmente
- Configurar recursos, variáveis de ambiente, health checks
- Monitorar aplicação via Console
- Configurar domínio customizado
- Gerenciar custos e alertas

**Ideal para:**
- ✅ Primeira vez fazendo deploy
- ✅ Pessoas que preferem interfaces visuais
- ✅ Entender cada passo do processo
- ✅ Não se sente confortável com terminal

---

### 2. 💻 Deploy Manual via CLI/Scripts

**Arquivo:** [`docs/DEPLOY_GOOGLE_CLOUD_RUN.md`](./docs/DEPLOY_GOOGLE_CLOUD_RUN.md)

**O que você aprende:**
- Configurar Google Cloud SDK
- Build e push de imagens Docker
- Deploy via linha de comando
- Scripts auxiliares prontos
- Troubleshooting comum

**Scripts disponíveis:**
- `./scripts/deploy-dashboard.sh` - Deploy manual do dashboard
- `./scripts/deploy-landing.sh` - Deploy manual da landing page

**Ideal para:**
- ✅ Desenvolvedores confortáveis com terminal
- ✅ Quer processo mais rápido
- ✅ Precisa automatizar localmente
- ✅ Entende conceitos de Docker/containers

---

### 3. 🤖 Deploy Automático (CI/CD)

#### Guia Rápido

**Arquivo:** [`SETUP_CI_CD.md`](./SETUP_CI_CD.md)

**Tempo:** 5 minutos de leitura

**Conteúdo:**
- ✅ Resumo executivo
- ✅ Checklist de 4 passos
- ✅ O que está pronto vs o que falta fazer
- ✅ Links para documentação detalhada

**Ideal para:**
- ✅ Quer visão geral rápida
- ✅ Já fez deploy manual antes
- ✅ Sabe o que é CI/CD

#### Guia Completo

**Arquivo:** [`docs/DEPLOY_AUTOMATICO_CI_CD.md`](./docs/DEPLOY_AUTOMATICO_CI_CD.md)

**Tempo:** 20 minutos de leitura + 15 minutos de setup

**Conteúdo:**
- ✅ Passo a passo detalhado com screenshots textuais
- ✅ Conectar GitHub ao Cloud Build
- ✅ Criar triggers para dashboard e landing
- ✅ Configurar permissões
- ✅ Testar deploy automático
- ✅ Troubleshooting completo

**Ideal para:**
- ✅ Primeira vez configurando CI/CD
- ✅ Quer entender cada detalhe
- ✅ Precisa de guia passo a passo
- ✅ Quer implementar em produção

---

### 4. ✅ Checklist Completo

**Arquivo:** [`DEPLOY_CHECKLIST.md`](./DEPLOY_CHECKLIST.md)

**O que contém:**
- ✅ Checklist pré-deploy
- ✅ Checklist deploy manual
- ✅ Checklist deploy automático
- ✅ Checklist pós-deploy
- ✅ Verificações de segurança
- ✅ Manutenção

**Ideal para:**
- ✅ Garantir que não esqueceu nada
- ✅ Auditar setup existente
- ✅ Guia rápido de referência

---

## 🛠️ Arquivos Técnicos

### Dockerfiles

- `apps/dashboard/Dockerfile` - Imagem Docker do dashboard React
- `apps/landing/Dockerfile` - Imagem Docker da landing Astro
- `.dockerignore` - Arquivos ignorados no build

### Configurações Nginx

- `apps/dashboard/nginx.conf` - Servidor web do dashboard
- `apps/landing/nginx.conf` - Servidor web da landing

### Cloud Build

- `cloudbuild-dashboard.yaml` - Build automático do dashboard
- `cloudbuild-landing.yaml` - Build automático da landing

### Scripts Auxiliares

- `scripts/deploy-dashboard.sh` - Deploy manual dashboard
- `scripts/deploy-landing.sh` - Deploy manual landing
- `scripts/setup-cicd.sh` - Setup automático de CI/CD

### Exemplos

- `.env.example` - Exemplo de variáveis de ambiente

---

## 🎓 Fluxo de Aprendizado Recomendado

### Para Iniciantes

1. 📖 Leia [`SETUP_CI_CD.md`](./SETUP_CI_CD.md) (visão geral)
2. 🖱️ Siga [`docs/DEPLOY_MANUAL_CONSOLE_GUI.md`](./docs/DEPLOY_MANUAL_CONSOLE_GUI.md) (primeiro deploy)
3. 🤖 Configure CI/CD com [`docs/DEPLOY_AUTOMATICO_CI_CD.md`](./docs/DEPLOY_AUTOMATICO_CI_CD.md)
4. ✅ Use [`DEPLOY_CHECKLIST.md`](./DEPLOY_CHECKLIST.md) para validar

### Para Desenvolvedores Experientes

1. 💻 Use [`docs/DEPLOY_GOOGLE_CLOUD_RUN.md`](./docs/DEPLOY_GOOGLE_CLOUD_RUN.md) (deploy via CLI)
2. 🤖 Configure CI/CD rápido com [`SETUP_CI_CD.md`](./SETUP_CI_CD.md)
3. 📖 Consulte [`docs/DEPLOY_AUTOMATICO_CI_CD.md`](./docs/DEPLOY_AUTOMATICO_CI_CD.md) se necessário

---

## 🆘 Troubleshooting

Problemas? Consulte estas seções:

- **Build falha:** Ver seção Troubleshooting em qualquer guia de deploy
- **Container crasha:** [`docs/DEPLOY_MANUAL_CONSOLE_GUI.md`](./docs/DEPLOY_MANUAL_CONSOLE_GUI.md#-troubleshooting-via-console)
- **CI/CD não funciona:** [`docs/DEPLOY_AUTOMATICO_CI_CD.md`](./docs/DEPLOY_AUTOMATICO_CI_CD.md#-troubleshooting)
- **Permissões:** Todos os guias têm seção sobre IAM

---

## 💰 Custos

**Estimativa mensal:**
- Dashboard: $5-10/mês (10k requests/dia)
- Landing: $2-5/mês
- **Total: $7-15/mês** (provavelmente dentro do free tier)

**Free Tier do Cloud Run:**
- 2 milhões de requests/mês
- 360,000 GB-seconds de memória
- 180,000 vCPU-seconds

Ver mais em: [`docs/DEPLOY_GOOGLE_CLOUD_RUN.md`](./docs/DEPLOY_GOOGLE_CLOUD_RUN.md#-custos-estimados)

---

## 🔗 Links Úteis

### Console do Google Cloud

- **Cloud Run:** https://console.cloud.google.com/run
- **Cloud Build:** https://console.cloud.google.com/cloud-build
- **Container Registry:** https://console.cloud.google.com/gcr
- **Logs:** https://console.cloud.google.com/logs
- **Monitoring:** https://console.cloud.google.com/monitoring
- **Billing:** https://console.cloud.google.com/billing

### Documentação Oficial

- [Cloud Run Docs](https://cloud.google.com/run/docs)
- [Cloud Build Docs](https://cloud.google.com/build/docs)
- [Container Registry Docs](https://cloud.google.com/container-registry/docs)

---

## 🎯 Roadmap de Deploy

```
┌─────────────────────────────────────────────────────────────┐
│                    JORNADA DE DEPLOY                        │
└─────────────────────────────────────────────────────────────┘

   1️⃣  Setup Inicial
        ├── Criar projeto GCP
        ├── Ativar APIs
        └── Configurar gcloud CLI
                │
                ▼
   2️⃣  Primeiro Deploy
        ├── Via Console (GUI) 🖱️  ← RECOMENDADO
        └── Via CLI/Scripts 💻
                │
                ▼
   3️⃣  Testar Aplicação
        ├── Verificar URLs públicas
        ├── Testar funcionalidades
        └── Ver logs/métricas
                │
                ▼
   4️⃣  Configurar CI/CD 🤖
        ├── Conectar GitHub
        ├── Criar triggers
        └── Testar deploy automático
                │
                ▼
   5️⃣  Produção
        ├── Configurar domínio customizado
        ├── Configurar alertas
        ├── Otimizar custos
        └── Monitorar continuamente
```

---

## 🔧 Guias de Troubleshooting

### Problema de Arquitetura (Mac Apple Silicon)

**Arquivo:** [`docs/docker-architecture-amd64-arm64.md`](./docs/docker-architecture-amd64-arm64.md)

**Quando usar:**
- ❌ Erro: "Container manifest type must support amd64/linux"
- ❌ Cloud Run rejeita a imagem
- 💻 Você está usando Mac com Apple Silicon (M1/M2/M3)

**Solução:** Build com `--platform linux/amd64`

### Problema de Compilação (SWC + Alpine)

**Arquivo:** [`docs/docker-swc-alpine-fix.md`](./docs/docker-swc-alpine-fix.md)

**Quando usar:**
- ❌ Erro: "SIGSEGV (Segmentation fault)" durante build
- ❌ Build falha no stage do Vite
- 🐧 Você está usando Alpine Linux no Dockerfile

**Solução:** Usar `node:22-slim` ao invés de `node:22-alpine` no builder stage

### BuildKit e Docker Buildx

**Arquivo:** [`docs/DOCKER_BUILDKIT.md`](./docs/DOCKER_BUILDKIT.md)

**Quando usar:**
- ❌ Erro: "docker: unknown command: docker buildx"
- ❌ Deprecation warning sobre legacy builder
- 🔨 Configurar buildx pela primeira vez

---

## ✨ Próximos Passos

Depois de fazer deploy com sucesso:

1. ✅ **Monitoramento:** Configure alertas e dashboards
2. ✅ **Segurança:** Use Secrets Manager para credenciais
3. ✅ **Performance:** Configure CDN para assets estáticos
4. ✅ **Backup:** Configure backup de logs
5. ✅ **Ambientes:** Crie ambientes dev/staging/production

---

**💡 Dica:** Comece pelo guia de deploy manual (GUI ou CLI) para entender o processo, depois configure CI/CD para automatizar!

**🎉 Boa sorte com o deploy!** 🚀
