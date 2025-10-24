import React from 'react'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { userService } from '@/services/user.service'
import type { UpdateUserProfileDto, UserProfile } from '@/types/user.types'
import { useAuth } from '@/hooks/useAuth'
import { Input } from '@/components/ui/Input/Input'
import { SkeletonBase } from '@/components/ui/Skeleton'
import { Button } from '@/components/ui/button'
import { Alert, AlertIcon } from '@/components/ui/alert'

const profileSchema = z.object({
  name: z.string().trim().min(2, 'Informe ao menos 2 caracteres').max(60, 'Máximo de 60 caracteres'),
  picture: z
    .string()
    .trim()
    .url('Informe uma URL válida')
    .optional()
    .or(z.literal('').transform(() => undefined)),
})

type ProfileFormData = z.infer<typeof profileSchema>

export const ProfileForm: React.FC = () => {
  const { user } = useAuth()
  const [profile, setProfile] = React.useState<UserProfile | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [saving, setSaving] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [success, setSuccess] = React.useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    mode: 'onBlur',
    defaultValues: { name: '', picture: '' },
  })

  React.useEffect(() => {
    let mounted = true
    const loadProfile = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await userService.getProfile()
        if (!mounted) return
        setProfile(data)
        reset({ name: data.name ?? '', picture: data.picture ?? '' })
      } catch (e) {
        if (!mounted) return
        setError(e instanceof Error ? e.message : 'Falha ao carregar perfil')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    loadProfile()
    return () => {
      mounted = false
    }
  }, [reset])

  const onSubmit: SubmitHandler<ProfileFormData> = async (data) => {
    setSaving(true)
    setError(null)
    setSuccess(null)
    
    try {
      const dto: UpdateUserProfileDto = { name: data.name, picture: data.picture }
      const updated = await userService.updateProfile(dto)
      setProfile(updated)
      reset({ name: updated.name, picture: updated.picture ?? '' })
      setSuccess('Perfil atualizado com sucesso!')
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Falha ao atualizar perfil')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-5">
        <SkeletonBase>
          <div className="h-12 rounded-lg bg-gray-200 dark:bg-neutral-700" />
        </SkeletonBase>
        <SkeletonBase>
          <div className="h-12 rounded-lg bg-gray-200 dark:bg-neutral-700" />
        </SkeletonBase>
        <SkeletonBase>
          <div className="h-12 rounded-lg bg-gray-200 dark:bg-neutral-700" />
        </SkeletonBase>
        <SkeletonBase>
          <div className="h-10 w-40 rounded-xl bg-gray-200 dark:bg-neutral-700" />
        </SkeletonBase>
      </div>
    )
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
      {/* Email (read-only) */}
      <div>
        <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-neutral-300">
          Email
        </label>
        <div className="px-4 py-3 rounded-lg border border-gray-200 dark:border-neutral-700/40 bg-gray-50 dark:bg-neutral-800/60 text-gray-700 dark:text-neutral-300">
          {profile?.email ?? user?.email ?? '—'}
        </div>
      </div>

      {/* Name */}
      <Input
        {...register('name')}
        name="name"
        label="Nome"
        placeholder="Seu nome"
        required
        error={errors.name?.message}
        autoFocus
      />

      {/* Picture URL */}
      <Input
        {...register('picture')}
        name="picture"
        label="URL da imagem (opcional)"
        placeholder="https://..."
        error={errors.picture?.message}
      />

      {/* Company (read-only) - if available */}
      {profile?.companyId && (
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-neutral-300">
            Empresa
          </label>
          <div className="px-4 py-3 rounded-lg border border-gray-200 dark:border-neutral-700/40 bg-gray-50 dark:bg-neutral-800/60 text-gray-700 dark:text-neutral-300">
            {profile.companyId}
          </div>
        </div>
      )}

      {/* Feedback */}
      {error && (
        <Alert variant="error">
          <AlertIcon variant="error" />
          <span>{error}</span>
        </Alert>
      )}
      {success && (
        <Alert variant="success">
          <AlertIcon variant="success" />
          <span>{success}</span>
        </Alert>
      )}

      <div className="flex gap-3">
        <Button
          type="submit"
          disabled={saving || !isDirty}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          {saving ? 'Salvando...' : 'Salvar alterações'}
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={() => reset({ name: profile?.name ?? '', picture: profile?.picture ?? '' })}
          disabled={saving || !isDirty}
        >
          Desfazer
        </Button>
      </div>
    </form>
  )
}
