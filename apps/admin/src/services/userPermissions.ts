import { api } from './api'
import type { ApiResponse } from '@/types/roles'

interface UserPermissionsResponse extends ApiResponse<string[]> {
  data: string[]
}

const userPermissionsService = {
  async getUserPermissions(): Promise<UserPermissionsResponse> {
    const response = await api.get<UserPermissionsResponse>('/admin/roles/me')
    return response.data
  },
}

export default userPermissionsService
