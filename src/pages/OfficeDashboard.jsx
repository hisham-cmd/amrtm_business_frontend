import { useEffect, useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { Table } from 'flowbite-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import UiButton from '../components/ui/UiButton';
import UiTable from '../components/ui/UiTable';
import UiBadge from '../components/ui/UiBadge';

/**
 * لوحة المكاتب — يعتمد /api/v1/office/*
 */
export default function OfficeDashboard() {
    const { user, loading: authLoading } = useAuth();
    const [tab, setTab] = useState('requests');
    const [stats, setStats] = useState(null);
    const [requests, setRequests] = useState([]);
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user || user.type !== 'office') return;
        setLoading(true);
        Promise.all([api.get('/office/stats'), api.get('/office/requests')])
            .then(([sRes, rRes]) => {
                setStats(sRes.data.value || sRes.data);
                const rr = rRes.data.value || rRes.data;
                setRequests(Array.isArray(rr) ? rr : (rr.data || []));
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [user]);

    useEffect(() => {
        if (tab === 'services' && user?.type === 'office') {
            api.get('/office/services').then(({ data }) => {
                const sv = data.value || data;
                setServices(Array.isArray(sv) ? sv : (sv.data || []));
            }).catch(() => {});
        }
    }, [tab, user]);

    if (authLoading) return <div className="p-12 text-center text-slate-400">جارٍ التحميل...</div>;
    if (!user) return <Navigate to="/office/login" replace />;
    if (user.type !== 'office') return <Navigate to="/dashboard" replace />;

    const TABS = [
        { key: 'requests', label: 'الطلبات', icon: 'ti-inbox' },
        { key: 'services', label: 'الخدمات', icon: 'ti-list-check' },
        { key: 'financial', label: 'المالية', icon: 'ti-wallet' },
        { key: 'profile', label: 'الملف', icon: 'ti-user' },
    ];

    const statEntries = stats && typeof stats === 'object' ? Object.entries(stats).filter(([, v]) => typeof v === 'number') : [];

    return (
        <>
            <Navbar active="dashboard" />
            <section className="min-h-[70vh]">
                {/* شريط علوي */}
                <div className="border-b border-slate-200 bg-white">
                    <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-3 px-4 py-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-[#006C35]/8 text-lg font-black text-[#006C35]">
                                {String(user.name || 'م').charAt(0)}
                            </div>
                            <div>
                                <div className="text-[15px] font-black text-[#0A1F14]">{user.name}</div>
                                <div className="text-[12px] font-semibold text-[#5A7A6C]">لوحة المكتب · #{user.office_id}</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {TABS.map((t) => (
                                <UiButton key={t.key} variant="ghost" size="sm" onClick={() => setTab(t.key)}
                                    className={`transition !rounded-xl !px-4 !py-2 !text-[12.5px] !font-bold ${tab === t.key ? '!bg-[#006C35] !text-white !border-transparent' : '!bg-slate-100 !text-slate-600 !border-transparent hover:!bg-slate-200'}`}>
                                    <i className={`ti ${t.icon}`}></i>{t.label}
                                </UiButton>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mx-auto max-w-[1280px] px-4 py-8">
                    {/* الطلبات */}
                    {tab === 'requests' && (
                        <>
                            <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                {loading ? (
                                    [1, 2, 3, 4].map((i) => <div key={i} className="h-24 animate-pulse rounded-2xl border border-slate-100 bg-white" />)
                                ) : statEntries.length ? (
                                    statEntries.slice(0, 4).map(([key, value]) => (
                                        <div key={key} className="rounded-2xl border border-[rgba(0,108,53,.08)] bg-white p-5 shadow-sm">
                                            <div className="text-xs font-bold text-[#5A7A6C]">{key.replace(/_/g, ' ')}</div>
                                            <div className="mt-1 text-2xl font-black text-[#006C35]">{value}</div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="rounded-2xl border border-slate-100 bg-white p-5 text-[13px] text-slate-500 sm:col-span-4">لا توجد إحصاءات.</div>
                                )}
                            </div>

                            <div className="overflow-hidden rounded-2xl border border-[rgba(0,108,53,.08)] bg-white shadow-sm">
                                <div className="border-b border-slate-100 px-5 py-4 text-[15px] font-black text-[#0A1F14]">الطلبات الواردة</div>
                                {loading ? (
                                    <div className="p-8 text-center text-slate-400">جارٍ التحميل...</div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <UiTable striped={false} head={['#', 'الخدمة', 'العميل', 'الحالة', 'التاريخ']} empty={requests.length === 0} emptyText="لا توجد طلبات موكل إليك بعد">
                                            {requests.slice(0, 20).map((r) => (
                                                <Table.Row key={r.id} className="transition hover:bg-[#F8FAF8]">
                                                    <Table.BodyCell className="px-4 py-3 font-mono text-[12px] text-slate-400">#{r.id}</Table.BodyCell>
                                                    <Table.BodyCell className="px-4 py-3 font-bold text-[#0A1F14]">{r.service_name || r.gov_service_name || '—'}</Table.BodyCell>
                                                    <Table.BodyCell className="px-4 py-3 text-[#5A7A6C]">{r.client_name || r.user_name || '—'}</Table.BodyCell>
                                                    <Table.BodyCell className="px-4 py-3">
                                                        <UiBadge color="gray" className="!py-1 !text-[11px] !font-black">{r.status}</UiBadge>
                                                    </Table.BodyCell>
                                                    <Table.BodyCell className="px-4 py-3 text-[#5A7A6C]" dir="ltr">{r.created_at ? String(r.created_at).slice(0, 10) : '—'}</Table.BodyCell>
                                                </Table.Row>
                                            ))}
                                        </UiTable>
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    {/* الخدمات */}
                    {tab === 'services' && (
                        <div className="overflow-hidden rounded-2xl border border-[rgba(0,108,53,.08)] bg-white shadow-sm">
                            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                                <div className="text-[15px] font-black text-[#0A1F14]">خدمات المكتب</div>
                                <UiBadge color="primary" className="!bg-[#006C35]/8 !font-black">{services.length} خدمة</UiBadge>
                            </div>
                            {services.length === 0 ? (
                                <div className="p-10 text-center">
                                    <i className="ti ti-list text-4xl text-slate-300"></i>
                                    <p className="mt-3 text-sm font-bold text-slate-500">لم تُضف خدمات بعد</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-slate-50">
                                    {services.map((svc) => (
                                        <div key={svc.id} className="flex items-center justify-between px-5 py-4">
                                            <div>
                                                <div className="text-[14px] font-bold text-[#0A1F14]">{svc.name_ar || svc.name}</div>
                                                {svc.description && <div className="text-[12px] text-[#5A7A6C]">{svc.description}</div>}
                                            </div>
                                            <span className="text-[13px] font-black text-[#006C35]">{svc.price > 0 ? `${svc.price} ر.س` : 'مجاني'}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* المالية */}
                    {tab === 'financial' && (
                        <div className="rounded-2xl border border-[rgba(0,108,53,.08)] bg-white p-6 text-center shadow-sm">
                            <i className="ti ti-wallet text-4xl text-slate-300"></i>
                            <p className="mt-3 text-sm font-bold text-slate-500">البيانات المالية والتسويات قيد التفعيل</p>
                            <Link to="/office/financial" className="mt-2 inline-block text-[13px] font-bold text-[#006C35] no-underline">عرض التفاصيل ←</Link>
                        </div>
                    )}

                    {/* الملف */}
                    {tab === 'profile' && (
                        <div className="rounded-2xl border border-[rgba(0,108,53,.08)] bg-white p-6 shadow-sm">
                            <div className="text-[15px] font-black text-[#0A1F14]">بيانات المكتب</div>
                            <div className="mt-4 grid gap-4 text-[13.5px] sm:grid-cols-2">
                                <div><span className="text-slate-400">الاسم: </span><b>{user.name}</b></div>
                                <div><span className="text-slate-400">البريد: </span><b dir="ltr">{user.email}</b></div>
                                <div><span className="text-slate-400">رقم المكتب: </span><b>#{user.office_id}</b></div>
                                <div><span className="text-slate-400">الدور: </span><b>{user.role}</b></div>
                            </div>
                        </div>
                    )}
                </div>
            </section>
            <Footer />
        </>
    );
}