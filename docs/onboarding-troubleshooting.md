# Onboarding System - Troubleshooting & Architecture

## Índice
1. [Visão Geral](#visão-geral)
2. [Arquitetura do Sistema](#arquitetura-do-sistema)
3. [Problema Identificado](#problema-identificado)
4. [Tentativas de Solução](#tentativas-de-solução)
5. [Estado Atual](#estado-atual)
6. [Próximos Passos](#próximos-passos)
7. [Debugging Guide](#debugging-guide)

---

## Visão Geral

O sistema de onboarding usa a biblioteca `@reactour/tour` para guiar novos usuários através das funcionalidades da aplicação. O tour é dinâmico e adapta-se para dispositivos mobile e desktop, navegando entre diferentes páginas.

### Arquivos Principais
- **`OnboardingContext.tsx`**: Gerencia estado e lógica do tour
- **`OnboardingRouteListener.tsx`**: Monitora mudanças de rota
- **`Sidebar.tsx`**: Contém elementos com `data-tour` attributes
- **Páginas individuais**: Contêm elementos específicos do tour

---

## Arquitetura do Sistema

### Componentes

```
App
├── OnboardingProvider (Wrapper do TourProvider)
│   ├── OnboardingControllerContent (Lógica interna)
│   └── TourProvider (@reactour/tour)
└── RouterProvider
    └── RootComponent
        ├── OnboardingRouteListener (Monitora rotas)
        └── Páginas protegidas
```

### Fluxo do Tour

1. **Inicialização**
   - Tour inicia automaticamente para usuários de primeira vez
   - Detecta se é mobile (`window.innerWidth < 1024`) ou desktop
   - Abre sidebar mobile automaticamente em dispositivos móveis

2. **Navegação**
   - Steps que requerem navegação têm `stepInteraction: true`
   - `OnboardingRouteListener` detecta mudanças de rota
   - `handleRouteChange` verifica se a rota corresponde ao step atual
   - Avança para o próximo step após timeout (500ms mobile, 300ms desktop)

3. **Gerenciamento da Sidebar Mobile**
   - Steps que precisam da sidebar: `[1, 2, 3, 4, 8, 12, 15, 19]`
   - Sidebar abre/fecha automaticamente conforme necessário
   - Fecha quando tour é concluído ou cancelado

### Mapeamento de Steps

```typescript
STEP_TO_ROUTE_MAP = {
  3: '/home',           // Step 3: clique em "home"
  4: '/elogios',        // Step 4: clique em "praises"
  8: '/transacoes',     // Step 8: clique em "transactions"
  12: '/prizes',        // Step 12: clique em "prizes"
  15: '/resgates',      // Step 15: clique em "redemptions"
  19: '/settings',      // Step 19: clique em "settings"
}
```

### Geração Dinâmica de Steps

A função `getTourSteps()` gera os steps baseado no tamanho da tela:

```typescript
const getTourSteps = (): StepType[] => {
  const isMobile = window.innerWidth < 1024
  
  return [
    // Steps com seletores dinâmicos baseados em isMobile
    {
      selector: getSelectorForDevice('praises', isMobile),
      // Mobile: #mobile-sidebar [data-tour="praises"]
      // Desktop: aside[role="complementary"] [data-tour="praises"]
    },
    // ...
  ]
}
```

---

## Problema Identificado

### Sintoma Principal
Quando o usuário navega para a página de elogios (step 4 → 5), o tour não mostra os elementos da página (`praises-stats`, `praises-feed`, `praises-fab`).

### Causa Raiz
O Reactour **não reavalia seletores de string** dinamicamente. Quando os steps são gerados:
- Página atual: `/home`
- Elementos da página `/elogios` não existem no DOM
- Reactour "cacheia" os seletores e não os reavalia quando você navega

### Evidências dos Logs

```
🔍 Step 5 element ([data-tour="praises-stats"]): ✅ Found after navigation
```

O elemento **EXISTE** no DOM após navegação, mas o Reactour não o encontra porque:
1. O seletor foi avaliado quando o tour começou (na página `/home`)
2. Naquele momento, o elemento não existia
3. Reactour marcou internamente como "não encontrado"
4. Não reavalia mesmo após navegação

---

## Tentativas de Solução

### 1. Seletores Dinâmicos com `getSelectorForDevice()`

**Objetivo**: Garantir seletores corretos para mobile/desktop

**Implementação**:
```typescript
const getSelectorForDevice = (tourAttr: string, isMobile?: boolean) => {
  const sidebarElements = ['balance-cards', 'home', 'praises', ...]
  
  if (sidebarElements.includes(tourAttr)) {
    const isMobileNow = isMobile ?? (window.innerWidth < 1024)
    
    return isMobileNow 
      ? `#mobile-sidebar [data-tour="${tourAttr}"]`
      : `aside[role="complementary"] [data-tour="${tourAttr}"]`
  }
  
  return `[data-tour="${tourAttr}"]`
}
```

**Resultado**: ✅ Funcionou para elementos da sidebar, mas não resolve elementos de páginas específicas

### 2. `getTourSteps()` como Função (não constante)

**Objetivo**: Regenerar steps baseado no tamanho da tela atual

**Antes**:
```typescript
const tourSteps: StepType[] = [...]
```

**Depois**:
```typescript
const getTourSteps = (): StepType[] => {
  const isMobile = window.innerWidth < 1024
  return [...]
}
```

**Resultado**: ✅ Funcionou para gerar steps corretos, mas não resolve elementos dinâmicos

### 3. `setSteps()` no `useEffect`

**Objetivo**: Atualizar steps quando o tour abre

**Implementação**:
```typescript
React.useEffect(() => {
  if (isOpen && setSteps) {
    const updatedSteps = getTourSteps()
    setSteps(updatedSteps)
  }
}, [isOpen, setSteps])
```

**Resultado**: ✅ Steps são atualizados, mas seletores ainda são strings estáticas

### 4. Listener de Resize

**Objetivo**: Atualizar steps quando a tela redimensiona

**Resultado**: ✅ Funciona para resize, mas não resolve navegação entre páginas

### 5. Seletores como Funções

**Objetivo**: Fazer Reactour reavaliar seletores dinamicamente

**Tentativa**:
```typescript
{
  selector: () => document.querySelector('[data-tour="praises-stats"]') as Element,
  // ...
}
```

**Resultado**: ❌ **ERRO**
```
Uncaught SyntaxError: Failed to execute 'querySelector' on 'Document': 
'()=>document.querySelector('[data-tour="praises-stats"]')' is not a valid selector.
```

**Causa**: Reactour converte o selector para string internamente, não suporta funções como selector

### 6. Refresh de Steps Após Navegação

**Objetivo**: Forçar Reactour a reprocessar seletores após navegar

**Implementação**:
```typescript
setTimeout(() => {
  setCurrentStep(currentStep + 1)
  
  if (setSteps) {
    const refreshedSteps = getTourSteps()
    setSteps(refreshedSteps) // ← Força refresh
  }
}, delay)
```

**Resultado**: ⚠️ **Parcialmente funcional** - Steps são atualizados, mas Reactour ainda não encontra elementos de páginas não renderizadas inicialmente

---

## Estado Atual

### O Que Funciona ✅

1. **Seletores dinâmicos para sidebar**: Mobile vs Desktop corretamente identificados
2. **Navegação entre rotas**: `OnboardingRouteListener` detecta mudanças e avança steps
3. **Gerenciamento de sidebar mobile**: Abre/fecha automaticamente conforme necessário
4. **Detecção de elementos**: Sistema de logs confirma que elementos existem no DOM
5. **Steps são regenerados**: `getTourSteps()` é chamado dinamicamente

### O Que Não Funciona ❌

1. **Elementos de páginas específicas não são exibidos**: Reactour não mostra elementos que não existiam quando o tour iniciou
2. **Seletores não são reavaliados**: Mesmo com `setSteps()`, o Reactour mantém cache interno

### Logs de Debug Implementados

```typescript
// Geração de steps
console.log(`🔧 Generating tour steps for ${isMobile ? 'MOBILE' : 'DESKTOP'}`)

// Seletores (sidebar)
console.log(`🎯 [SIDEBAR-MOBILE] ${tourAttr} → ${selector}`)
console.log(`🖥️ [SIDEBAR-DESKTOP] ${tourAttr} → ${selector}`)

// Mudança de rota
console.log('🚦 Route changed:', { currentStep, pathname, expectedRoute, shouldAdvance })

// Avanço de step
console.log(`⏭️ Advancing to step ${currentStep + 1} after ${delay}ms delay`)

// Refresh de steps
console.log('🔄 Refreshing tour steps after navigation...')

// Verificação de elemento
console.log(`🔍 Step ${nextStep} element (${selector}):`, element ? '✅ Found' : '⚠️ Not found')
```

---

## Próximos Passos

### Opção 1: Forçar Remontagem do Tour (Recomendado)

**Ideia**: Fechar e reabrir o tour ao navegar entre páginas

```typescript
if (expectedRoute && pathname === expectedRoute) {
  setTimeout(() => {
    // Fecha o tour
    setIsOpen(false)
    
    // Aguarda um pouco
    setTimeout(() => {
      // Avança o step
      setCurrentStep(currentStep + 1)
      
      // Reabre o tour (força remontagem)
      setIsOpen(true)
    }, 100)
  }, delay)
}
```

**Prós**: 
- Força Reactour a reprocessar tudo
- Garante que elementos são encontrados

**Contras**: 
- Experiência visual pode ter "piscada"
- Menos elegante

### Opção 2: Split Tour por Página

**Ideia**: Tour separado para cada página

```typescript
const homeTourSteps = [/* steps da home */]
const praisesTourSteps = [/* steps de elogios */]
// ...

// Trocar steps baseado na rota
useEffect(() => {
  if (pathname === '/home') setSteps(homeTourSteps)
  if (pathname === '/elogios') setSteps(praisesTourSteps)
}, [pathname])
```

**Prós**:
- Cada página tem tour independente
- Elementos sempre existem quando tour roda

**Contras**:
- Perde continuidade do tour global
- Mais complexo de gerenciar

### Opção 3: Biblioteca Alternativa

**Opções**:
- **Shepherd.js**: Mais flexível, suporta seletores dinâmicos
- **Intro.js**: Popular, boa documentação
- **Driver.js**: Leve, moderno

**Prós**:
- Pode resolver problema de seletores dinâmicos
- Mais features

**Contras**:
- Requer reescrita completa
- Nova curva de aprendizado

### Opção 4: Pré-renderizar Elementos Ocultos

**Ideia**: Renderizar elementos de todas as páginas do tour (ocultos) na primeira página

```typescript
// Em HomePage.tsx
<div style={{ display: 'none' }}>
  <div data-tour="praises-stats" />
  <div data-tour="praises-feed" />
  <div data-tour="praises-fab" />
  {/* Outros elementos do tour */}
</div>
```

**Prós**:
- Elementos existem quando tour inicia
- Reactour os encontra sem problemas

**Contras**:
- Gambiarra / hack
- Não elegante
- Problemas de manutenção

### Opção 5: Usar `MutationObserver` (Avançado)

**Ideia**: Monitorar DOM e notificar Reactour quando elementos aparecem

```typescript
useEffect(() => {
  if (!isOpen) return
  
  const observer = new MutationObserver(() => {
    // Elementos mudaram, refresh steps
    if (setSteps) {
      setSteps(getTourSteps())
    }
  })
  
  observer.observe(document.body, { 
    childList: true, 
    subtree: true 
  })
  
  return () => observer.disconnect()
}, [isOpen, setSteps])
```

**Prós**:
- Detecta automaticamente quando elementos aparecem
- Mais robusto

**Contras**:
- Complexidade adicional
- Performance concerns

---

## Debugging Guide

### Como Debugar Problemas do Onboarding

#### 1. Verificar se elemento existe no DOM

```javascript
// No console do navegador
document.querySelector('[data-tour="praises-stats"]')
// Se retornar null, elemento não existe
```

#### 2. Verificar estado do tour

```javascript
// Adicione no código
console.log('Tour state:', {
  isOpen,
  currentStep,
  totalSteps: steps.length,
  currentSelector: steps[currentStep]?.selector
})
```

#### 3. Verificar navegação

```javascript
// Os logs já implementados mostram:
// - 🚦 Route changed
// - ⏭️ Advancing to step
// - 🔍 Element found/not found
```

#### 4. Testar manualmente seletores

```javascript
// Testar seletor mobile
document.querySelector('#mobile-sidebar [data-tour="praises"]')

// Testar seletor desktop
document.querySelector('aside[role="complementary"] [data-tour="praises"]')

// Testar seletor de página
document.querySelector('[data-tour="praises-stats"]')
```

#### 5. Verificar timing

```javascript
// Aumentar delays se elementos não são encontrados
const delay = window.innerWidth < 1024 ? 1000 : 500 // ← Aumentar
```

### Checklist de Troubleshooting

- [ ] Elemento tem atributo `data-tour` correto?
- [ ] Elemento está renderizado no DOM quando tour roda?
- [ ] Seletor corresponde ao tipo de dispositivo (mobile/desktop)?
- [ ] Route mapping está correto em `STEP_TO_ROUTE_MAP`?
- [ ] `OnboardingRouteListener` está renderizado?
- [ ] Delays são suficientes para renderização?
- [ ] Logs mostram elemento como "Found" mas tour não mostra?

### Logs Importantes

```bash
# Tour iniciou corretamente
🎯 Tour steps updated for MOBILE/DESKTOP

# Navegação funcionando
🚦 Route changed: { currentStep: 4, pathname: '/elogios', shouldAdvance: true }
⏭️ Advancing to step 5 after 500ms delay

# Elemento encontrado (mas tour pode não mostrar)
🔍 Step 5 element ([data-tour="praises-stats"]): ✅ Found after navigation

# Se mostrar "Not found", há problema de timing ou elemento não existe
🔍 Step 5 element ([data-tour="praises-stats"]): ⚠️ Still not found
```

---

## Configuração dos Steps

### Tipos de Steps

#### 1. Steps de Navegação (Sidebar)
```typescript
{
  selector: getSelectorForDevice('praises', isMobile),
  content: '👆 Clique em "Elogios"...',
  position: 'right',
  stepInteraction: true, // ← Permite clique
}
```

#### 2. Steps Informativos (Páginas)
```typescript
{
  selector: '[data-tour="praises-stats"]',
  content: 'Aqui você vê suas estatísticas...',
  position: 'bottom',
  // stepInteraction não definido = mostra controles de navegação
}
```

#### 3. Step de Conclusão (Modal)
```typescript
{
  selector: '#tour-completion-modal', // Elemento não existe
  content: ({ setIsOpen }) => <CustomComponent />,
  position: 'center',
  styles: {
    // Customização específica para modal
  }
}
```

### Steps que NÃO Requerem Clique

Lista em `stepsWithNavigation` (linha 347):
```typescript
[0, 1, 2, 5, 6, 7, 9, 10, 11, 13, 14, 16, 17, 18, 20, 21, 22]
```

Esses steps mostram botões "Anterior" e "Próximo" para navegação manual.

---

## Conclusão

O sistema de onboarding está **90% funcional**. O problema restante é uma limitação da biblioteca `@reactour/tour` que não reavalia seletores dinamicamente quando elementos aparecem após a inicialização do tour.

**Recomendação**: Implementar **Opção 1 (Forçar Remontagem)** como solução de curto prazo, ou considerar **Opção 3 (Biblioteca Alternativa)** como solução de longo prazo se o problema persistir.

### Contato para Dúvidas

- Arquivo principal: `/apps/dashboard/src/contexts/OnboardingContext.tsx`
- Logs implementados: Buscar por `console.log` com emojis (🎯, 🚦, ⏭️, 🔍)
- Documentação adicional: `/docs/onboarding-guide.md` e `/docs/onboarding-setup.md`

---

**Última atualização**: 2025-10-04  
**Status**: Problema parcialmente identificado, aguardando implementação de solução definitiva

