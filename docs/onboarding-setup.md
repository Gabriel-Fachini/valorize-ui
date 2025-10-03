# Onboarding Interativo - Valorize Dashboard

## 📦 Biblioteca instalada

- `@reactour/tour@^3.8.0` - Biblioteca para tours interativos em React

## 🎯 Configuração Implementada

### 1. Contexto e Provider

**Arquivo:** `apps/dashboard/src/contexts/OnboardingContext.tsx`

O `OnboardingProvider` envolve todo o app e gerencia:
- Estado de conclusão do tour (persiste em `localStorage`)
- Auto-start do tour para novos usuários autenticados (delay de 1.5 segundos)
- **Não inicia na tela de login** - verifica token de autenticação
- Funções para iniciar, resetar e completar o tour
- Estilos customizados para dark/light mode
- Hook `useOnboarding()` exportado diretamente do contexto

### 2. Hook Integrado ao Contexto

O hook `useOnboarding()` agora é exportado **diretamente do contexto**, eliminando o arquivo separado desnecessário.

**Uso:**
```tsx
import { useOnboarding } from '@/contexts/OnboardingContext'

const { startTour, hasCompletedOnboarding, resetTour } = useOnboarding()
```

**Retorna:**
```tsx
{
  startTour: () => void           // Inicia o tour
  completeTour: () => void         // Marca como concluído (uso interno)
  resetTour: () => void            // Reseta o estado de conclusão
  hasCompletedOnboarding: boolean  // Status de conclusão
}
```

### 3. Steps Configurados

Atualmente **6 steps** estão definidos:

1. **Welcome** (`data-tour="welcome"`) - Boas-vindas centralizadas
2. **Sidebar** (`data-tour="sidebar"`) - Navegação lateral
3. **Praises** (`data-tour="praises"`) - Seção de elogios
4. **Prizes** (`data-tour="prizes"`) - Seção de prêmios
5. **Profile** (`data-tour="profile"`) - Configurações de perfil
6. **Conclusão** (componente customizado) - Mensagem final com:
   - 🎉 Parabéns por concluir o tour
   - Botão para enviar feedback via Google Forms
   - Botão para fechar
   - Marca automaticamente como concluído ao fechar neste step

### 4. Atributos data-tour Adicionados

**Sidebar** (`apps/dashboard/src/components/layout/Sidebar.tsx`):
- `data-tour="sidebar"` - Na tag `<aside>` do sidebar desktop
- `data-tour="welcome"` - No botão "Início"
- `data-tour="praises"` - No botão "Elogios"
- `data-tour="prizes"` - No botão "Prêmios"
- `data-tour="profile"` - No botão "Configurações"

### 5. Controle Manual em Settings

**Arquivo:** `apps/dashboard/src/pages/SettingsPage.tsx`

Na aba "Preferências", foi adicionado um controle para:
- Iniciar o tour manualmente
- Reiniciar o tour (reseta + inicia)
- Mostra status de conclusão

## 🎨 Estilos CSS

**Arquivo:** `apps/dashboard/src/index.css`

CSS Variables adicionadas:
```css
:root {
  --tour-bg-color: #ffffff;
  --tour-text-color: #1f2937;
}

html.dark {
  --tour-bg-color: #1f2937;
  --tour-text-color: #f9fafb;
}
```

## 🚀 Próximos Passos

### 1. Adicionar mais steps ao tour

Edite o array `tourSteps` em `OnboardingContext.tsx`:

```tsx
const tourSteps: StepType[] = [
  {
    selector: '[data-tour="elemento"]',  // Seletor CSS
    content: 'Descrição do step',         // Texto ou componente React
    position: 'top',                      // top|right|bottom|left|center
  },
  // ... mais steps
]
```

### 2. Adicionar atributos data-tour em novos elementos

Em qualquer componente:

```tsx
<button data-tour="meu-elemento">
  Clique aqui
</button>
```

### 3. Customizar estilos do popover

No `OnboardingProvider`, edite a prop `styles`:

```tsx
<TourProvider
  steps={tourSteps}
  styles={{
    popover: (base) => ({
      ...base,
      // Seus estilos customizados
    }),
    // Outros elementos: badge, maskArea, controls, close, etc.
  }}
/>
```

### 4. Adicionar ações customizadas

