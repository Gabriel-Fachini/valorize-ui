import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import compression from 'vite-plugin-compression'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// Vite configuration for Admin Dashboard - https://vite.dev/config/
export default defineConfig({
  // ============================
  // PLUGINS CONFIGURATION
  // ============================
  plugins: [
    // Using SWC instead of Babel for 3-10x faster compilation
    // SWC is written in Rust and provides much better performance
    react(),
    
    // TailwindCSS v4 plugin
    tailwindcss(),
    
    // Compression plugins for production builds
    // Generates .gz files alongside original assets
    compression({
      algorithm: 'gzip',
      ext: '.gz',
      threshold: 1024,        // Only compress files larger than 1KB
      deleteOriginFile: false, // Keep original files
    }),
    
    // Brotli compression (better compression ratio than gzip)
    // Modern browsers prefer brotli over gzip when available
    compression({
      algorithm: 'brotliCompress',
      ext: '.br',
      threshold: 1024,
      deleteOriginFile: false,
    }),
  ],
  base: './',  // Base public path - ensures assets load correctly in nested routes
  // ============================
  // DEVELOPMENT SERVER CONFIG
  // ============================
  server: {
    port: 3003,                    // Admin dashboard port (different from dashboard)
    open: true,                    // Automatically open browser on server start
    cors: true,                    // Enable CORS for cross-origin requests
    
    // API Proxy configuration - routes /api/* to backend
    // This avoids CORS issues and allows environment-specific API URLs
    proxy: process.env.VITE_API_URL
      ? {
          '/api': {
            target: process.env.VITE_API_URL,
            changeOrigin: true,        // Changes the origin header to match target
            secure: true,              // Verify SSL certificates for HTTPS targets
            rewrite: (path) => path.replace(/^\/api/, ''),  // Remove /api prefix
          },
        }
      : undefined,
  },

  // ============================
  // MODULE RESOLUTION
  // ============================
  resolve: {
    // Path aliases for cleaner imports and better maintainability
    // Instead of '../../../components' use '@components'
    alias: {
      "@": path.resolve(__dirname, "./src"),                        // Root src alias
      "@components": path.resolve(__dirname, "./src/components"),   // UI components
      "@pages": path.resolve(__dirname, "./src/pages"),            // Page components
      "@hooks": path.resolve(__dirname, "./src/hooks"),            // Custom React hooks
      "@services": path.resolve(__dirname, "./src/services"),      // API services
      "@helpers": path.resolve(__dirname, "./src/helpers"),        // Utility functions
      "@assets": path.resolve(__dirname, "./src/assets"),          // Static assets
      "@translations": path.resolve(__dirname, "./src/translations"), // i18n files
      "@types": path.resolve(__dirname, "./src/types"),            // TypeScript types
      "@valorize/shared": path.resolve(__dirname, "../../packages/shared/src"), // Shared package
    },
  },

  // ============================
  // PRODUCTION BUILD OPTIONS
  // ============================
  build: {
    target: 'esnext',              // Target esnext for modern browsers
    minify: 'esbuild',             // Use esbuild for minification (10-100x faster than Terser)
    sourcemap: false,              // Disable sourcemaps in production (smaller bundle, faster deploy)
    
    // Rollup-specific build options
    rollupOptions: {
      output: {
        // Manual chunk splitting for optimal caching strategy
        // Vendor chunks change less frequently than app code
        manualChunks: {
          // React ecosystem - rarely changes, good for long-term caching
          'react-vendor': ['react', 'react-dom'],
          
          // State management - stable but separate for size reasons
          'query-vendor': ['@tanstack/react-query'],
        },
      },
    },
    
    chunkSizeWarningLimit: 1000,   // Warn if chunks exceed 1MB (performance threshold)
    assetsInlineLimit: 4096,       // Inline assets smaller than 4KB as base64 (reduces HTTP requests)
  },

  // ============================
  // DEPENDENCY OPTIMIZATION
  // ============================
  optimizeDeps: {
    // Pre-bundle these dependencies for faster cold starts
    // These are ESM dependencies that benefit from being bundled together
    include: [
      'react',                     // Core React library
      'react-dom',                 // React DOM renderer
      '@tanstack/react-query',     // Server state management
      '@tanstack/react-router',    // Client-side routing
      '@valorize/shared',          // Shared components package
    ],
  },
})
