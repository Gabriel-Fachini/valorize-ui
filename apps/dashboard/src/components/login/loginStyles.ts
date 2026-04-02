import { cva } from 'class-variance-authority'

export const loginFormVariants = cva('auth-form xl:space-y-5', {
  variants: {
    density: {
      compact: 'space-y-3 sm:space-y-4',
      default: 'space-y-3.5 sm:space-y-4.5',
    },
  },
  defaultVariants: {
    density: 'default',
  },
})

export const loginPrimaryButtonClassName =
  'auth-primary-button flex w-full cursor-pointer items-center justify-center rounded-lg bg-primary px-6 py-2.5 text-base font-semibold text-white transition-colors hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-white disabled:cursor-not-allowed disabled:opacity-60 dark:focus:ring-offset-gray-950'

export const loginBackButtonClassName =
  'auth-inline-link auth-back-link inline-flex h-10 w-fit items-center justify-center gap-2 rounded-full border border-gray-200 bg-white/80 px-4 text-sm font-semibold leading-none text-gray-700 shadow-sm transition-all duration-200 hover:cursor-pointer hover:border-gray-300 hover:bg-gray-50 hover:text-gray-950 dark:border-white/10 dark:bg-white/5 dark:text-gray-300 dark:hover:border-white/20 dark:hover:bg-white/10 dark:hover:text-white'

export const loginInlineLinkClassName =
  'auth-inline-link group relative inline-flex cursor-pointer items-center text-sm font-medium text-green-700 transition-colors hover:text-green-800 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 dark:text-green-400 dark:hover:text-green-300'

export const loginSocialButtonClassName =
  'auth-social-button flex w-full cursor-pointer items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-base font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-white disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-600 dark:bg-[#2a2a2a] dark:text-gray-200 dark:hover:bg-[#333333] dark:focus:ring-offset-gray-950'

export const loginSecondaryCardClassName =
  'auth-secondary-card rounded-[1.5rem] border border-white/10 bg-white/[0.045] px-4 py-3.5 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-md sm:px-5 sm:py-4'

export const loginSecondaryButtonClassName =
  'auth-secondary-button mt-4 inline-flex items-center justify-center rounded-full border border-green-400/20 bg-green-500/12 px-5 py-2.5 text-sm font-semibold text-green-200 transition-colors hover:border-green-300/35 hover:bg-green-500/18'

export const loginPanelWrapperClassName = `
  pointer-events-none relative z-10 flex min-h-dvh w-full items-center justify-center px-4 py-5 sm:px-6 sm:py-6 lg:justify-start lg:px-3 lg:py-3 xl:px-4 xl:py-4 2xl:px-5
  lg:[@media(max-height:900px)]:items-center lg:[@media(max-height:900px)]:py-5
  [&_h1]:lg:[@media(max-height:900px)]:text-[2.65rem]
  [&_p]:lg:[@media(max-height:900px)]:leading-[1.45]
  [&_.auth-form]:lg:[@media(max-height:900px)]:space-y-3
  [&_.auth-label]:lg:[@media(max-height:900px)]:mb-1 [&_.auth-label]:lg:[@media(max-height:900px)]:text-[0.8125rem]
  [&_.auth-input]:lg:[@media(max-height:900px)]:py-[0.55rem] [&_.auth-input]:lg:[@media(max-height:900px)]:text-[0.92rem]
  [&_.auth-inline-link:not(.auth-back-link)]:lg:[@media(max-height:900px)]:pb-0.5
  [&_.auth-primary-button]:lg:[@media(max-height:900px)]:py-[0.7rem] [&_.auth-primary-button]:lg:[@media(max-height:900px)]:text-[0.96rem]
  [&_.auth-social-button]:lg:[@media(max-height:900px)]:py-[0.7rem] [&_.auth-social-button]:lg:[@media(max-height:900px)]:text-[0.96rem]
  [&_.auth-secondary-card]:lg:[@media(max-height:900px)]:px-4 [&_.auth-secondary-card]:lg:[@media(max-height:900px)]:py-3
  [&_.auth-secondary-button]:lg:[@media(max-height:900px)]:mt-[0.625rem] [&_.auth-secondary-button]:lg:[@media(max-height:900px)]:px-[0.95rem] [&_.auth-secondary-button]:lg:[@media(max-height:900px)]:py-[0.55rem]
`

export const loginPanelSurfaceClassName =
  'relative flex items-center justify-center overflow-hidden rounded-[2rem] border border-white/12 bg-[linear-gradient(180deg,rgba(16,24,19,0.82)_0%,rgba(9,15,12,0.68)_100%)] p-5 text-white shadow-[0_32px_100px_-50px_rgba(0,0,0,0.95)] backdrop-blur-[28px] sm:p-6 lg:min-h-[calc(100dvh-1.5rem)] lg:px-8 lg:py-8 xl:px-10 xl:py-9'
