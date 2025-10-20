import { animated, useSpring } from '@react-spring/web'
import { ProfileForm } from '@/components/settings/ProfileForm'
import { PreferencesForm } from '@/components/settings/PreferencesForm'
import { AddressTab } from '@/components/settings/AddressTab'
import { useOnboarding } from '@/contexts/onboarding'
import { PageLayout } from '@/components/layout/PageLayout'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { usePageEntrance, useCardEntrance } from '@/hooks/useAnimations'

export const SettingsPage = () => {
  const { startTour, resetTour, hasCompletedOnboarding } = useOnboarding()

  // Animations
  const pageAnimation = usePageEntrance()
  const cardAnimation = useCardEntrance()

  const headerSpring = useSpring({
    from: { opacity: 0, transform: 'translateY(-20px)' },
    to: { opacity: 1, transform: 'translateY(0px)' },
    config: { tension: 280, friction: 60 },
  })

  const handleStartTour = () => {
    if (hasCompletedOnboarding) {
      resetTour()
    }
    startTour()
  }

  return (
    <PageLayout maxWidth="7xl">
      <animated.div style={pageAnimation}>
        {/* Header */}
        <animated.div style={headerSpring} className="mb-8">
          <h1 className="mb-2 text-4xl font-bold text-gray-900 dark:text-white">
            Configurações
          </h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-400">
            Personalize sua conta e preferências do sistema
          </p>
        </animated.div>

        {/* Tabs */}
        <animated.div style={cardAnimation}>
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList 
              data-tour="settings-tabs"
              className="inline-flex h-auto w-full sm:w-auto bg-white/70 dark:bg-neutral-800/70 backdrop-blur-xl border border-neutral-200 dark:border-neutral-700/50 p-1.5 rounded-xl shadow-lg"
            >
              <TabsTrigger 
                value="profile" 
                className="flex items-center gap-2 px-4 py-2.5 data-[state=active]:bg-green-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-green-500/20"
              >
                <i className="ph ph-user text-lg" />
                <span className="hidden sm:inline">Perfil</span>
              </TabsTrigger>
              <TabsTrigger 
                value="preferences"
                className="flex items-center gap-2 px-4 py-2.5 data-[state=active]:bg-green-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-green-500/20"
              >
                <i className="ph ph-sliders text-lg" />
                <span className="hidden sm:inline">Preferências</span>
              </TabsTrigger>
              <TabsTrigger 
                value="addresses"
                className="flex items-center gap-2 px-4 py-2.5 data-[state=active]:bg-green-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-green-500/20"
              >
                <i className="ph ph-map-pin text-lg" />
                <span className="hidden sm:inline">Endereços</span>
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6">
              <Card className="border-neutral-200 dark:border-neutral-700/50 bg-white/70 dark:bg-neutral-800/70 backdrop-blur-xl shadow-xl">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 dark:bg-green-900/30">
                      <i className="ph ph-user text-2xl text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl text-gray-900 dark:text-white">
                        Informações do Perfil
                      </CardTitle>
                      <CardDescription className="text-neutral-600 dark:text-neutral-400">
                        Gerencie suas informações pessoais
                      </CardDescription>
                    </div>
                  </div>
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
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 dark:bg-green-900/30">
                      <i className="ph ph-sliders text-2xl text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl text-gray-900 dark:text-white">
                        Preferências do Sistema
                      </CardTitle>
                      <CardDescription className="text-neutral-600 dark:text-neutral-400">
                        Personalize sua experiência no Valorize
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <PreferencesForm />

                  {/* Onboarding Tour Control */}
                  <div
                    data-tour="settings-tour-control"
                    className="rounded-xl border border-neutral-200 dark:border-neutral-700/50 bg-neutral-50/50 dark:bg-neutral-900/30 p-6"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-green-100 dark:bg-green-900/30">
                        <i className="ph ph-compass text-2xl text-green-600 dark:text-green-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="mb-1 text-lg font-semibold text-gray-900 dark:text-white">
                          Tour Interativo
                        </h3>
                        <p className="mb-4 text-sm text-neutral-600 dark:text-neutral-400">
                          {hasCompletedOnboarding
                            ? 'Quer fazer o tour novamente? Clique no botão abaixo para reiniciar.'
                            : 'Inicie o tour para conhecer melhor o Valorize.'}
                        </p>
                        <button
                          type="button"
                          onClick={handleStartTour}
                          className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-green-500/20 transition-all hover:bg-green-700 hover:shadow-xl active:scale-95"
                        >
                          <i className={`ph ${hasCompletedOnboarding ? 'ph-arrow-clockwise' : 'ph-play'}`} />
                          {hasCompletedOnboarding ? 'Reiniciar Tour' : 'Iniciar Tour'}
                        </button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Addresses Tab */}
            <TabsContent value="addresses" className="space-y-6">
              <Card className="border-neutral-200 dark:border-neutral-700/50 bg-white/70 dark:bg-neutral-800/70 backdrop-blur-xl shadow-xl">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 dark:bg-green-900/30">
                      <i className="ph ph-map-pin text-2xl text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl text-gray-900 dark:text-white">
                        Endereços de Entrega
                      </CardTitle>
                      <CardDescription className="text-neutral-600 dark:text-neutral-400">
                        Gerencie seus endereços cadastrados
                      </CardDescription>
                    </div>
                  </div>
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
