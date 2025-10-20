import { STEPS_WITH_NAVIGATION } from './constants'

export const getTourStyles = () => ({
  popover: (base: any) => ({
    ...base,
    borderRadius: '12px',
    padding: '24px',
    maxWidth: '450px',
    backgroundColor: 'var(--tour-bg-color)',
    color: 'var(--tour-text-color)',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)',
    zIndex: 60,
  }),
  maskArea: (base: any) => ({
    ...base,
    rx: 8,
    zIndex: 56,
  }),
  maskWrapper: (base: any) => ({
    ...base,
    color: '#000',
    opacity: 0.85,
    zIndex: 55,
  }),
  badge: (base: any) => ({
    ...base,
    backgroundColor: '#6366f1',
    color: 'white',
  }),
  controls: (base: any, state: any) => {
    const currentStep = state?.currentStep ?? 0
    const shouldHide = !STEPS_WITH_NAVIGATION.includes(currentStep)
    return {
      ...base,
      marginTop: '24px',
      display: shouldHide ? 'none' : 'flex',
    }
  },
  close: (base: any) => ({
    ...base,
    right: '16px',
    top: '16px',
    color: 'var(--tour-text-color)',
    opacity: 0.8,
    transition: 'opacity 0.2s ease',
  }),
  arrow: (base: any) => ({
    ...base,
    color: 'white',
    borderColor: 'var(--tour-bg-color)',
    filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))',
  }),
})
