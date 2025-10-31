import { type FC, useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BasicInfoTab } from './tabs/BasicInfoTab'
import { DomainsTab } from './tabs/DomainsTab'
import { CoinEconomyTab } from './tabs/CoinEconomyTab'
import { ValuesTab } from './tabs/ValuesTab'
import { TestTab } from './tabs/TestTab'
import type { Company } from '@/types/company'
import { SettingsTabsSkeleton } from './SettingsTabsSkeleton'

interface SettingsTabsProps {
  company?: Company
  isLoading?: boolean
}

export const SettingsTabs: FC<SettingsTabsProps> = ({ company, isLoading = false }) => {
  const [currentCompany, setCurrentCompany] = useState<Company | undefined>(company)

  // Sync currentCompany with company prop when it changes (after API fetch)
  useEffect(() => {
    if (company) {
      setCurrentCompany(company)
    }
  }, [company])

  // Update company state when a tab saves changes
  const handleCompanyUpdate = (updatedCompany: Company) => {
    setCurrentCompany(updatedCompany)
  }

  if (isLoading) {
    return <SettingsTabsSkeleton />
  }

  return (
    <Tabs defaultValue="basic-info" className="w-full">
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
        <TabsTrigger value="test" className="flex items-center gap-2">
          <i className="ph ph-flask text-lg" />
          <span className="hidden sm:inline">Teste</span>
          <span className="sm:hidden">Teste</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="basic-info">
        <BasicInfoTab company={currentCompany} onUpdate={handleCompanyUpdate} />
      </TabsContent>

      {/* Values second */}
      <TabsContent value="values">
        <ValuesTab />
      </TabsContent>

      <TabsContent value="domains">
        <DomainsTab company={currentCompany} onUpdate={handleCompanyUpdate} />
      </TabsContent>

      <TabsContent value="coin-economy">
        <CoinEconomyTab company={currentCompany} onUpdate={handleCompanyUpdate} />
      </TabsContent>

      <TabsContent value="test">
        <TestTab />
      </TabsContent>
    </Tabs>
  )
}
