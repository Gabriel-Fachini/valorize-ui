# 🤖 Configuração de Deploy Automático (CI/CD)

## ✅ Status Atual

**Arquivos de configuração criados:**
- ✅ `cloudbuild-dashboard.yaml` - Configuração de build do dashboard
- ✅ `cloudbuild-landing.yaml` - Configuração de build da landing page
- ✅ Dockerfiles prontos para ambas aplicações

**O que falta fazer:**
- ⚠️ Configurar triggers no Console do Google Cloud
- ⚠️ Conectar repositório GitHub ao Cloud Build
- ⚠️ Configurar permissões do Cloud Build

---

## 📋 Passo a Passo - Configuração no Console

### Passo 1: Ativar APIs Necessárias

Primeiro, certifique-se de que as APIs estão ativas:

```bash
# Configurar projeto (substitua pelo seu PROJECT_ID)
gcloud config set project SEU-PROJECT-ID

# Ativar APIs
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com
```

**Ou pelo Console:**
1. Acesse [console.cloud.google.com](https://console.cloud.google.com)
2. Vá em **APIs & Services > Library**
3. Busque e ative:
   - Cloud Build API
   - Cloud Run API
   - Container Registry API

---

### Passo 2: Conectar GitHub ao Cloud Build

#### Via Console (Recomendado - Interface Visual)

1. **Acesse Cloud Build:**
   - URL direta: https://console.cloud.google.com/cloud-build/triggers
   - Ou: Menu ☰ > Cloud Build > Triggers

2. **Conectar Repositório:**
   - Clique no botão **"Connect Repository"** (topo da página)
   - Selecione **"GitHub (Cloud Build GitHub App)"**
   - Clique em **"Continue"**

3. **Autenticar GitHub:**
   - Uma janela popup do GitHub vai abrir
   - Clique em **"Authorize Google Cloud Build"**
   - Digite sua senha do GitHub se solicitado
   - Selecione sua conta/organização (`Gabriel-Fachini`)

4. **Selecionar Repositório:**
   - Marque o repositório **"valorize-ui"**
   - Clique em **"Connect repository"**
   - Na próxima tela, clique em **"Done"** (não crie trigger ainda)

#### Via CLI (Alternativa)

```bash
# Instalar Cloud Build app no GitHub
gcloud alpha builds connections create github valorize-connection \
  --region=us-central1

# Listar conexões
gcloud alpha builds connections list --region=us-central1
```

---

### Passo 3: Criar Trigger para Dashboard

1. **Criar novo trigger:**
   - Na página Cloud Build > Triggers
   - Clique em **"Create Trigger"**

2. **Configurar trigger do Dashboard:**
   
   **Name:** `deploy-dashboard`
   
   **Description:** `Deploy dashboard automaticamente quando houver push na main`
   
   **Event:** Selecione **"Push to a branch"**
   
   **Source:**
   - **Repository:** Selecione `Gabriel-Fachini/valorize-ui` (dropdown)
   - **Branch:** `^main$` (regex - apenas branch main)
   
   **Configuration:**
   - Tipo: **"Cloud Build configuration file (yaml or json)"**
   - Location: **"Repository"**
   - Cloud Build configuration file location: `/cloudbuild-dashboard.yaml`
   
   **Included files filter (OPCIONAL mas recomendado):**
   ```
   apps/dashboard/**
   ```
   
   Isso faz o trigger rodar apenas quando houver mudanças na pasta do dashboard.

3. **Adicionar Substitution Variables:**
   - Clique em **"Show Advanced" > "Substitution Variables"**
   - Clique em **"Add Variable"** 3 vezes e adicione:
   
   | Variable Name | Variable Value |
   |--------------|----------------|
   | `_REGION` | `us-central1` |
   | `_VITE_API_BASE_URL` | `https://api.valorize.com` |
   | `_VITE_API_URL` | `https://api.valorize.com` |
   
   ⚠️ **IMPORTANTE:** Substitua as URLs pela URL real da sua API!

4. **Salvar:**
   - Clique em **"Create"** no final da página

---

### Passo 4: Criar Trigger para Landing Page

Repita o processo acima com estas configurações:

**Name:** `deploy-landing`

**Description:** `Deploy landing page automaticamente quando houver push na main`

**Event:** Push to a branch

**Source:**
- Repository: `Gabriel-Fachini/valorize-ui`
- Branch: `^main$`

**Configuration:**
- Cloud Build configuration file: `/cloudbuild-landing.yaml`

**Included files filter:**
```
apps/landing/**
```

**Substitution Variables:**

| Variable Name | Variable Value |
|--------------|----------------|
| `_REGION` | `us-central1` |
| `_PUBLIC_SITE_URL` | `https://valorize.com` |

---

### Passo 5: Conceder Permissões ao Cloud Build

O Cloud Build precisa de permissões para fazer deploy no Cloud Run.

#### Via CLI (Mais Rápido):

```bash
# Obter número do projeto
PROJECT_ID=$(gcloud config get-value project)
PROJECT_NUMBER=$(gcloud projects describe $PROJECT_ID --format='value(projectNumber)')

# Conceder permissão Cloud Run Admin
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member=serviceAccount:$PROJECT_NUMBER@cloudbuild.gserviceaccount.com \
  --role=roles/run.admin

# Conceder permissão Service Account User
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member=serviceAccount:$PROJECT_NUMBER@cloudbuild.gserviceaccount.com \
  --role=roles/iam.serviceAccountUser

echo "✅ Permissões concedidas com sucesso!"
```

#### Via Console (Alternativa):

1. **Acesse IAM:**
   - URL: https://console.cloud.google.com/iam-admin/iam
   - Ou: Menu ☰ > IAM & Admin > IAM

2. **Encontrar Service Account:**
   - Procure por: `[NÚMERO]@cloudbuild.gserviceaccount.com`
   - Ex: `123456789@cloudbuild.gserviceaccount.com`

3. **Editar Permissões:**
   - Clique no ícone de **lápis (✏️)** ao lado da service account
   - Clique em **"Add Another Role"**
   - Adicione estas roles:
     - ✅ **Cloud Run Admin** (`roles/run.admin`)
     - ✅ **Service Account User** (`roles/iam.serviceAccountUser`)
   - Clique em **"Save"**

---

### Passo 6: Testar Deploy Automático

Agora vamos testar se tudo está funcionando!

```bash
# 1. Fazer uma pequena mudança
echo "# Deploy automático configurado! 🚀" >> README.md

# 2. Commit e push
git add .
git commit -m "test: configurar deploy automático no GCP"
git push origin main
```

**O que deve acontecer:**

1. ✅ Push no GitHub dispara o trigger
2. ✅ Cloud Build inicia build automaticamente
3. ✅ Docker images são criadas
4. ✅ Images são enviadas para Container Registry
5. ✅ Deploy no Cloud Run é executado
6. ✅ Aplicação fica disponível na URL do Cloud Run

**Acompanhar o build:**

1. **Via Console:**
   - URL: https://console.cloud.google.com/cloud-build/builds
   - Você verá o build em andamento com status "Building"
   - Clique nele para ver logs em tempo real

2. **Via CLI:**
   ```bash
   # Listar últimos builds
   gcloud builds list --limit=5
   
   # Ver logs do último build
   gcloud builds log $(gcloud builds list --limit=1 --format='value(id)')
   ```

---

## 🔍 Verificar se Está Funcionando

### Verificar Triggers Criados

```bash
# Listar triggers configurados
gcloud builds triggers list

# Deve mostrar algo como:
# NAME              SOURCE         BRANCH  BUILD_CONFIG
# deploy-dashboard  valorize-ui    ^main$  cloudbuild-dashboard.yaml
# deploy-landing    valorize-ui    ^main$  cloudbuild-landing.yaml
```

### Verificar Permissões

```bash
# Verificar IAM policies
PROJECT_ID=$(gcloud config get-value project)
PROJECT_NUMBER=$(gcloud projects describe $PROJECT_ID --format='value(projectNumber)')

gcloud projects get-iam-policy $PROJECT_ID \
  --flatten="bindings[].members" \
  --filter="bindings.members:serviceAccount:$PROJECT_NUMBER@cloudbuild.gserviceaccount.com"
```

---

## 🎯 Fluxo de Deploy Automático

Após configuração completa, o fluxo será:

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  1. Developer faz commit no GitHub (branch main)           │
│                            │                                │
│                            ▼                                │
│  2. GitHub Webhook notifica Cloud Build                    │
│                            │                                │
│                            ▼                                │
│  3. Cloud Build verifica se mudou apps/dashboard/**        │
│     ou apps/landing/**                                      │
│                            │                                │
│                            ▼                                │
│  4. Cloud Build executa cloudbuild-*.yaml                  │
│     - Build Docker image                                    │
│     - Push para Container Registry                          │
│     - Deploy no Cloud Run                                   │
│                            │                                │
│                            ▼                                │
│  5. Cloud Run atualiza serviço automaticamente             │
│                            │                                │
│                            ▼                                │
│  6. Nova versão disponível em produção! 🚀                 │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Tempo estimado:** 5-10 minutos por deploy

---

## 🎨 Otimizações Opcionais

### 1. Deploy apenas quando necessário

Os triggers já estão configurados com `Included files filter` para rodar apenas quando houver mudanças relevantes:

- **Dashboard trigger** → roda apenas se mudar `apps/dashboard/**`
- **Landing trigger** → roda apenas se mudar `apps/landing/**`

### 2. Notificações de Build

Configure notificações para saber quando o deploy terminar:

```bash
# Criar tópico no Pub/Sub
gcloud pubsub topics create cloud-builds

# Criar notificação
gcloud builds triggers update deploy-dashboard \
  --subscription=projects/$(gcloud config get-value project)/topics/cloud-builds
```

Depois configure notificações por email no Pub/Sub.

### 3. Aprovação Manual (Opcional)

Para ambientes críticos, adicione step de aprovação:

No `cloudbuild-dashboard.yaml`, adicione antes do deploy:

```yaml
# Adicionar após o push da imagem
- name: 'gcr.io/cloud-builders/gcloud'
  id: 'wait-for-approval'
  entrypoint: 'bash'
  args:
    - '-c'
    - |
      echo "Build concluído. Aguardando aprovação manual..."
      echo "Acesse Cloud Build Console para aprovar"
      # Este step pausará até aprovação manual
```

---

## 🐛 Troubleshooting

### Trigger não está rodando

**Problema:** Push no GitHub mas build não inicia

**Soluções:**

1. Verificar se repositório está conectado:
   ```bash
   gcloud builds triggers list
   ```

2. Verificar webhooks do GitHub:
   - GitHub > Repo Settings > Webhooks
   - Deve ter webhook do Google Cloud Build
   - Verificar "Recent Deliveries" para erros

3. Re-conectar repositório:
   - Cloud Build > Triggers > Connect Repository
   - Selecionar repositório novamente

### Build falha com "Permission Denied"

**Problema:** Erro `PERMISSION_DENIED` ao fazer deploy

**Solução:** Conceder permissões ao Cloud Build (ver Passo 5)

### Build falha com "Service not found"

**Problema:** Primeira vez fazendo deploy

**Solução:** Fazer primeiro deploy manual:

```bash
# Dashboard
./scripts/deploy-dashboard.sh

# Landing
./scripts/deploy-landing.sh
```

Depois os deploys automáticos funcionarão normalmente.

### Variáveis de ambiente não funcionam

**Problema:** Aplicação não encontra variáveis de ambiente

**Solução:** Verificar substitution variables nos triggers:

1. Cloud Build > Triggers > [seu-trigger] > Edit
2. Ir em "Show Advanced" > "Substitution Variables"
3. Verificar se todas variáveis estão corretas

---

## 📊 Monitorar Deploys

### Ver histórico de builds

```bash
# Últimos 10 builds
gcloud builds list --limit=10

# Filtrar por trigger
gcloud builds list --filter='buildTriggerId:deploy-dashboard'

# Ver logs de um build específico
gcloud builds log BUILD_ID
```

### Métricas no Console

1. Acesse: https://console.cloud.google.com/cloud-build/dashboard
2. Veja:
   - ✅ Taxa de sucesso dos builds
   - ⏱️ Tempo médio de build
   - 📊 Builds por dia/semana

---

## ✅ Checklist Final

Antes de considerar completo, verifique:

- [ ] APIs ativadas (Cloud Build, Cloud Run, Container Registry)
- [ ] Repositório GitHub conectado ao Cloud Build
- [ ] Trigger `deploy-dashboard` criado e configurado
- [ ] Trigger `deploy-landing` criado e configurado
- [ ] Substitution variables configuradas em ambos triggers
- [ ] Permissões concedidas ao Cloud Build service account
- [ ] Deploy manual feito pelo menos uma vez (cria os serviços)
- [ ] Push de teste realizado e build executado com sucesso
- [ ] Aplicações acessíveis nas URLs do Cloud Run

---

## 🎉 Pronto!

Após completar todos os passos, seu workflow será:

```bash
# Fazer mudanças no código
vim apps/dashboard/src/pages/HomePage.tsx

# Commit e push
git add .
git commit -m "feat: adicionar nova funcionalidade"
git push origin main

# ✨ Deploy automático acontece!
# ✅ Em ~5-10 minutos está em produção
```

**Sem necessidade de:**
- ❌ Rodar scripts manualmente
- ❌ Fazer build local
- ❌ Fazer deploy manual
- ❌ Configurar servidor

**Tudo automático!** 🚀

---

## 📚 Próximos Passos

Depois que o CI/CD estiver funcionando:

1. ✅ Configurar domínio customizado (ver guia principal)
2. ✅ Configurar ambientes (dev, staging, production)
3. ✅ Adicionar testes no pipeline (antes do deploy)
4. ✅ Configurar rollback automático em caso de falha
5. ✅ Implementar Blue-Green deployment

---

**📖 Ver também:**
- [Guia completo de deploy](./DEPLOY_GOOGLE_CLOUD_RUN.md)
- [Checklist de deploy](../DEPLOY_CHECKLIST.md)
- [Scripts auxiliares](../scripts/README.md)
