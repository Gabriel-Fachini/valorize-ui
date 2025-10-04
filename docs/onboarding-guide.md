# 🎯 Guia Completo do Onboarding Valorize

## 📋 Visão Geral

O Valorize possui um **sistema de onboarding guiado e interativo** que introduz novos usuários às principais funcionalidades da plataforma. O tour cobre todas as páginas principais e garante que o usuário explore ativamente o sistema através de **navegação obrigatória**.

### ✨ Características Principais

- **23 steps totais** cobrindo 6 páginas principais
- **Navegação obrigatória** via cliques na sidebar
- **Steps informativos detalhados** com botões de navegação
- **Detecção automática** de mudanças de rota
- **Persistência no localStorage** (não se repete)
- **Reinício manual** disponível nas Configurações
- **Modal de conclusão** com link para feedback
- **Suporte completo para mobile** com gerenciamento automático da sidebar

---

## 📊 Estatísticas do Tour

| Métrica | Valor |
|---------|-------|
| **Total de Steps** | 23 |
| **Steps com clique obrigatório** | 6 |
| **Steps informativos** | 17 |
| **Páginas cobertas** | 6 |
| **Tempo estimado** | 4-6 minutos |

### Distribuição de Steps por Página

- **Sidebar**: 2 steps (introdução + cards de saldo)
- **Home**: 1 step (welcome + clique obrigatório)
- **Elogios**: 3 steps (stats, feed, FAB)
- **Transações**: 3 steps (intro, saldos, histórico)
- **Prêmios**: 2 steps (filtros, grid)
- **Resgates**: 3 steps (intro, filtros, lista)
- **Configurações**: 2 steps (tabs, tour control)
- **Conclusão**: 1 step (modal final)

---

## 🗺️ Mapa Visual do Tour

