import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import UiButton from './ui/UiButton';

/**
 * Navbar الرئيسية — مطابقة لـ partials/public/navbar.blade.php (1:1)
 * مع إصلاحات تصميم: hover صحيح، نص زر المكاتب يظهر على الشاشات الكبيرة،
 * وتبديل اللغة نشط حسب الاتجاه الحالي (تفاعلي مع React state).
 */
export default function Navbar({ active }) {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [isArabic, setIsArabic] = useState(() => {
        if (typeof document === 'undefined') return true;
        return document.documentElement.getAttribute('dir') !== 'ltr';
    });

    const setLang = (dir) => {
        document.documentElement.setAttribute('dir', dir);
        setIsArabic(dir !== 'ltr');
    };

    const isHomepage = location.pathname === '/';
    const isOffice = user && user.type === 'office';
    const isAdmin = user && user.is_admin;
    const dashUrl = isOffice
        ? '/office/dashboard'
        : isAdmin
        ? '/admin'
        : '/dashboard';
    const dashLabel = isOffice || isAdmin ? 'لوحة التحكم' : 'حسابي';

    const linkCls = (key) =>
        active === key
            ? 'relative cursor-pointer rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-200 bg-[#006C35]/10 text-[#006C35]'
            : 'relative cursor-pointer rounded-lg px-4 py-2 text-sm font-semibold text-gray-500 transition-all duration-200 hover:bg-[#006C35]/10 hover:text-[#006C35]';

    // تمرير سلس عند النقر على رابط مرساة من صفحة داخلية
    const goAnchor = (hash) => {
        if (isHomepage) {
            const el = document.querySelector(hash);
            if (el) el.scrollIntoView({ behavior: 'smooth' });
        } else {
            navigate('/');
            setTimeout(() => {
                const el = document.querySelector(hash);
                if (el) el.scrollIntoView({ behavior: 'smooth' });
            }, 250);
        }
    };

    return (
        <>
            <nav className="sticky top-0 inset-x-0 z-[999] w-full border-b border-slate-200 bg-white shadow-sm">
                <div className="mx-auto flex h-[72px] w-full max-w-[1400px] items-center justify-between gap-4 px-4 md:px-6">
                    {/* الشعار */}
                    <Link to="/" className="group flex shrink-0 items-center gap-2.5 no-underline">
                        <span className="relative flex h-[52px] w-[52px] items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-[#f8fafc] transition-all duration-200 group-hover:border-[#006C35]/40 group-hover:shadow-[0_4px_14px_rgba(0,108,53,0.12)]">
                            <img
                                src="/images/official-logo.jpg"
                                alt="آمر تم"
                                className="relative h-[48px] w-[48px] object-contain"
                                onError={(e) => { e.target.style.display = 'none'; }}
                            />
                        </span>
                        <span className="hidden text-xl font-black text-[#006C35] sm:block">آمر تم</span>
                    </Link>

                    {/* روابط سطح المكتب */}
                    <div className="hidden flex-1 items-center justify-center gap-1 lg:flex">
                        {isHomepage ? (
                            <>
                                <div
                                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                    id="nl-home"
                                    className={linkCls('home')}
                                >
                                    الرئيسية
                                </div>
                                <div
                                    onClick={() => document.getElementById('offices-sec')?.scrollIntoView({ behavior: 'smooth' })}
                                    id="nl-svcs"
                                    className={linkCls('services')}
                                >
                                    الخدمات
                                </div>
                            </>
                        ) : (
                            <>
                                <Link to="/" id="nl-home" className={linkCls('home').replace('cursor-pointer', 'no-underline')}>
                                    الرئيسية
                                </Link>
                                <Link to="/#services" id="nl-svcs" className={linkCls('services').replace('cursor-pointer', 'no-underline')}>
                                    الخدمات
                                </Link>
                            </>
                        )}
                        <div
                            onClick={() => goAnchor('#about')}
                            id="nl-about"
                            className={`${linkCls('about')} no-underline`}
                        >
                            عن المنصة
                        </div>
                        <div
                            onClick={() => goAnchor('#contact')}
                            id="nl-con"
                            className={`${linkCls('contact')} no-underline`}
                        >
                            تواصل معنا
                        </div>
                    </div>

                    {/* القسم الأيمن */}
                    <div className="flex shrink-0 items-center gap-2.5">
                        {/* تبديل اللغة — نشط حسب الاتجاه الحالي */}
                        <div className="flex items-center overflow-hidden rounded-full border-[1.5px] border-slate-300 bg-gray-50 p-0.5">
                            <UiButton
                                    variant="ghost"
                                    type="button"
                                    id="la"
                                    onClick={() => setLang('rtl')}
                                    className={`!rounded-full !px-2.5 !py-1.5 text-xs font-bold transition-all duration-200 sm:!px-3 ${isArabic ? '!bg-[#006C35] text-white shadow-[0_2px_8px_rgba(0,108,53,0.25)]' : 'text-gray-400 hover:text-gray-600'}`}
                                >
                                    AR
                                </UiButton>
                                <UiButton
                                    variant="ghost"
                                    type="button"
                                    id="le"
                                    onClick={() => setLang('ltr')}
                                    className={`!rounded-full !px-2.5 !py-1.5 text-xs font-bold transition-all duration-200 sm:!px-3 ${!isArabic ? '!bg-[#006C35] text-white shadow-[0_2px_8px_rgba(0,108,53,0.25)]' : 'text-gray-400 hover:text-gray-600'}`}
                                >
                                    EN
                                </UiButton>
                        </div>

                        {/* أزرار الزائر */}
                        {!user && (
                            <div id="nb-guest" className="flex items-center gap-2">
                                <Link
                                    to="/login"
                                    id="nb-li"
                                    className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-gray-700 no-underline transition-all duration-200 hover:border-[#006C35]/40 hover:bg-[#006C35]/5 hover:text-[#006C35] sm:px-4"
                                >
                                    <i className="fa fa-right-to-bracket text-sm"></i>
                                    <span className="hidden sm:inline">دخول</span>
                                </Link>
                                <Link
                                    to="/login?mode=register"
                                    id="nb-re"
                                    className="inline-flex items-center gap-2 rounded-lg bg-[#006C35] px-3 py-2 text-sm font-semibold text-white no-underline shadow-[0_3px_10px_rgba(0,108,53,0.2)] transition-all duration-200 hover:bg-[#00843D] hover:shadow-[0_5px_14px_rgba(0,108,53,0.3)] sm:px-4"
                                >
                                    <i className="fa fa-user-plus text-sm"></i>
                                    <span className="hidden sm:inline">تسجيل</span>
                                </Link>
                                <Link
                                    to="/office/login"
                                    className="hidden items-center gap-2 rounded-lg border border-[#006C35]/20 px-4 py-2 text-sm font-semibold text-[#006C35] no-underline transition-all duration-200 hover:border-[#006C35] hover:bg-[#006C35] hover:text-white lg:inline-flex"
                                >
                                    <i className="fa fa-building text-sm"></i>
                                    <span className="max-lg:hidden lg:inline">المكاتب</span>
                                </Link>
                            </div>
                        )}

                        {/* أزرار المستخدم الموثّق */}
                        {user && (
                            <div id="nb-auth" className="flex items-center gap-2">
                                <Link
                                    to={dashUrl}
                                    id="nb-dash-lnk"
                                    className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-gray-700 no-underline transition-all duration-200 hover:border-[#006C35]/40 hover:bg-[#006C35]/5 hover:text-[#006C35]"
                                >
                                    <i className="fa fa-gauge-high text-sm"></i>
                                    <span className="hidden sm:inline">{dashLabel}</span>
                                </Link>
                                <div
                                    onClick={() => navigate(dashUrl)}
                                    id="nb-user-chip"
                                    className="flex cursor-pointer items-center gap-2.5 rounded-xl bg-gray-100 px-2 py-1.5 transition-all duration-200 hover:bg-gray-200"
                                >
                                    <img
                                        className="h-9 w-9 rounded-full object-cover ring-2 ring-[#006C35]/20"
                                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'مستخدم')}&background=006C35&color=fff&size=64`}
                                        alt={user.name}
                                    />
                                    <span className="hidden max-w-[80px] truncate text-[13px] font-bold text-gray-800 sm:block">
                                        {String(user.name || '').split(' ')[0]}
                                    </span>
                                </div>
                                <UiButton
                                    variant="ghost"
                                    type="button"
                                    onClick={logout}
                                    className="!cursor-pointer !rounded-lg !p-1.5 text-gray-400 !border-0 !bg-transparent transition-colors duration-200 hover:!bg-red-50 hover:text-red-500"
                                    title="تسجيل الخروج"
                                >
                                    <i className="fa fa-right-from-bracket text-lg"></i>
                                </UiButton>
                            </div>
                        )}

                        {/* الهامبرغر */}
                        <UiButton
                            variant="ghost"
                            type="button"
                            className="!flex h-10 w-10 !cursor-pointer items-center justify-center !rounded-xl !bg-gray-100 text-gray-600 transition-all duration-200 hover:!bg-gray-200 lg:!hidden"
                            onClick={() => setMobileOpen((o) => !o)}
                            aria-label="فتح القائمة"
                        >
                            <i className="fa fa-bars text-lg"></i>
                        </UiButton>
                    </div>
                </div>
            </nav>

            {/* طبقة تغطية خلف قائمة الموبايل — تنقرة تغلقها */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 z-[1997] bg-black/20 bg-black/25 backdrop-blur-[2px] lg:hidden"
                    onClick={() => setMobileOpen(false)}
                    aria-hidden="true"
                />
            )}

            {/* قائمة الموبايل */}
            <div
                id="mob-dd"
                className={`fixed top-[72px] left-0 right-0 bottom-0 z-[1998] flex-col items-stretch gap-1 overflow-y-auto bg-white px-4 pb-6 pt-2 ${mobileOpen ? 'flex' : 'hidden'}`}
            >
                {isHomepage ? (
                    <>
                        <div
                            className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-gray-700 hover:bg-[#006C35]/10 hover:text-[#006C35]"
                            onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setMobileOpen(false); }}
                        >
                            <i className="fa fa-house w-5 text-center"></i>
                            <span>الرئيسية</span>
                        </div>
                        <div
                            className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-gray-700 hover:bg-[#006C35]/10 hover:text-[#006C35]"
                            onClick={() => { document.getElementById('offices-sec')?.scrollIntoView({ behavior: 'smooth' }); setMobileOpen(false); }}
                        >
                            <i className="fa fa-table-cells-large w-5 text-center"></i>
                            <span>الخدمات</span>
                        </div>
                    </>
                ) : (
                    <>
                        <Link className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold no-underline text-gray-700 hover:bg-[#006C35]/10 hover:text-[#006C35]" to="/" onClick={() => setMobileOpen(false)}>
                            <i className="fa fa-house w-5 text-center"></i>
                            <span>الرئيسية</span>
                        </Link>
                        <Link className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold no-underline text-gray-700 hover:bg-[#006C35]/10 hover:text-[#006C35]" to="/#services" onClick={() => setMobileOpen(false)}>
                            <i className="fa fa-table-cells-large w-5 text-center"></i>
                            <span>الخدمات</span>
                        </Link>
                    </>
                )}
                {user ? (
                    <>
                        <Link className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold no-underline text-gray-700 hover:bg-[#006C35]/10 hover:text-[#006C35]" to={dashUrl} onClick={() => setMobileOpen(false)}>
                            <i className="fa fa-gauge-high w-5 text-center"></i>
                            <span>لوحة التحكم</span>
                        </Link>
                        <div
                            className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-red-500 hover:bg-red-50"
                            onClick={() => { logout(); setMobileOpen(false); }}
                        >
                            <i className="fa fa-right-from-bracket w-5 text-center"></i>
                            <span>تسجيل الخروج</span>
                        </div>
                    </>
                ) : (
                    <>
                        <Link className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold no-underline text-gray-700 hover:bg-[#006C35]/10 hover:text-[#006C35]" to="/login" onClick={() => setMobileOpen(false)}>
                            <i className="fa fa-right-to-bracket w-5 text-center"></i>
                            <span>تسجيل الدخول</span>
                        </Link>
                        <Link className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold no-underline text-gray-700 hover:bg-[#006C35]/10 hover:text-[#006C35]" to="/login?mode=register" onClick={() => setMobileOpen(false)}>
                            <i className="fa fa-user-plus w-5 text-center"></i>
                            <span>إنشاء حساب</span>
                        </Link>
                        <Link className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold no-underline text-gray-700 hover:bg-[#006C35]/10 hover:text-[#006C35]" to="/office/login" onClick={() => setMobileOpen(false)}>
                            <i className="fa fa-building w-5 text-center"></i>
                            <span>دخول المكاتب المهنية</span>
                        </Link>
                    </>
                )}
            </div>
        </>
    );
}