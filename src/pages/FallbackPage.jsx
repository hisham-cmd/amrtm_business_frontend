import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

/**
 * صفحة مؤقتة للقسم الذي لم يُحوَّل إلى React بعد —
 * تعرض إشعاراً وتوجّه إلى الواجهة القديمة (Blade) على منفذ الباك اند.
 */
export default function FallbackPage({ section }) {
    const { user } = useAuth();

    const labels = {
        office: { title: 'لوحة المكاتب المهنية', desc: 'لوحة المكاتب قيد التحويل إلى React.' },
        admin: { title: 'لوحة الإدارة', desc: 'لوحة الأدمن قيد التحويل إلى React.' },
        hub: { title: 'المركز الموحّد', desc: 'المركز الموحّد قيد التحويل إلى React.' },
        contracts: { title: 'العقود', desc: 'نظام العقود قيد التحويل إلى React.' },
        provider: { title: 'حساب المكتب', desc: 'صفحة إنشاء حساب المكتب قيد التحويل.' },
    };

    const info = labels[section] || { title: 'قسم قيد التحويل', desc: 'هذه الصفحة قيد التحويل إلى React.' };

    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-[#F8FAF8] px-4 py-20">
            <div className="w-full max-w-md rounded-2xl border border-[rgba(0,108,53,.1)] bg-white p-8 text-center shadow-[0_20px_50px_-16px_rgba(0,30,15,.14)]">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#006C35]/8">
                    <i className="ti ti-tools text-3xl text-[#006C35]"></i>
                </div>
                <h1 className="text-lg font-black text-[#0A1F14]">{info.title}</h1>
                <p className="mt-2 text-[13.5px] leading-relaxed text-[#5A7A6C]">{info.desc}</p>

                <div className="mt-6 space-y-2.5">
                    {user && (
                        <p className="text-[12.5px] text-slate-400">
                            دخولك الحالي: <b className="text-[#006C35]">{user.name}</b> ({user.type || 'business'})
                        </p>
                    )}
                    <Link to="/" className="inline-flex items-center gap-2 rounded-xl bg-[#006C35] px-6 py-2.5 text-sm font-bold text-white no-underline transition hover:bg-[#00843D]">
                        <i className="ti ti-home"></i> العودة للرئيسية
                    </Link>
                </div>
            </div>
        </main>
    );
}