```
┌─────────────────────────────────────────────────────────────┐
│                    INÍCIO DO TOUR                           │
└─────────────────────────────────────────────────────────────┘
                           ↓
        ┌──────────────────────────────────┐
        │  Step 0: Welcome                 │
        │  ✓ Botão Próximo                 │
        └──────────────────────────────────┘
                           ↓
        ┌──────────────────────────────────┐
        │  Step 1: Sidebar                 │
        │  ✓ Botão Próximo                 │
        └──────────────────────────────────┘
                           ↓
        ┌──────────────────────────────────┐
        │  Step 2: Cards de Saldo          │
        │  ✓ Info sobre renovação semanal  │
        │  ✓ Botão Próximo                 │
        └──────────────────────────────────┘
                           ↓
        ┌──────────────────────────────────┐
        │  Step 3: 👆 Clique em HOME       │
        │  ✗ Sem navegação                 │
        └──────────────────────────────────┘
                           ↓
        ┌──────────────────────────────────┐
        │  Step 4: 👆 Clique em ELOGIOS    │
        │  ✗ Sem navegação                 │
        └──────────────────────────────────┘
                           ↓
    ╔═══════════════════════════════════════╗
    ║     PÁGINA DE ELOGIOS (3 steps)       ║
    ╠═══════════════════════════════════════╣
    ║  Step 5: Stats Cards                  ║
    ║  ✓ Mostra estatísticas                ║
    ║  ✓ Botão Próximo                      ║
    ╟───────────────────────────────────────╢
    ║  Step 6: Feed de Elogios              ║
    ║  ✓ Mostra timeline                    ║
    ║  ✓ Botão Próximo                      ║
    ╟───────────────────────────────────────╢
    ║  Step 7: Botão Flutuante (FAB)        ║
    ║  ✓ Mostra como enviar elogios         ║
    ║  ✓ Botão Próximo                      ║
    ╚═══════════════════════════════════════╝
                           ↓
        ┌──────────────────────────────────┐
        │  Step 8: 👆 Clique em TRANSAÇÕES │
        │  ✗ Sem navegação                 │
        └──────────────────────────────────┘
                           ↓
    ╔═══════════════════════════════════════╗
    ║   PÁGINA DE TRANSAÇÕES (3 steps)      ║
    ╠═══════════════════════════════════════╣
    ║  Step 9: Intro da Página              ║
    ║  ✓ Explica a página                   ║
    ║  ✓ Botão Próximo                      ║
    ╟───────────────────────────────────────╢
    ║  Step 10: Saldos e Renovação          ║
    ║  ✓ Info sobre renovação semanal       ║
    ║  ✓ Botão Próximo                      ║
    ╟───────────────────────────────────────╢
    ║  Step 11: Feed com Filtros            ║
    ║  ✓ Mostra histórico e filtros         ║
    ║  ✓ Botão Próximo                      ║
    ╚═══════════════════════════════════════╝
                           ↓
        ┌──────────────────────────────────┐
        │  Step 12: 👆 Clique em PRÊMIOS   │
        │  ✗ Sem navegação                 │
        └──────────────────────────────────┘
                           ↓
    ╔═══════════════════════════════════════╗
    ║     PÁGINA DE PRÊMIOS (2 steps)       ║
    ╠═══════════════════════════════════════╣
    ║  Step 13: Filtros                     ║
    ║  ✓ Mostra sistema de filtros          ║
    ║  ✓ Botão Próximo                      ║
    ╟───────────────────────────────────────╢
    ║  Step 14: Grid de Produtos            ║
    ║  ✓ Mostra catálogo                    ║
    ║  ✓ Botão Próximo                      ║
    ╚═══════════════════════════════════════╝
                           ↓
        ┌──────────────────────────────────┐
        │  Step 15: 👆 Clique em RESGATES  │
        │  ✗ Sem navegação                 │
        └──────────────────────────────────┘
                           ↓
    ╔═══════════════════════════════════════╗
    ║    PÁGINA DE RESGATES (3 steps)       ║
    ╠═══════════════════════════════════════╣
    ║  Step 16: Intro da Página             ║
    ║  ✓ Explica acompanhamento             ║
    ║  ✓ Botão Próximo                      ║
    ╟───────────────────────────────────────╢
    ║  Step 17: Filtros                     ║
    ║  ✓ Busca, status e período            ║
    ║  ✓ Botão Próximo                      ║
    ╟───────────────────────────────────────╢
    ║  Step 18: Lista de Resgates           ║
    ║  ✓ Cards com status e detalhes        ║
    ║  ✓ Botão Próximo                      ║
    ╚═══════════════════════════════════════╝
                           ↓
        ┌──────────────────────────────────┐
        │  Step 19: 👆 Clique em CONFIG    │
        │  ✗ Sem navegação                 │
        └──────────────────────────────────┘
                           ↓
    ╔═══════════════════════════════════════╗
    ║  PÁGINA DE CONFIGURAÇÕES (2 steps)    ║
    ╠═══════════════════════════════════════╣
    ║  Step 20: Abas                        ║
    ║  ✓ Mostra seções disponíveis          ║
    ║  ✓ Botão Próximo                      ║
    ╟───────────────────────────────────────╢
    ║  Step 21: Controle do Tour            ║
    ║  ✓ Mostra como reiniciar              ║
    ║  ✓ Botão Próximo                      ║
    ╚═══════════════════════════════════════╝
                           ↓
        ┌──────────────────────────────────┐
        │  Step 22: 🎉 CONCLUSÃO           │
        │  ✓ Modal de parabéns             │
        │  ✓ Link para feedback            │
        │  ✓ Botão Fechar                  │
        └──────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│              TOUR CONCLUÍDO ✨                              │
│     (Marcado como completo no localStorage)                 │
└─────────────────────────────────────────────────────────────┘
```

---

## 📱 Suporte Mobile

### Problema e Solução

**Problema Original:**
Em dispositivos mobile, a sidebar está oculta por padrão e precisa ser aberta manualmente clicando no ícone de menu. Isso criava um problema durante o onboarding, pois os steps que mostram elementos da sidebar não eram visíveis para usuários mobile.

**Solução Implementada:**
O sistema agora detecta automaticamente quando está em mobile (largura < 1024px) e gerencia a abertura/fechamento da sidebar durante o tour:

