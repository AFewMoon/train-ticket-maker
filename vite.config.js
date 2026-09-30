import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  // GitHub Pages 仓库级站点地址为 https://afewmoon.github.io/train-ticket-maker/
  // 若改用自定义域名或 <user>.github.io 根站点部署，这里需改回 '/'
  base: '/train-ticket-maker/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
})