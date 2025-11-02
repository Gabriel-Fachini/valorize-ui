import { type FC, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ErrorModal } from '@/components/ui/ErrorModal'
import { UserForm } from './UserForm'
import { PasswordSetupModal } from './PasswordSetupModal'
import type { User, UserFormData, CreateUserResponse } from '@/types/users'

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
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [showPasswordSetupModal, setShowPasswordSetupModal] = useState(false)
  const [passwordSetupData, setPasswordSetupData] = useState<{
    email: string
    temporaryPasswordUrl?: string
  } | null>(null)

  const handleOpenChange = (newOpen: boolean) => {
    onOpenChange(newOpen)
  }

  const handleSubmit = async (data: UserFormData) => {
    try {
      const response = await onSubmit(data)
      
      // If this is a create operation and we have a CreateUserResponse with temporaryPasswordUrl
      if (!user && (response as unknown as CreateUserResponse)?.temporaryPasswordUrl) {
        const createResponse = response as unknown as CreateUserResponse
        setPasswordSetupData({
          email: createResponse.email,
          temporaryPasswordUrl: createResponse.temporaryPasswordUrl,
        })
        setShowPasswordSetupModal(true)
        onOpenChange(false)
      } else {
        onOpenChange(false)
      }
    } catch (error) {
      let message = 'Ocorreu um erro ao processar sua solicitação. Tente novamente.'
      
      // Handle axios error response
      if (error instanceof Error) {
        message = error.message
        
        // Check for specific error messages from API
        if (error.message.includes('not allowed')) {
          message = '❌ Domínio de email não permitido. Verifique os domínios autorizados e tente novamente.'
        } else if (error.message.includes('already exists')) {
          message = '⚠️ Este email já está registrado no sistema.'
        }
      }
      
      setErrorMessage(message)
      setIsErrorModalOpen(true)
    }
  }

  const handleErrorClose = () => {
    setIsErrorModalOpen(false)
    setErrorMessage('')
  }

  const handlePasswordSetupClose = () => {
    setShowPasswordSetupModal(false)
    setPasswordSetupData(null)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
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
            onSubmit={handleSubmit}
            onCancel={() => onOpenChange(false)}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>

      {passwordSetupData && passwordSetupData.temporaryPasswordUrl && (
        <PasswordSetupModal
          open={showPasswordSetupModal}
          onOpenChange={handlePasswordSetupClose}
          email={passwordSetupData.email}
          resetLink={passwordSetupData.temporaryPasswordUrl}
          expiresIn="24 horas"
        />
      )}

      <ErrorModal
        isOpen={isErrorModalOpen}
        onClose={handleErrorClose}
        title={user ? 'Erro ao atualizar usuário' : 'Erro ao criar usuário'}
        message={
          errorMessage ||
          'Ocorreu um erro ao processar sua solicitação. Tente novamente.'
        }
      />
    </>
  )
}