### Funcionamento

**1. Detecção de Mobile:**
```typescript
const isMobile = () => window.innerWidth < 1024 // lg breakpoint do Tailwind
```

**2. Abertura Automática:**
- Quando o tour começa em mobile, a sidebar abre automaticamente
- Durante os steps que precisam da sidebar (1, 2, 3, 4, 8, 12, 15, 19), ela permanece aberta
- Nos demais steps, a sidebar fecha automaticamente para não atrapalhar a visualização

**3. Steps que Mantêm Sidebar Aberta:**
- Step 1: Introdução à sidebar
- Step 2: Cards de saldo
- Steps 3, 4, 8, 12, 15, 19: Cliques de navegação na sidebar

**4. Fechamento Inteligente:**
- Ao completar o tour, a sidebar fecha automaticamente
- Ao cancelar/fechar o tour, a sidebar fecha
- Ao navegar para steps que não precisam dela, fecha automaticamente

### Implementação Técnica

**SidebarContext:**
```typescript
interface SidebarContextType {
  // ... existing
  mobileSidebarOpen: boolean
  setMobileSidebarOpen: (open: boolean) => void
  toggleMobileSidebar: () => void
}
```

**OnboardingContext:**
```typescript
// Gerenciar a sidebar mobile durante o tour
useEffect(() => {
  if (!isOpen) return

  const stepsThatNeedSidebar = [1, 2, 3, 4, 8, 12, 15, 19]
  
  if (isMobile()) {
    if (stepsThatNeedSidebar.includes(currentStep)) {
      setMobileSidebarOpen(true)
    } else if (currentStep > 4 && !stepsThatNeedSidebar.includes(currentStep)) {
      setMobileSidebarOpen(false)
    }
  }
}, [currentStep, isOpen, isMobile, setMobileSidebarOpen])
```

**Event Listener:**
- Evento customizado `onboarding:close-mobile-sidebar` para sincronização
- Listener na Sidebar para responder ao fechamento do tour

### Experiência do Usuário

**Desktop (≥1024px):**
- Sidebar sempre visível (a menos que colapsada pelo usuário)
- Comportamento padrão do onboarding
- Sem interferência na navegação

**Mobile (<1024px):**
- ✅ Sidebar abre automaticamente ao iniciar o tour
- ✅ Permanece aberta durante steps relevantes
- ✅ Fecha nos steps de conteúdo das páginas
- ✅ Reabre automaticamente nos steps de navegação
- ✅ Fecha ao completar ou cancelar o tour
- ✅ Transições suaves com animações CSS

### Benefícios

1. **Experiência Fluída:** Usuário não precisa abrir/fechar a sidebar manualmente
2. **Contexto Visual:** Elementos sempre visíveis quando precisam ser destacados
3. **Não Intrusivo:** Sidebar fecha quando não é necessária
4. **Consistente:** Mesma experiência em todos os dispositivos
5. **Automático:** Zero configuração ou intervenção do usuário

---

## 🔧 Arquitetura Técnica

### Problema Inicial

O `OnboardingProvider` está fora do `RouterProvider` (Tanstack Router), então não podemos usar hooks como `useLocation` diretamente no contexto de onboarding.

### Solução Implementada

Criamos uma arquitetura de **listener** que conecta o Router com o Onboarding Context:

```
RouterProvider
  └── RootComponent
      ├── OnboardingRouteListener (monitora mudanças de rota)
      └── Outlet (páginas)

OnboardingProvider (fora do Router)
  └── expõe handleRouteChange()
```

### Fluxo de Dados

```
Usuário clica no link da sidebar
    ↓
Router navega para nova página
    ↓
OnboardingRouteListener detecta mudança (useLocation)
    ↓
Chama handleRouteChange(pathname)
    ↓
OnboardingContext verifica STEP_TO_ROUTE_MAP
    ↓
Se pathname === expectedRoute E previousRoute !== expectedRoute
    ↓
setCurrentStep(currentStep + 1) após 300ms
    ↓
Atualiza previousRouteRef.current = pathname
    ↓
Tour avança para próximo step
```

