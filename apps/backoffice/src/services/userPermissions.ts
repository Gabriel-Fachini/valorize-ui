import type { Role } from '@/types'

const userPermissionsService = {
  async getUserRoles(): Promise<Role[]> {
    // TODO: Implementar quando o backend estiver pronto
    // Por enquanto retorna um array vazio para não quebrar a sidebar
    return []
  },
}

export default userPermissionsService
