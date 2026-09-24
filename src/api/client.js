import axios from 'axios';

/**
 * عميل الـ API الموحّد للواجهة الأمامية المنفصلة.
 *
 * - في وضع التطوير: Vite proxy يمرر /api إلى الباك اند (evade CORS).
 * - في الإنتاج: استخدم VITE_API_URL (مثال: https://api.example.com)
 */
const baseURL = import.meta.env.VITE_API_URL || '/api/v1';

const api = axios.create({
    baseURL,
    headers: { 'Accept': 'application/json' },
});

// إرفاق التوكن تلقائياً من التخزين المحلي
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('amrtm_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// معالجة الأخطاء الموحّدة: محاولة فك غلاف { isSuccess, value, error }
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const err = error.response?.data?.error;
        if (error.response?.status === 401) {
            localStorage.removeItem('amrtm_token');
            localStorage.removeItem('amrtm_user');
            // لا نعيد توجيه قسري هنا — الصفحات تتعامل مع 401 بنفسها
        }
        error.message = typeof err === 'string' ? err : err?.message || error.message;
        return Promise.reject(error);
    }
);

export default api;