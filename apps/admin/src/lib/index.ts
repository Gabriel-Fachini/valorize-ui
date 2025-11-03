/**
 * Lib - General Purpose Utilities
 * Central export point for all utility functions
 */

// Token management utilities
export { TokenManager } from './tokenManager'

// Email utilities
export { 
  COMMON_EMAIL_DOMAINS,
  extractEmailDomain,
  suggestEmailDomain,
} from './email'

// Table utilities
export {
  filtersToRecord,
  recordToFilters,
  createFilterHandler,
} from './table-utils'

// Table column helpers
export {
  createAvatarColumn,
  createLinkColumn,
  createStringColumn,
  createRelationColumn,
  createActiveStatusBadge,
} from './table-column-helpers'

// Table filter helpers
export {
  createSearchFilter,
  createStatusFilter,
  createDynamicFilter,
  createSelectOptions,
} from './table-filter-helpers'
