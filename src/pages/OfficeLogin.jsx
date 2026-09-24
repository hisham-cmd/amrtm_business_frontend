import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import CuHero from '../components/CuHero';
import Footer from '../components/Footer';
import UiButton from '../components/ui/UiButton';
import UiInput from '../components/ui/UiInput';

/**
 * دخول المكاتب المهنية — يستخدم نفس نقطة /auth/login التي تدعم office.
 */
export default function OfficeLogin() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const user = await login(email, password);
            if (user.type === 'office') navigate('/office/dashboard');
            else navigate('/dashboard');
        } catch (err) {
            setError(err.message || 'فشل تسجيل الدخول. تأكد من بيانات حساب المكتب.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <Navbar active="home" />
            <CuHero
                title="دخول المكاتب المهنية"
                badge={<><i className="ti ti-building text-[12px]"></i><span>المكاتب</span></>}
                subtitle="بوابة المكاتب والشركات المهنية المساندة"
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
                            placeholder="office@example.com"
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
                            {loading ? <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"></span> جارٍ الدخول...</> : <><i className="ti ti-building"></i> دخول المكتب</>}
                        </UiButton>
                    </form>

                    <p className="mt-5 text-center text-[13px] text-slate-500">
                        لا تملك حساب مكتب؟{' '}
                        <Link to="/provider-account/create" className="font-bold text-[#006C35] no-underline">سجّل مكتبك</Link>
                    </p>
                </div>
            </section>

            <Footer />
        </>
    );
}