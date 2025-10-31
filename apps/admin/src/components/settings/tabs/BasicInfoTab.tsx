import { type FC, useState, useEffect, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { SimpleInput } from '@/components/ui/simple-input'
import { Label } from '@/components/ui/label'
import { LogoUpload } from '../LogoUpload'
import { basicInfoSchema, type BasicInfoFormData, type CompanyInfo } from '@/types/company'
import { companyService } from '@/services/company'
import { SkeletonText, SkeletonBase } from '@/components/ui/Skeleton'

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

  const loadCompanyInfo = useCallback(async () => {
    setIsFetching(true)
    setError(undefined)

    try {
      const data = await companyService.getCompanyInfo()
      setCompanyInfo(data)
      // Reset logoUrl state when loading
      setLogoUrl('')
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
  }, [reset])

  // Load company info on mount
  useEffect(() => {
    loadCompanyInfo()
  }, [loadCompanyInfo])

  // Update form when companyInfo changes
  useEffect(() => {
    if (companyInfo) {
      // Reset logoUrl state when companyInfo changes
      setLogoUrl('')
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
      let finalLogoUrl = companyInfo?.logo_url || ''

      // Check if logo was changed (either new upload or removal)
      const hasLogoChange = logoUrl !== (companyInfo?.logo_url || '')

      if (hasLogoChange) {
        if (logoUrl && logoUrl.trim() !== '') {
          // New logo uploaded
          setIsUploadingLogo(true)
          const uploadResult = await companyService.uploadLogo({ logo_url: logoUrl })
          finalLogoUrl = uploadResult.logo_url
          setIsUploadingLogo(false)
        } else {
          // Logo was removed - send empty string
          finalLogoUrl = ''
        }
      }

      // Update basic info
      const updatedInfo = await companyService.updateCompanyInfo({
        name: data.name,
        logo_url: finalLogoUrl,
      })

      setCompanyInfo(updatedInfo)
      // Reset logoUrl state after successful save
      setLogoUrl('')
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

  const handleLogoChange = (fileOrUrl: string | File) => {
    if (fileOrUrl instanceof File) {
      // If it's a File, convert to data URL (shouldn't happen with current implementation)
      const reader = new FileReader()
      reader.onloadend = () => {
        const dataUrl = reader.result as string
        setLogoUrl(dataUrl)
      }
      reader.readAsDataURL(fileOrUrl)
    } else {
      // It's a string (URL or empty string for removal)
      setLogoUrl(fileOrUrl)
    }
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
          <div className="space-y-6">
            {/* Nome da Empresa Skeleton */}
            <div className="space-y-2">
              <SkeletonText width="lg" height="sm" />
              <SkeletonText width="full" height="md" className="h-10" />
            </div>

            {/* Logo Upload Skeleton */}
            <div className="space-y-2">
              <SkeletonText width="md" height="sm" />
              <div className="flex items-center gap-4">
                <SkeletonBase>
                  <div className="h-20 w-20 rounded-lg bg-neutral-300 dark:bg-neutral-600" />
                </SkeletonBase>
                <div className="space-y-2 flex-1">
                  <SkeletonText width="full" height="sm" className="h-8" />
                  <SkeletonText width="xl" height="sm" />
                </div>
              </div>
            </div>

            {/* Botão Skeleton */}
            <div className="flex justify-end pt-4 border-t">
              <SkeletonText width="xl" height="md" className="h-10" />
            </div>
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
