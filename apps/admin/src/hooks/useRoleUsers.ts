import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import userRolesService from '@/services/userRoles'
import type { RoleUser } from '@/types/roles'

/**
 * Hook para gerenciar usuários de um role específico
 * - Lista usuários que possuem o role
 * - Remove usuários do role
 * - Invalidar cache após mudanças
 */
export const useRoleUsers = (roleId: string, page = 1, limit = 20) => {
  const queryClient = useQueryClient()

  // Query para listar usuários do role
  const query = useQuery({
    queryKey: ['roles', roleId, 'users', page, limit],
    queryFn: async () => await userRolesService.getRoleUsers(roleId, page, limit),
    enabled: !!roleId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    retry: 2,
  })

  // Mutation para remover usuário do role
  const removeUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      await userRolesService.removeRoleFromUser(userId, roleId)
    },
    onSuccess: () => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({
        queryKey: ['roles', roleId, 'users'],
        exact: false,
      })
      // Invalidar detalhe do role para atualizar contagem
      queryClient.invalidateQueries({
        queryKey: ['roles', roleId],
        exact: true,
      })
      // Invalidar lista de usuários (pode afetar contagens)
      queryClient.invalidateQueries({
        queryKey: ['users'],
        exact: false,
      })
    },
  })

  return {
    users: (query.data?.data as RoleUser[]) ?? [],
    totalCount: query.data?.totalCount ?? 0,
    pageCount: query.data?.pageCount ?? 0,
    currentPage: query.data?.currentPage ?? 1,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    isFetching: query.isFetching,
    refetch: query.refetch,
    // Remove user from role
    removeUser: removeUserMutation.mutate,
    isRemoving: removeUserMutation.isPending,
    removeError: removeUserMutation.error,
  }
}

export type UseRoleUsersReturn = ReturnType<typeof useRoleUsers>
