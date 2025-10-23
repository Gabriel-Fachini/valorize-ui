import { memo } from 'react'
import { ThumbnailSidebarProps } from '../types'

export const ThumbnailSidebar = memo<ThumbnailSidebarProps>(({ 
  images, 
  currentIndex, 
  onImageSelect 
}) => {
  if (images.length <= 1) return null

  return (
    <div className="hidden md:flex flex-col gap-3 p-6 overflow-y-auto max-h-screen w-32 bg-white/10 dark:bg-[#171717] backdrop-blur-lg border-r border-white/10">
      {images.map((image, index) => (
        <button
          key={`thumb-${image}-${index}`}
          onClick={() => onImageSelect(index)}
          className={`relative aspect-square overflow-hidden rounded-lg flex-shrink-0 border-2 transition-all ${
            currentIndex === index
              ? 'border-white ring-2 ring-white/50'
              : 'border-white/30 hover:border-white/60'
          }`}
          aria-label={`Ver imagem ${index + 1}`}
        >
          <img
            src={image}
            alt={`Miniatura ${index + 1}`}
            className="h-full w-full object-cover"
            loading="lazy"
            decoding="async"
          />
          {currentIndex === index && (
            <div className="absolute inset-0 bg-white/20" />
          )}
        </button>
      ))}
    </div>
  )
})