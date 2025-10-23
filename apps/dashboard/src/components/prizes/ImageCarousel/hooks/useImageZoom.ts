import { useReducer, useCallback } from 'react'
import { ZoomState, ZoomAction } from '../types'

const initialState: ZoomState = {
  zoom: 1,
  position: { x: 0, y: 0 },
  isImageDragging: false,
}

const zoomReducer = (state: ZoomState, action: ZoomAction): ZoomState => {
  switch (action.type) {
    case 'SET_ZOOM':
      return { ...state, zoom: action.payload }
    
    case 'SET_POSITION':
      return { ...state, position: action.payload }
    
    case 'SET_IMAGE_DRAGGING':
      return { ...state, isImageDragging: action.payload }
    
    case 'RESET_ZOOM_AND_POSITION':
      return { ...state, zoom: 1, position: { x: 0, y: 0 } }
    
    case 'ADJUST_ZOOM':
      return { ...state, zoom: Math.max(0.9, Math.min(3, state.zoom + action.payload)) }
    
    case 'UPDATE_IMAGE_POSITION': {
      const { offset, zoom } = action.payload
      const zoomFactor = zoom - 1
      const baseOffset = 150
      const maxOffset = baseOffset + (zoomFactor * 200)
      
      const clampedX = Math.max(-maxOffset, Math.min(maxOffset, offset[0]))
      const clampedY = Math.max(-maxOffset, Math.min(maxOffset, offset[1]))
      
      return { ...state, position: { x: clampedX, y: clampedY } }
    }
    
    default:
      return state
  }
}

export const useImageZoom = () => {
  const [state, dispatch] = useReducer(zoomReducer, initialState)

  const zoomIn = useCallback(() => {
    dispatch({ type: 'ADJUST_ZOOM', payload: 0.5 })
  }, [])

  const zoomOut = useCallback(() => {
    dispatch({ type: 'ADJUST_ZOOM', payload: -0.5 })
  }, [])

  const resetZoom = useCallback(() => {
    dispatch({ type: 'RESET_ZOOM_AND_POSITION' })
  }, [])

  const setZoom = useCallback((zoom: number) => {
    dispatch({ type: 'SET_ZOOM', payload: zoom })
  }, [])

  const setPosition = useCallback((position: { x: number; y: number }) => {
    dispatch({ type: 'SET_POSITION', payload: position })
  }, [])

  const handleImageDrag = useCallback(({ offset, dragging }: { offset: [number, number], dragging?: boolean }) => {
    if (!dragging) {
      dispatch({ type: 'SET_IMAGE_DRAGGING', payload: false })
      return
    }

    dispatch({ type: 'SET_IMAGE_DRAGGING', payload: true })
    dispatch({ type: 'UPDATE_IMAGE_POSITION', payload: { offset, zoom: state.zoom } })
  }, [state.zoom])

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? -0.1 : 0.1
    dispatch({ type: 'ADJUST_ZOOM', payload: delta })
  }, [])

  return {
    zoom: state.zoom,
    position: state.position,
    isImageDragging: state.isImageDragging,
    zoomIn,
    zoomOut,
    resetZoom,
    setZoom,
    setPosition,
    handleImageDrag,
    handleWheel,
  }
}