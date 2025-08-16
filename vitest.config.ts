import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    environmentOptions: {
      jsdom: {
        url: 'http://localhost/'
      }
    },
    setupFiles: ['./vitest.setup.ts'],
    globals: true,
    css: true,
    testTimeout: 10000,
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
})
