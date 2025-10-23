import { useReducer, useCallback } from 'react'
import { CarouselState, CarouselAction } from '../types'

const initialState: CarouselState = {
  currentIndex: 0,
  isModalOpen: false,
  isDragging: false,
}

const carouselReducer = (state: CarouselState, action: CarouselAction): CarouselState => {
  switch (action.type) {
    case 'SET_CURRENT_INDEX':
      return { ...state, currentIndex: action.payload }
    
    case 'SET_MODAL_OPEN':
      return { ...state, isModalOpen: action.payload }
    
    case 'SET_DRAGGING':
      return { ...state, isDragging: action.payload }
    
    case 'GO_TO_PREVIOUS':
      return {
        ...state,
        currentIndex: state.currentIndex > 0 ? state.currentIndex - 1 : action.payload - 1,
      }
    
    case 'GO_TO_NEXT':
      return {
        ...state,
        currentIndex: state.currentIndex < action.payload - 1 ? state.currentIndex + 1 : 0,
      }
    
    default:
      return state
  }
}

export const useCarouselState = (images: string[]) => {
  const [state, dispatch] = useReducer(carouselReducer, initialState)

  const goToSlide = useCallback((index: number) => {
    dispatch({ type: 'SET_CURRENT_INDEX', payload: index })
  }, [])

  const goToPrevious = useCallback(() => {
    dispatch({ type: 'GO_TO_PREVIOUS', payload: images.length })
  }, [images.length])

  const goToNext = useCallback(() => {
    dispatch({ type: 'GO_TO_NEXT', payload: images.length })
  }, [images.length])

  const openModal = useCallback(() => {
    dispatch({ type: 'SET_MODAL_OPEN', payload: true })
  }, [])

  const closeModal = useCallback(() => {
    dispatch({ type: 'SET_MODAL_OPEN', payload: false })
  }, [])

  const setDragging = useCallback((dragging: boolean) => {
    dispatch({ type: 'SET_DRAGGING', payload: dragging })
  }, [])

  return {
    currentIndex: state.currentIndex,
    isModalOpen: state.isModalOpen,
    isDragging: state.isDragging,
    goToSlide,
    goToPrevious,
    goToNext,
    openModal,
    closeModal,
    setDragging,
  }
}