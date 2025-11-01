import type { NavLink } from './types'

export const NAV_LINKS = [
  { path: '/home', label: 'Início', icon: 'house', dataTour: 'home' },
  { path: '/compliments', label: 'Elogios', icon: 'chat-circle', dataTour: 'compliments' },
  { path: '/users', label: 'Usuários', icon: 'users', dataTour: 'users' },
] as const

export const BOTTOM_NAV_LINKS: readonly NavLink[] = [
  { path: '/settings', label: 'Configurações', icon: 'gear', dataTour: 'profile' },
]

