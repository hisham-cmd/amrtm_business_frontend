import { useNavigate, useSearchParams, Link, Navigate } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import Navbar from '../components/Navbar';
import CuHero from '../components/CuHero';
import Footer from '../components/Footer';
import UiButton from '../components/ui/UiButton';
import UiInput from '../components/ui/UiInput';

/**
 * صفحة تسجيل الدخول الموحّدة (Business أو Office) — توكنية عبر Sanctum.
 * مطابقة لـ auth/login صفحات الهوية.
 */
export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [params] = useSearchParams();
    const mode = params.get('mode') === 'register' ? 'register' : 'login';

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const target = useMemo(() => {
        // الحفاظ على مسار إعادة التوجيه عبر query ?redirect=
        return params.get('redirect') || '/dashboard';
    }, [params]);

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const user = await login(email, password);
            // توجيه حسب النوع
            if (user.type === 'office') navigate('/office/dashboard');
            else if (user.is_admin || user.role === 'admin' || user.role === 'supervisor') navigate('/admin');
            else navigate('/dashboard');
        } catch (err) {
            setError(err.message || 'فشل تسجيل الدخول.');
        } finally {
            setLoading(false);
        }
    }

    if (mode === 'register') {
        return <NavigateRegister />;
    }

    return (
        <>
            <Navbar active="home" />
            <CuHero
                title="تسجيل الدخول"
                badge={<><i className="ti ti-lock text-[12px]"></i><span>آمن</span></>}
                subtitle="أدخل بريدك وكلمة المرور للوصول إلى حسابك"
            />

            <section className="mx-auto max-w-[480px] px-4 py-10">
                <div className="rounded-2xl border border-[rgba(0,108,53,.08)] bg-white p-6 shadow-[0_8px_24px_-8px_rgba(0,30,15,.1)] md:p-8">
                    {error && (
                        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                            <i className="ti ti-alert-circle mr-1"></i>{error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <UiInput
                            label="البريد الإلكتروني"
                            type="email"
                            required
                            dir="ltr"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                        />

                        <UiInput
                            label="كلمة المرور"
                            type="password"
                            required
                            dir="ltr"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                        />

                        <UiButton type="submit" variant="primary" size="lg" disabled={loading} className="w-full px-6 py-3 text-sm font-black disabled:opacity-60">
                            {loading ? <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"></span> جارٍ الدخول...</> : <><i className="ti ti-login"></i> دخول</>}
                        </UiButton>
                    </form>

                    <div className="mt-5 grid gap-2 text-center text-[13px]">
                        <p className="text-slate-500">
                            ليس لديك حساب؟{' '}
                            <Link to="/register" className="font-bold text-[#006C35] no-underline">إنشاء حساب</Link>
                        </p>
                        <Link to="/office/login" className="text-slate-400 no-underline transition hover:text-[#006C35]">
                            <i className="ti ti-building mr-1"></i> دخول المكاتب المهنية
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
}

function NavigateRegister() {
    return <Navigate to="/register" replace />;
}