**Importante:** O `previousRouteRef` previne que o tour avance automaticamente quando já está na rota correta. Isso é essencial para steps consecutivos na mesma rota (ex: link da sidebar → conteúdo da página).

---

## 📁 Implementação Detalhada

### 1. OnboardingContext.tsx

**Funcionalidades principais:**

- Interface `OnboardingContextType` com `handleRouteChange`
- Mapeamento `STEP_TO_ROUTE_MAP` entre steps e rotas
- Array `tourSteps` com todos os 23 steps configurados
- Lógica de avanço baseada em navegação
- Controle de visibilidade de botões via `stepsWithNavigation`
- Animação de pulse para steps interativos

**STEP_TO_ROUTE_MAP:**
```typescript
export const STEP_TO_ROUTE_MAP: Record<number, string> = {
  3: '/home',           // Step 3: clique em "home"
  4: '/elogios',        // Step 4: clique em "praises"
  8: '/transacoes',     // Step 8: clique em "transactions"
  12: '/prizes',        // Step 12: clique em "prizes"
  15: '/resgates',      // Step 15: clique em "redemptions"
  19: '/settings',      // Step 19: clique em "settings"
}
```

**Steps com navegação visível:**
```typescript
const stepsWithNavigation = [0, 1, 2, 5, 6, 7, 9, 10, 11, 13, 14, 16, 17, 18, 20, 21, 22]
```

### 2. OnboardingRouteListener.tsx

Componente que faz a ponte entre Tanstack Router e OnboardingContext:

```typescript
import React from 'react'
import { useLocation } from '@tanstack/react-router'
import { useOnboarding } from '@/contexts/OnboardingContext'

export const OnboardingRouteListener: React.FC = () => {
  const location = useLocation()
  const { handleRouteChange } = useOnboarding()

  React.useEffect(() => {
    handleRouteChange(location.pathname)
  }, [location.pathname, handleRouteChange])

  return null
}
```

### 3. router.tsx

Integração do listener no root component:

```typescript
import { OnboardingRouteListener } from '@/components/OnboardingRouteListener'

function RootComponent() {
  return (
    <div>
      <OnboardingRouteListener />
      <Outlet />
    </div>
  )
}
```

### 4. data-tour Attributes

**Sidebar.tsx:**
- `data-tour="sidebar"` - Container da sidebar
- `data-tour="balance-cards"` - Seção de saldos
- `data-tour="home"` - Link Início
- `data-tour="praises"` - Link Elogios
- `data-tour="transactions"` - Link Transações
- `data-tour="prizes"` - Link Prêmios
- `data-tour="redemptions"` - Link Resgates
- `data-tour="profile"` - Link Configurações

**HomePage.tsx:**
- `data-tour="welcome"` - Título de boas-vindas

**PraisesPage.tsx:**
- `data-tour="praises-stats"` - Cards de estatísticas
- `data-tour="praises-feed"` - Feed de elogios
- `data-tour="praises-fab"` - Botão flutuante

**TransactionsPage.tsx:**
- `data-tour="transactions-page"` - Título da página
- `data-tour="transactions-balance"` - Header de saldos
- `data-tour="transactions-feed"` - Feed de transações

**PrizesPage.tsx:**
- `data-tour="prizes-filters"` - Filtros de produtos
- `data-tour="prizes-grid"` - Grid de prêmios

**RedemptionsPage.tsx:**
- `data-tour="redemptions-page"` - Título da página
- `data-tour="redemptions-filters"` - Filtros de resgates
- `data-tour="redemptions-list"` - Lista de resgates

**SettingsPage.tsx:**
- `data-tour="settings-tabs"` - Abas de navegação
- `data-tour="settings-tour-control"` - Controle do tour

### 5. index.css

Animação para steps interativos:

```css
@keyframes pulse {
  0%, 100% {
    opacity: 1
    transform: scale(1)
  }
  50% {
    opacity: 0.9
    transform: scale(1.02)
  }
}
```

