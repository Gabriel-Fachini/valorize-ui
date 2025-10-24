import { animated } from '@react-spring/web'
import { 
  ProfileForm, 
  PreferencesForm, 
  AddressTab, 
  SettingsTourControl, 
  SettingsCard,
} from '@/components/settings'
import { AnimatedTabsList, PageHeader } from '@/components/ui'
import { PageLayout } from '@/components/layout/PageLayout'
import { Tabs, TabsContent } from '@/components/ui/tabs'
import { usePageEntrance } from '@/hooks/useAnimations'
import { useSettingsTabs } from '@/hooks/useSettingsTabs'
import { useCallback } from 'react'

export const SettingsPage = () => {
  const { activeTab, tabItems, handleTabChange } = useSettingsTabs()

  // Animations
  const pageAnimation = usePageEntrance()

  // Simple tour reset function for future use
  const handleStartTour = useCallback(() => {
    // TODO: Implement tour functionality when needed
    console.log('Tour reset requested - functionality to be implemented')
  }, [])

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
              <div className="space-y-6">
                <PreferencesForm />
                <SettingsTourControl
                  hasCompletedOnboarding={false}
                  onStartTour={handleStartTour}
                />
              </div>
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
