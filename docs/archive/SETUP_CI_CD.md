# 🚀 Deploy Automático - Resumo Rápido

## Status Atual

✅ **Arquivos de configuração:** Todos criados e prontos  
⚠️ **Triggers no GCP:** Você precisa configurar no Console

---

## 🎯 O que você precisa fazer

### 1️⃣ Executar script de setup (2 minutos)

```bash
./scripts/setup-cicd.sh
```

Este script vai:
- ✅ Ativar APIs necessárias
- ✅ Conceder permissões ao Cloud Build
- ✅ Mostrar instruções para próximos passos

### 2️⃣ Configurar triggers no Console (5 minutos)

Acesse: [console.cloud.google.com/cloud-build/triggers](https://console.cloud.google.com/cloud-build/triggers)

**Criar 2 triggers:**

#### 🟦 Trigger 1: deploy-dashboard

| Campo | Valor |
|-------|-------|
| **Name** | `deploy-dashboard` |
| **Event** | Push to a branch |
| **Branch** | `^main$` |
| **Config file** | `/cloudbuild-dashboard.yaml` |
| **Included files** | `apps/dashboard/**` |

**Variables:**
- `_REGION` → `us-central1`
- `_VITE_API_BASE_URL` → URL da sua API
- `_VITE_API_URL` → URL da sua API

#### 🟩 Trigger 2: deploy-landing

| Campo | Valor |
|-------|-------|
| **Name** | `deploy-landing` |
| **Event** | Push to a branch |
| **Branch** | `^main$` |
| **Config file** | `/cloudbuild-landing.yaml` |
| **Included files** | `apps/landing/**` |

**Variables:**
- `_REGION` → `us-central1`
- `_PUBLIC_SITE_URL` → URL do seu site

### 3️⃣ Fazer primeiro deploy manual (5 minutos cada)

```bash
# Dashboard
./scripts/deploy-dashboard.sh

# Landing
./scripts/deploy-landing.sh
```

### 4️⃣ Testar deploy automático (1 minuto)

```bash
# Fazer uma mudança qualquer
echo "# CI/CD configurado! 🚀" >> README.md

# Commit e push
git add .
git commit -m "test: testar CI/CD"
git push origin main
```

Acompanhe o build em: [console.cloud.google.com/cloud-build/builds](https://console.cloud.google.com/cloud-build/builds)

---

## ✅ Como funciona depois de configurado

```
Você faz commit → Push no GitHub → Deploy automático! 🎉
```

**Sem necessidade de:**
- ❌ Rodar scripts
- ❌ Acessar Console
- ❌ Configurar nada

**Apenas:**
```bash
git push origin main
```

E em ~5-10 minutos está em produção! ✨

---

## 📚 Documentação Completa

- **🖱️ Deploy manual via Console (GUI):** [docs/DEPLOY_MANUAL_CONSOLE_GUI.md](docs/DEPLOY_MANUAL_CONSOLE_GUI.md)
- **Guia detalhado de CI/CD:** [docs/DEPLOY_AUTOMATICO_CI_CD.md](docs/DEPLOY_AUTOMATICO_CI_CD.md)
- **Guia completo de deploy:** [docs/DEPLOY_GOOGLE_CLOUD_RUN.md](docs/DEPLOY_GOOGLE_CLOUD_RUN.md)
- **Checklist:** [DEPLOY_CHECKLIST.md](DEPLOY_CHECKLIST.md)

---

## 🆘 Problemas?

### Trigger não roda após push

1. Verificar se repositório está conectado no Cloud Build
2. Verificar webhooks no GitHub (Settings > Webhooks)
3. Ver guia de troubleshooting: [docs/DEPLOY_AUTOMATICO_CI_CD.md](../docs/DEPLOY_AUTOMATICO_CI_CD.md#-troubleshooting)

### Build falha

```bash
# Ver logs do último build
gcloud builds list --limit=1
gcloud builds log $(gcloud builds list --limit=1 --format='value(id)')
```

### Precisa de ajuda?

Consulte o guia completo com screenshots e exemplos visuais em:  
📖 **[docs/DEPLOY_AUTOMATICO_CI_CD.md](../docs/DEPLOY_AUTOMATICO_CI_CD.md)**
