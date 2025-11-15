# Valorize Backoffice

Interface de gerenciamento interno do negócio Valorize.

## Funcionalidades

- Gestão de clientes/empresas
- Gestão de contratos
- Acompanhamento de receita
- Catálogo de vouchers
- Métricas relevantes do negócio

## Desenvolvimento

```bash
# Instalar dependências
pnpm install

# Rodar em desenvolvimento
pnpm dev:backoffice

# Build
pnpm build:backoffice
```

## Tech Stack

- React 19
- TypeScript
- Vite
- TanStack Router
- TanStack Query
- TailwindCSS v4
- Shadcn UI
- Axios

## Estrutura

```
src/
├── components/       # Componentes React
│   ├── auth/        # Componentes de autenticação
│   ├── layout/      # Componentes de layout
│   └── ui/          # Componentes UI (shadcn)
├── contexts/        # React Contexts
├── hooks/           # Custom hooks
├── lib/             # Utilitários
├── pages/           # Páginas
├── services/        # Serviços de API
├── types/           # TypeScript types
├── App.tsx
├── main.tsx
└── router.tsx
```
