import type { NavLink } from './types'

export const NAV_LINKS = [
  { path: '/home', label: 'Início', icon: 'house', dataTour: 'home' },
  { path: '/compliments', label: 'Elogios', icon: 'chat-circle', dataTour: 'compliments' },
  { path: '/economy', label: 'Economia', icon: 'currency-circle-dollar', dataTour: 'economy' },
  { path: '/users', label: 'Usuários', icon: 'users', dataTour: 'users' },
  { path: '/roles', label: 'Cargos', icon: 'lock', dataTour: 'roles' },
] as const

export const BOTTOM_NAV_LINKS: readonly NavLink[] = [
  { path: '/settings', label: 'Configurações', icon: 'gear', dataTour: 'profile' },
]

