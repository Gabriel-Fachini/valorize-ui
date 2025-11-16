import type { NavLink } from './types'

export const NAV_LINKS: NavLink[] = [
  { path: '/home', label: 'Início', icon: 'house', dataTour: 'home' },
  { path: '/clients', label: 'Clientes', icon: 'buildings', dataTour: 'clients' },
  {
    path: '#',
    label: 'Elogios',
    icon: 'chat-circle',
    dataTour: 'compliments',
    subItems: [
      { path: '/compliments', label: 'Dashboard', icon: 'chart-bar', dataTour: 'compliments-dashboard' },
      { path: '/compliments/network', label: 'Network', icon: 'graph', dataTour: 'compliments-network' },
    ]
  },
]

export const BOTTOM_NAV_LINKS: readonly NavLink[] = [
  { path: '/settings', label: 'Configurações', icon: 'gear', dataTour: 'profile' },
]

