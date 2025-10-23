import { animated, useSpring } from '@react-spring/web'
import { ProfileForm } from '@/components/settings/ProfileForm'
import { PreferencesForm } from '@/components/settings/PreferencesForm'
import { AddressTab } from '@/components/settings/AddressTab'
import { SettingsTourControl } from '@/components/settings/SettingsTourControl'
import { useOnboarding } from '@/contexts/onboarding'
import { PageLayout } from '@/components/layout/PageLayout'
import { Tabs, TabsContent } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { SectionCardHeader } from '@/components/ui/SectionCardHeader'
import { usePageEntrance, useCardEntrance } from '@/hooks/useAnimations'
import { useState, useEffect } from 'react'

export const SettingsPage = () => {
  const { startTour, resetTour, hasCompletedOnboarding } = useOnboarding()
  const [activeTab, setActiveTab] = useState('profile')

  // Animations
  const pageAnimation = usePageEntrance()
  const cardAnimation = useCardEntrance()

  // Tab indicator animation with dynamic sizing
  const [tabDimensions, setTabDimensions] = useState<{ [key: string]: { width: number; left: number } }>({})
  
  const tabIndicatorStyle = useSpring({
    width: tabDimensions[activeTab]?.width || 0,
    left: tabDimensions[activeTab]?.left || 0,
    config: { tension: 280, friction: 20 },
  })

  const handleStartTour = () => {
    if (hasCompletedOnboarding) {
      resetTour()
    }
    startTour()
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value)
  }

  const measureTab = (tabValue: string, element: HTMLButtonElement) => {
    if (element) {
      const rect = element.getBoundingClientRect()
      const containerRect = element.parentElement?.getBoundingClientRect()
      if (containerRect) {
        const newDimensions = {
          width: rect.width,
          left: rect.left - containerRect.left,
        }
        
        setTabDimensions(prev => {
          // Only update if dimensions actually changed to prevent unnecessary re-renders
          const existing = prev[tabValue]
          if (existing && existing.width === newDimensions.width && existing.left === newDimensions.left) {
            return prev
          }
          return {
            ...prev,
            [tabValue]: newDimensions,
          }
        })
      }
    }
  }

  // Measure all tabs on mount to ensure correct initial sizing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      // Force measurement of all tabs after component mount
      const profileTab = document.querySelector('[data-tab="profile"]') as HTMLButtonElement
      const preferencesTab = document.querySelector('[data-tab="preferences"]') as HTMLButtonElement
      const addressesTab = document.querySelector('[data-tab="addresses"]') as HTMLButtonElement

      if (profileTab) measureTab('profile', profileTab)
      if (preferencesTab) measureTab('preferences', preferencesTab)
      if (addressesTab) measureTab('addresses', addressesTab)
    }, 50) // Small delay to ensure DOM is fully rendered

    return () => clearTimeout(timeoutId)
  }, [])

  return (
    <PageLayout maxWidth="7xl">
      <animated.div style={pageAnimation}>
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold text-gray-900 dark:text-white">
            Configurações
          </h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-400">
            Personalize sua conta e preferências do sistema
          </p>
        </div>

        {/* Tabs */}
        <animated.div style={cardAnimation}>
          <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
            <div 
              data-tour="settings-tabs"
              className="relative inline-flex h-auto w-full sm:w-auto bg-white/70 dark:bg-neutral-800/70 backdrop-blur-xl border border-neutral-200 dark:border-neutral-700/50 p-1.5 rounded-xl shadow-lg"
            >
              {/* Animated indicator */}
              <animated.div
                style={tabIndicatorStyle}
                className="absolute top-1.5 bottom-1.5 bg-green-600 rounded-lg shadow-lg shadow-green-500/20"
                aria-hidden="true"
              />
              
              <button
                data-tab="profile"
                ref={(el) => {
                  if (el) measureTab('profile', el)
                }}
                onClick={() => handleTabChange('profile')}
                className={`relative z-10 flex items-center gap-2 px-4 py-2.5 rounded-lg transition-colors ${
                  activeTab === 'profile'
                    ? 'text-white'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200'
                }`}
                aria-label="Aba de perfil"
                aria-current={activeTab === 'profile' ? 'page' : undefined}
              >
                <i className={`ph ${activeTab === 'profile' ? 'ph-fill' : 'ph'} ph-user text-lg`} />
                <span className="hidden sm:inline">Perfil</span>
              </button>
              
              <button
                data-tab="preferences"
                ref={(el) => {
                  if (el) measureTab('preferences', el)
                }}
                onClick={() => handleTabChange('preferences')}
                className={`relative z-10 flex items-center gap-2 px-4 py-2.5 rounded-lg transition-colors ${
                  activeTab === 'preferences'
                    ? 'text-white'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200'
                }`}
                aria-label="Aba de preferências"
                aria-current={activeTab === 'preferences' ? 'page' : undefined}
              >
                <i className={`ph ${activeTab === 'preferences' ? 'ph-fill' : 'ph'} ph-sliders text-lg`} />
                <span className="hidden sm:inline">Preferências</span>
              </button>
              
              <button
                data-tab="addresses"
                ref={(el) => {
                  if (el) measureTab('addresses', el)
                }}
                onClick={() => handleTabChange('addresses')}
                className={`relative z-10 flex items-center gap-2 px-4 py-2.5 rounded-lg transition-colors ${
                  activeTab === 'addresses'
                    ? 'text-white'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200'
                }`}
                aria-label="Aba de endereços"
                aria-current={activeTab === 'addresses' ? 'page' : undefined}
              >
                <i className={`ph ${activeTab === 'addresses' ? 'ph-fill' : 'ph'} ph-map-pin text-lg`} />
                <span className="hidden sm:inline">Endereços</span>
              </button>
            </div>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6">
              <Card className="border-neutral-200 dark:border-neutral-700/50 bg-white/70 dark:bg-neutral-800/70 backdrop-blur-xl shadow-xl">
                <CardHeader className="pb-4">
                  <SectionCardHeader
                    icon="ph-user"
                    title="Informações do Perfil"
                    description="Gerencie suas informações pessoais"
                  />
                </CardHeader>
                <CardContent>
                  <ProfileForm />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Preferences Tab */}
            <TabsContent value="preferences" className="space-y-6">
              <Card className="border-neutral-200 dark:border-neutral-700/50 bg-white/70 dark:bg-neutral-800/70 backdrop-blur-xl shadow-xl">
                <CardHeader className="pb-4">
                  <SectionCardHeader
                    icon="ph-sliders"
                    title="Preferências do Sistema"
                    description="Personalize sua experiência no Valorize"
                  />
                </CardHeader>
                <CardContent className="space-y-6">
                  <PreferencesForm />

                  {/* Onboarding Tour Control */}
                  <SettingsTourControl
                    hasCompletedOnboarding={hasCompletedOnboarding}
                    onStartTour={handleStartTour}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Addresses Tab */}
            <TabsContent value="addresses" className="space-y-6">
              <Card className="border-neutral-200 dark:border-neutral-700/50 bg-white/70 dark:bg-neutral-800/70 backdrop-blur-xl shadow-xl">
                <CardHeader className="pb-4">
                  <SectionCardHeader
                    icon="ph-map-pin"
                    title="Endereços de Entrega"
                    description="Gerencie seus endereços cadastrados"
                  />
                </CardHeader>
                <CardContent>
                  <AddressTab />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </animated.div>
      </animated.div>
    </PageLayout>
  )
}

export default SettingsPage
