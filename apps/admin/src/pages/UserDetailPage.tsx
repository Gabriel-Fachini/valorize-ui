import { type FC, useState } from 'react'
import { Link, useParams } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { SkeletonBase as Skeleton } from '@/components/ui/Skeleton'
import { PageLayout } from '@/components/layout/PageLayout'
import { UserDetailCard, UserStatisticsCard, UserFormDialog, UserDeleteDialog } from '@/components/users'
import { useUserDetail } from '@/hooks/useUserDetail'
import { useUserMutations } from '@/hooks/useUserMutations'
import type { UserFormData } from '@/types/users'

export const UserDetailPage: FC = () => {
  const { userId } = useParams({ strict: false })
  const { user, isLoading } = useUserDetail(userId as string)
  const { updateUser, deleteUser, isUpdating, isDeleting } = useUserMutations()
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const handleUpdate = async (data: UserFormData) => {
    if (!userId) return
    await updateUser({ userId, data })
  }

  const handleDelete = async () => {
    if (!userId) return
    await deleteUser(userId)
    window.history.back()
  }

  if (isLoading) {
    return (
      <PageLayout maxWidth="7xl">
        <div className="space-y-6">
          <Skeleton className="h-10 w-64" />
          <div className="grid gap-6 lg:grid-cols-2">
            <Skeleton className="h-64" />
            <Skeleton className="h-64" />
          </div>
        </div>
      </PageLayout>
    )
  }

  if (!user) {
    return (
      <PageLayout maxWidth="7xl">
        <div className="flex flex-col items-center justify-center py-12">
          <i className="ph ph-user-circle text-6xl text-muted-foreground" />
          <h2 className="mt-4 text-2xl font-bold">Usuário não encontrado</h2>
          <p className="mt-2 text-muted-foreground">O usuário que você está procurando não existe.</p>
          <Button asChild className="mt-6">
            <Link to="/users">
              <i className="ph ph-arrow-left mr-2" />
              Voltar para lista
            </Link>
          </Button>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout maxWidth="7xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/users">
                <i className="ph ph-arrow-left mr-2" />
                Voltar
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Detalhes do Usuário</h1>
              <p className="text-muted-foreground">Visualize e gerencie informações do usuário</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(true)}>
              <i className="ph ph-pencil-simple mr-2" />
              Editar
            </Button>
            <Button variant="destructive" onClick={() => setIsDeleteDialogOpen(true)}>
              <i className="ph ph-trash mr-2" />
              Deletar
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="grid gap-6 lg:grid-cols-2">
          <UserDetailCard user={user} />
          <UserStatisticsCard user={user} />
        </div>

        {/* Dialogs */}
        <UserFormDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          user={user}
          onSubmit={handleUpdate}
          isSubmitting={isUpdating}
        />
        <UserDeleteDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          user={user}
          onConfirm={handleDelete}
          isDeleting={isDeleting}
        />
      </div>
    </PageLayout>
  )
}
