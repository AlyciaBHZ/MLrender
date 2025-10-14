import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// 中文说明：Vite 基础配置，启用 React 插件与别名
export default defineConfig({
    plugins: [react()],
    server: {
        port: 5173
    },
    resolve: {
        alias: {
            '@': '/src'
        }
    }
});
