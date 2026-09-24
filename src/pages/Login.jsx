import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [params] = useSearchParams();
    const mode = params.get('mode') === 'register' ? 'register' : 'login';

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.message || 'فشل تسجيل الدخول.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-12">
            <div className="card">
                <h1 className="text-2xl font-bold text-gray-900">
                    {mode === 'register' ? 'إنشاء حساب' : 'تسجيل الدخول'}
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                    {mode === 'register'
                        ? 'أنشئ حسابك للبدء في استخدام المنصة'
                        : 'أدخل بريدك وكلمة المرور للوصول إلى حسابك'}
                </p>

                {error && (
                    <div className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
                )}

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700">البريد الإلكتروني</label>
                        <input
                            type="email"
                            required
                            dir="ltr"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="input"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700">كلمة المرور</label>
                        <input
                            type="password"
                            required
                            dir="ltr"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input"
                            placeholder="••••••••"
                        />
                    </div>

                    <button type="submit" disabled={loading} className="btn-primary w-full">
                        {loading ? 'جارٍ الدخول...' : mode === 'register' ? 'إنشاء الحساب' : 'دخول'}
                    </button>
                </form>

                <p className="mt-4 text-center text-sm text-gray-500">
                    {mode === 'register' ? (
                        <>لديك حساب؟ <Link to="/login" className="font-semibold text-primary">تسجيل الدخول</Link></>
                    ) : (
                        <>ليس لديك حساب؟ <Link to="/login?mode=register" className="font-semibold text-primary">إنشاء حساب</Link></>
                    )}
                </p>
            </div>
        </main>
    );
}