/**
 * Data Table Column Renderers - Helper Functions
 */

import type { ReactNode } from 'react'
import {
  AvatarRenderer,
  StringRenderer,
  LinkRenderer,
  RelationRenderer,
  BadgeRenderer,
  DateRenderer,
  NumberRenderer,
} from './DataTableColumnRenderers'
import type {
  AvatarColumnConfig,
  StringColumnConfig,
  LinkColumnConfig,
  RelationColumnConfig,
  BadgeColumnConfig,
  DateColumnConfig,
  NumberColumnConfig,
} from '@/config/tables/types'

/**
 * Renderiza uma coluna com base no tipo
 */
export const renderColumn = <T,>(row: T, config: unknown): ReactNode => {
  const col = config as { type: string }

  switch (col.type) {
    case 'avatar':
      return <AvatarRenderer row={row} config={config as AvatarColumnConfig<T>} />
    case 'string':
      return <StringRenderer row={row} config={config as StringColumnConfig<T>} />
    case 'link':
      return <LinkRenderer row={row} config={config as LinkColumnConfig<T>} />
    case 'relation':
      return <RelationRenderer row={row} config={config as RelationColumnConfig<T>} />
    case 'badge':
      return <BadgeRenderer row={row} config={config as BadgeColumnConfig<T>} />
    case 'date':
      return <DateRenderer row={row} config={config as DateColumnConfig<T>} />
    case 'number':
      return <NumberRenderer row={row} config={config as NumberColumnConfig<T>} />
    default:
      return null
  }
}
