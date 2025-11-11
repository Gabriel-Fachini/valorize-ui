/**
 * Data Table Column Renderers - Helper Functions
 */

import type { ReactNode } from 'react'
import {
  AvatarRenderer,
  ImageRenderer,
  StringRenderer,
  LinkRenderer,
  RelationRenderer,
  BadgeRenderer,
  DateRenderer,
  NumberRenderer,
} from './DataTableColumnRenderers'
import type {
  AvatarColumnConfig,
  ImageColumnConfig,
  StringColumnConfig,
  LinkColumnConfig,
  RelationColumnConfig,
  BadgeColumnConfig,
  DateColumnConfig,
  NumberColumnConfig,
  CustomColumnConfig,
} from '@/config/tables/types'
import { UserCardCell } from '@/components/redemptions/UserCardCell'
import { PrizeImageCell } from '@/components/redemptions/PrizeImageCell'
import type { Redemption } from '@/types/redemptions'

/**
 * Renderiza uma coluna com base no tipo
 */
export const renderColumn = <T extends object>(row: T, config: unknown, columnId?: string): ReactNode => {
  const col = config as { type: string }

  switch (col.type) {
    case 'avatar':
      return <AvatarRenderer row={row} config={config as AvatarColumnConfig<T>} />
    case 'image':
      return <ImageRenderer row={row} config={config as ImageColumnConfig<T>} />
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
    case 'custom': {
      // Handle custom columns with special renderers
      if (columnId === 'userId' && 'userId' in row) {
        return <UserCardCell row={row as unknown as Redemption} />
      }
      if (columnId === 'prizeId' && 'prizeId' in row) {
        return <PrizeImageCell row={row as unknown as Redemption} />
      }
      return (config as CustomColumnConfig<T>).cell(row)
    }
    default:
      return null
  }
}
