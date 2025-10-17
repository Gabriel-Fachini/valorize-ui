# ⚡ Deploy Rápido - Google Cloud Run

> **Tempo:** ~5 minutos | **Pré-requisito:** Docker + gcloud CLI instalados

## 🚀 Deploy em 3 Comandos

### Dashboard (React App)

```bash
# 1. Configure o projeto GCP
gcloud config set project SEU-PROJECT-ID

# 2. Execute o script
./scripts/deploy-dashboard.sh

# 3. Pronto! URL do serviço será exibida
```

### Landing Page (Astro)

```bash
./scripts/deploy-landing.sh
```

## 📦 Primeira Vez? Instale as Ferramentas

```bash
# macOS
brew install --cask google-cloud-sdk docker

# Login
gcloud auth login
gcloud auth configure-docker

# Configurar projeto
gcloud config set project SEU-PROJECT-ID
```

## 🔧 Customizar Deploy

```bash
# Dashboard com API customizada
VITE_API_BASE_URL=https://sua-api.com \
REGION=southamerica-east1 \
./scripts/deploy-dashboard.sh

# Landing com URL customizada
PUBLIC_SITE_URL=https://seu-site.com \
./scripts/deploy-landing.sh
```

## 📖 Precisa de Mais Detalhes?

- **Guia Completo:** [`README.md`](./README.md)
- **Problemas?** [`troubleshooting.md`](./troubleshooting.md)
- **CI/CD Automático:** Veja seção "Deploy Automático" no README
