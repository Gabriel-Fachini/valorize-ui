import React from 'react'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { addressService } from '@/services/address.service'
import { cepService } from '@/services/cep.service'
import type { Address, AddressInput } from '@/types/address.types'
import { Input } from '@/components/ui/Input/Input'
import { addressSchema, formatCEP, formatPhone, BRAZILIAN_STATES, type AddressFormData } from '@/lib/addressValidation'
import { SkeletonBase } from '@/components/ui/Skeleton'

export const AddressTab: React.FC = () => {
  const [addresses, setAddresses] = React.useState<Address[]>([])
  const [loading, setLoading] = React.useState(true)
  const [editing, setEditing] = React.useState<Address | null>(null)
  const [saving, setSaving] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [success, setSuccess] = React.useState<string | null>(null)
  const [showForm, setShowForm] = React.useState(false)
  const [fetchingCep, setFetchingCep] = React.useState(false)
  const [cepError, setCepError] = React.useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    mode: 'onBlur',
    defaultValues: {
      name: '',
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'BR',
      phone: '',
    },
  })

  const loadAddresses = React.useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await addressService.list()
      setAddresses(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Falha ao carregar endereços')
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    loadAddresses()
  }, [loadAddresses])

  const startCreate = () => {
    setEditing(null)
    setShowForm(true)
    reset({
      name: '',
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'BR',
      phone: '',
    })
    setError(null)
    setSuccess(null)
  }

  const startEdit = (addr: Address) => {
    setEditing(addr)
    setShowForm(true)
    reset({
      name: addr.name,
      street: addr.street,
      number: addr.number,
      complement: addr.complement ?? '',
      neighborhood: addr.neighborhood ?? '',
      city: addr.city,
      state: addr.state,
      zipCode: addr.zipCode,
      country: addr.country,
      phone: addr.phone ?? '',
    })
    setError(null)
    setSuccess(null)
  }

  const cancelForm = () => {
    setShowForm(false)
    setEditing(null)
    reset()
    setError(null)
    setSuccess(null)
  }

  const onSubmit: SubmitHandler<AddressFormData> = async (data) => {
    setSaving(true)
    setError(null)
    setSuccess(null)

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

    try {
      if (editing) {
        await addressService.update(editing.id, input)
        setSuccess('Endereço atualizado com sucesso!')
      } else {
        await addressService.create(input)
        setSuccess('Endereço criado com sucesso!')
      }
      await loadAddresses()
      cancelForm()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Falha ao salvar endereço')
    } finally {
      setSaving(false)
    }
  }

  const remove = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja remover este endereço?')) return

    try {
      setError(null)
      await addressService.remove(id)
      setSuccess('Endereço removido com sucesso!')
      await loadAddresses()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Falha ao remover endereço')
    }
  }

  const makeDefault = async (id: string) => {
    try {
      setError(null)
      await addressService.setDefault(id)
      setSuccess('Endereço padrão atualizado!')
      await loadAddresses()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Falha ao definir endereço padrão')
    }
  }

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
          setTimeout(() => setSuccess(null), 3000)
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

  return (
    <div className="space-y-6">
      {/* Success/Error Messages */}
      {success && (
        <div
          className="rounded-xl bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-200 px-4 py-3"
          role="alert"
        >
          <div className="flex items-center gap-2">
            <span className="text-lg">✓</span>
            <span>{success}</span>
          </div>
        </div>
      )}

      {error && (
        <div
          className="rounded-xl bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-200 px-4 py-3"
          role="alert"
        >
          <div className="flex items-center gap-2">
            <span className="text-lg">⚠️</span>
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Endereços salvos</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Gerencie seus endereços de entrega
          </p>
        </div>
        {!showForm && (
          <button
            type="button"
            onClick={startCreate}
            className="rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2 text-sm font-medium text-white hover:from-purple-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all duration-200"
          >
            + Novo endereço
          </button>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="space-y-4">
          <SkeletonBase>
            <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-gray-800 p-6 h-32" />
          </SkeletonBase>
          <SkeletonBase>
            <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-gray-800 p-6 h-32" />
          </SkeletonBase>
        </div>
      )}

      {/* Address List */}
      {!loading && !showForm && (
        <>
          {addresses.length === 0 ? (
            <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white/80 dark:bg-white/5 p-8 text-center backdrop-blur-xl">
              <div className="text-4xl mb-3">📍</div>
              <p className="text-gray-600 dark:text-gray-400">
                Nenhum endereço cadastrado ainda.
              </p>
              <button
                type="button"
                onClick={startCreate}
                className="mt-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2 text-sm font-medium text-white hover:from-purple-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all duration-200"
              >
                Adicionar primeiro endereço
              </button>
            </div>
          ) : (
            <div className="grid gap-4">
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white/80 dark:bg-white/5 p-6 backdrop-blur-xl"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-lg">{addr.name}</h4>
                        {addr.isDefault && (
                          <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                            Padrão
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                        <p>
                          {addr.street}, {addr.number}
                          {addr.complement && ` - ${addr.complement}`}
                        </p>
                        <p>
                          {addr.neighborhood && `${addr.neighborhood}, `}
                          {addr.city}/{addr.state}
                        </p>
                        <p>CEP: {formatCEP(addr.zipCode)}</p>
                        {addr.phone && <p>Tel: {formatPhone(addr.phone)}</p>}
                      </div>
                    </div>
                    <div className="flex sm:flex-col gap-2">
                      <button
                        type="button"
                        onClick={() => startEdit(addr)}
                        className="px-3 py-1.5 rounded-lg text-sm border bg-white/70 dark:bg-gray-800/70 text-gray-800 dark:text-gray-200 border-white/20 dark:border-gray-700/40 hover:bg-white/90 dark:hover:bg-gray-800/90 transition-all duration-200"
                      >
                        Editar
                      </button>
                      {!addr.isDefault && (
                        <button
                          type="button"
                          onClick={() => makeDefault(addr.id)}
                          className="px-3 py-1.5 rounded-lg text-sm border bg-white/70 dark:bg-gray-800/70 text-gray-800 dark:text-gray-200 border-white/20 dark:border-gray-700/40 hover:bg-white/90 dark:hover:bg-gray-800/90 transition-all duration-200"
                        >
                          Tornar padrão
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => remove(addr.id)}
                        className="px-3 py-1.5 rounded-lg text-sm border bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/50 transition-all duration-200"
                      >
                        Remover
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Address Form */}
      {showForm && (
        <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white/80 dark:bg-white/5 p-6 backdrop-blur-xl">
          <h4 className="text-lg font-semibold mb-4">
            {editing ? 'Editar endereço' : 'Novo endereço'}
          </h4>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Name */}
            <Input
              {...register('name')}
              name="name"
              label="Nome do endereço"
              placeholder="Ex: Casa, Trabalho, Pais"
              error={errors.name?.message}
              required
            />

            {/* CEP - Now comes right after name */}
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
                  <div className="absolute right-3 top-10 text-purple-600 dark:text-purple-400">
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                )}
              </div>
              {fetchingCep && (
                <p className="mt-1 text-sm text-purple-600 dark:text-purple-400">
                  Buscando endereço...
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
                  className="w-full px-4 py-3 rounded-lg border border-white/20 dark:border-gray-700/40 bg-white/60 dark:bg-gray-800/50 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
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
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={saving || !isDirty}
                className={`flex-1 px-5 py-3 rounded-xl transition-all duration-200 font-medium ${
                  saving || !isDirty
                    ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:shadow-lg hover:shadow-purple-500/20 active:scale-95'
                }`}
              >
                {saving ? 'Salvando...' : editing ? 'Salvar alterações' : 'Adicionar endereço'}
              </button>
              <button
                type="button"
                onClick={cancelForm}
                disabled={saving}
                className="px-5 py-3 rounded-xl transition-all duration-200 border bg-white/70 dark:bg-gray-800/70 text-gray-800 dark:text-gray-200 border-white/20 dark:border-gray-700/40 hover:bg-white/90 dark:hover:bg-gray-800/90 disabled:opacity-50"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

export default AddressTab
