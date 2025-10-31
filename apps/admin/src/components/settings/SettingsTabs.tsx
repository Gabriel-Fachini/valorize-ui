import { type FC } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BasicInfoTab } from './tabs/BasicInfoTab'
import { DomainsTab } from './tabs/DomainsTab'
import { CoinEconomyTab } from './tabs/CoinEconomyTab'
import { ValuesTab } from './tabs/ValuesTab'

/**
 * Settings Tabs Component
 *
 * Each tab loads and manages its own data independently.
 * This provides better modularity and performance.
 */
export const SettingsTabs: FC = () => {
  return (
    <Tabs defaultValue="basic-info" className="w-full">
      <TabsList className="grid w-full grid-cols-4 mb-8">
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
    </Tabs>
  )
}
