import { type FC, useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { SimpleInput } from '@/components/ui/simple-input'
import { Label } from '@/components/ui/label'
import { LogoUpload } from '../LogoUpload'
import { basicInfoSchema, type BasicInfoFormData, type CompanyInfo } from '@/types/company'
import { companyService } from '@/services/company'

import { ErrorModal } from '@/components/ui/ErrorModal'

export const BasicInfoTab: FC = () => {
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null)
  const [isFetching, setIsFetching] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [isUploadingLogo, setIsUploadingLogo] = useState(false)
  const [logoUrl, setLogoUrl] = useState<string>('')
  const [successMessage, setSuccessMessage] = useState<string | undefined>()
  const [error, setError] = useState<string | undefined>()
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<BasicInfoFormData>({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: {
      name: '',
      logo_url: '',
    },
  })

  // Load company info on mount
  useEffect(() => {
    loadCompanyInfo()
  }, [])

  const loadCompanyInfo = async () => {
    setIsFetching(true)
    setError(undefined)

    try {
      const data = await companyService.getCompanyInfo()
      setCompanyInfo(data)
      reset({
        name: data.name,
        logo_url: data.logo_url || '',
      })
    } catch (err) {
      console.error('Error loading company info:', err)
      setError('Erro ao carregar informações da empresa.')
      setIsErrorModalOpen(true)
    } finally {
      setIsFetching(false)
    }
  }

  // Update form when companyInfo changes
  useEffect(() => {
    if (companyInfo) {
      reset({
        name: companyInfo.name,
        logo_url: companyInfo.logo_url || '',
      })
    }
  }, [companyInfo, reset])

  const onSubmit = async (data: BasicInfoFormData) => {
    setIsLoading(true)
    setSuccessMessage(undefined)
    setError(undefined)

    try {
      let finalLogoUrl = data.logo_url

      // Upload logo if a new URL was provided (mock upload)
      if (logoUrl && logoUrl !== companyInfo?.logo_url) {
        setIsUploadingLogo(true)
        const uploadResult = await companyService.uploadLogo({ logo_url: logoUrl })
        finalLogoUrl = uploadResult.logo_url
        setIsUploadingLogo(false)
      }

      // Update basic info
      const updatedInfo = await companyService.updateCompanyInfo({
        name: data.name,
        logo_url: finalLogoUrl,
      })

      setCompanyInfo(updatedInfo)
      setSuccessMessage('Informações básicas atualizadas com sucesso!')

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(undefined), 3000)
    } catch (error) {
      console.error('Error updating basic info:', error)
      setError('Erro ao atualizar informações. Tente novamente.')
      setIsErrorModalOpen(true)
    } finally {
      setIsLoading(false)
      setIsUploadingLogo(false)
    }
  }

  const handleLogoChange = (url: string) => {
    setLogoUrl(url)
  }

  const handleCloseModal = () => {
    setIsErrorModalOpen(false)
    setError(undefined)
  }

  if (isFetching) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <i className="ph ph-info text-xl" />
            Informações Básicas
          </CardTitle>
          <CardDescription>
            Configure o nome e a logo da sua empresa. Essas informações serão exibidas em toda a plataforma.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <i className="ph ph-circle-notch animate-spin text-4xl text-primary" />
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
            <i className="ph ph-info text-xl" />
            Informações Básicas
          </CardTitle>
          <CardDescription>
            Configure o nome e a logo da sua empresa. Essas informações serão exibidas em toda a plataforma.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Company Name */}
            <div className="space-y-2">
              <Label htmlFor="name">
                Nome da Empresa <span className="text-red-500">*</span>
              </Label>
              <SimpleInput
                id="name"
                type="text"
                placeholder="Ex: Empresa X Tecnologia"
                {...register('name')}
                aria-invalid={errors.name ? 'true' : 'false'}
              />
              {errors.name && (
                <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                  <i className="ph ph-warning-circle" />
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Logo Upload */}
            <LogoUpload
              currentLogoUrl={companyInfo?.logo_url}
              onLogoChange={handleLogoChange}
              isUploading={isUploadingLogo}
            />

            {/* Success Message */}
            {successMessage && (
              <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-700 dark:text-green-300 flex items-center gap-2">
                <i className="ph ph-check-circle text-xl" />
                {successMessage}
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end pt-4 border-t">
              <Button type="submit" disabled={isLoading || isUploadingLogo}>
                {isLoading ? (
                  <>
                    <i className="ph ph-circle-notch animate-spin mr-2" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <i className="ph ph-check mr-2" />
                    Salvar Alterações
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      <ErrorModal
        isOpen={isErrorModalOpen}
        onClose={handleCloseModal}
        title="Ocorreu um Erro"
        message={error || 'Algo deu errado. Por favor, tente novamente mais tarde.'}
      />
    </>
  )
}
