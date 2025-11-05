export interface NavLink {
  path: string
  label: string
  icon: string
  dataTour: string
  subItems?: NavLink[]
}

export interface UserProfileProps {
  collapsed?: boolean
  userName?: string
  userEmail?: string
  avatarUrl?: string
  userRole?: string
  userDepartment?: string
  isLoading?: boolean
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
  subItems?: NavLink[]
  currentPath: string
  hasIndicator?: boolean
}

export interface BottomActionsProps {
  collapsed?: boolean
  currentPath: string
  onNavigate: (path: string) => void
  onLogout: () => void
}

export interface LogoProps {
  collapsed?: boolean
  onToggle?: () => void
  showToggle?: boolean
}

