# Gestos Mobile - Sidebar

Este documento descreve a implementação de gestos para controle da sidebar no mobile.

## Funcionalidades

### Gestos Implementados

1. **Swipe da esquerda para direita**: Abre a sidebar
2. **Swipe da direita para esquerda**: Fecha a sidebar (quando aberta)

### Características

- **Área de detecção**: Borda esquerda da tela (20px por padrão)
- **Threshold**: 50px de movimento mínimo para ativar o gesto
- **Feedback háptico**: Vibração quando disponível
- **Detecção inteligente**: Distingue entre gestos horizontais e verticais

## Componentes

### `useSwipeGesture`
Hook base para detecção de gestos de swipe.

```typescript
useSwipeGesture({
  onSwipeRight: () => console.log('Swipe right'),
  onSwipeLeft: () => console.log('Swipe left'),
  threshold: 50,
  startArea: { x: 0, y: 0, width: 20, height: window.innerHeight }
})
```

### `useMobileSidebarGesture`
Hook específico para gestos da sidebar mobile.

```typescript
useMobileSidebarGesture({
  enabled: true,
  swipeThreshold: 50,
  edgeThreshold: 20,
  enableHapticFeedback: true
})
```

### `MobileGestureArea`
Componente que adiciona a área de detecção de gestos.

```tsx
<MobileGestureArea 
  enabled={true}
  swipeThreshold={50}
  edgeThreshold={20}
/>
```

## Configuração

### Parâmetros Ajustáveis

- **`swipeThreshold`**: Distância mínima para ativar o gesto (padrão: 50px)
- **`edgeThreshold`**: Largura da área de detecção na borda (padrão: 20px)
- **`enableHapticFeedback`**: Ativar vibração (padrão: true)

### Exemplo de Uso

```tsx
import { MobileGestureArea } from '@/components/layout/Sidebar/MobileGestureArea'

export const App = () => {
  return (
    <div>
      <MobileGestureArea 
        enabled={true}
        swipeThreshold={40}
        edgeThreshold={15}
      />
      {/* Resto da aplicação */}
    </div>
  )
}
```

## Comportamento

1. **Gesto de abertura**: 
   - Inicia na borda esquerda da tela
   - Movimento horizontal da esquerda para direita
   - Mínimo de 50px de movimento
   - Vibração de feedback

2. **Gesto de fechamento**:
   - Funciona apenas quando a sidebar está aberta
   - Movimento horizontal da direita para esquerda
   - Mesmo threshold de movimento

## Acessibilidade

- **Área de detecção invisível**: Não interfere com outros elementos
- **Feedback háptico**: Melhora a experiência do usuário
- **Detecção inteligente**: Evita ativação acidental

## Desenvolvimento

### Debug

Em modo de desenvolvimento, um componente de debug é exibido mostrando:
- Status da sidebar (aberta/fechada)
- Status dos gestos (ativo/inativo)

### Testes

Para testar os gestos:
1. Acesse a aplicação em um dispositivo móvel
2. Toque na borda esquerda da tela
3. Deslize da esquerda para direita
4. A sidebar deve abrir com feedback háptico
