import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuth } from '@/hooks/useAuth'
import { useNavigate } from '@tanstack/react-router'
import { LoginFormData, loginFormSchema } from '@/types'

export const useLoginForm = () => {
  const { login, user } = useAuth()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  // React Hook Form setup with Zod validation
  const formMethods = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
    mode: 'onBlur',
  })

  const { setError, clearErrors } = formMethods

  // Redirecionar se já estiver logado
  useEffect(() => {
    if (user) {
      navigate({ to: '/' })
    }
  }, [user, navigate])

  // Handle form submission
  const onSubmit = async (data: LoginFormData) => {
    clearErrors()
    setIsLoading(true)
    
    const res = await login(data.email, data.password)
    
    if (res.success) {
      navigate({ to: '/' })
    } else {
      setIsLoading(false)
      setError('root', {
        type: 'manual',
        message: res.message ?? 'Email ou senha inválidos',
      })
    }
  }

  return {
    formMethods,
    states: { isLoading },
    handlers: { onSubmit },
  }
}
