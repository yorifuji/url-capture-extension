import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: false,
    rollupOptions: {
      input: {
        background: resolve(__dirname, 'src/background/index.ts'),
        popup: resolve(__dirname, 'src/presentation/popup/index.html'),
        options: resolve(__dirname, 'src/presentation/options/index.html'),
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'src/presentation/popup/index.html') return 'popup.html'
          if (assetInfo.name === 'src/presentation/options/index.html') return 'options.html'
          return '[name].[ext]'
        },
      },
    },
  },
})
