import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

/**
 * في انتظار الموافقة عبر نفاذ — تعادل nafath/wait.blade.php
 */
export default function NafathWait() {
    const [params] = useSearchParams();
    const intent = params.get('intent') === 'register' ? 'register' : 'login';
    const nationalId = params.get('national_id') || '';

    // رقم طلب وهمي (في الإنتاج يأتي من الاستجابة)
    const [random] = useState(() => String(Math.floor(100000 + Math.random() * 900000)));
    const [status, setStatus] = useState(null); // {kind, message}
    const [hint, setHint] = useState('بانتظار موافقتك على الطلب داخل تطبيق نفاذ…');

    // استطلاع الحالة كل 5 ثوانٍ
    useEffect(() => {
        const timer = setInterval(async () => {
            try {
                const res = await fetch(`/api/v1/nafath/status?trans_id=demo-${nationalId}`, {
                    headers: { 'Accept': 'application/json' },
                });
                const data = await res.json();
                if (data.status === 'VERIFIED' || data.status === 'COMPLETED') {
                    setStatus({ kind: 'success', message: 'تم التحقق بنجاح — جارٍ تحويلك…' });
                    setHint('تم التحقق بنجاح — جارٍ تحويلك…');
                    clearInterval(timer);
                    setTimeout(() => { window.location.href = '/dashboard-hub'; }, 2000);
                }
            } catch {
                setHint('تعذر الاتصال بالخادم — محاولة جديدة…');
            }
        }, 5000);
        return () => clearInterval(timer);
    }, [nationalId]);

    const statusStyles = {
        success: 'border-green-300 bg-green-50 text-green-700',
        danger: 'border-red-300 bg-red-50 text-red-700',
        warning: 'border-amber-300 bg-amber-50 text-amber-800',
    };

    return (
        <>
            <Navbar active="home" />
            <div className="relative flex min-h-[calc(100vh-130px)] items-center justify-center bg-[#F4F6FB] px-4 py-10 sm:px-6">
                <div className="w-full max-w-lg">
                    <div className="relative overflow-hidden rounded-[28px] border border-[#006C35]/10 bg-white p-8 shadow-[0_35px_90px_rgba(0,108,53,.18)] sm:p-10">
                        <div className="mb-8 flex flex-col items-center text-center">
                            <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full border-4 border-[#006C35]/15 bg-[#E9F3EC] nafath-pulse">
                                <i className="ti ti-device-mobile-message text-4xl text-[#006C35]"></i>
                            </div>
                            <h1 className="text-2xl font-extrabold text-[#0f172a] sm:text-[26px]">في انتظار الموافقة…</h1>
                            <p className="mt-2 max-w-[380px] text-sm leading-relaxed text-[#64748b]">
                                افتح تطبيق نفاذ على جوالك واقبل طلب التحقق. يجب تنفيذ ذلك قبل انتهاء المهلة.
                            </p>
                        </div>

                        <div className="mb-7 rounded-2xl border-2 border-dashed border-[#006C35]/25 bg-[#F8FAFC] p-5 text-center">
                            <span className="mb-2 block text-xs font-extrabold text-[#64748b]">رقم الطلب — طابقه داخل التطبيق</span>
                            <strong dir="ltr" className="block text-4xl font-black tracking-[0.35em] text-[#006C35]">{random}</strong>
                        </div>

                        {status && (
                            <div className={`mb-6 flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-semibold ${statusStyles[status.kind] || statusStyles.warning}`}>
                                <i className="ti ti-info-circle shrink-0"></i>
                                <span>{status.message}</span>
                            </div>
                        )}

                        <div className="mb-6 flex items-center justify-center gap-2 text-sm font-bold text-[#0f172a]">
                            <span className="inline-flex h-2.5 w-2.5 animate-ping rounded-full bg-[#006C35]"></span>
                            <span>{hint}</span>
                        </div>

                        <div className="flex items-center justify-center gap-3">
                            <Link to={`/nafath?intent=${intent}`} className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-extrabold text-[#334155] transition-all duration-300 hover:bg-slate-50">
                                <i className="ti ti-refresh"></i> إعادة المحاولة
                            </Link>
                            <Link to="/login" className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-extrabold text-[#334155] transition-all duration-300 hover:bg-slate-50">
                                <i className="ti ti-arrow-right"></i> العودة لتسجيل الدخول
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />

            <style>{`
                @keyframes nafathPulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.08); } }
                .nafath-pulse { animation: nafathPulse 2.5s ease-in-out infinite; }
            `}</style>
        </>
    );
}