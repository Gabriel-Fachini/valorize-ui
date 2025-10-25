import { animated } from '@react-spring/web'
import { 
  ProfileForm, 
  PreferencesForm, 
  AddressTab, 
  SettingsCard,
} from '@/components/settings'
import { AnimatedTabsList, PageHeader } from '@/components/ui'
import { PageLayout } from '@/components/layout/PageLayout'
import { Tabs, TabsContent } from '@/components/ui/tabs'
import { usePageEntrance } from '@/hooks/useAnimations'
import { useSettingsTabs } from '@/hooks/useSettingsTabs'

export const SettingsPage = () => {
  const { activeTab, tabItems, handleTabChange } = useSettingsTabs()

  // Animations
  const pageAnimation = usePageEntrance()

  return (
    <PageLayout maxWidth="7xl">
      <animated.div style={pageAnimation}>
        {/* Header */}
        <PageHeader
          title="Configurações"
          description="Personalize sua conta e preferências do sistema"
        />

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
          <AnimatedTabsList
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
