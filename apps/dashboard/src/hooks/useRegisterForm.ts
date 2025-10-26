import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { RegisterFormData, registerFormSchema } from '@/types'
import { registerUser } from '@/services/auth'
import { useAuth } from '@/hooks/useAuth'

export const useRegisterForm = () => {
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  // React Hook Form setup with Zod validation
  const formMethods = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormSchema),
    mode: 'onBlur',
  })

  const { setError, clearErrors } = formMethods

  // Handle form submission
  const onSubmit = async (data: RegisterFormData) => {
    clearErrors()
    setIsLoading(true)
    
    try {
      const response = await registerUser(data)
      
      if (response.success) {
        // Cadastro realizado com sucesso, fazer login automático
        const loginResult = await login(data.email, 'V@alorize')
        
        if (loginResult.success) {
          // Login bem-sucedido, redirecionar para home
          navigate({ to: '/home' })
        } else {
          // Se o login falhar após o cadastro, mostrar erro
          setError('root', {
            type: 'manual',
            message: 'Cadastro realizado, mas falha no login automático. Tente fazer login manualmente.',
          })
        }
      } else {
        setError('root', {
          type: 'manual',
          message: response.message ?? 'Erro ao cadastrar usuário. Tente novamente.',
        })
      }
    } catch {
      setError('root', {
        type: 'manual',
        message: 'Erro ao cadastrar usuário. Tente novamente.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return {
    formMethods,
    states: { isLoading },
    handlers: { onSubmit },
  }
}
