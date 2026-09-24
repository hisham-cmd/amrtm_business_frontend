import { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import UiButton from '../components/ui/UiButton';
import UiInput from '../components/ui/UiInput';

/**
 * توثيق الهوية عبر نفاذ — تعادل nafath/verify.blade.php
 */
export default function NafathVerify() {
    const [params] = useSearchParams();
    const navigate = useNavigate();
    const intent = params.get('intent') === 'register' ? 'register' : 'login';
    const [nationalId, setNationalId] = useState('');
    const [error, setError] = useState('');
    const [sending, setSending] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        if (!/^\d{10}$/.test(nationalId)) {
            setError('رقم الهوية يجب أن يتكون من 10 أرقام.');
            return;
        }
        setSending(true);
        // في الإنتاج: POST /api/v1/nafath (توكني) — هنا نوازي إجراء الـ Blade
        // تعبئة الرقم في الجلسة عبر endpoint بسيط ثم الانتقال لصفحة الانتظار
        try {
            const res = await fetch('/api/v1/nafath/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({ national_id: nationalId, intent }),
            });
            if (res.ok) {
                navigate(`/nafath/wait?intent=${intent}&national_id=${nationalId}`);
            } else {
                const data = await res.json().catch(() => ({}));
                setError(data.error?.message || data.message || 'تعذر إرسال طلب التحقق.');
            }
        } catch (err) {
            setError('تعذر الاتصال بالخادم.');
        } finally {
            setSending(false);
        }
    }

    return (
        <>
            <Navbar active="home" />
            <div className="relative flex min-h-[calc(100vh-130px)] items-center justify-center bg-[#F4F6FB] px-4 py-10 sm:px-6">
                <div className="w-full max-w-lg">
                    <div className="relative overflow-hidden rounded-[28px] border border-[#006C35]/10 bg-white p-8 shadow-[0_35px_90px_rgba(0,108,53,.18)] sm:p-10">
                        <div className="mb-8 flex flex-col items-center text-center">
                            <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[#006C35] to-[#00843D] shadow-[0_14px_35px_rgba(0,108,53,.35)]">
                                <i className="ti ti-shield-check text-4xl text-white"></i>
                            </div>
                            <h1 className="text-2xl font-extrabold text-[#0f172a] sm:text-[26px]">
                                {intent === 'register' ? 'توثيق الهوية الوطنية' : 'الدخول عبر نفاذ'}
                            </h1>
                            <p className="mt-2 max-w-[360px] text-sm leading-relaxed text-[#64748b]">
                                أدخل رقم الهوية الوطنية أو الإقامة، وسيصلك إشعار على تطبيق نفاذ للسداد بالموافقة
                            </p>
                        </div>

                        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-amber-300/60 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                            <i className="ti ti-alert-triangle mt-0.5"></i>
                            <div>
                                <strong className="block font-extrabold">الربط قيد التفعيل</strong>
                                <span className="mt-1 block leading-relaxed">ستتوفر خدمة التوثيق عبر نفاذ بعد اعتماد المنصة لدى الجهة المختصة وإدخال مفاتيح الربط.</span>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} autoComplete="off">
                            <div className="mb-5">
                                <div className="relative">
                                    <i className="ti ti-id-badge-2 pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#006C35]/60"></i>
                                    <UiInput
                                        id="national-id"
                                        label="رقم الهوية الوطنية / الإقامة"
                                        type="text"
                                        inputMode="numeric"
                                        pattern="[0-9]{10}"
                                        maxLength="10"
                                        dir="ltr"
                                        value={nationalId}
                                        onChange={(e) => setNationalId(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                        placeholder="1000000000"
                                        color={error ? 'failure' : 'gray'}
                                    />
                                </div>
                                {error && (
                                    <p className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-red-600">
                                        <i className="ti ti-alert-circle"></i>{error}
                                    </p>
                                )}
                            </div>

                            <UiButton
                                type="submit"
                                variant="primary"
                                size="sm"
                                disabled={sending}
                                className="w-full py-3.5 text-sm font-extrabold hover:shadow-[0_10px_30px_rgba(0,108,53,.35)] focus:ring-4 focus:ring-[#006C35]/25 disabled:opacity-60"
                            >
                                <i className="ti ti-device-mobile-share"></i>
                                {sending ? 'جارٍ الإرسال...' : 'إرسال طلب الموافقة'}
                            </UiButton>
                        </form>

                        <div className="mt-6 rounded-2xl border border-slate-100 bg-[#F8FAFC] p-4">
                            <p className="mb-2 text-xs font-extrabold text-[#334155]">كيف تعمل العملية؟</p>
                            <ol className="space-y-1.5 text-xs leading-relaxed text-[#64748b]">
                                <li className="flex items-start gap-2"><span className="font-extrabold text-[#006C35]">1.</span> يُرسل طلب تحقق إلى تطبيق نفاذ المثبت على جوالك.</li>
                                <li className="flex items-start gap-2"><span className="font-extrabold text-[#006C35]">2.</span> تفتح التطبيق وتطابق رقم الطلب ثم توافق عليه.</li>
                                <li className="flex items-start gap-2"><span className="font-extrabold text-[#006C35]">3.</span> تُدخل رمزك الشخصي (PIN) أو بصمة الوجه لإتمام التوثيق.</li>
                            </ol>
                        </div>

                        <p className="mt-6 text-center text-xs font-bold text-[#94a3b8]">
                            <i className="ti ti-shield-lock ml-1"></i>
                            بيانات الهوية تُستخدم للتحقق الأمني فقط ولا تُشارك مع أي طرف ثالث.
                        </p>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}