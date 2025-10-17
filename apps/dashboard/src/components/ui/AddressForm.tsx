import React from 'react'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { cepService } from '@/services/cep.service'
import { Input } from '@/components/ui/Input/Input'
import { Button } from '@/components/ui/button'
import { addressSchema, formatCEP, formatPhone, BRAZILIAN_STATES, type AddressFormData } from '@/lib/addressValidation'
import type { AddressInput } from '@/types/address.types'

interface AddressFormProps {
  defaultValues?: Partial<AddressFormData>
  onSubmit: (data: AddressInput) => Promise<void>
  onCancel: () => void
  isSubmitting?: boolean
  submitLabel?: string
  cancelLabel?: string
  showCancelButton?: boolean
}

export const AddressForm: React.FC<AddressFormProps> = ({
  defaultValues,
  onSubmit,
  onCancel,
  isSubmitting = false,
  submitLabel = 'Salvar',
  cancelLabel = 'Cancelar',
  showCancelButton = true,
}) => {
  const [fetchingCep, setFetchingCep] = React.useState(false)
  const [cepError, setCepError] = React.useState<string | null>(null)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    mode: 'onBlur',
    defaultValues: {
      name: defaultValues?.name ?? '',
      street: defaultValues?.street ?? '',
      number: defaultValues?.number ?? '',
      complement: defaultValues?.complement ?? '',
      neighborhood: defaultValues?.neighborhood ?? '',
      city: defaultValues?.city ?? '',
      state: defaultValues?.state ?? '',
      zipCode: defaultValues?.zipCode ?? '',
      country: defaultValues?.country ?? 'BR',
      phone: defaultValues?.phone ?? '',
    },
  })

  // Auto-format CEP on blur and fetch address data
  const zipCodeValue = watch('zipCode')
  const handleZipCodeBlur = async () => {
    if (!zipCodeValue) return

    // Format CEP
    const formattedCep = formatCEP(zipCodeValue)
    setValue('zipCode', formattedCep)

    // Try to fetch address data from CEP
    if (cepService.isValidFormat(formattedCep)) {
      setFetchingCep(true)
      setCepError(null)
      
      try {
        const addressData = await cepService.fetchAddressByCep(formattedCep)
        
        if (addressData) {
          // Auto-fill address fields if they're empty
          if (!watch('street') && addressData.street) {
            setValue('street', addressData.street, { shouldValidate: true })
          }
          if (!watch('neighborhood') && addressData.neighborhood) {
            setValue('neighborhood', addressData.neighborhood, { shouldValidate: true })
          }
          if (!watch('city') && addressData.city) {
            setValue('city', addressData.city, { shouldValidate: true })
          }
          if (!watch('state') && addressData.state) {
            setValue('state', addressData.state, { shouldValidate: true })
          }
        } else {
          setCepError('CEP não encontrado. Preencha manualmente.')
        }
      } catch (e) {
        setCepError(e instanceof Error ? e.message : 'Erro ao buscar CEP')
      } finally {
        setFetchingCep(false)
      }
    }
  }

  // Auto-format phone on blur
  const phoneValue = watch('phone')
  const handlePhoneBlur = () => {
    if (phoneValue) {
      setValue('phone', formatPhone(phoneValue))
    }
  }

  const handleFormSubmit: SubmitHandler<AddressFormData> = async (data) => {
    const input: AddressInput = {
      name: data.name,
      street: data.street,
      number: data.number,
      complement: data.complement ?? undefined,
      neighborhood: data.neighborhood ?? undefined,
      city: data.city,
      state: data.state,
      zipCode: data.zipCode,
      country: data.country,
      phone: data.phone ?? undefined,
    }

    await onSubmit(input)
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      {/* Name */}
      <Input
        {...register('name')}
        name="name"
        label="Nome do endereço"
        placeholder="Ex: Casa, Trabalho, Pais"
        error={errors.name?.message}
        required
      />

      {/* CEP - with auto-completion */}
      <div>
        <div className="relative">
          <Input
            {...register('zipCode')}
            name="zipCode"
            label="CEP"
            placeholder="12345-678"
            error={errors.zipCode?.message ?? cepError ?? undefined}
            onBlur={handleZipCodeBlur}
            required
          />
          {fetchingCep && (
            <div className="absolute right-3 top-10">
              <i className="ph ph-circle-notch animate-spin text-green-600 dark:text-green-400 text-xl"></i>
            </div>
          )}
        </div>
        {fetchingCep && (
          <p className="mt-1 text-sm text-green-600 dark:text-green-400">
            <i className="ph ph-magnifying-glass"></i> Buscando endereço...
          </p>
        )}
      </div>

      {/* Street and Number */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-2">
          <Input
            {...register('street')}
            name="street"
            label="Rua/Avenida"
            placeholder="Rua Exemplo"
            error={errors.street?.message}
            required
          />
        </div>
        <Input
          {...register('number')}
          name="number"
          label="Número"
          placeholder="123"
          error={errors.number?.message}
          required
        />
      </div>

      {/* Complement and Neighborhood */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          {...register('complement')}
          name="complement"
          label="Complemento"
          placeholder="Apto, Bloco, etc."
          error={errors.complement?.message}
        />
        <Input
          {...register('neighborhood')}
          name="neighborhood"
          label="Bairro"
          placeholder="Centro"
          error={errors.neighborhood?.message}
        />
      </div>

      {/* City and State */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-2">
          <Input
            {...register('city')}
            name="city"
            label="Cidade"
            placeholder="São Paulo"
            error={errors.city?.message}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
            UF <span className="text-red-500">*</span>
          </label>
          <select
            {...register('state')}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-[#262626] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-600 transition-all"
          >
            <option value="">Selecione</option>
            {BRAZILIAN_STATES.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
          {errors.state && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.state.message}
            </p>
          )}
        </div>
      </div>

      {/* Phone */}
      <Input
        {...register('phone')}
        name="phone"
        label="Telefone"
        placeholder="(11) 98765-4321"
        error={errors.phone?.message}
        onBlur={handlePhoneBlur}
      />

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          disabled={isSubmitting || !isDirty}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white"
        >
          {isSubmitting ? (
            <>
              <i className="ph ph-circle-notch animate-spin"></i>
              Salvando...
            </>
          ) : (
            <>
              <i className="ph-bold ph-check"></i>
              {submitLabel}
            </>
          )}
        </Button>
        {showCancelButton && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            {cancelLabel}
          </Button>
        )}
      </div>
    </form>
  )
}
