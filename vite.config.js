import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ command }) => ({
    plugins: [vue()],
    // GitHub Pages 部署配置
    base: command === 'build'
        ? '/threejs-screenshot-exporter/'
        : '/',
    server: {
        host: true
    },
    build: {
        // 确保输出目录为 dist
        outDir: 'dist',
        // 生成源映射以便调试
        sourcemap: false,
        // 优化资源处理
        assetsDir: 'assets'
    }
}))
