import { type FC, useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { SimpleInput } from '@/components/ui/simple-input'
import { Label } from '@/components/ui/label'
import { DomainList } from '../DomainList'
import { domainSchema, type Company } from '@/types/company'
import { companyService } from '@/services/company'

interface DomainsTabProps {
  company?: Company
  onUpdate: (updatedCompany: Company) => void
}

export const DomainsTab: FC<DomainsTabProps> = ({ company, onUpdate }) => {
  const [domains, setDomains] = useState<string[]>([])
  const [newDomain, setNewDomain] = useState('')
  const [domainError, setDomainError] = useState<string | undefined>()
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | undefined>()

  // Update domains when company data arrives
  useEffect(() => {
    if (company?.domains) {
      console.log('✅ DomainsTab: Setting domains:', company.domains)
      setDomains(company.domains)
    }
  }, [company])

  const handleAddDomain = () => {
    setDomainError(undefined)

    // Validate domain
    const result = domainSchema.safeParse(newDomain.trim())
    if (!result.success) {
      setDomainError(result.error.issues[0].message)
      return
    }

    const domainToAdd = result.data

    // Check for duplicates
    if (domains.includes(domainToAdd)) {
      setDomainError('Este domínio já está cadastrado')
      return
    }

    // Add domain to list
    setDomains([...domains, domainToAdd])
    setNewDomain('')
  }

  const handleRemoveDomain = (domainToRemove: string) => {
    setDomains(domains.filter((d) => d !== domainToRemove))
    setSuccessMessage(undefined)
  }

  const handleSave = async () => {
    setIsLoading(true)
    setSuccessMessage(undefined)

    // Validate at least one domain
    if (domains.length === 0) {
      setDomainError('Pelo menos um domínio é obrigatório')
      setIsLoading(false)
      return
    }

    try {
      const updatedCompany = await companyService.updateDomains(domains)
      onUpdate(updatedCompany)
      setSuccessMessage('Domínios atualizados com sucesso!')

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(undefined), 3000)
    } catch (error) {
      console.error('Error updating domains:', error)
      alert('Erro ao atualizar domínios. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <i className="ph ph-shield-check text-xl" />
          Domínios Permitidos (SSO)
        </CardTitle>
        <CardDescription>
          Configure os domínios de email permitidos para login via Google SSO. Apenas emails desses domínios poderão acessar a plataforma.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Info Box */}
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div className="flex items-start gap-3">
            <i className="ph ph-info text-blue-600 dark:text-blue-400 text-xl mt-0.5" />
            <div className="text-sm text-blue-700 dark:text-blue-300">
              <p className="font-semibold mb-1">Como funciona o SSO?</p>
              <p>Os domínios cadastrados aqui serão usados para validar emails no Login Google. Apenas emails corporativos dos domínios listados poderão fazer login, bloqueando emails pessoais.</p>
              <p className="mt-2 font-mono text-xs">
                Exemplo: @empresa.com.br, @empresa.com
              </p>
            </div>
          </div>
        </div>

        {/* Add Domain Input */}
        <div className="space-y-2">
          <Label htmlFor="new-domain">Adicionar Novo Domínio</Label>
          <div className="flex gap-2">
            <div className="flex-1">
              <SimpleInput
                id="new-domain"
                type="text"
                placeholder="empresa.com.br"
                value={newDomain}
                onChange={(e) => {
                  setNewDomain(e.target.value)
                  setDomainError(undefined)
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleAddDomain()
                  }
                }}
                aria-invalid={domainError ? 'true' : 'false'}
              />
            </div>
            <Button
              type="button"
              onClick={handleAddDomain}
              disabled={!newDomain.trim()}
            >
              <i className="ph ph-plus mr-2" />
              Adicionar
            </Button>
          </div>
          {domainError && (
            <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
              <i className="ph ph-warning-circle" />
              {domainError}
            </p>
          )}
        </div>

        {/* Domain List */}
        <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-900/50">
          <DomainList
            domains={domains}
            onRemove={handleRemoveDomain}
            isDisabled={isLoading}
          />
        </div>

        {/* Warning if no domains */}
        {domains.length === 0 && (
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg text-yellow-700 dark:text-yellow-300 flex items-center gap-2">
            <i className="ph ph-warning text-xl" />
            <span className="text-sm">
              Atenção: Pelo menos um domínio é necessário para habilitar o SSO
            </span>
          </div>
        )}

        {/* Success Message */}
        {successMessage && (
          <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-700 dark:text-green-300 flex items-center gap-2">
            <i className="ph ph-check-circle text-xl" />
            {successMessage}
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end pt-4 border-t">
          <Button
            type="button"
            onClick={handleSave}
            disabled={isLoading || domains.length === 0}
          >
            {isLoading ? (
              <>
                <i className="ph ph-circle-notch animate-spin mr-2" />
                Salvando...
              </>
            ) : (
              <>
                <i className="ph ph-check mr-2" />
                Salvar Domínios
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
