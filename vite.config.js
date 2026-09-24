import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// الواجهة الأمامية المنفصلة — تشغيل مستقل تماماً عن Laravel.
// في وضع التطوير: BASE_URL_API يحدد عنوان الباك اند (افتراضياً localhost:8000).
// عند البناء للإنتاج: VITE_API_URL يحدد عنوان سيرفر الباك اند.
export default defineConfig({
    plugins: [react(), tailwindcss()],
    server: {
        port: 5173,
        strictPort: true,
        proxy: {
            // في التطوير المحلي، نُمرر طلبات /api إلى Laravel مباشرة
            // (تفادي مشاكل CORS أثناء التطوير فقط)
            '/api': {
                target: process.env.BASE_URL_API || 'http://127.0.0.1:8000',
                changeOrigin: true,
            },
        },
    },
});