---

## 📚 Histórico de Versões

### ✨ Versão 2.1 - Suporte Mobile (Atual)

**Data:** Outubro 2025

**Mudanças:**
- ✅ Detecção automática de dispositivo mobile
- ✅ Gerenciamento inteligente da sidebar mobile durante o tour
- ✅ Abertura/fechamento automático baseado nos steps
- ✅ Event listener para sincronização entre componentes
- ✅ Estado compartilhado no SidebarContext para controle da sidebar mobile
- ✅ Transições suaves e não intrusivas
- ✅ data-tour="sidebar" adicionado à sidebar mobile

**Arquivos Modificados:**
1. `contexts/SidebarContext.tsx` - Adicionado estado `mobileSidebarOpen`
2. `contexts/OnboardingContext.tsx` - Lógica de gerenciamento mobile
3. `components/layout/Sidebar.tsx` - Integração com estado compartilhado
4. `hooks/useSidebar.ts` - Sem mudanças (já retorna todo o contexto)

**Impacto:**
- Experiência mobile agora é tão boa quanto desktop
- Zero configuração adicional necessária
- Retrocompatível com implementação existente

### ✨ Versão 2.0 - Steps Detalhados

**Mudanças:** De 18 steps → 23 steps (+28%)

**Novos Steps:**

1. **Step 2: Balance Cards**
   - Info sobre renovação semanal de moedas
   - Explicação dos dois tipos de saldo

2. **Step 10: Transactions Balance**
   - Reforço sobre renovação semanal
   - Contexto sobre acumulação de moedas

3. **Step 11: Transactions Feed**
   - Explicação de filtros e paginação
   - Como navegar no histórico

4. **Step 17: Redemptions Filters**
   - Sistema de filtros avançado
   - Busca por nome, status e período

5. **Step 18: Redemptions List**
   - Interface de acompanhamento
   - Como ver detalhes e timeline

**Comparativo de Versões:**

| Métrica | v1.0 | v2.0 | Mudança |
|---------|------|------|---------|
| Total de Steps | 18 | 23 | +5 (+28%) |
| Steps Informativos | 12 | 17 | +5 (+42%) |
| Steps na Transações | 1 | 3 | +2 |
| Steps nos Resgates | 1 | 3 | +2 |
| Steps na Sidebar | 1 | 2 | +1 |
| Tempo Estimado | 3-5 min | 4-6 min | +1 min |

**O que o usuário aprende agora:**

**Sobre Saldos 💰**
- ✅ Existem 2 tipos de moedas (para elogiar e resgatáveis)
- ✅ Moedas para elogiar renovam toda semana ⏰
- ✅ Moedas resgatáveis acumulam dos elogios recebidos
- ✅ Onde ver os saldos (sidebar + páginas)

**Sobre Transações 📊**
- ✅ 3 tipos de transações (elogios enviados, recebidos, resgates)
- ✅ Como filtrar por tipo e período
- ✅ Como ver mais transações antigas (paginação)
- ✅ Onde ver saldos atualizados em tempo real

**Sobre Resgates 📦**
- ✅ 4 status possíveis (pendente, processando, concluído, cancelado)
- ✅ Como buscar por nome do produto
- ✅ Como filtrar por status e período
- ✅ Como ver detalhes (clicando no card)
- ✅ Timeline de rastreamento disponível

### 📅 Versão 1.0 - Onboarding Interativo (Lançamento Inicial)

**Features:**
- ✅ 18 steps cobrindo 6 páginas principais
- ✅ Navegação obrigatória via cliques na sidebar
- ✅ Steps informativos com botões de navegação
- ✅ Detecção automática de navegação
- ✅ Persistência no localStorage
- ✅ Reinício via Configurações
- ✅ Modal de conclusão com feedback

---

## 🎯 Como Usar

### Iniciar o Tour

**Automaticamente:**
- Tour inicia automaticamente para novos usuários (primeira visita)
- Verifica `localStorage.getItem('valorize_tour_completed')`

