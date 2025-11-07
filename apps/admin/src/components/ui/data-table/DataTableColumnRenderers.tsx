/**
 * Data Table Column Renderers
 * Renderizadores específicos para cada tipo de coluna
 */

import type { ReactNode } from 'react'
import { Link } from '@tanstack/react-router'
import { Badge } from '@/components/ui/badge'
import type {
  AvatarColumnConfig,
  ImageColumnConfig,
  StringColumnConfig,
  LinkColumnConfig,
  RelationColumnConfig,
  BadgeColumnConfig,
  DateColumnConfig,
  NumberColumnConfig,
} from '@/config/tables/types'

// ============================================================================
// Helper: Get nested value from object
// ============================================================================

const getNestedValue = <T,>(obj: T, path: string | keyof T | ((row: T) => unknown)): unknown => {
  if (typeof path === 'function') {
    return path(obj)
  }

  if (typeof path === 'string' && path.includes('.')) {
    return path.split('.').reduce((acc: unknown, part: string) => {
      if (acc && typeof acc === 'object' && part in acc) {
        return (acc as Record<string, unknown>)[part]
      }
      return undefined
    }, obj)
  }

  return obj[path as keyof T]
}

// ============================================================================
// Avatar Renderer
// ============================================================================

interface AvatarRendererProps<T> {
  row: T
  config: AvatarColumnConfig<T>
}

export const AvatarRenderer = <T,>({ row, config }: AvatarRendererProps<T>): ReactNode => {
  const imageUrl = config.imageAccessor
    ? (getNestedValue(row, config.imageAccessor) as string | undefined)
    : undefined

  const name = config.nameAccessor
    ? (getNestedValue(row, config.nameAccessor) as string)
    : config.accessor
      ? (getNestedValue(row, config.accessor) as string)
      : ''

  const initials = name
    ? name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '??'

  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
  }

  const size = config.size || 'md'

  return (
    <div className="flex items-center justify-center">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={name}
          className={`${sizeClasses[size]} rounded-full object-cover`}
        />
      ) : (
        <div
          className={`${sizeClasses[size]} flex items-center justify-center rounded-full bg-primary/10 font-semibold text-primary`}
        >
          {initials}
        </div>
      )}
    </div>
  )
}

// ============================================================================
// Image Renderer
// ============================================================================

interface ImageRendererProps<T> {
  row: T
  config: ImageColumnConfig<T>
}

export const ImageRenderer = <T,>({ row, config }: ImageRendererProps<T>): ReactNode => {
  const imageUrl = getNestedValue(row, config.imageAccessor) as string | undefined

  const altText = config.altAccessor
    ? (getNestedValue(row, config.altAccessor) as string)
    : 'Imagem'

  // Aspect ratio classes
  const aspectRatioClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    portrait: 'aspect-[3/4]',
    custom: '',
  }

  const aspectRatio = config.aspectRatio || 'video'
  const objectFit = config.objectFit || 'cover'

  // Calculate dimensions
  const width = config.width || 80
  const height = config.height

  const containerStyle = height
    ? { width: `${width}px`, height: `${height}px` }
    : { width: `${width}px` }

  const handleClick = config.onClick ? () => config.onClick!(row) : undefined

  return (
    <div className="flex items-center">
      {imageUrl ? (
        <div
          className={`overflow-hidden rounded border bg-muted ${
            !height ? aspectRatioClasses[aspectRatio] : ''
          } ${config.onClick ? 'cursor-pointer transition-opacity hover:opacity-80' : ''}`}
          style={containerStyle}
          onClick={handleClick}
          onKeyDown={(e) => {
            if (config.onClick && (e.key === 'Enter' || e.key === ' ')) {
              e.preventDefault()
              config.onClick(row)
            }
          }}
          role={config.onClick ? 'button' : undefined}
          tabIndex={config.onClick ? 0 : undefined}
        >
          <img
            src={imageUrl}
            alt={altText}
            className={`h-full w-full object-${objectFit}`}
          />
        </div>
      ) : (
        <div
          className={`flex items-center justify-center rounded border bg-muted/50 ${
            !height ? aspectRatioClasses[aspectRatio] : ''
          } ${config.onClick ? 'cursor-pointer transition-opacity hover:opacity-80' : ''}`}
          style={containerStyle}
          onClick={handleClick}
          onKeyDown={(e) => {
            if (config.onClick && (e.key === 'Enter' || e.key === ' ')) {
              e.preventDefault()
              config.onClick(row)
            }
          }}
          role={config.onClick ? 'button' : undefined}
          tabIndex={config.onClick ? 0 : undefined}
        >
          <i className="ph ph-image text-2xl text-muted-foreground" />
        </div>
      )}
    </div>
  )
}

// ============================================================================
// String Renderer
// ============================================================================

interface StringRendererProps<T> {
  row: T
  config: StringColumnConfig<T>
}

