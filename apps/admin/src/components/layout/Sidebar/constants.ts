import type { NavLink } from './types'

export const NAV_LINKS = [
  { path: '/home', label: 'Início', icon: 'house', dataTour: 'home' },
  { path : '/compliments', label: 'Elogios', icon: 'chat-circle', dataTour: 'compliments' },
] as const

export const BOTTOM_NAV_LINKS: readonly NavLink[] = [
  { path: '/settings', label: 'Configurações', icon: 'gear', dataTour: 'profile' },
]

