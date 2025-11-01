import { type FC } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { UserForm } from './UserForm'
import type { User, UserFormData } from '@/types/users'

interface UserFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user?: User
  onSubmit: (data: UserFormData) => Promise<void>
  isSubmitting?: boolean
}

export const UserFormDialog: FC<UserFormDialogProps> = ({
  open,
  onOpenChange,
  user,
  onSubmit,
  isSubmitting,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{user ? 'Editar usuário' : 'Criar novo usuário'}</DialogTitle>
          <DialogDescription>
            {user
              ? 'Atualize as informações do usuário abaixo.'
              : 'Preencha os dados para criar um novo usuário.'}
          </DialogDescription>
        </DialogHeader>
        <UserForm
          user={user}
          onSubmit={async (data) => {
            await onSubmit(data)
            onOpenChange(false)
          }}
          onCancel={() => onOpenChange(false)}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  )
}
