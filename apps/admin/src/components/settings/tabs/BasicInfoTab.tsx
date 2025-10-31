import { type FC, useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { SimpleInput } from '@/components/ui/simple-input'
import { Label } from '@/components/ui/label'
import { LogoUpload } from '../LogoUpload'
import { basicInfoSchema, type BasicInfoFormData, type Company } from '@/types/company'
import { companyService } from '@/services/company'

import { ErrorModal } from '@/components/ui/ErrorModal'

interface BasicInfoTabProps {
  company?: Company
  onUpdate: (updatedCompany: Company) => void
}

export const BasicInfoTab: FC<BasicInfoTabProps> = ({ company, onUpdate }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [isUploadingLogo, setIsUploadingLogo] = useState(false)
  const [logoFile, setLogoFile] = useState<File | null>(null)
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

  // Reset form when company data arrives
  useEffect(() => {
    if (company) {
      console.log('✅ BasicInfoTab: Resetting form with company data:', company)
      reset({
        name: company.name,
        logo_url: company.logo_url || '',
      })
    }
  }, [company, reset])

  const onSubmit = async (data: BasicInfoFormData) => {
    setIsLoading(true)
    setSuccessMessage(undefined)
    setError(undefined)

    try {
      let logoUrl = data.logo_url

      // Upload logo if a new file was selected
      if (logoFile) {
        setIsUploadingLogo(true)
        const uploadResult = await companyService.uploadLogo(logoFile)
        logoUrl = uploadResult.logo_url
        setIsUploadingLogo(false)
      }

      // Update basic info
      const updatedCompany = await companyService.updateBasicInfo({
        name: data.name,
        logo_url: logoUrl,
      })

      onUpdate(updatedCompany)
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

  const handleLogoChange = (file: File) => {
    setLogoFile(file)
  }

  const handleCloseModal = () => {
    setIsErrorModalOpen(false)
    setError(undefined)
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
              currentLogoUrl={company?.logo_url}
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
