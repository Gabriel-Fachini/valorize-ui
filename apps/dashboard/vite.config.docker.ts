import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react' // Using regular React plugin instead of SWC
import compression from 'vite-plugin-compression'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// Docker-specific Vite configuration (SWC causes segfaults in Alpine Linux)
export default defineConfig({
  plugins: [
    // Using regular React plugin (Babel) instead of SWC for Docker compatibility
    react(),
    
    // TailwindCSS v4 plugin
    tailwindcss(),
    
    // Compression plugins
    compression({
      algorithm: 'gzip',
      ext: '.gz',
      threshold: 1024,
      deleteOriginFile: false,
    }),
    compression({
      algorithm: 'brotliCompress',
      ext: '.br',
      threshold: 1024,
      deleteOriginFile: false,
    }),
  ],
  
  base: './',
  
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@pages": path.resolve(__dirname, "./src/pages"),
      "@hooks": path.resolve(__dirname, "./src/hooks"),
      "@services": path.resolve(__dirname, "./src/services"),
      "@helpers": path.resolve(__dirname, "./src/helpers"),
      "@assets": path.resolve(__dirname, "./src/assets"),
      "@translations": path.resolve(__dirname, "./src/translations"),
      "@types": path.resolve(__dirname, "./src/types"),
    },
  },
  
  build: {
    target: 'esnext',
    minify: 'esbuild',
    sourcemap: false,
    
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'query-vendor': ['@tanstack/react-query'],
        },
      },
    },
  },
})
