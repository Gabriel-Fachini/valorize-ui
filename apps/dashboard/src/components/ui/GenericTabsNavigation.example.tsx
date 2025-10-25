import { GenericTabsNavigation, useGenericTabs } from '@/components/ui'
import type { TabItem } from '@/components/ui/GenericTabsNavigation'

/**
 * Exemplo de uso do componente GenericTabsNavigation
 * Este arquivo demonstra como usar o componente genérico de navegação entre abas
 */

// Exemplo 1: Configuração básica de abas
const basicTabs: TabItem[] = [
  {
    value: 'dashboard',
    label: 'Dashboard',
    icon: 'ph-house',
    'aria-label': 'Aba do dashboard',
  },
  {
    value: 'analytics',
    label: 'Analytics',
    icon: 'ph-chart-line',
    'aria-label': 'Aba de analytics',
  },
  {
    value: 'settings',
    label: 'Configurações',
    icon: 'ph-gear',
    'aria-label': 'Aba de configurações',
  },
]

// Exemplo 2: Configuração de abas compactas
const compactTabs: TabItem[] = [
  {
    value: 'overview',
    label: 'Visão Geral',
    icon: 'ph-eye',
    'aria-label': 'Visão geral',
  },
  {
    value: 'details',
    label: 'Detalhes',
    icon: 'ph-list',
    'aria-label': 'Detalhes',
  },
]

// Exemplo de componente que usa o GenericTabsNavigation
export const ExampleTabsComponent = () => {
  const { activeTab, tabItems, handleTabChange } = useGenericTabs({
    tabs: basicTabs,
    defaultTab: 'dashboard',
  })

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Exemplo de Navegação entre Abas</h3>
      
      {/* Navegação padrão */}
      <GenericTabsNavigation
        items={tabItems}
        activeTab={activeTab}
        onChange={handleTabChange}
        data-tour="example-tabs"
      />

      {/* Conteúdo das abas */}
      <div className="p-4 border rounded-lg">
        {activeTab === 'dashboard' && (
          <p>Conteúdo do Dashboard</p>
        )}
        {activeTab === 'analytics' && (
          <p>Conteúdo do Analytics</p>
        )}
        {activeTab === 'settings' && (
          <p>Conteúdo das Configurações</p>
        )}
      </div>
    </div>
  )
}

// Exemplo de componente com variante compacta
export const CompactTabsComponent = () => {
  const { activeTab, tabItems, handleTabChange } = useGenericTabs({
    tabs: compactTabs,
    defaultTab: 'overview',
  })

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Exemplo de Navegação Compacta</h3>
      
      {/* Navegação compacta */}
      <GenericTabsNavigation
        items={tabItems}
        activeTab={activeTab}
        onChange={handleTabChange}
        variant="compact"
        data-tour="compact-tabs"
      />

      {/* Conteúdo das abas */}
      <div className="p-4 border rounded-lg">
        {activeTab === 'overview' && (
          <p>Conteúdo da Visão Geral</p>
        )}
        {activeTab === 'details' && (
          <p>Conteúdo dos Detalhes</p>
        )}
      </div>
    </div>
  )
}

/**
 * Como usar o GenericTabsNavigation:
 * 
 * 1. Importe o componente e o hook:
 *    import { GenericTabsNavigation, useGenericTabs } from '@/components/ui'
 *    import type { TabItem } from '@/components/ui/GenericTabsNavigation'
 * 
 * 2. Defina suas abas:
 *    const myTabs: TabItem[] = [
 *      {
 *        value: 'tab1',
 *        label: 'Aba 1',
 *        icon: 'ph-icon-name',
 *        'aria-label': 'Descrição da aba 1',
 *      },
 *      // ... mais abas
 *    ]
 * 
 * 3. Use o hook para gerenciar o estado:
 *    const { activeTab, tabItems, handleTabChange } = useGenericTabs({
 *      tabs: myTabs,
 *      defaultTab: 'tab1', // opcional
 *    })
 * 
 * 4. Renderize o componente:
 *    <GenericTabsNavigation
 *      items={tabItems}
 *      activeTab={activeTab}
 *      onChange={handleTabChange}
 *      variant="default" // ou "compact"
 *      data-tour="my-tabs" // opcional
 *    />
 * 
 * Props disponíveis:
 * - items: TabItem[] - Array de abas
 * - activeTab: string - Aba ativa atual
 * - onChange: (value: string) => void - Callback para mudança de aba
 * - className?: string - Classes CSS adicionais
 * - data-tour?: string - Atributo para tours
 * - variant?: 'default' | 'compact' - Variante visual
 */
