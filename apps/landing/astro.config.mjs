// @ts-check
import { defineConfig } from 'astro/config'
import tailwindcss from '@tailwindcss/vite'

// https://astro.build/config
export default defineConfig({
  output: 'static',
  build: {
    assets: 'assets',
  },
  vite: {
    // @ts-expect-error - Tailwind CSS v4 Vite plugin compatibility
    plugins: [tailwindcss()],
    define: {
      __DATE__: `'${new Date().toISOString()}'`,
    },
  },
  server: {
    port: 4321,
    host: true,
  },
})
