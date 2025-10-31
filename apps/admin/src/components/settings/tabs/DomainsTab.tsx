import { type FC, useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { SimpleInput } from '@/components/ui/simple-input'
import { Label } from '@/components/ui/label'
import { DomainList } from '../DomainList'
import { ErrorModal } from '@/components/ui/ErrorModal'
import { domainSchema, type CompanyDomain } from '@/types/company'
import { companyService } from '@/services/company'
import { SkeletonText, SkeletonBase } from '@/components/ui/Skeleton'

export const DomainsTab: FC = () => {
  const [domains, setDomains] = useState<CompanyDomain[]>([])
  const [isFetching, setIsFetching] = useState(true)
  const [newDomain, setNewDomain] = useState('')
  const [domainError, setDomainError] = useState<string | undefined>()
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | undefined>()
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false)
  const [errorModalMessage, setErrorModalMessage] = useState<string | undefined>()

  // Validação em tempo real do domínio
  const validateDomainInput = (value: string): string | undefined => {
    const trimmed = value.trim()
    if (!trimmed) return undefined

    // Verifica se contém caracteres inválidos
    if (/[^a-z0-9.-]/i.test(trimmed)) {
      return 'Domínio não pode conter espaços ou caracteres especiais'
    }

    // Verifica se começa ou termina com ponto ou hífen
    if (trimmed.startsWith('.') || trimmed.endsWith('.') || 
        trimmed.startsWith('-') || trimmed.endsWith('-')) {
      return 'Domínio não pode começar ou terminar com ponto ou hífen'
    }

    // Verifica pontos consecutivos
    if (trimmed.includes('..')) {
      return 'Domínio não pode ter pontos consecutivos'
    }

    // Verifica se tem pelo menos um ponto
    if (!trimmed.includes('.')) {
      return 'Domínio deve conter pelo menos um ponto (ex: empresa.com)'
    }

    // Verifica TLD válido
    const parts = trimmed.split('.')
    if (parts.length < 2) {
      return 'Domínio deve ter pelo menos um ponto (ex: empresa.com)'
    }
    const tld = parts[parts.length - 1]
    if (tld.length < 2) {
      return 'TLD deve ter pelo menos 2 caracteres'
    }
    if (!/^[a-z]+$/i.test(tld)) {
      return 'TLD deve conter apenas letras'
    }

    // Verifica se não é apenas números
    if (/^\d+$/.test(parts[0])) {
      return 'Domínio não pode ser apenas números'
    }

    return undefined
  }

  // Load domains on mount
  useEffect(() => {
    loadDomains()
  }, [])

  const loadDomains = async () => {
    setIsFetching(true)
    setErrorModalMessage(undefined)

    try {
      const data = await companyService.getDomains()
      setDomains(data)
    } catch (err) {
      console.error('Error loading domains:', err)
      setErrorModalMessage('Erro ao carregar domínios.')
      setIsErrorModalOpen(true)
    } finally {
      setIsFetching(false)
    }
  }

  const handleAddDomain = async () => {
    setDomainError(undefined)
    setSuccessMessage(undefined)

    // Validate domain
    const result = domainSchema.safeParse(newDomain.trim())
    if (!result.success) {
      setDomainError(result.error.issues[0].message)
      return
    }

    const domainToAdd = result.data

    // Check for duplicates locally
    if (domains.some((d) => d.domain === domainToAdd)) {
      setDomainError('Este domínio já está cadastrado')
      return
    }

    setIsLoading(true)

    try {
      const newDomainObj = await companyService.addDomain(domainToAdd)
      setDomains([...domains, newDomainObj])
      setNewDomain('')
      setDomainError(undefined)
      setSuccessMessage('Domínio adicionado com sucesso!')
      setTimeout(() => setSuccessMessage(undefined), 3000)
    } catch (error: any) {
      console.error('Error adding domain:', error)
      if (error.response?.status === 409) {
        setDomainError('Este domínio já existe')
      } else {
        setErrorModalMessage('Erro ao adicionar domínio. Tente novamente.')
        setIsErrorModalOpen(true)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveDomain = async (domainId: string) => {
    // Check if it's the last domain
    if (domains.length === 1) {
      setErrorModalMessage('Não é possível remover o último domínio. Pelo menos um domínio é obrigatório.')
      setIsErrorModalOpen(true)
      return
    }

    setIsLoading(true)
    setSuccessMessage(undefined)

    try {
      await companyService.removeDomain(domainId)
      setDomains(domains.filter((d) => d.id !== domainId))
      setSuccessMessage('Domínio removido com sucesso!')
      setTimeout(() => setSuccessMessage(undefined), 3000)
    } catch (error: any) {
      console.error('Error removing domain:', error)
      if (error.response?.status === 400) {
        setErrorModalMessage('Não é possível remover o último domínio.')
      } else {
        setErrorModalMessage('Erro ao remover domínio. Tente novamente.')
      }
      setIsErrorModalOpen(true)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCloseModal = () => {
    setIsErrorModalOpen(false)
    setErrorModalMessage(undefined)
  }

  if (isFetching) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <i className="ph ph-shield-check text-xl" />
            Domínios Permitidos (SSO)
          </CardTitle>
          <CardDescription>
            Configure os domínios de email permitidos para login via Google SSO.
            Apenas emails desses domínios poderão acessar a plataforma.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Info Box Skeleton */}
            <SkeletonBase>
              <div className="p-4 bg-neutral-200 dark:bg-neutral-700 rounded-lg">
                <div className="space-y-2">
                  <SkeletonText width="md" height="sm" />
                  <SkeletonText width="full" height="sm" />
                  <SkeletonText width="xl" height="sm" />
                </div>
              </div>
            </SkeletonBase>

            {/* Add Domain Input Skeleton */}
            <div className="space-y-2">
              <SkeletonText width="lg" height="sm" />
              <div className="flex gap-2">
                <SkeletonText width="full" height="md" className="h-10" />
                <SkeletonText width="xl" height="md" className="h-10" />
              </div>
            </div>

            {/* Domain List Skeleton */}
            <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-900/50">
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <SkeletonBase>
                        <div className="h-5 w-5 bg-neutral-300 dark:bg-neutral-600 rounded" />
                      </SkeletonBase>
                      <SkeletonText width="xl" height="sm" />
                    </div>
                    <SkeletonText width="md" height="md" className="h-8 w-8" />
                  </div>
                ))}
              </div>
            </div>

            {/* Info Card Skeleton */}
            <SkeletonBase>
              <div className="p-4 bg-neutral-200 dark:bg-neutral-700 rounded-lg">
                <div className="space-y-2">
                  <SkeletonText width="lg" height="sm" />
                  <SkeletonText width="full" height="sm" />
                </div>
              </div>
            </SkeletonBase>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <i className="ph ph-shield-check text-xl" />
            Domínios Permitidos (SSO)
          </CardTitle>
          <CardDescription>
            Configure os domínios de email permitidos para login via Google SSO.
            Apenas emails desses domínios poderão acessar a plataforma.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Info Box */}
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-start gap-3">
              <i className="ph ph-info text-blue-600 dark:text-blue-400 text-xl mt-0.5" />
              <div className="text-sm text-blue-700 dark:text-blue-300">
                <p className="font-semibold mb-1">Como funciona o SSO?</p>
                <p>
                  Os domínios cadastrados aqui serão usados para validar emails no
                  Login Google. Apenas emails corporativos dos domínios listados
                  poderão fazer login, bloqueando emails pessoais.
                </p>
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
                    const value = e.target.value
                    // Remove caracteres inválidos automaticamente
                    const sanitized = value.replace(/[^a-z0-9.-]/gi, '')
                    setNewDomain(sanitized)
                    
                    // Validação em tempo real
                    if (sanitized.trim()) {
                      const validationError = validateDomainInput(sanitized)
                      if (validationError) {
                        setDomainError(validationError)
                      } else {
                        setDomainError(undefined)
                      }
                    } else {
                      setDomainError(undefined)
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleAddDomain()
                    }
                  }}
                  className={domainError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
                  aria-invalid={domainError ? 'true' : 'false'}
                />
              </div>
              <Button
                type="button"
                onClick={handleAddDomain}
                disabled={!newDomain.trim() || !!domainError || isLoading}
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
            {!domainError && newDomain.trim() && (
              <p className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
                <i className="ph ph-check-circle" />
                Formato válido
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

          {/* Info about auto-save */}
          <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
            <div className="flex items-start gap-3">
              <i className="ph ph-lightning text-primary text-xl mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold text-foreground mb-1">Salvamento Automático</p>
                <p className="text-muted-foreground">
                  As alterações são salvas automaticamente ao adicionar ou remover domínios.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <ErrorModal
        isOpen={isErrorModalOpen}
        onClose={handleCloseModal}
        onRetry={loadDomains}
        title="Ocorreu um Erro"
        message={
          errorModalMessage ||
          'Algo deu errado. Por favor, tente novamente mais tarde.'
        }
      />
    </>
  )
}
