// Design tokens centralizados para o sistema de design
export const designTokens = {
  // Cores e gradientes
  colors: {
    primary: {
      gradient: 'from-purple-600 to-indigo-600',
      light: 'text-purple-600 dark:text-purple-400',
      bg: 'bg-gradient-to-r from-purple-600 to-indigo-600',
    },
    surface: {
      glass: 'bg-white/80 dark:bg-gray-900/80',
      overlay: 'bg-white/20 dark:bg-gray-800/40',
      border: 'border-white/20 dark:border-gray-700/30',
    },
    balance: {
      compliment: {
        gradient: 'from-purple-50/80 to-indigo-50/80 dark:from-purple-900/30 dark:to-indigo-900/30',
        text: 'text-purple-600 dark:text-purple-400',
        icon: 'bg-purple-100/80 dark:bg-purple-800/60',
        border: 'border-white/20 dark:border-purple-500/20',
        shadow: 'shadow-purple-500/10 dark:shadow-purple-500/20',
      },
      redeemable: {
        gradient: 'from-emerald-50/80 to-teal-50/80 dark:from-emerald-900/30 dark:to-teal-900/30',
        text: 'text-emerald-600 dark:text-emerald-400',
        icon: 'bg-emerald-100/80 dark:bg-emerald-800/60',
        border: 'border-white/20 dark:border-emerald-500/20',
        shadow: 'shadow-emerald-500/10 dark:shadow-emerald-500/20',
      },
    },
    indicator: {
      gradient: 'from-purple-50/90 to-indigo-50/90 dark:from-purple-500/20 dark:to-indigo-500/20',
      border: 'border-white/30 dark:border-purple-500/30',
      shadow: 'shadow-purple-500/20 dark:shadow-purple-500/30',
    },
    danger: {
      gradient: 'from-red-50/80 to-pink-50/80 dark:from-red-900/30 dark:to-pink-900/30',
      text: 'text-red-600 dark:text-red-400',
      border: 'border-white/20 dark:border-red-500/20',
      shadow: 'shadow-red-500/10 dark:shadow-red-500/20',
      hover: 'hover:from-red-100/80 hover:to-pink-100/80 dark:hover:from-red-800/40 dark:hover:to-pink-800/40',
    },
  },

  // Efeitos visuais
  effects: {
    backdrop: 'backdrop-blur-xl backdrop-saturate-150',
    glass: 'backdrop-blur-md',
    shadow: {
      default: 'shadow-lg shadow-black/5 dark:shadow-black/20',
      elevated: 'shadow-2xl shadow-black/10 dark:shadow-black/30',
      glow: 'shadow-xl shadow-purple-500/25',
    },
  },

  // Espaçamentos e dimensões
  layout: {
    sidebar: {
      desktop: {
        expanded: '320px',
        collapsed: '80px',
      },
      mobile: '320px',
      header: '64px',
    },
    spacing: {
      xs: '8px',
      sm: '12px',
      md: '16px',
      lg: '24px',
      xl: '32px',
    },
  },

  // Transições e animações
  animation: {
    default: 'transition-all duration-300',
    gentle: 'transition-all duration-200',
    spring: { tension: 280, friction: 30 },
  },

  // Bordas e raios
  border: {
    radius: {
      sm: 'rounded-lg',
      md: 'rounded-xl',
      full: 'rounded-full',
    },
  },
} as const

// Helper functions para combinar classes
export const combineClasses = (...classes: (string | undefined)[]) => {
  return classes.filter(Boolean).join(' ')
}

// Tokens específicos para componentes
export const sidebarTokens = {
  mobileHeader: combineClasses(
    'sticky top-0 z-50 flex h-16 items-center justify-between',
    designTokens.colors.surface.glass,
    designTokens.effects.backdrop,
    designTokens.colors.surface.border,
    'px-4 lg:hidden',
    designTokens.effects.shadow.default,
  ),
  desktopSidebar: combineClasses(
    'hidden lg:flex fixed left-0 top-0 z-40 h-screen flex-col',
    designTokens.colors.surface.glass,
    designTokens.effects.backdrop,
    designTokens.colors.surface.border,
    'border-r overflow-hidden',
    designTokens.effects.shadow.elevated,
  ),
  button: {
    primary: combineClasses(
      'flex items-center justify-center',
      designTokens.colors.surface.overlay,
      designTokens.effects.glass,
      'text-gray-700 dark:text-gray-200',
      'hover:bg-white/30 dark:hover:bg-gray-700/50',
      designTokens.animation.default,
      designTokens.colors.surface.border,
      designTokens.effects.shadow.default,
    ),
  },
}