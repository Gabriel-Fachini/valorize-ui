import { toast as sonnerToast, Toaster } from 'sonner'

/**
 * Toast helper utilities using Sonner
 * Provides convenient functions for showing notifications
 */

export const toast = {
  /**
   * Success notification
   */
  success: (message: string, options?: Parameters<typeof sonnerToast.success>[1]) => {
    return sonnerToast.success(message, options)
  },

  /**
   * Error notification
   */
  error: (message: string, options?: Parameters<typeof sonnerToast.error>[1]) => {
    return sonnerToast.error(message, options)
  },

  /**
   * Info notification
   */
  info: (message: string, options?: Parameters<typeof sonnerToast.info>[1]) => {
    return sonnerToast.info(message, options)
  },

  /**
   * Warning notification
   */
  warning: (message: string, options?: Parameters<typeof sonnerToast.warning>[1]) => {
    return sonnerToast.warning(message, options)
  },

  /**
   * Loading notification
   * Returns an id to update or close it later
   */
  loading: (message: string, options?: Parameters<typeof sonnerToast.loading>[1]) => {
    return sonnerToast.loading(message, options)
  },

  /**
   * Promise-based notification
   * Automatically shows loading, success, or error based on promise result
   */
  promise: <T,>(
    promise: Promise<T>,
    messages: {
      loading: string
      success: string | ((data: T) => string)
      error: string | ((error: Error) => string)
    }
  ) => {
    return sonnerToast.promise(promise, messages)
  },

  /**
   * Close a toast by id
   */
  dismiss: (toastId?: string | number) => {
    sonnerToast.dismiss(toastId)
  },

  /**
   * Close all toasts
   */
  dismissAll: () => {
    sonnerToast.dismiss()
  },
}

export { Toaster }
