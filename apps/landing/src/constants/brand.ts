/**
 * Valorize Brand Constants
 * Design tokens and brand guidelines
 */

export const colors = {
  brand: {
    // Valorize Green - Primary Brand Color
    valorize: {
      50: '#E5FFF0',
      100: '#CCFFE1',
      200: '#99FFCC',
      300: '#66FFB3',
      400: '#33E680',
      500: '#00D959', // Primary
      600: '#00AD47',
      700: '#008235',
      800: '#005723',
      900: '#003314',
      950: '#001A0A',
    },
    // Secondary Pink - Accent Color
    secondary: {
      500: '#D9004F',
    },
  },
  // Dark Theme Colors
  dark: {
    800: '#262626',
    900: '#171717',
    950: '#0A0A0A', // Background
  },
  // Semantic Colors
  semantic: {
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  },
  // Coin/Gamification Colors
  coin: {
    base: '#D97706', // Amber 600 - Dark Gold for sides
    face: '#FCD34D', // Amber 300 - Bright Gold for face
    ink: '#92400E', // Amber 800 - Darker for engravings
  },
}

export const typography = {
  fontFamily: {
    sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
    mono: ['Fira Code', 'Consolas', 'monospace'],
  },
  fontWeight: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
}

export const spacing = {
  section: {
    sm: '4rem', // py-16
    md: '6rem', // py-24
    lg: '8rem', // py-32
  },
  container: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
}

export const animations = {
  duration: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
    slower: '800ms',
  },
  easing: {
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
  },
  // Framer Motion defaults
  spring: {
    stiffness: 260,
    damping: 20,
  },
}

export const gradients = {
  brand: 'linear-gradient(135deg, #00D959, #00AD47)',
  brandHover: 'linear-gradient(135deg, #00AD47, #008235)',
  text: 'linear-gradient(to right, #33E680, #00AD47)',
  cta: 'linear-gradient(to right, #00AD47, #00D959)',
}

export const shadows = {
  valorize: {
    sm: '0 4px 14px -3px rgba(0, 217, 89, 0.1)',
    md: '0 10px 25px -5px rgba(0, 217, 89, 0.15)',
    lg: '0 20px 40px -10px rgba(0, 217, 89, 0.2)',
    xl: '0 25px 50px -12px rgba(0, 217, 89, 0.25)',
  },
}

export const borderRadius = {
  sm: '0.375rem', // 6px
  md: '0.5rem', // 8px
  lg: '0.75rem', // 12px
  xl: '1rem', // 16px
  '2xl': '1.5rem', // 24px
  '3xl': '2rem', // 32px
  full: '9999px',
}