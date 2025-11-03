import { animated } from '@react-spring/web'
import { 
  ProfileForm, 
  PreferencesForm, 
  AddressTab, 
  SettingsCard,
} from '@/components/settings'
import { GenericTabsNavigation, PageHeader, useGenericTabs } from '@/components/ui'
import { PageLayout } from '@/components/layout/PageLayout'
import { Tabs, TabsContent } from '@/components/ui/tabs'
import { usePageEntrance } from '@/hooks/useAnimations'
import type { TabItem } from '@/components/ui/GenericTabsNavigation'

export const SettingsPage = () => {
  // Define tabs configuration
  const settingsTabs: TabItem[] = [
    {
      value: 'profile',
      label: 'Perfil',
      icon: 'ph-user',
      'aria-label': 'Aba de perfil',
    },
    {
      value: 'preferences',
      label: 'Preferências',
      icon: 'ph-sliders',
      'aria-label': 'Aba de preferências',
    },
    {
      value: 'addresses',
      label: 'Endereços',
      icon: 'ph-map-pin',
      'aria-label': 'Aba de endereços',
    },
  ]

  const { activeTab, tabItems, handleTabChange } = useGenericTabs({
    tabs: settingsTabs,
    defaultTab: 'profile',
  })

  // Animations
  const pageAnimation = usePageEntrance()

  return (
    <PageLayout maxWidth="7xl">
      <animated.div style={pageAnimation as any}>
        {/* Header */}
        <PageHeader
          title="Configurações"
          description="Personalize sua conta e preferências do sistema"
        />

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
          <GenericTabsNavigation
            items={tabItems}
            activeTab={activeTab}
            onChange={handleTabChange}
            data-tour="settings-tabs"
          />

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <SettingsCard
              icon="ph-user"
              title="Informações do Perfil"
              description="Gerencie suas informações pessoais"
            >
              <ProfileForm />
            </SettingsCard>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences" className="space-y-6">
            <SettingsCard
              icon="ph-sliders"
              title="Preferências do Sistema"
              description="Personalize sua experiência no Valorize"
            >
              <PreferencesForm />
            </SettingsCard>
          </TabsContent>

          {/* Addresses Tab */}
          <TabsContent value="addresses" className="space-y-6">
            <SettingsCard
              icon="ph-map-pin"
              title="Endereços de Entrega"
              description="Gerencie seus endereços cadastrados"
            >
              <AddressTab />
            </SettingsCard>
          </TabsContent>
        </Tabs>
      </animated.div>
    </PageLayout>
  )
}

export default SettingsPage
