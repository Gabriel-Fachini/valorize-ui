import { type FC, useEffect } from 'react'
import { useNavigate, useLocation } from '@tanstack/react-router'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BasicInfoTab } from './tabs/BasicInfoTab'
import { DomainsTab } from './tabs/DomainsTab'
import { CoinEconomyTab } from './tabs/CoinEconomyTab'
import { ValuesTab } from './tabs/ValuesTab'
import { PreferencesTab } from './tabs/PreferencesTab'

/**
 * Settings Tabs Component
 *
 * Each tab loads and manages its own data independently.
 * This provides better modularity and performance.
 * 
 * Tabs are now synced with the URL route for persistence across page reloads.
 */
export const SettingsTabs: FC = () => {
  const navigate = useNavigate()
  const location = useLocation()

  // Map URL path to tab value
  const getTabValueFromPath = (pathname: string): string => {
    if (pathname === '/settings' || pathname === '/settings/basic-info') {
      return 'basic-info'
    }
    if (pathname === '/settings/values') {
      return 'values'
    }
    if (pathname === '/settings/domains') {
      return 'domains'
    }
    if (pathname === '/settings/coin-economy') {
      return 'coin-economy'
    }
    if (pathname === '/settings/preferences') {
      return 'preferences'
    }
    return 'basic-info'
  }

  // Map tab value to URL path
  const getPathFromTabValue = (value: string): string => {
    switch (value) {
      case 'basic-info':
        return '/settings/basic-info'
      case 'values':
        return '/settings/values'
      case 'domains':
        return '/settings/domains'
      case 'coin-economy':
        return '/settings/coin-economy'
      case 'preferences':
        return '/settings/preferences'
      default:
        return '/settings/basic-info'
    }
  }

  const currentTab = getTabValueFromPath(location.pathname)

  const handleTabChange = (value: string) => {
    const path = getPathFromTabValue(value)
    navigate({ to: path })
  }

  // Ensure URL is correct when component mounts
  useEffect(() => {
    if (location.pathname === '/settings') {
      navigate({ to: '/settings/basic-info', replace: true })
    }
  }, [location.pathname, navigate])

  return (
    <Tabs value={currentTab} onValueChange={handleTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-5 mb-8">
        <TabsTrigger value="basic-info" className="flex items-center gap-2">
          <i className="ph ph-info text-lg" />
          <span className="hidden sm:inline">Informações Básicas</span>
          <span className="sm:hidden">Info</span>
        </TabsTrigger>
        {/* Values second */}
        <TabsTrigger value="values" className="flex items-center gap-2">
          <i className="ph ph-star text-lg" />
          <span className="hidden sm:inline">Valores</span>
          <span className="sm:hidden">Valores</span>
        </TabsTrigger>
        <TabsTrigger value="domains" className="flex items-center gap-2">
          <i className="ph ph-shield-check text-lg" />
          <span className="hidden sm:inline">Domínios SSO</span>
          <span className="sm:hidden">SSO</span>
        </TabsTrigger>
        <TabsTrigger value="coin-economy" className="flex items-center gap-2">
          <i className="ph ph-coin text-lg" />
          <span className="hidden sm:inline">Economia</span>
          <span className="sm:hidden">Moedas</span>
        </TabsTrigger>
        <TabsTrigger value="preferences" className="flex items-center gap-2">
          <i className="ph ph-gear text-lg" />
          <span className="hidden sm:inline">Preferências</span>
          <span className="sm:hidden">Prefs</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="basic-info">
        <BasicInfoTab />
      </TabsContent>

      {/* Values second */}
      <TabsContent value="values">
        <ValuesTab />
      </TabsContent>

      <TabsContent value="domains">
        <DomainsTab />
      </TabsContent>

      <TabsContent value="coin-economy">
        <CoinEconomyTab />
      </TabsContent>

      <TabsContent value="preferences">
        <PreferencesTab />
      </TabsContent>
    </Tabs>
  )
}
