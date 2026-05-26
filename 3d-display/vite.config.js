import { defineConfig } from 'vite'

export default defineConfig({
  // 设置基础路径，用于 GitHub Pages 部署
  // 如果部署到 https://username.github.io/repo-name/3d-display/，则使用 '/repo-name/3d-display/'
  base: './',
  server: {
    open: true
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
})
