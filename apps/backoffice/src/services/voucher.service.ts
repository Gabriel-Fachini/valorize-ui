/**
 * Voucher Service
 * Handles all API calls related to voucher products catalog management
 */

import { api } from './api'
import type {
  VouchersListResponse,
  VoucherDetailResponse,
  SyncCatalogResponse,
  VouchersQueryParams,
  UpdateVoucherInput,
  VoucherActionResponse,
  ImageUploadResponse,
} from '@/types/voucher'

/**
 * List voucher products with optional filters
 * GET /backoffice/vouchers/all - List ALL vouchers including inactive with summary stats
 */
export async function listVouchers(
  params?: VouchersQueryParams
): Promise<VouchersListResponse> {
  const response = await api.get<VouchersListResponse>('/backoffice/vouchers/all', {
    params,
  })
  return response.data
}

/**
 * Get a single voucher product by ID
 * GET /backoffice/vouchers/:id
 */
export async function getVoucher(id: string): Promise<VoucherDetailResponse> {
  const response = await api.get<VoucherDetailResponse>(`/backoffice/vouchers/${id}`)
  return response.data
}

/**
 * Sync voucher products catalog with Tremendous API
 * POST /backoffice/vouchers/sync
 *
 * This operation:
 * - Fetches latest products from Tremendous API
 * - Creates/updates products in the database
 * - Creates/updates associated prizes
 * - Deactivates products no longer available
 *
 * @returns SyncCatalogResponse with operation summary
 */
export async function syncCatalog(): Promise<SyncCatalogResponse> {
  const response = await api.post<SyncCatalogResponse>('/backoffice/vouchers/sync')
  return response.data
}

/**
 * Update a voucher product
 * PATCH /backoffice/vouchers/:id
 *
 * @param id - Voucher product ID
 * @param input - Fields to update
 * @returns VoucherActionResponse with updated product
 */
export async function updateVoucher(
  id: string,
  input: UpdateVoucherInput
): Promise<VoucherActionResponse> {
  const response = await api.patch<VoucherActionResponse>(`/backoffice/vouchers/${id}`, input)
  return response.data
}

/**
 * Toggle voucher product active status
 * PATCH /backoffice/vouchers/:id
 *
 * @param id - Voucher product ID
 * @param isActive - New active status
 * @returns VoucherActionResponse with updated product
 */
export async function toggleVoucherStatus(id: string, isActive: boolean): Promise<VoucherActionResponse> {
  const response = await api.patch<VoucherActionResponse>(`/backoffice/vouchers/${id}`, { isActive })
  return response.data
}

/**
 * Upload images for a voucher product
 * POST /backoffice/vouchers/:id/images
 *
 * Accepts up to 4 image files at once (JPEG, PNG, WebP, max 5MB each)
 * Adds images to the existing array (does not replace)
 * Storage: Supabase bucket /vouchers/
 *
 * @param id - Voucher product ID
 * @param files - Array of image files to upload
 * @returns ImageUploadResponse with complete updated images array
 */
export async function uploadVoucherImages(
  id: string,
  files: File[]
): Promise<ImageUploadResponse> {
  const formData = new FormData()

  files.forEach((file) => {
    formData.append('images', file)
  })

  const response = await api.post<ImageUploadResponse>(
    `/backoffice/vouchers/${id}/images`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  )
  return response.data
}

// Export as service object (alternative pattern)
export const voucherService = {
  listVouchers,
  getVoucher,
  syncCatalog,
  updateVoucher,
  toggleVoucherStatus,
  uploadVoucherImages,
}
