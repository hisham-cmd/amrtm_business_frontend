import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import Navbar from '../components/Navbar';
import CuHero from '../components/CuHero';
import Footer from '../components/Footer';
import UiButton from '../components/ui/UiButton';
import UiInput from '../components/ui/UiInput';

/**
 * صفحة إنشاء حساب — عبر POST /api/v1/auth/register (توكني)
 */
export default function Register() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: '', email: '', phone: '', password: '', password_confirmation: '', account_type: 'individual',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (form.password !== form.password_confirmation) {
            setError('كلمتا المرور غير متطابقتين.');
            setLoading(false);
            return;
        }

        try {
            // التسجيل عبر الـ API ثم استخدام نفس بيانات الدخول للحصول على التوكن
            const { data } = await api.post('/auth/register', form);
            const { token, user } = data.value;
            localStorage.setItem('amrtm_token', token);
            localStorage.setItem('amrtm_user', JSON.stringify(user));
            await login(form.email, form.password);
            navigate('/dashboard');
        } catch (err) {
            const msg = err.response?.data?.error;
            setError(typeof msg === 'string' ? msg : (msg?.message || 'فشل إنشاء الحساب. تحقق من البيانات.'));
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <Navbar active="home" />
            <CuHero
                title="إنشاء حساب جديد"
                badge={<><i className="ti ti-user-plus text-[12px]"></i><span>تسجيل</span></>}
                subtitle="انضم إلى منصة آمر تم لقطاع الأعمال"
            />

            <section className="mx-auto max-w-[560px] px-4 py-10">
                <div className="rounded-2xl border border-[rgba(0,108,53,.08)] bg-white p-6 shadow-[0_8px_24px_-8px_rgba(0,30,15,.1)] md:p-8">
                    {error && (
                        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                            <i className="ti ti-alert-circle mr-1"></i>{error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <UiInput
                            label="الاسم الكامل"
                            type="text"
                            required
                            value={form.name}
                            onChange={set('name')}
                            placeholder="الاسم كما في الهوية"
                        />

                        <div className="grid gap-4 sm:grid-cols-2">
                            <UiInput
                                label="البريد الإلكتروني"
                                type="email"
                                required
                                dir="ltr"
                                value={form.email}
                                onChange={set('email')}
                                placeholder="you@example.com"
                            />
                            <UiInput
                                label="رقم الجوال"
                                type="tel"
                                required
                                dir="ltr"
                                value={form.phone}
                                onChange={set('phone')}
                                placeholder="05xxxxxxxx"
                            />
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <UiInput
                                label="كلمة المرور"
                                type="password"
                                required
                                dir="ltr"
                                value={form.password}
                                onChange={set('password')}
                                placeholder="••••••••"
                                minLength={8}
                            />
                            <UiInput
                                label="تأكيد كلمة المرور"
                                type="password"
                                required
                                dir="ltr"
                                value={form.password_confirmation}
                                onChange={set('password_confirmation')}
                                placeholder="••••••••"
                                minLength={8}
                            />
                        </div>

                        <div>
                            <label className="mb-1.5 block text-[13px] font-bold text-[#1E3D2E]">نوع الحساب</label>
                            <div className="grid grid-cols-2 gap-3">
                                <UiButton type="button" variant="ghost" size="sm"
                                    onClick={() => setForm((f) => ({ ...f, account_type: 'individual' }))}
                                    className={`px-4 py-3 text-[13px] ${form.account_type === 'individual' ? 'border-[#006C35] bg-[#006C35]/5 text-[#006C35]' : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'}`}>
                                    <i className="ti ti-user mr-1"></i> فرد
                                </UiButton>
                                <UiButton type="button" variant="ghost" size="sm"
                                    onClick={() => setForm((f) => ({ ...f, account_type: 'establishment' }))}
                                    className={`px-4 py-3 text-[13px] ${form.account_type === 'establishment' ? 'border-[#006C35] bg-[#006C35]/5 text-[#006C35]' : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'}`}>
                                    <i className="ti ti-building mr-1"></i> منشأة
                                </UiButton>
                            </div>
                        </div>

                        <UiButton type="submit" variant="primary" size="lg" disabled={loading} className="w-full px-6 py-3 text-sm font-black disabled:opacity-60">
                            {loading ? <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"></span> جارٍ الإنشاء...</> : <><i className="ti ti-user-plus"></i> إنشاء الحساب</>}
                        </UiButton>
                    </form>

                    <p className="mt-5 text-center text-[13px] text-slate-500">
                        لديك حساب بالفعل؟{' '}
                        <Link to="/login" className="font-bold text-[#006C35] no-underline">تسجيل الدخول</Link>
                    </p>
                </div>
            </section>

            <Footer />
        </>
    );
}