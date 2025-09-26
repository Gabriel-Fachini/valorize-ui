// @ts-check
import { defineConfig } from 'astro/config'
import react from '@astrojs/react'

// https://astro.build/config
export default defineConfig({
  site: 'https://valorize.com',
  output: 'static',
  integrations: [react()],
  build: {
    assets: 'assets',
  },
  vite: {
    define: {
      __DATE__: `'${new Date().toISOString()}'`,
    },
  },
  server: {
    port: 3001,
    host: true,
  },
})
