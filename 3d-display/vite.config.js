import { defineConfig } from 'vite'

export default defineConfig({
  // GitHub Pages 子目录部署路径
  // 访问地址： https://Niuyuan0523.github.io/workstation/3d-display/
  base: '/workstation/3d-display/',
  server: {
    // 本地开发时自动打开浏览器
    open: true
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
})
