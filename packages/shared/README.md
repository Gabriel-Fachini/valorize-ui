# @valorize/shared

Pacote compartilhado de componentes, hooks, utilitários e tipos para o monorepo Valorize.

## Estrutura

```
packages/shared/
├── src/
│   ├── ui/           # Componentes de interface
│   ├── hooks/        # Hooks customizados
│   ├── utils/        # Funções utilitárias
│   ├── types/        # Definições de tipos
│   └── index.ts      # Exportações principais
```

## Componentes Disponíveis

### UI Components

- **Button** - Botão com variantes e tamanhos
- **Card** - Card com header, content e footer
- **Input** - Campo de entrada de texto
- **Modal** - Modal com overlay e controles
- **LoadingSpinner** - Indicador de carregamento
- **EmptyState** - Estado vazio com ícone e ação

### Hooks

- **useLocalStorage** - Persistência de dados no localStorage
- **useDebounce** - Debounce para inputs e pesquisas

### Utilitários

- **formatCurrency** - Formatação de moeda em Real (BRL)
- **formatDate** - Formatação de data brasileira
- **formatDateTime** - Formatação de data e hora brasileira
- **formatNumber** - Formatação de números brasileira
- **cn** - Utilitário para classes CSS (clsx + tailwind-merge)

### Tipos

- **ApiResponse** - Resposta padrão da API
- **PaginatedResponse** - Resposta paginada
- **User** - Tipo de usuário
- **BaseEntity** - Entidade base
- **LoadingState** - Estados de carregamento
- **ErrorState** - Estados de erro

## Como Usar

### 1. Instalação

O pacote já está configurado como dependência nos apps. Para usar:

```bash
# Instalar dependências
pnpm install
```

### 2. Importação

```typescript
// Importar tudo
import { Button, Card, formatCurrency } from '@valorize/shared'

// Importar módulos específicos
import { Button } from '@valorize/shared/ui'
import { useLocalStorage } from '@valorize/shared/hooks'
import { formatCurrency } from '@valorize/shared/utils'
import { User } from '@valorize/shared/types'
```

### 3. Exemplos de Uso

#### Componente Button

```tsx
import { Button } from '@valorize/shared'

function MyComponent() {
  return (
    <div>
      <Button>Botão Padrão</Button>
      <Button variant="outline">Botão Outline</Button>
      <Button variant="destructive">Botão Destrutivo</Button>
      <Button size="sm">Botão Pequeno</Button>
      <Button size="lg">Botão Grande</Button>
    </div>
  )
}
```

#### Componente Card

```tsx
import { Card, CardHeader, CardTitle, CardContent } from '@valorize/shared'

function MyCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Título do Card</CardTitle>
      </CardHeader>
      <CardContent>
        Conteúdo do card aqui...
      </CardContent>
    </Card>
  )
}
```

#### Hook useLocalStorage

```tsx
import { useLocalStorage } from '@valorize/shared'

function MyComponent() {
  const [userName, setUserName] = useLocalStorage('userName', '')
  
  return (
    <input 
      value={userName}
      onChange={(e) => setUserName(e.target.value)}
    />
  )
}
```

#### Formatação

```tsx
import { formatCurrency, formatDate } from '@valorize/shared'

function MyComponent() {
  const price = 1500.50
  const date = new Date()
  
  return (
    <div>
      <p>Preço: {formatCurrency(price)}</p>
      <p>Data: {formatDate(date)}</p>
    </div>
  )
}
```

## Desenvolvimento

### Build

```bash
# Build do pacote compartilhado
pnpm build:shared

# Build de todos os pacotes
pnpm build
```

### Desenvolvimento

```bash
# Modo watch para desenvolvimento
pnpm dev:shared

# Desenvolvimento de todos os apps
pnpm dev
```

## Adicionando Novos Componentes

1. Crie o componente em `src/ui/`
2. Adicione a exportação em `src/ui/index.ts`
3. Adicione a exportação em `src/index.ts`
4. Atualize esta documentação

## Convenções

- Todos os componentes devem usar TypeScript
- Use `cn()` para classes CSS condicionais
- Siga os padrões de design system existentes
- Documente props e exemplos de uso
- Mantenha compatibilidade com Tailwind CSS

