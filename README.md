# Valorize - Cultura e Engajamento

Um SaaS B2B focado em cultura e engajamento empresarial, com possibilidade de resgate de prêmios.

## 🚀 Funcionalidades

- **Autenticação**: Sistema de login com email e senha
- **Dashboard**: Página inicial com visão geral das funcionalidades
- **Interface Responsiva**: Design moderno e responsivo com TailwindCSS
- **Navegação Inteligente**: Redirecionamento automático baseado no status de autenticação

## 🛠️ Tecnologias

- **React 19** - Biblioteca de interface
- **TypeScript** - Tipagem estática
- **Vite** - Bundler e servidor de desenvolvimento
- **TailwindCSS** - Framework de estilos
- **@tanstack/react-router** - Roteamento do lado do cliente
- **@tanstack/react-query** - Gerenciamento de estado do servidor

## 📦 Instalação

1. Clone o repositório:

```bash
git clone <repository-url>
cd valorize-ui
```

1. Instale as dependências:

```bash
npm install
```

1. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

1. Acesse a aplicação em: http://localhost:3000

## 🔐 Como usar

### Login
1. Acesse a página inicial (será redirecionado para `/login`)
2. Digite qualquer email e senha (autenticação simulada)
3. Clique em "Entrar"
4. Será redirecionado automaticamente para a página inicial

### Dashboard
- Visualize suas conquistas, recompensas e métricas de engajamento
- Veja seus dados de usuário
- Use o botão "Sair" para fazer logout

## 📁 Estrutura do Projeto

```
src/
├── components/     # Componentes reutilizáveis
├── contexts/       # Contextos React (AuthContext)
├── pages/          # Páginas da aplicação
│   ├── LoginPage.tsx
│   └── HomePage.tsx
├── hooks/          # Custom hooks
├── services/       # Serviços e APIs
├── assets/         # Recursos estáticos
└── router.tsx      # Configuração de rotas
```

## 🎨 Design System

A aplicação utiliza TailwindCSS com uma paleta de cores focada em:
- **Primária**: Indigo (para CTAs e elementos importantes)
- **Secundária**: Gray (para textos e elementos de suporte)
- **Sucesso**: Green (para feedbacks positivos)
- **Erro**: Red (para alertas e erros)

## 🔧 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Gera build de produção
- `npm run preview` - Visualiza o build de produção
- `npm run lint` - Executa o linter

## 🚀 Deploy

Este projeto está pronto para deploy no **Google Cloud Run**.

### Deploy Rápido

```bash
# Configure seu projeto GCP
gcloud config set project SEU-PROJECT-ID

# Deploy dashboard
./scripts/deploy-dashboard.sh

# Deploy landing page
./scripts/deploy-landing.sh
```

### Documentação Completa

- 📖 **[Guia de Deploy Completo](docs/deployment/README.md)** - Instruções detalhadas
- ⚡ **[Quick Start](docs/deployment/quick-start.md)** - Deploy em 5 minutos
- 🔧 **[Troubleshooting](docs/deployment/troubleshooting.md)** - Solução de problemas

### CI/CD Automático

Configure deploy automático com GitHub + Cloud Build:

```bash
./scripts/setup-cicd.sh
```

## 📝 Licença

Este projeto está sob a licença MIT.
