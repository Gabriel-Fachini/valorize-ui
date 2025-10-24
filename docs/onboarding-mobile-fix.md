# Correção do Onboarding para Mobile

## Problema Identificado

O onboarding do sistema estava com um bug crítico em dispositivos móveis:

1. **Sidebar oculta no mobile**: A sidebar fica escondida por padrão em telas menores que 1024px (usando `translate-x-full` e `opacity-0`)
2. **Steps não encontrados**: O Joyride não conseguia encontrar os elementos `data-tour` porque estavam em elementos DOM ocultos
3. **Tour pulava para o final**: Como nenhum target era encontrado, o tour pulava todos os steps e ia direto para a mensagem de conclusão

## Solução Implementada

### 1. Detecção de Dispositivo Mobile

Adicionado no `OnboardingManager.tsx`:

```typescript
const [isMobile, setIsMobile] = useState(false)

useEffect(() => {
  const checkMobile = () => {
    const mobile = window.innerWidth < 1024
    setIsMobile(mobile)
  }

  checkMobile()
  window.addEventListener('resize', checkMobile)
  return () => window.removeEventListener('resize', checkMobile)
}, [])
```

### 2. Controle Automático da Sidebar Mobile

O sistema agora abre automaticamente a sidebar quando o onboarding inicia em mobile:

```typescript
const handleStartSidebarTour = useCallback(() => {
  setCurrentTour(true)
  setShowWelcome(false)
  
  // Open mobile sidebar if on mobile device
  if (isMobile) {
    setMobileSidebarOpen(true)
  }
  
  startTour()
}, [startTour, isMobile, setMobileSidebarOpen])
```

E fecha quando o tour termina ou é pulado:

```typescript
const handleTourComplete = () => {
  // ... código existente
  
  // Close mobile sidebar when tour ends
  if (isMobile) {
    setMobileSidebarOpen(false)
  }
  
  // ... código existente
}
```

### 3. Seletores Adaptativos por Dispositivo

Criada função helper em `onboardingSteps.ts`:

```typescript
const getSelectorForDevice = (tourAttr: string, isMobile: boolean): string => {
  const sidebarElements = [
    'sidebar',
    'user-profile',
    'balance-cards',
    'home',
    'praises',
    'transactions',
    'prizes',
    'redemptions',
    'profile',
  ]

  if (sidebarElements.includes(tourAttr)) {
    return isMobile
      ? `#mobile-sidebar [data-tour="${tourAttr}"]`
      : `aside[role="complementary"] [data-tour="${tourAttr}"]`
  }

  return `[data-tour="${tourAttr}"]`
}
```

### 4. Steps Dinâmicos

Nova função `getSidebarOnboardingSteps(isMobile)` que gera steps com:

- **Seletores corretos**: Usa `#mobile-sidebar` para mobile e `aside[role="complementary"]` para desktop
- **Placement adaptativo**: Usa `bottom` para mobile e `right` para desktop
- **Mantém compatibilidade**: A constante `sidebarOnboardingSteps` antiga ainda existe (deprecated) para não quebrar código existente

### 5. Melhorias no JoyrideTour

- **Scroll habilitado**: Mudado `disableScrolling` de `true` para `false`
- **Scroll automático**: Habilitado `scrollToFirstStep={true}` e `scrollOffset={100}`
- **Melhor logging**: Console.warn agora mostra o índice do step quando target não é encontrado

## Arquivos Modificados

1. **`apps/dashboard/src/components/onboarding/onboardingSteps.ts`**
   - Adicionada função `getSelectorForDevice()`
   - Criada função `getSidebarOnboardingSteps(isMobile)`
   - Mantida constante antiga como deprecated

2. **`apps/dashboard/src/components/onboarding/OnboardingManager.tsx`**
   - Adicionado state `isMobile` com detecção via resize listener
   - Importado e usado `useSidebar()` hook
   - Lógica para abrir/fechar sidebar mobile automaticamente
   - Mudado de `sidebarOnboardingSteps` para `getSidebarOnboardingSteps(isMobile)`

3. **`apps/dashboard/src/components/onboarding/JoyrideTour.tsx`**
   - Habilitado scroll e scroll automático
   - Melhor tratamento de TARGET_NOT_FOUND com logging de índice
   - Adicionado `scrollOffset={100}` para melhor posicionamento

## Como Testar

### Desktop

1. Abrir a aplicação em tela >= 1024px
2. Iniciar o onboarding
3. Verificar que todos os steps aparecem na sidebar lateral fixa
4. Placement deve ser `right`

### Mobile

1. Abrir DevTools e configurar para mobile (< 1024px)
2. Iniciar o onboarding
3. **Sidebar deve abrir automaticamente**
4. Verificar que todos os steps aparecem na sidebar mobile
5. Placement deve ser `bottom`
6. Ao finalizar/pular, sidebar deve fechar automaticamente

### Teste de Resize

1. Iniciar onboarding em desktop
2. Redimensionar para mobile durante o tour
3. Verificar que funciona corretamente (pode necessitar restart do tour)

## Referências

- [React Joyride Documentation](https://docs.react-joyride.com/)
- [React Joyride - Callback Props](https://docs.react-joyride.com/callback)
- [React Joyride - Step Props](https://docs.react-joyride.com/step)

## Melhorias Futuras

1. **Teste de unidade**: Adicionar testes para `getSelectorForDevice()`
2. **E2E tests**: Testar fluxo completo de onboarding em mobile e desktop
3. **Restart do tour**: Permitir que o tour se adapte em tempo real ao resize
4. **Orientação**: Detectar mudança de orientação (portrait/landscape) em mobile
5. **Persistência**: Salvar progresso do tour se usuário fechar sem completar
