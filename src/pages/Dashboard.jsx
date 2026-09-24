import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';

export default function Dashboard() {
    const { user, loading: authLoading } = useAuth();
    const [stats, setStats] = useState(null);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;
        const dashboardPath = user.type === 'office' ? '/office/stats' : '/dashboard/user';
        const requestsPath = user.type === 'office' ? '/office/requests' : '/requests';

        Promise.all([api.get(dashboardPath), api.get(requestsPath)])
            .then(([sRes, rRes]) => {
                setStats(sRes.data);
                setRequests(rRes.data?.data || rRes.data || []);
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [user]);

    if (authLoading) return <div className="p-12 text-center text-gray-400">جارٍ التحميل...</div>;
    if (!user) return <Navigate to="/login" replace />;

    const statsEntries = stats ? Object.entries(stats).filter(([, v]) => typeof v === 'number' || typeof v === 'string') : [];

    return (
        <main className="mx-auto max-w-7xl px-4 py-10">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="section-title">أهلاً، {user.name}</h1>
                    <p className="mt-1 text-gray-500">لوحة التحكم الخاصة بك</p>
                </div>
                <span className="rounded-full bg-primary-light px-3 py-1 text-xs font-bold text-primary">
                    {user.type === 'office' ? 'مكتب' : user.is_admin ? 'إدارة' : 'عميل'}
                </span>
            </div>

            {/* الإحصاءات */}
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {loading ? (
                    [1, 2, 3, 4].map((i) => <div key={i} className="card h-24 animate-pulse !bg-gray-100" />)
                ) : statsEntries.length ? (
                    statsEntries.map(([key, value]) => (
                        <div key={key} className="card">
                            <p className="text-xs text-gray-500">{key.replace(/_/g, ' ')}</p>
                            <p className="mt-1 text-2xl font-extrabold text-primary">{value}</p>
                        </div>
                    ))
                ) : (
                    <div className="card sm:col-span-2 lg:col-span-4">
                        <p className="text-sm text-gray-500">لا توجد إحصاءات متاحة حالياً.</p>
                    </div>
                )}
            </div>

            {/* الطلبات */}
            <div className="mt-10">
                <h2 className="text-lg font-bold text-gray-900">آخر الطلبات</h2>
                <div className="mt-4 overflow-hidden rounded-xl border border-gray-200 bg-white">
                    {loading ? (
                        <div className="p-6 text-center text-gray-400">جارٍ التحميل...</div>
                    ) : requests.length === 0 ? (
                        <div className="p-6 text-center text-sm text-gray-500">لا توجد طلبات بعد.</div>
                    ) : (
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 text-right text-xs text-gray-500">
                                <tr>
                                    <th className="px-4 py-3 font-medium">#</th>
                                    <th className="px-4 py-3 font-medium">الخدمة</th>
                                    <th className="px-4 py-3 font-medium">الحالة</th>
                                    <th className="px-4 py-3 font-medium">التاريخ</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {requests.slice(0, 10).map((r) => (
                                    <tr key={r.id}>
                                        <td className="px-4 py-3 font-mono text-xs text-gray-400">{r.id}</td>
                                        <td className="px-4 py-3 text-gray-800">{r.service_name || r.gov_service_name || '—'}</td>
                                        <td className="px-4 py-3">
                                            <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                                r.status === 'done' ? 'bg-green-50 text-green-700'
                                                : r.status === 'pending' ? 'bg-yellow-50 text-yellow-700'
                                                : 'bg-gray-100 text-gray-600'}`}>
                                                {r.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-gray-500" dir="ltr">{r.created_at ? String(r.created_at).slice(0, 10) : '—'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </main>
    );
}