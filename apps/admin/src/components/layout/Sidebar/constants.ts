import type { NavLink } from './types'

export const NAV_LINKS: NavLink[] = [
  { path: '/home', label: 'Início', icon: 'house', dataTour: 'home' },
  { path: '/compliments', label: 'Elogios', icon: 'chat-circle', dataTour: 'compliments' },
  { path: '/economy', label: 'Economia', icon: 'currency-circle-dollar', dataTour: 'economy' },
  {
    path: '#',
    label: 'Usuários',
    icon: 'users',
    dataTour: 'users',
    subItems: [
      { path: '/users', label: 'Gerenciar Usuários', icon: 'users', dataTour: 'users-manage' },
      { path: '/roles', label: 'Cargos', icon: 'lock', dataTour: 'roles' },
    ]
  },
  {
    path: '#',
    label: 'Prêmios',
    icon: 'gift',
    dataTour: 'rewards',
    subItems: [
      { path: '/prizes/dashboard', label: 'Dashboard', icon: 'chart-bar', dataTour: 'redemptions-dashboard' },
      { path: '/prizes', label: 'Prêmios', icon: 'gift', dataTour: 'prizes' },
      { path: '/vouchers', label: 'Vouchers', icon: 'ticket', dataTour: 'vouchers' },
      { path: '/redemptions', label: 'Resgates', icon: 'receipt', dataTour: 'redemptions' },
    ]
  },
]

export const BOTTOM_NAV_LINKS: readonly NavLink[] = [
  { path: '/settings', label: 'Configurações', icon: 'gear', dataTour: 'profile' },
]