**Manualmente:**
- Acesse **Configurações → Preferências**
- Clique em "Reiniciar Tour"
- Tour começa do início

### Navegar no Tour

**Steps com 👆 (clique obrigatório):**
- Tooltip aparece indicando qual link clicar
- Botões de navegação ficam ocultos
- Usuário DEVE clicar no link indicado para avançar
- Tour detecta navegação automaticamente

**Steps informativos:**
- Botões "Próximo" e "Anterior" disponíveis
- Usuário pode avançar no seu ritmo
- Pode pular o tour clicando no "X"

### Completar o Tour

1. Navegue por todos os 22 steps
2. Modal de conclusão aparece
3. Opção de enviar feedback
4. Tour marcado como completo no localStorage
5. Não se repete automaticamente

---

## 🎨 Personalização

### Adicionar Novo Step Interativo

**1. Adicione o mapeamento de rota:**
```typescript
// OnboardingContext.tsx
export const STEP_TO_ROUTE_MAP: Record<number, string> = {
  // ... existing
  23: '/nova-rota', // Novo step
}
```

**2. Configure o step:**
```typescript
// OnboardingContext.tsx - tourSteps array
{
  selector: '[data-tour="novo-elemento"]',
  content: '👆 Clique aqui para...',
  position: 'right',
  stepInteraction: true,
  styles: {
    popover: (base) => ({
      ...base,
      animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
    }),
  },
}
```

**3. Adicione o atributo data-tour:**
```tsx
// NovaPage.tsx
<button data-tour="novo-elemento">Clique aqui</button>
```

**4. Atualize stepsWithNavigation:**
```typescript
// OnboardingContext.tsx
// Não adicione o índice se for step interativo (sem botões)
// Adicione o índice se for step informativo (com botões)
```

### Adicionar Step Informativo

**1. Adicione o data-tour no elemento:**
```tsx
<div data-tour="novo-conteudo">
  {/* conteúdo */}
</div>
```

**2. Adicione o step no array:**
```typescript
{
  selector: '[data-tour="novo-conteudo"]',
  content: 'Aqui você pode fazer X, Y e Z! 🎯',
  position: 'bottom',
}
```

**3. Adicione o índice em stepsWithNavigation:**
```typescript
const stepsWithNavigation = [..., 23] // Índice do novo step
```

### Customizar Mensagens

**Boas práticas:**
- Mantenha mensagens **curtas e objetivas**
- Use **emojis** para destacar ações importantes
- Use **"👆"** para indicar cliques obrigatórios
- Use **verbo no imperativo** ("Clique", "Veja", "Use")
- Limite a **2-3 linhas** de texto

**Exemplo:**
```typescript
// ❌ Ruim
content: 'Nesta seção você tem acesso a várias funcionalidades importantes...'

// ✅ Bom
content: 'Use os filtros para encontrar produtos rapidamente! 🔍'
```

---

## 🐛 Troubleshooting

### Tour não avança ao clicar no link

**Possíveis causas:**
- ❌ `STEP_TO_ROUTE_MAP` não tem a rota correta
- ❌ `OnboardingRouteListener` não está renderizado no Router
- ❌ Atributo `data-tour` não existe no elemento

**Solução:**
1. Verifique se a rota em `STEP_TO_ROUTE_MAP` corresponde à rota real
2. Confirme que `OnboardingRouteListener` está no `RootComponent` do `router.tsx`
3. Inspecione o elemento e verifique se o atributo `data-tour` está presente

### Botões aparecem quando não deveriam

**Causa:**
- Array `stepsWithNavigation` está incorreto

**Solução:**
- Remova o índice do step do array `stepsWithNavigation`
- Steps interativos (com clique obrigatório) NÃO devem ter botões

### Animação de pulse não funciona

**Possíveis causas:**
- ❌ CSS do `@keyframes pulse` não está carregado
- ❌ Preferência de "reduce-motion" está ativa

**Solução:**
1. Verifique se `index.css` tem o `@keyframes pulse` definido
2. Teste com `prefers-reduced-motion: no-preference`
3. Confirme que os estilos estão sendo aplicados no step

