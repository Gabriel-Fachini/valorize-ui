import React from 'react'
import { addressService } from '@/services/address.service'
import { formatCEP, formatPhone } from '@/lib/addressValidation'
import type { Address, AddressInput } from '@/types/address.types'
import { AddressForm } from '@/components/ui/AddressForm'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { SkeletonBase } from '@/components/ui/Skeleton'

export const AddressTab: React.FC = () => {
  const [addresses, setAddresses] = React.useState<Address[]>([])
  const [loading, setLoading] = React.useState(true)
  const [editing, setEditing] = React.useState<Address | null>(null)
  const [saving, setSaving] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [success, setSuccess] = React.useState<string | null>(null)
  const [showForm, setShowForm] = React.useState(false)

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
    setError(null)
    setSuccess(null)
  }

  const startEdit = (addr: Address) => {
    setEditing(addr)
    setShowForm(true)
    setError(null)
    setSuccess(null)
  }

  const cancelForm = () => {
    setShowForm(false)
    setEditing(null)
    setError(null)
    setSuccess(null)
  }

  const onSubmit = async (input: AddressInput) => {
    setSaving(true)
    setError(null)
    setSuccess(null)

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
      throw e // Re-throw to let form handle it
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

  return (
    <div className="space-y-6">
      {/* Success/Error Messages */}
      {success && (
        <div
          className="rounded-xl bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-200 px-4 py-3"
          role="alert"
        >
          <div className="flex items-center gap-2">
            <i className="ph-bold ph-check-circle text-lg"></i>
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
            <i className="ph-bold ph-warning-circle text-lg"></i>
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Endereços salvos</h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
            Gerencie seus endereços de entrega
          </p>
        </div>
        {!showForm && (
          <Button
            onClick={startCreate}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <i className="ph-bold ph-plus"></i>
            Novo endereço
          </Button>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="space-y-4">
          <SkeletonBase>
            <div className="rounded-2xl border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-neutral-800 p-6 h-32" />
          </SkeletonBase>
          <SkeletonBase>
            <div className="rounded-2xl border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-neutral-800 p-6 h-32" />
          </SkeletonBase>
        </div>
      )}

      {/* Address List */}
      {!loading && !showForm && (
        <>
          {addresses.length === 0 ? (
            <div className="rounded-2xl border border-neutral-200 dark:border-white/10 bg-white/80 dark:bg-white/5 p-8 text-center backdrop-blur-xl">
              <i className="ph-bold ph-map-pin text-neutral-400 dark:text-neutral-600 text-6xl mb-3 block"></i>
              <p className="text-neutral-600 dark:text-neutral-400">
                Nenhum endereço cadastrado ainda.
              </p>
              <Button
                onClick={startCreate}
                className="mt-4 bg-green-600 hover:bg-green-700 text-white"
              >
                <i className="ph-bold ph-plus"></i>
                Adicionar primeiro endereço
              </Button>
            </div>
          ) : (
            <div className="grid gap-4">
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  className="rounded-2xl border border-neutral-200 dark:border-white/10 bg-white/80 dark:bg-white/5 p-6 backdrop-blur-xl"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-lg">{addr.name}</h4>
                        {addr.isDefault && (
                          <Badge className="bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-500/20">
                            Padrão
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-neutral-700 dark:text-neutral-300 space-y-1">
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
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => startEdit(addr)}
                      >
                        <i className="ph ph-pencil-simple"></i>
                        Editar
                      </Button>
                      {!addr.isDefault && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => makeDefault(addr.id)}
                        >
                          <i className="ph ph-star"></i>
                          Tornar padrão
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => remove(addr.id)}
                        className="text-red-600 hover:text-red-700 border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/30"
                      >
                        <i className="ph ph-trash"></i>
                        Remover
                      </Button>
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

          <AddressForm
            defaultValues={editing ? {
              name: editing.name,
              street: editing.street,
              number: editing.number,
              complement: editing.complement ?? '',
              neighborhood: editing.neighborhood ?? '',
              city: editing.city,
              state: editing.state,
              zipCode: editing.zipCode,
              country: editing.country,
              phone: editing.phone ?? '',
            } : undefined}
            onSubmit={onSubmit}
            onCancel={cancelForm}
            isSubmitting={saving}
            submitLabel={editing ? 'Salvar alterações' : 'Adicionar endereço'}
            showCancelButton={true}
          />
        </div>
      )}
    </div>
  )
}

export default AddressTab
