/**
 * API Types
 * Types for API responses and requests
 */

export interface ApiSuccess<T = unknown> {
  success: true
  data: T
  message?: string
  statusCode: number
}

export interface ApiError {
  success: false
  error: string
  message: string
  statusCode: number
}

export type ApiResponse<T = unknown> = ApiSuccess<T> | ApiError
