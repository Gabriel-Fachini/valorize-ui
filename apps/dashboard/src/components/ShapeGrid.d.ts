declare module '@/components/ShapeGrid' {
  import type { FC } from 'react'

  export interface ShapeGridProps {
    direction?: 'right' | 'left' | 'up' | 'down' | 'diagonal'
    speed?: number
    borderColor?: string
    squareSize?: number
    hoverFillColor?: string
    shape?: 'square' | 'circle' | 'triangle' | 'hexagon'
    hoverTrailAmount?: number
    className?: string
  }

  const ShapeGrid: FC<ShapeGridProps>
  export default ShapeGrid
}
