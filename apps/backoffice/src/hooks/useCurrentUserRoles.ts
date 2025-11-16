import { useEffect, useState } from 'react'
import userPermissionsService from '@/services/userPermissions'
import type { Role } from '@/types'

export const useCurrentUserRoles = () => {
  const [roles, setRoles] = useState<Role[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRoles = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const userRoles = await userPermissionsService.getUserRoles()
        setRoles(userRoles)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar roles'
        setError(errorMessage)
        console.error('Error fetching user roles:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRoles()
  }, [])

  return { roles, isLoading, error }
}
