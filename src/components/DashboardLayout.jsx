import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import UiButton from './ui/UiButton';
import UiBadge from './ui/UiBadge';

/**
 * قالب لوحات التحكم — مطابق لـ layouts/dashboard.blade.php (Flowbite).
 * Sidebar يمين + Topbar + إشعارات.
 */
export default function DashboardLayout({ pageTitle, personaLabel, menu = [], children }) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false); // موبايل
    const [notifOpen, setNotifOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [notifs, setNotifs] = useState([]);
    const [unread, setUnread] = useState(0);
    const [dark, setDark] = useState(() => {
        try { return localStorage.getItem('color-theme') === 'dark'; } catch { return false; }
    });

    useEffect(() => {
        document.documentElement.classList.toggle('dark', dark);
        try { localStorage.setItem('color-theme', dark ? 'dark' : 'light'); } catch {}
    }, [dark]);

    // الإشعارات
    const loadNotifs = () => {
        api.get('/notifications?page=1').then(({ data }) => {
            const d = data.value || data;
            setNotifs(Array.isArray(d) ? d : (d.data || []));
        }).catch(() => {});
        api.get('/notifications/unread-count').then(({ data }) => {
            const d = data.value || data;
            setUnread(d.count ?? 0);
        }).catch(() => {});
    };

    useEffect(() => { if (user) loadNotifs(); }, [user]);
    useEffect(() => {
        const t = setInterval(() => { if (user) loadNotifs(); }, 30000);
        return () => clearInterval(t);
    }, [user]);

    const markAll = async () => { await api.post('/notifications/read-all').catch(() => {}); loadNotifs(); };
    const markRead = async (id) => { await api.post(`/notifications/${id}/read`).catch(() => {}); loadNotifs(); };

    const firstName = String(user?.name || 'مستخدم').split(' ')[0];

    const isActive = (href) => {
        const path = href.split('#')[0];
        if (href.includes('#')) return location.hash === '#' + href.split('#')[1];
        return location.pathname === path;
    };

    const menuContent = (
        <nav className="flex-1 overflow-y-auto px-4 py-6">
            <div className="space-y-6">
                {menu.map((group, gi) => (
                    <div key={gi}>
                        {group.items?.length > 0 && (
                            <>
                                <p className="mb-2 px-3 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                                    {group.label}
                                </p>
                                <ul className="space-y-1">
                                    {group.items.map((item, ii) => (
                                        <li key={ii}>
                                            <Link
                                                to={item.href}
                                                onClick={() => setSidebarOpen(false)}
                                                className={`sidebar-item group/item relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-200 ${isActive(item.href) ? 'is-active' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
                                            >
                                                <i className={`nav-item-icon ti ${item.icon} text-lg text-gray-400 ${isActive(item.href) ? 'is-active' : ''}`}></i>
                                                <span className="flex-1 whitespace-nowrap">{item.ar}</span>
                                                {item.en && <span className="text-[10px] font-normal text-gray-400">{item.en}</span>}
                                                {item.count !== undefined && item.count !== null && (
                                                    <UiBadge color="success" className="tabular-nums !bg-emerald-100">{item.count}</UiBadge>
                                                )}
                                                <span className="nav-bar"></span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </>
                        )}
                    </div>
                ))}
                <div className="pt-2">
                    <Link to="/" className="sidebar-item group/item relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-emerald-700 transition-all duration-200 hover:bg-emerald-50">
                        <i className="nav-item-icon ti ti-world text-lg text-emerald-600"></i>
                        <span className="flex-1 whitespace-nowrap">الانتقال إلى الموقع الالكتروني</span>
                        <i className="ti ti-arrow-left text-base text-emerald-500"></i>
                    </Link>
                </div>
            </div>
        </nav>
    );

    return (
        <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 ${dark ? 'dark' : ''}`}>
            {/* Sidebar */}
            <aside
                id="dash-sidebar"
                className={`fixed inset-y-0 right-0 z-40 flex h-screen w-72 flex-col border-l border-gray-200 bg-white transition-transform duration-300 ease-in-out dark:border-gray-700 dark:bg-gray-800 ${sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}`}
            >
                <div className="flex items-center justify-between gap-4 border-b border-gray-200 px-5 py-4 dark:border-gray-700">
                    <Link to="/dashboard-hub" className="flex items-center gap-2.5">
                        <span className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-emerald-50 ring-1 ring-emerald-100">
                            <img src="/images/official-logo.jpg" alt="آمر تم" className="h-9 w-9 rounded-lg object-contain" />
                        </span>
                        <span className="leading-tight">
                            <span className="block text-[15px] font-black text-gray-900 dark:text-white">آمر تم</span>
                            <span className="block text-[11px] font-medium text-gray-500">لوحة التحكم الموحّدة</span>
                        </span>
                    </Link>
                    <UiButton variant="ghost" size="sm" onClick={() => setSidebarOpen(false)} className="!rounded-lg !p-1.5 !border-transparent text-gray-500 hover:!bg-gray-100 lg:hidden" aria-label="إغلاق القائمة">
                        <i className="ti ti-x text-xl"></i>
                    </UiButton>
                </div>

                {menuContent}

                <div className="border-t border-gray-200 p-4 dark:border-gray-700">
                    <UiButton variant="danger" onClick={logout} className="!w-full !rounded-xl !px-3 !py-2.5 !text-sm !font-semibold !justify-start">
                        <i className="ti ti-logout text-lg"></i> تسجيل الخروج
                    </UiButton>
                </div>
            </aside>

            {/* طبقة تعتيم للموبايل */}
            {sidebarOpen && <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

            {/* المحتوى */}
            <div className="flex min-h-screen w-full flex-col lg:pr-72">
                <header className="sticky top-0 z-20 border-b border-gray-200 bg-white/80 backdrop-blur-xl dark:border-gray-700 dark:bg-gray-800/80">
                    <div className="flex h-[72px] items-center justify-between gap-4 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                            <UiButton variant="ghost" size="sm" onClick={() => setSidebarOpen(true)} className="!rounded-lg !p-2 !border-transparent text-gray-500 hover:!bg-gray-100 lg:hidden" aria-label="فتح القائمة">
                                <i className="ti ti-menu-2 text-xl"></i>
                            </UiButton>
                            <div className="leading-tight">
                                <h1 id="dash-page-title" className="text-base font-extrabold text-gray-900 sm:text-lg dark:text-white">{pageTitle}</h1>
                                {personaLabel && (
                                    <p className="hidden text-[12px] font-medium text-gray-500 sm:block">
                                        {personaLabel} <span className="mx-1 text-gray-300">•</span> {user?.name || ''}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-2 sm:gap-3">
                            {/* الإشعارات */}
                            <div className="relative">
                                <UiButton
                                    variant="ghost"
                                    onClick={() => { setNotifOpen((o) => !o); setUserMenuOpen(false); if (!notifOpen) loadNotifs(); }}
                                    className={`relative !rounded-xl !p-2.5 !bg-white transition hover:!border-emerald-200 hover:!text-emerald-600 dark:!bg-gray-700 ${unread > 0 ? '!border-red-200 !text-red-600' : '!border-gray-200 dark:!border-gray-600'}`}
                                    aria-label="الإشعارات"
                                >
                                    <i className="ti ti-bell text-xl"></i>
                                    {unread > 0 && (
                                        <UiBadge className="absolute -left-1.5 -top-1.5 min-w-[18px] !px-1 !py-0.5 !text-[10px] !bg-red-500 !text-white tabular-nums">{unread > 99 ? '99+' : unread}</UiBadge>
                                    )}
                                </UiButton>

                                {notifOpen && (
                                    <div className="absolute left-0 top-12 z-50 my-4 w-[340px] rounded-2xl border border-gray-200 bg-white text-gray-900 shadow-xl dark:border-gray-600 dark:bg-gray-800 dark:text-white">
                                        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 dark:border-gray-700">
                                            <p className="text-sm font-bold">الإشعارات</p>
                                            <UiButton variant="ghost" size="sm" onClick={markAll} className="!rounded-lg !bg-emerald-50 !px-2.5 !py-1 !text-[11px] !font-bold !text-emerald-700 hover:!bg-emerald-100">
                                                تعليم الكل كمقروء
                                            </UiButton>
                                        </div>
                                        <div className="max-h-[60vh] overflow-y-auto">
                                            {notifs.length === 0 ? (
                                                <div className="flex flex-col items-center gap-2 px-4 py-8 text-center">
                                                    <i className="ti ti-bell-off text-3xl text-gray-300"></i>
                                                    <p className="text-sm font-semibold text-gray-500">لا توجد إشعارات حالياً</p>
                                                </div>
                                            ) : (
                                                notifs.slice(0, 15).map((n) => (
                                                    <div key={n.id} onClick={() => markRead(n.id)}
                                                        className={`flex cursor-pointer items-start gap-3 px-4 py-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700 ${n.is_read ? '' : 'bg-emerald-50/40 dark:bg-emerald-900/10'}`}>
                                                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: n.is_read ? '#CBD5E1' : '#006C35', flexShrink: 0, marginTop: 6 }}></span>
                                                        <div className="min-w-0 flex-1">
                                                            <div className="text-[13px] font-bold text-gray-800 dark:text-gray-200">{n.title}</div>
                                                            <div className="mt-0.5 text-xs text-gray-500">{n.body}</div>
                                                            <div className="mt-1 text-[11px] text-gray-400">{n.created_at ? String(n.created_at).slice(0, 10) : ''}</div>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* الوضع الليلي */}
                            <UiButton variant="ghost" size="sm" onClick={() => setDark((d) => !d)} className="!rounded-xl !p-2.5 !bg-white !border-gray-200 text-gray-500 transition hover:!border-emerald-200 hover:!text-emerald-600 dark:!border-gray-600 dark:!bg-gray-700 dark:!text-gray-400" aria-label="تبديل المظهر">
                                <i className={`ti ${dark ? 'ti-sun' : 'ti-moon'} text-xl`}></i>
                            </UiButton>

                            {/* المستخدم */}
                            <div className="relative">
                                <UiButton variant="ghost" onClick={() => { setUserMenuOpen((o) => !o); setNotifOpen(false); }}
                                    className="!flex !items-center !justify-start !gap-2.5 !rounded-xl !p-1.5 !pe-4 !bg-white !border-gray-200 transition hover:!border-emerald-200 dark:!bg-gray-700">
                                    <img className="h-9 w-9 rounded-lg object-cover ring-2 ring-emerald-100"
                                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'مستخدم')}&background=006C35&color=fff&size=64`}
                                        alt={user?.name || ''} />
                                    <span className="hidden text-right sm:block">
                                        <span className="block max-w-[120px] truncate text-[13px] font-bold text-gray-800 dark:text-gray-200">{firstName}</span>
                                        <span className="block text-[11px] font-medium text-emerald-600">{personaLabel || ''}</span>
                                    </span>
                                    <i className="ti ti-chevron-down hidden text-sm text-gray-400 sm:block"></i>
                                </UiButton>

                                {userMenuOpen && (
                                    <div className="absolute left-0 top-12 z-50 my-4 w-56 list-none divide-y divide-gray-100 rounded-2xl border border-gray-200 bg-white text-gray-900 shadow-xl dark:divide-gray-600 dark:border-gray-600 dark:bg-gray-800 dark:text-white">
                                        <div className="px-5 py-4">
                                            <p className="truncate text-sm font-bold">{user?.name}</p>
                                            <p className="truncate text-xs font-medium text-gray-500">{personaLabel}</p>
                                        </div>
                                        <div className="py-2">
                                            <UiButton variant="ghost" onClick={() => { navigate('/dashboard-hub'); setUserMenuOpen(false); }} className="!w-full !justify-start !gap-2.5 !rounded-none !px-5 !py-2.5 !text-sm !font-medium !text-gray-700 !border-transparent hover:!bg-gray-50">
                                                <i className="ti ti-layout-dashboard text-gray-400"></i> لوحة التحكم
                                            </UiButton>
                                        </div>
                                        <div className="py-2">
                                            <UiButton variant="danger" onClick={() => { logout(); setUserMenuOpen(false); }} className="!w-full !justify-start !gap-2.5 !rounded-none !px-5 !py-2.5 !text-sm !font-semibold hover:!bg-gray-50">
                                                <i className="ti ti-logout"></i> تسجيل الخروج
                                            </UiButton>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>

                <footer className="border-t border-gray-200 bg-white/60 py-5 text-center text-xs font-medium text-gray-400">
                    آمر تم © {new Date().getFullYear()} — لوحة التحكم الموحّدة
                </footer>
            </div>
        </div>
    );
}