import { createContext, useState, useContext, ReactNode } from 'react'

interface TransitionContextProps {
  isTransitioning: boolean
  startTransition: (callback: () => void) => void
}

const TransitionContext = createContext<TransitionContextProps | undefined>(undefined)

export const TransitionProvider = ({ children }: { children: ReactNode }) => {
  const [isTransitioning, setIsTransitioning] = useState(false)

  const startTransition = (callback: () => void) => {
    setIsTransitioning(true)
    // Tempo para a animação de saída
    setTimeout(() => {
      callback()
      // Tempo para a animação de entrada
      setTimeout(() => {
        setIsTransitioning(false)
      }, 300)
    }, 500)
  }

  return (
    <TransitionContext.Provider value={{ isTransitioning, startTransition }}>
      {children}
    </TransitionContext.Provider>
  )
}

export const useTransition = () => {
  const context = useContext(TransitionContext)
  if (!context) {
    throw new Error('useTransition must be used within a TransitionProvider')
  }
  return context
}
