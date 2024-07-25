import path from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  plugins: [
    vue(),
    // https://unocss.dev/
    UnoCSS(),
    AutoImport({
      imports: ['vue', 'vue-router'],
      dts: 'src/auto-import.d.ts',
    }),
    Components(),
  ],
})
