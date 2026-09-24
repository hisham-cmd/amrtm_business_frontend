import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Table } from 'flowbite-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import Navbar from '../components/Navbar';
import CuHero from '../components/CuHero';
import Footer from '../components/Footer';
import UiTable from '../components/ui/UiTable';
import UiBadge from '../components/ui/UiBadge';

const STATUS_MAP = {
    pending: { ar: 'قيد الانتظار', color: '#E65100', bg: 'rgba(230,81,0,.1)' },
    processing: { ar: 'جاري المعالجة', color: '#0277BD', bg: 'rgba(2,119,189,.1)' },
    in_progress: { ar: 'قيد التنفيذ', color: '#F9A825', bg: 'rgba(249,168,37,.1)' },
    done: { ar: 'تمت العملية', color: '#1B5E20', bg: 'rgba(27,94,32,.1)' },
    rejected: { ar: 'مرفوض', color: '#C62828', bg: 'rgba(198,40,40,.1)' },
};

const STATUS_BADGE = {
    pending: 'warning',
    processing: 'primary',
    in_progress: 'warning',
    done: 'success',
    rejected: 'failure',
};

/**
 * لوحة المستخدم — نفس الاستخدام القديم (طلباتي + إحصائيات) بهوية CUI.
 */
export default function UserDashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;
        Promise.all([api.get('/dashboard/user'), api.get('/requests?page=1')])
            .then(([sRes, rRes]) => {
                setStats(sRes.data.value || sRes.data);
                const rr = rRes.data.value || rRes.data;
                setRequests(Array.isArray(rr) ? rr : (rr.data || []));
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [user]);

    const statItems = stats && typeof stats === 'object'
        ? Object.entries(stats).filter(([, v]) => typeof v === 'number')
        : [];

    return (
        <>
            <Navbar active="dashboard" />
            <CuHero
                title={`أهلاً، ${user?.name || 'مستخدم'}`}
                badge={<><i className="ti ti-user-check text-[12px]"></i><span>لوحة المستخدم</span></>}
                subtitle="تابع طلباتك وملفك الشخصي من هنا"
            />

            <section className="mx-auto max-w-[1100px] px-4 py-8">
                {/* الإحصاءات */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {loading ? (
                        [1, 2, 3, 4].map((i) => <div key={i} className="h-24 animate-pulse rounded-2xl border border-slate-100 bg-white" />)
                    ) : statItems.length ? (
                        statItems.map(([key, value]) => (
                            <div key={key} className="rounded-2xl border border-[rgba(0,108,53,.08)] bg-white p-5 shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#006C35]/8 text-lg text-[#006C35]">
                                        <i className="ti ti-chart-bar"></i>
                                    </div>
                                    <div>
                                        <div className="text-xl font-black text-[#0A1F14]">{value}</div>
                                        <div className="text-[11.5px] font-bold text-[#5A7A6C]">
                                            {String(key).replace(/_/g, ' ')}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="rounded-2xl border border-[rgba(0,108,53,.08)] bg-white p-5 text-[13px] text-slate-500 sm:col-span-2 lg:col-span-4">لا توجد إحصاءات متاحة.</div>
                    )}
                </div>

                {/* الطلبات */}
                <div className="mt-8">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-lg font-black text-[#0A1F14]">طلباتي</h2>
                        <Link to="/catalog/ministries" className="inline-flex items-center gap-1.5 rounded-xl bg-[#006C35] px-4 py-2 text-[12.5px] font-bold text-white no-underline transition hover:bg-[#00843D]">
                            <i className="ti ti-plus"></i> طلب جديد
                        </Link>
                    </div>

                    <div className="overflow-hidden rounded-2xl border border-[rgba(0,108,53,.08)] bg-white shadow-sm">
                        {loading ? (
                            <div className="p-8 text-center text-slate-400">جارٍ التحميل...</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <UiTable striped={false} head={['#', 'الخدمة', 'الجهة', 'الحالة', 'التاريخ', 'تتبع']}>
                                    <Table.Body>
                                        {requests.length === 0 ? (
                                            <Table.Row>
                                                <Table.BodyCell colSpan={6} className="px-4 py-10 text-center">
                                                    <i className="ti ti-inbox text-4xl text-slate-300"></i>
                                                    <p className="mt-3 text-sm font-bold text-slate-500">لا توجد طلبات بعد</p>
                                                    <Link to="/catalog/ministries" className="mt-3 inline-block text-[13px] font-bold text-[#006C35] no-underline">ابدأ طلبك الأول ←</Link>
                                                </Table.BodyCell>
                                            </Table.Row>
                                        ) : (
                                            requests.map((r) => {
                                                const st = STATUS_MAP[r.status] || { ar: r.status, color: '#999', bg: 'rgba(0,0,0,.05)' };
                                                return (
                                                    <Table.Row key={r.id} className="transition hover:bg-[#F8FAF8]">
                                                        <Table.BodyCell className="px-4 py-3 font-mono text-[12px] text-slate-400">#{r.id}</Table.BodyCell>
                                                        <Table.BodyCell className="px-4 py-3 font-bold text-[#0A1F14]">{r.service_name || r.gov_service_name || '—'}</Table.BodyCell>
                                                        <Table.BodyCell className="px-4 py-3 text-[#5A7A6C]">{r.entity_name || r.office_name || '—'}</Table.BodyCell>
                                                        <Table.BodyCell className="px-4 py-3">
                                                            <UiBadge color={STATUS_BADGE[r.status] || 'gray'} className="!px-2.5 !py-1 !text-[11px] !font-black">{st.ar}</UiBadge>
                                                        </Table.BodyCell>
                                                        <Table.BodyCell className="px-4 py-3 text-[#5A7A6C]" dir="ltr">{r.created_at ? String(r.created_at).slice(0, 10) : '—'}</Table.BodyCell>
                                                        <Table.BodyCell className="px-4 py-3">
                                                            <Link to={`/requests/${r.id}/track`} className="inline-flex items-center gap-1 text-[12px] font-black text-[#006C35] no-underline">
                                                                تتبع <i className="ti ti-arrow-left"></i>
                                                            </Link>
                                                        </Table.BodyCell>
                                                    </Table.Row>
                                                );
                                            })
                                        )}
                                    </Table.Body>
                                </UiTable>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
}