export const StringRenderer = <T,>({ row, config }: StringRendererProps<T>): ReactNode => {
  const value = config.accessor ? getNestedValue(row, config.accessor) : ''
  const stringValue = String(value || '')

  const displayClasses = {
    'string-bold': 'font-medium',
    'string-secondary': 'text-sm text-muted-foreground',
    'string-muted': 'text-sm text-muted-foreground/70',
    string: 'text-sm',
  }

  const className = displayClasses[config.display || 'string']

  let displayValue = stringValue

  if (config.truncate && config.maxLength && stringValue.length > config.maxLength) {
    displayValue = `${stringValue.slice(0, config.maxLength)}...`
  }

  const handleClick = config.onClick ? () => config.onClick!(row) : undefined

  return (
    <div
      className={`${className} ${config.onClick ? 'cursor-pointer hover:underline' : ''}`}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (config.onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault()
          config.onClick(row)
        }
      }}
      role={config.onClick ? 'button' : undefined}
      tabIndex={config.onClick ? 0 : undefined}
    >
      {displayValue}
    </div>
  )
}

// ============================================================================
// Link Renderer
// ============================================================================

interface LinkRendererProps<T> {
  row: T
  config: LinkColumnConfig<T>
}

export const LinkRenderer = <T,>({ row, config }: LinkRendererProps<T>): ReactNode => {
  const value = config.accessor ? getNestedValue(row, config.accessor) : ''
  const stringValue = String(value || '')

  const path = typeof config.linkPath === 'function' ? config.linkPath(row) : config.linkPath

  const displayClasses = {
    'string-bold': 'font-medium',
    'string-secondary': 'text-sm text-muted-foreground',
    'string-muted': 'text-sm text-muted-foreground/70',
    string: 'text-sm',
  }

  const className = displayClasses[config.display || 'string']

  return (
    <Link 
      to={path}
      target={config.linkTarget} 
      className={`${className} hover:underline`}
      params={{}}
    >
      {stringValue}
    </Link>
  )
}

// ============================================================================
// Relation Renderer
// ============================================================================

interface RelationRendererProps<T> {
  row: T
  config: RelationColumnConfig<T>
}

export const RelationRenderer = <T,>({ row, config }: RelationRendererProps<T>): ReactNode => {
  const value = config.accessor ? getNestedValue(row, config.accessor) : undefined

  const displayClasses = {
    'string-bold': 'font-medium',
    'string-secondary': 'text-sm text-muted-foreground',
    'string-muted': 'text-sm text-muted-foreground/70',
    string: 'text-sm',
  }

  const className = displayClasses[config.display || 'string']

  if (!value) {
    return <span className="text-sm text-muted-foreground">{config.fallback || '-'}</span>
  }

  return <div className={className}>{String(value)}</div>
}

// ============================================================================
// Badge Renderer
// ============================================================================

interface BadgeRendererProps<T> {
  row: T
  config: BadgeColumnConfig<T>
}

export const BadgeRenderer = <T,>({ row, config }: BadgeRendererProps<T>): ReactNode => {
  const value = config.accessor ? getNestedValue(row, config.accessor) : undefined

  const variant = config.badgeVariant ? config.badgeVariant(value, row) : 'default'
  const label = config.badgeLabel ? config.badgeLabel(value, row) : String(value)

  return <Badge variant={variant}>{label}</Badge>
}

// ============================================================================
// Date Renderer
// ============================================================================

interface DateRendererProps<T> {
  row: T
  config: DateColumnConfig<T>
}

export const DateRenderer = <T,>({ row, config }: DateRendererProps<T>): ReactNode => {
  const value = config.accessor ? getNestedValue(row, config.accessor) : undefined

  if (!value) {
    return <span className="text-sm text-muted-foreground">-</span>
  }

  // Formata a data com hora usando toLocaleString pt-BR
  let dateValue = ''
  
  if (value instanceof Date) {
    dateValue = value.toLocaleString('pt-BR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  } else {
    // Se for string, tenta converter para Date primeiro
    const date = new Date(String(value))
    if (!isNaN(date.getTime())) {
      dateValue = date.toLocaleString('pt-BR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
    } else {
      dateValue = String(value)
    }
  }

  return <div className="text-sm">{dateValue}</div>
}

// ============================================================================
// Number Renderer
// ============================================================================

interface NumberRendererProps<T> {
  row: T
  config: NumberColumnConfig<T>
}

export const NumberRenderer = <T,>({ row, config }: NumberRendererProps<T>): ReactNode => {
  const value = config.accessor ? getNestedValue(row, config.accessor) : undefined

  if (value === null || value === undefined) {
    return <span className="text-sm text-muted-foreground">-</span>
  }

  const numValue = Number(value)

  let formatted = ''

  switch (config.format) {
    case 'currency':
      formatted = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: config.currency || 'BRL',
        minimumFractionDigits: config.decimals ?? 2,
        maximumFractionDigits: config.decimals ?? 2,
      }).format(numValue)
      break

    case 'percent':
      formatted = new Intl.NumberFormat('pt-BR', {
        style: 'percent',
        minimumFractionDigits: config.decimals ?? 0,
        maximumFractionDigits: config.decimals ?? 0,
      }).format(numValue)
      break

    case 'decimal':
    default:
      formatted = new Intl.NumberFormat('pt-BR', {
        minimumFractionDigits: config.decimals ?? 0,
        maximumFractionDigits: config.decimals ?? 2,
      }).format(numValue)
      break
  }

  return <div className="text-sm font-medium tabular-nums">{formatted}</div>
}
