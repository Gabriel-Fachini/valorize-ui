export interface NavLink {
  path: string
  label: string
  icon: string
  dataTour: string
}

export interface UserProfileProps {
  collapsed?: boolean
  userName?: string
  userEmail?: string
}

export interface NavigationProps {
  collapsed?: boolean
  currentPath: string
  onNavigate: (path: string) => void
}

export interface NavigationItemProps {
  path: string
  label: string
  icon: string
  dataTour: string
  isActive: boolean
  collapsed?: boolean
  onNavigate: (path: string) => void
}

export interface BottomActionsProps {
  collapsed?: boolean
  onLogout: () => void
}

export interface LogoProps {
  collapsed?: boolean
  onToggle?: () => void
  showToggle?: boolean
}

