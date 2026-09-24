import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Table } from 'flowbite-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import DashboardLayout from '../components/DashboardLayout';
import UiButton from '../components/ui/UiButton';
import UiTable from '../components/ui/UiTable';
import UiBadge from '../components/ui/UiBadge';

/**
 * لوحة الإدارة — تعتمد endpoints /api/v1/dashboard/admin و /api/v1/admin/*
 * تغطي: نظرة عامة، الطلبات، المكاتب، المستخدمون، المالية.
 */
export default function AdminDashboard({ page = 'overview' }) {
    const { user, loading: authLoading } = useAuth();
    const [stats, setStats] = useState(null);
    const [requests, setRequests] = useState([]);
    const [offices, setOffices] = useState([]);
    const [users, setUsers] = useState([]);
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [reqFilter, setReqFilter] = useState('all');

    useEffect(() => {
        if (!user || !user.is_admin) return;
        setLoading(true);
        const calls = {
            stats: api.get('/dashboard/admin'),
            requests: api.get('/admin/requests?status=all'),
            offices: api.get('/admin/offices'),
            users: api.get('/admin/users'),
            payments: api.get('/admin/payments'),
        };
        Promise.all([calls.stats, calls.requests, calls.offices, calls.users, calls.payments])
            .then(([s, r, o, u, p]) => {
                setStats(s.data.value || s.data);
                const rr = r.data.value || r.data;
                setRequests(Array.isArray(rr) ? rr : (rr.data || []));
                const oo = o.data.value || o.data;
                setOffices(Array.isArray(oo) ? oo : (oo.data || []));
                const uu = u.data.value || u.data;
                setUsers(Array.isArray(uu) ? uu : (uu.data || []));
                const pp = p.data.value || p.data;
                setPayments(Array.isArray(pp) ? pp : (pp.data || []));
            })
            .catch((e) => console.error('admin api error', e))
            .finally(() => setLoading(false));
    }, [user]);

    if (authLoading) return <div className="p-12 text-center text-gray-400">جارٍ التحميل...</div>;
    if (!user) return <Navigate to="/login" replace />;
    if (!user.is_admin && !['admin', 'supervisor'].includes(user.role)) return <Navigate to="/dashboard" replace />;

    const isSupervisor = user.role === 'supervisor';
    const s = stats || {};
    const req = s.requests || { total: 0, pending: 0, processing: 0, done: 0, rejected: 0 };
    const statCards = isSupervisor
        ? [
              { label: 'إجمالي الطلبات', value: req.total, icon: 'ti-file-text', bg: 'bg-sky-100', color: 'text-sky-700' },
              { label: 'قيد الانتظار', value: req.pending, icon: 'ti-loader', bg: 'bg-orange-100', color: 'text-orange-600' },
              { label: 'جاري المعالجة', value: req.processing, icon: 'ti-settings', bg: 'bg-sky-100', color: 'text-sky-700' },
              { label: 'مكتملة', value: req.done, icon: 'ti-circle-check', bg: 'bg-emerald-100', color: 'text-emerald-700' },
              { label: 'مرفوضة', value: req.rejected, icon: 'ti-x', bg: 'bg-red-100', color: 'text-red-600' },
              { label: 'المستخدمين', value: s.users ?? 0, icon: 'ti-users', bg: 'bg-purple-100', color: 'text-purple-700' },
          ]
        : [
              { label: 'إجمالي الطلبات', value: req.total, icon: 'ti-file-text', bg: 'bg-sky-100', color: 'text-sky-700' },
              { label: 'إجمالي المكاتب', value: s.offices ?? offices.length, icon: 'ti-building', bg: 'bg-emerald-100', color: 'text-emerald-700' },
              { label: 'المستخدمون', value: s.users ?? users.length, icon: 'ti-users', bg: 'bg-purple-100', color: 'text-purple-700' },
              { label: 'المعاملات', value: payments.length, icon: 'ti-wallet', bg: 'bg-amber-100', color: 'text-amber-700' },
          ];

    const menu = isSupervisor
        ? [
              {
                  label: 'الإدارة', items: [
                      { href: '/admin', ar: 'نظرة عامة', en: 'Overview', icon: 'ti-dashboard', count: null },
                      { href: '/admin/requests', ar: 'الطلبات', en: 'Requests', icon: 'ti-file-text', count: req.total },
                      { href: '/admin/offices', ar: 'المكاتب', en: 'Offices', icon: 'ti-building', count: offices.length },
                      { href: '/admin/users', ar: 'المستخدمون', en: 'Users', icon: 'ti-users', count: users.length },
                      { href: '/admin/finance', ar: 'المالية', en: 'Finance', icon: 'ti-wallet', count: null },
                  ],
              },
          ]
        : [
              {
                  label: 'نظرة عامة', items: [
                      { href: '/admin', ar: 'نظرة عامة', en: 'Overview', icon: 'ti-dashboard', count: null },
                  ],
              },
          ];

    // تصفية الطلبات حسب الحالة
    const filteredRequests = reqFilter === 'all' ? requests : requests.filter((r) => r.status === reqFilter);

    return (
        <DashboardLayout
            pageTitle={isSupervisor ? 'لوحة التحكم — مشرف' : 'لوحة التحكم — مدير النظام'}
            personaLabel={isSupervisor ? 'مشرف' : 'مدير النظام'}
            menu={menu}
        >
            {/* عداد النظرة العامة */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <div>
                    <div className="text-lg font-extrabold text-slate-900">نظرة عامة على المنصة</div>
                    <div className="mt-1 text-xs text-slate-500">آخر تحديث: منذ لحظات</div>
                </div>
            </div>

            {/* بطاقات الإحصاءات */}
            <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
                {loading ? (
                    [1, 2, 3, 4, 5, 6].map((i) => <div key={i} className="h-24 animate-pulse rounded-2xl border border-emerald-900/10 bg-white" />)
                ) : (
                    statCards.map((c) => (
                        <div key={c.label} className="flex items-center gap-4 rounded-2xl border border-emerald-900/10 bg-white p-5 shadow-sm shadow-emerald-900/5">
                            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${c.bg} text-xl`}>
                                <i className={`ti ${c.icon} ${c.color}`}></i>
                            </div>
                            <div>
                                <div className="text-2xl font-black tabular-nums text-slate-900">{c.value ?? 0}</div>
                                <div className="mt-0.5 text-xs font-medium text-slate-500">{c.label}</div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* المحتوى حسب التبويب */}
            {(page === 'overview' || page === 'requests') && (
                <div className="rounded-2xl border border-emerald-900/10 bg-white shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
                        <div className="flex items-center gap-2 text-[15px] font-black text-slate-900">
                            <i className="ti ti-file-text text-emerald-600"></i> الطلبات
                        </div>
                        <div className="flex gap-1.5">
                            {['all', 'pending', 'processing', 'done', 'rejected'].map((f) => (
                                <UiButton key={f} variant="ghost" size="sm" onClick={() => setReqFilter(f)}
                                    className={`capitalize transition !rounded-lg !px-3 !py-1.5 !text-[11.5px] !font-bold ${reqFilter === f ? '!bg-emerald-600 !text-white !border-transparent' : '!bg-slate-100 !text-slate-600 !border-transparent hover:!bg-slate-200'}`}>
                                    {f}
                                </UiButton>
                            ))}
                        </div>
                    </div>

                    {loading ? (
                        <div className="p-8 text-center text-slate-400">جارٍ التحميل...</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <UiTable striped={false} head={['#', 'الخدمة', 'العميل', 'الحالة', 'التاريخ']} empty={filteredRequests.length === 0} emptyText="لا توجد طلبات">
                                {filteredRequests.slice(0, 15).map((r) => (
                                    <Table.Row key={r.id} className="hover:bg-slate-50/50">
                                        <Table.BodyCell className="px-4 py-3 font-mono text-[11.5px] text-slate-400">#{r.id}</Table.BodyCell>
                                        <Table.BodyCell className="px-4 py-3 font-bold text-slate-800">{r.service_name || r.gov_service_name || '—'}</Table.BodyCell>
                                        <Table.BodyCell className="px-4 py-3 text-slate-600">{r.client_name || r.user_name || r.user?.name || '—'}</Table.BodyCell>
                                        <Table.BodyCell className="px-4 py-3">
                                            <UiBadge color="gray" className="!py-1 !text-[10.5px] !font-black">{r.status}</UiBadge>
                                        </Table.BodyCell>
                                        <Table.BodyCell className="px-4 py-3 text-slate-500" dir="ltr">{r.created_at ? String(r.created_at).slice(0, 10) : '—'}</Table.BodyCell>
                                    </Table.Row>
                                ))}
                            </UiTable>
                        </div>
                    )}
                </div>
            )}

            {/* المكاتب */}
            {page === 'offices' && (
                <div className="rounded-2xl border border-emerald-900/10 bg-white shadow-sm">
                    <div className="border-b border-slate-100 px-5 py-4 text-[15px] font-black text-slate-900">
                        <i className="ti ti-building text-emerald-600 ml-1"></i> المكاتب
                    </div>
                    <div className="overflow-x-auto">
                        <UiTable striped={false} head={['#', 'الاسم', 'النوع', 'المدينة', 'الحالة']} empty={offices.length === 0} emptyText="لا توجد مكاتب">
                            {offices.slice(0, 15).map((o) => (
                                <Table.Row key={o.id} className="hover:bg-slate-50/50">
                                    <Table.BodyCell className="px-4 py-3 font-mono text-[11.5px] text-slate-400">#{o.id}</Table.BodyCell>
                                    <Table.BodyCell className="px-4 py-3 font-bold text-slate-800">{o.name_ar || o.name}</Table.BodyCell>
                                    <Table.BodyCell className="px-4 py-3 text-slate-600">{o.type}</Table.BodyCell>
                                    <Table.BodyCell className="px-4 py-3 text-slate-600">{o.city || '—'}</Table.BodyCell>
                                    <Table.BodyCell className="px-4 py-3">
                                        <UiBadge color={o.is_active ? 'success' : 'failure'} className="!py-1 !text-[10.5px] !font-black">
                                            {o.is_active ? 'مفعّل' : 'موقوف'}
                                        </UiBadge>
                                    </Table.BodyCell>
                                </Table.Row>
                            ))}
                        </UiTable>
                    </div>
                </div>
            )}

            {/* المستخدمون */}
            {page === 'users' && (
                <div className="rounded-2xl border border-emerald-900/10 bg-white shadow-sm">
                    <div className="border-b border-slate-100 px-5 py-4 text-[15px] font-black text-slate-900">
                        <i className="ti ti-users text-emerald-600 ml-1"></i> المستخدمون
                    </div>
                    <div className="overflow-x-auto">
                        <UiTable striped={false} head={['#', 'الاسم', 'البريد', 'الدور', 'الحالة']} empty={users.length === 0} emptyText="لا يوجد مستخدمون">
                            {users.slice(0, 15).map((u) => (
                                <Table.Row key={u.id} className="hover:bg-slate-50/50">
                                    <Table.BodyCell className="px-4 py-3 font-mono text-[11.5px] text-slate-400">#{u.id}</Table.BodyCell>
                                    <Table.BodyCell className="px-4 py-3 font-bold text-slate-800">{u.name}</Table.BodyCell>
                                    <Table.BodyCell className="px-4 py-3 text-slate-600" dir="ltr">{u.email}</Table.BodyCell>
                                    <Table.BodyCell className="px-4 py-3 text-slate-600">{u.role}</Table.BodyCell>
                                    <Table.BodyCell className="px-4 py-3">
                                        <UiBadge color={u.is_active ? 'success' : 'failure'} className="!py-1 !text-[10.5px] !font-black">
                                            {u.is_active ? 'نشط' : 'موقوف'}
                                        </UiBadge>
                                    </Table.BodyCell>
                                </Table.Row>
                            ))}
                        </UiTable>
                    </div>
                </div>
            )}

            {/* المالية */}
            {page === 'finance' && (
                <div className="rounded-2xl border border-emerald-900/10 bg-white shadow-sm">
                    <div className="border-b border-slate-100 px-5 py-4 text-[15px] font-black text-slate-900">
                        <i className="ti ti-wallet text-emerald-600 ml-1"></i> المعاملات المالية
                    </div>
                    <div className="overflow-x-auto">
                        <UiTable striped={false} head={['#', 'المبلغ', 'الطريقة', 'الحالة', 'التاريخ']} empty={payments.length === 0} emptyText="لا توجد معاملات">
                            {payments.slice(0, 15).map((p) => (
                                <Table.Row key={p.id} className="hover:bg-slate-50/50">
                                    <Table.BodyCell className="px-4 py-3 font-mono text-[11.5px] text-slate-400">#{p.id}</Table.BodyCell>
                                    <Table.BodyCell className="px-4 py-3 font-black text-emerald-700">{p.amount ?? p.total ?? 0} ر.س</Table.BodyCell>
                                    <Table.BodyCell className="px-4 py-3 text-slate-600">{p.method || '—'}</Table.BodyCell>
                                    <Table.BodyCell className="px-4 py-3">
                                        <UiBadge color="gray" className="!py-1 !text-[10.5px] !font-black">{p.status}</UiBadge>
                                    </Table.BodyCell>
                                    <Table.BodyCell className="px-4 py-3 text-slate-500" dir="ltr">{p.created_at ? String(p.created_at).slice(0, 10) : '—'}</Table.BodyCell>
                                </Table.Row>
                            ))}
                        </UiTable>
                    </div>
                </div>
            )}

            {/* تحويلات غير مباشرة */}
            {['catalog', 'logs', 'analytics', 'settings', 'permissions', 'pricing', 'contracts', 'services-approvals', 'off-finance', 'office-specialties'].includes(page) && (
                <div className="rounded-2xl border border-dashed border-emerald-900/15 bg-white p-12 text-center">
                    <i className="ti ti-tools text-4xl text-slate-300"></i>
                    <p className="mt-3 text-sm font-bold text-slate-600">قسم «{page}» قيد التفصيل</p>
                    <p className="mt-1 text-[12.5px] text-slate-400">البيانات تصل عبر الـ API — يتم إكمال الواجهة التفصيلية تباعاً</p>
                </div>
            )}
        </DashboardLayout>
    );
}