No step, você pode adicionar callbacks:

```tsx
{
  selector: '[data-tour="elemento"]',
  content: 'Descrição',
  action: (elem) => {
    // Executado quando o step é exibido
    console.log('Step aberto!', elem)
  },
  actionAfter: (elem) => {
    // Executado ao sair do step
    console.log('Saindo do step', elem)
  },
}
```

### 5. Conteúdo dinâmico nos steps

Use função ao invés de string para conteúdo interativo:

```tsx
{
  selector: '[data-tour="elemento"]',
  content: ({ setCurrentStep, currentStep, setIsOpen }) => (
    <div>
      <h3>Título customizado</h3>
      <p>Conteúdo dinâmico</p>
      <button onClick={() => setCurrentStep(currentStep + 1)}>
        Próximo
      </button>
      <button onClick={() => setIsOpen(false)}>
        Fechar
      </button>
    </div>
  ),
}
```

### 6. Controlar o tour de qualquer lugar

```tsx
import { useOnboarding } from '@/contexts/OnboardingContext'

function MeuComponente() {
  const { startTour, resetTour, hasCompletedOnboarding } = useOnboarding()
  
  return (
    <button onClick={startTour}>
      {hasCompletedOnboarding ? 'Rever Tour' : 'Iniciar Tour'}
    </button>
  )
}
```

### 7. Tours múltiplos ou condicionais

Você pode criar diferentes conjuntos de steps baseado em contexto:

```tsx
const onboardingSteps = [/* steps básicos */]
const advancedTourSteps = [/* steps avançados */]

// No provider, use setSteps() do useTour para alternar
const { setSteps } = useTour()
setSteps(advancedTourSteps)
```

## 📚 Documentação Oficial

- [Reactour Docs](https://docs.reactour.dev/)
- [Quickstart](https://docs.reactour.dev/quickstart)
- [Tour Props](https://docs.reactour.dev/tour/props)
- [Hooks & HOC](https://docs.reactour.dev/tour/hooks)

## 🔧 Troubleshooting

### O elemento não é destacado

- Verifique se o atributo `data-tour` está correto
- Confirme que o elemento existe no DOM quando o step é ativado
- Use `disableWhenSelectorFalsy={false}` se quiser mostrar o step mesmo sem elemento

### Tour não abre automaticamente

- Verifique o localStorage: `valorize_onboarding_completed`
- Limpe o localStorage ou use `resetTour()` para testar novamente

### Conflito com animações react-spring

O tour usa transições próprias. Se houver conflito, você pode desabilitar:

```tsx
<TourProvider scrollSmooth={false} />
```

### Estilos não aplicados no dark mode

Certifique-se que as CSS variables estão definidas em `:root` e `html.dark`

## 🎯 Status Atual

✅ Biblioteca instalada  
✅ Provider configurado e adicionado ao App.tsx  
✅ Hook exportado diretamente do contexto (sem arquivo separado desnecessário)  
✅ Contexto de gerenciamento implementado  
✅ Steps definidos (6 steps, incluindo conclusão com feedback)  
✅ Atributos data-tour adicionados no Sidebar  
✅ Controle manual em Settings  
✅ Estilos dark/light mode configurados  
✅ Auto-start apenas para usuários autenticados (não aparece no login)  
✅ Persistência em localStorage  
✅ Step final de conclusão com botão de feedback para Google Forms  
✅ Auto-marca como concluído ao fechar no último step  

🔜 **Próximo:** Expandir steps para outras páginas e funcionalidades

## 📝 Notas Importantes

### Sobre o Hook useOnboarding

O hook foi simplificado e agora é exportado diretamente do arquivo de contexto. Isso elimina a necessidade de um arquivo separado que apenas re-exportava o contexto, tornando o código mais direto e fácil de entender.

### URL do Formulário de Feedback

Edite a constante `FEEDBACK_FORM_URL` em `OnboardingContext.tsx` para apontar para seu Google Forms:

```tsx
const FEEDBACK_FORM_URL = 'https://forms.google.com/your-feedback-form-url'
```

### Prevenção na Tela de Login

O tour agora verifica se o usuário está autenticado antes de iniciar automaticamente, evitando que apareça na tela de login. Isso é feito checando a presença do `access_token` no localStorage.