### Tour fica preso em um step

**Causa:**
- `previousRouteRef` não está sendo atualizado corretamente

**Solução:**
- Verifique o código de `handleRouteChange` em `OnboardingContext.tsx`
- Confirme que `previousRouteRef.current` está sendo atualizado após avançar

### Sidebar não abre em mobile durante o tour

**Possíveis causas:**
- ❌ `mobileSidebarOpen` não está sincronizado no SidebarContext
- ❌ Detecção de mobile não está funcionando
- ❌ Event listener não está registrado

**Solução:**
1. Verifique se `setMobileSidebarOpen` está disponível no SidebarContext
2. Teste a função `isMobile()` no console (deve retornar true para largura < 1024px)
3. Confirme que o event listener está registrado na Sidebar
4. Verifique se o array `stepsThatNeedSidebar` inclui o step atual

### Step não encontra o elemento

**Possíveis causas:**
- ❌ Elemento ainda não foi renderizado
- ❌ Seletor `data-tour` está errado
- ❌ Elemento está em uma rota diferente

**Solução:**
1. Adicione `setTimeout` de 300ms antes de avançar (já implementado)
2. Verifique o seletor exato no HTML renderizado
3. Confirme que o elemento está na página atual do tour

---

## ✅ Boas Práticas Implementadas

### UX
- ✅ **Navegação forçada**: Garante exploração completa
- ✅ **Steps informativos**: Explicam funcionalidades-chave
- ✅ **Feedback visual**: Tooltips claros e objetivos
- ✅ **Flexibilidade**: Botões de navegação quando apropriado
- ✅ **Persistência**: Tour não se repete automaticamente
- ✅ **Reinício fácil**: Disponível nas Configurações

### Técnicas
- ✅ **Separação de contextos**: Router e Onboarding desacoplados
- ✅ **Listener pattern**: Comunicação unidirecional clara
- ✅ **Ref para controle**: Previne avanços indesejados
- ✅ **Delay estratégico**: 300ms para renderização
- ✅ **CSS modular**: Animações isoladas
- ✅ **TypeScript strict**: Tipagem completa
- ✅ **Estado compartilhado**: SidebarContext gerencia sidebar mobile
- ✅ **Responsive design**: Detecção automática de dispositivo
- ✅ **Event-driven**: Custom events para sincronização de componentes

---

## 🔮 Roadmap Futuro

### v3.0 (Planejado)
- [ ] Step na PrizeDetailsPage explicando como resgatar
- [ ] Step na RedemptionDetailsPage explicando timeline
- [ ] Animações entre steps com react-spring
- [ ] Progress indicator visual
- [ ] Tour personalizado por role (user/admin)
- [ ] Analytics de quais steps usuários pulam mais

### v2.2 (Backlog)
- [ ] Tour em vídeo opcional
- [ ] Tooltips permanentes para novos recursos
- [ ] Gamification (badge de "Explorador")
- [ ] Compartilhar progresso do tour
- [ ] Gestos de swipe em mobile para navegar entre steps

---

## 📚 Referências

- [Tanstack Router - useLocation](https://tanstack.com/router/latest)
- [React Tour - Documentation](https://docs.react.tours/)
- [React Spring - Animations](https://www.react-spring.dev/)
- [Clean Architecture Concepts](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)

---

## 🎓 Objetivos Alcançados

1. ✅ Usuário conhece **todas as páginas principais**
2. ✅ Usuário entende **funcionalidades-chave** de cada página
3. ✅ Usuário aprende **como navegar** no sistema
4. ✅ Experiência é **interativa e engajadora**
5. ✅ Tour é **rápido** (4-6 minutos) e **direto ao ponto**
6. ✅ Sistema de **moedas e renovação** bem explicado
7. ✅ **Filtros e buscas** completamente cobertos
8. ✅ **Rastreamento de resgates** claramente demonstrado

---

**Última atualização:** Versão 2.1 - Outubro 2025 (Suporte Mobile)

