import React from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { addressService } from '@/services/address.service'
import type { Address, AddressInput } from '@/types/address.types'
import { Input } from '@/components/ui/Input/Input'

const addressSchema = z.object({
  recipientName: z.string().trim().min(2, 'Informe o destinatário'),
  phone: z.string().trim().optional(),
  zip: z.string().trim().min(5, 'CEP inválido'),
  street: z.string().trim().min(3, 'Rua obrigatória'),
  number: z.string().trim().min(1, 'Número obrigatório'),
  complement: z.string().trim().optional(),
  neighborhood: z.string().trim().optional(),
  city: z.string().trim().min(2, 'Cidade obrigatória'),
  state: z.string().trim().min(2, 'UF obrigatória'),
  country: z.string().trim().min(2, 'País obrigatório'),
})

type AddressFormData = z.infer<typeof addressSchema>

export const AddressTab: React.FC = () => {
  const [items, setItems] = React.useState<Address[]>([])
  const [defaultId, setDefaultId] = React.useState<string | undefined>()
  const [editing, setEditing] = React.useState<Address | null>(null)
  const [saving, setSaving] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const load = React.useCallback(async () => {
    const { items, defaultId } = await addressService.list()
    setItems(items)
    setDefaultId(defaultId)
  }, [])

  React.useEffect(() => {
    load()
  }, [load])

  const { register, handleSubmit, reset, formState: { errors, isDirty } } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    mode: 'onBlur',
    defaultValues: {
      recipientName: '', phone: '', zip: '', street: '', number: '', complement: '', neighborhood: '', city: '', state: '', country: 'Brasil',
    },
  })

  const startCreate = () => {
    setEditing(null)
    reset({ recipientName: '', phone: '', zip: '', street: '', number: '', complement: '', neighborhood: '', city: '', state: '', country: 'Brasil' })
  }

  const startEdit = (addr: Address) => {
    setEditing(addr)
    reset({
      recipientName: addr.recipientName,
      phone: addr.phone ?? '',
      zip: addr.zip,
      street: addr.street,
      number: addr.number,
      complement: addr.complement ?? '',
      neighborhood: addr.neighborhood ?? '',
      city: addr.city,
      state: addr.state,
      country: addr.country,
    })
  }

  const onSubmit = async (data: AddressFormData) => {
    setSaving(true)
    setError(null)
    const input: AddressInput = {
      recipientName: data.recipientName,
      phone: data.phone?.trim() ?? undefined,
      zip: data.zip,
      street: data.street,
      number: data.number,
      complement: data.complement?.trim() ?? undefined,
      neighborhood: data.neighborhood?.trim() ?? undefined,
      city: data.city,
      state: data.state,
      country: data.country,
    }
    try {
      if (editing) {
        await addressService.update(editing.id, input)
      } else {
        await addressService.create(input)
      }
      await load()
      startCreate()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Falha ao salvar endereço')
    } finally {
      setSaving(false)
    }
  }

  const remove = async (id: string) => {
    if (!confirm('Remover este endereço?')) return
    await addressService.remove(id)
    await load()
  }

  const makeDefault = async (id: string) => {
    await addressService.setDefault(id)
    await load()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-md font-semibold">Endereços salvos</h3>
        <button type="button" onClick={startCreate} className="px-3 py-2 rounded-xl border bg-white/70 dark:bg-gray-800/70 text-gray-800 dark:text-gray-200 border-white/20 dark:border-gray-700/40 hover:bg-white/90 dark:hover:bg-gray-800/90">
          Novo endereço
        </button>
      </div>

      {/* Lista */}
      {items.length === 0 ? (
        <div className="text-sm text-gray-600 dark:text-gray-400">Nenhum endereço cadastrado.</div>
      ) : (
        <ul className="space-y-3">
          {items.map(addr => (
            <li key={addr.id} className="p-4 rounded-xl border border-white/20 dark:border-gray-700/40 bg-white/60 dark:bg-gray-800/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="text-sm">
                <div className="font-medium">
                  {addr.recipientName} {defaultId === addr.id && <span className="ml-2 text-xs px-2 py-0.5 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300">Padrão</span>}
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  {addr.street}, {addr.number}{addr.complement ? ` - ${addr.complement}` : ''} • {addr.neighborhood ? `${addr.neighborhood} • ` : ''}{addr.city}/{addr.state} • {addr.zip}
                </div>
                <div className="text-gray-500 dark:text-gray-500">{addr.country}</div>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => startEdit(addr)} className="px-3 py-1.5 rounded-lg text-sm border bg-white/70 dark:bg-gray-800/70">Editar</button>
                <button type="button" onClick={() => makeDefault(addr.id)} disabled={defaultId === addr.id} className="px-3 py-1.5 rounded-lg text-sm border bg-white/70 dark:bg-gray-800/70 disabled:opacity-50">Tornar padrão</button>
                <button type="button" onClick={() => remove(addr.id)} className="px-3 py-1.5 rounded-lg text-sm border bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300">Remover</button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Form */}
      <div>
        <h4 className="text-md font-semibold mb-2">{editing ? 'Editar endereço' : 'Novo endereço'}</h4>
        {error && (
          <div className="rounded-xl bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-200 px-4 py-3 mb-3" role="alert">{error}</div>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input {...register('recipientName')} name="recipientName" label="Destinatário" placeholder="Nome completo" error={errors.recipientName?.message} required />
          <Input {...register('phone')} name="phone" label="Telefone" placeholder="(xx) xxxxx-xxxx" error={errors.phone?.message} />
          <Input {...register('zip')} name="zip" label="CEP" placeholder="00000-000" error={errors.zip?.message} required />
          <Input {...register('street')} name="street" label="Rua" placeholder="Av. Exemplo" error={errors.street?.message} required />
          <Input {...register('number')} name="number" label="Número" placeholder="123" error={errors.number?.message} required />
          <Input {...register('complement')} name="complement" label="Complemento" placeholder="Apto, bloco" error={errors.complement?.message} />
          <Input {...register('neighborhood')} name="neighborhood" label="Bairro" placeholder="Bairro" error={errors.neighborhood?.message} />
          <Input {...register('city')} name="city" label="Cidade" placeholder="Cidade" error={errors.city?.message} required />
          <Input {...register('state')} name="state" label="UF" placeholder="SP" error={errors.state?.message} required />
          <Input {...register('country')} name="country" label="País" placeholder="Brasil" error={errors.country?.message} required />

          <div className="sm:col-span-2 flex gap-3 mt-2">
            <button type="submit" disabled={saving || !isDirty} className={`px-5 py-2 rounded-xl transition-all duration-200 border ${saving || !isDirty ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed' : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-transparent hover:shadow-lg hover:shadow-purple-500/20 active:scale-95'}`}>
              {saving ? 'Salvando...' : (editing ? 'Salvar alterações' : 'Adicionar endereço')}
            </button>
            <button type="button" onClick={startCreate} className="px-5 py-2 rounded-xl transition-all duration-200 border bg-white/70 dark:bg-gray-800/70 text-gray-800 dark:text-gray-200 border-white/20 dark:border-gray-700/40">Limpar</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddressTab
