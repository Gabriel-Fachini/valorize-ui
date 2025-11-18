import type { NavLink } from './types'

export const NAV_LINKS: NavLink[] = [
  { path: '/home', label: 'Início', icon: 'house', dataTour: 'home' },
  { path: '/clients', label: 'Clientes', icon: 'buildings', dataTour: 'clients' },
  { path: '/financial', label: 'Gestão Financeira', icon: 'currency-dollar', dataTour: 'financial' },
  { path: '/audit-logs', label: 'Logs de Auditoria', icon: 'clipboard-text', dataTour: 'audit-logs' },
]

export const BOTTOM_NAV_LINKS: readonly NavLink[] = [
  { path: '/settings', label: 'Configurações', icon: 'gear', dataTour: 'profile' },
]

