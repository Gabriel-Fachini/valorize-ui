# 🛠️ Deploy Scripts

Scripts para facilitar o deploy no Google Cloud Run.

---

## 🚀 Scripts Disponíveis

### `deploy-dashboard.sh`

Deploy manual do dashboard (React + Vite).

```bash
# Uso básico
./scripts/deploy-dashboard.sh

# Com variáveis customizadas
VITE_API_BASE_URL=https://api.example.com \
REGION=southamerica-east1 \
./scripts/deploy-dashboard.sh
```

**O que faz:**
1. Valida instalações (gcloud, docker)
2. Build da imagem Docker (AMD64)
3. Push para Google Container Registry
4. Deploy no Cloud Run
5. Exibe URL do serviço

---

### `deploy-landing.sh`

Deploy manual da landing page (Astro).

```bash
# Uso básico
./scripts/deploy-landing.sh

# Com variáveis customizadas
PUBLIC_SITE_URL=https://www.example.com \
./scripts/deploy-landing.sh
```

---

### `setup-cicd.sh`

Configura CI/CD automático com Cloud Build.

```bash
./scripts/setup-cicd.sh
```

**O que faz:**
1. Ativa APIs necessárias
2. Configura permissões do Cloud Build
3. Mostra instruções para criar triggers no Console

---

## 📋 Pré-requisitos

```bash
# macOS - Instalar ferramentas
brew install --cask google-cloud-sdk docker

# Autenticação
gcloud auth login
gcloud auth configure-docker

# Configurar projeto
gcloud config set project SEU-PROJECT-ID
```

---

## 🔧 Variáveis de Ambiente

### Dashboard
- `VITE_API_BASE_URL` - URL da API (default: `https://api.valorize.com`)
- `VITE_API_URL` - URL da API para proxy (default: `https://api.valorize.com`)
- `REGION` - Região do Cloud Run (default: `us-central1`)

### Landing
- `PUBLIC_SITE_URL` - URL pública do site (default: `https://valorize.com`)
- `REGION` - Região do Cloud Run (default: `us-central1`)

---

## 🌎 Regiões Disponíveis

- `us-central1` - Iowa, USA ⭐ (recomendada)
- `us-east1` - Carolina do Sul, USA
- `southamerica-east1` - São Paulo, Brasil 🇧🇷
- `europe-west1` - Bélgica
- `asia-east1` - Taiwan

[Lista completa](https://cloud.google.com/run/docs/locations)

---

## 📖 Documentação Completa

Para guias detalhados, troubleshooting e CI/CD:

👉 **[docs/deployment/README.md](../docs/deployment/README.md)**

