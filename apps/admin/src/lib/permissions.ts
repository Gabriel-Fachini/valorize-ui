/**
 * Valida se o usuário tem uma permissão específica
 * @param userPermissions Array de permissões do usuário
 * @param requiredPermission Permissão requerida
 * @returns true se o usuário tem a permissão
 */
export const hasPermission = (userPermissions: string[] | unknown, requiredPermission: string): boolean => {
  if (!Array.isArray(userPermissions)) {
    return false
  }
  return userPermissions.includes(requiredPermission)
}

/**
 * Valida se o usuário tem pelo menos uma das permissões fornecidas
 * @param userPermissions Array de permissões do usuário
 * @param requiredPermissions Array de permissões (qualquer uma serve)
 * @returns true se o usuário tem pelo menos uma permissão
 */
export const hasAnyPermission = (
  userPermissions: string[] | unknown,
  requiredPermissions: string[],
): boolean => {
  if (!Array.isArray(userPermissions)) {
    return false
  }
  return requiredPermissions.some((perm) => userPermissions.includes(perm))
}

/**
 * Valida se o usuário tem todas as permissões fornecidas
 * @param userPermissions Array de permissões do usuário
 * @param requiredPermissions Array de permissões (todas são obrigatórias)
 * @returns true se o usuário tem todas as permissões
 */
export const hasAllPermissions = (
  userPermissions: string[] | unknown,
  requiredPermissions: string[],
): boolean => {
  if (!Array.isArray(userPermissions)) {
    return false
  }
  return requiredPermissions.every((perm) => userPermissions.includes(perm))
}

/**
 * Permissões esperadas do sistema
 * Baseado no backend FAC-100
 */
export const ROLE_PERMISSIONS = {
  ROLES_CREATE: 'ROLES_CREATE',
  ROLES_READ: 'ROLES_READ',
  ROLES_UPDATE: 'ROLES_UPDATE',
  ROLES_DELETE: 'ROLES_DELETE',
  ROLES_MANAGE_PERMISSIONS: 'ROLES_MANAGE_PERMISSIONS',
  USERS_MANAGE_ROLES: 'USERS_MANAGE_ROLES',
} as const
