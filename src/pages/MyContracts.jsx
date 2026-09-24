import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Table } from 'flowbite-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import UiTable from '../components/ui/UiTable';
import UiBadge from '../components/ui/UiBadge';

/**
 * عقودي الصادرة — تعادل contracts_my.blade.php
 */
export default function MyContracts() {
    const { user, loading: authLoading } = useAuth();
    const [contracts, setContracts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;
        api.get('/contracts/my')
            .then(({ data }) => {
                const d = data.value || data;
                setContracts(Array.isArray(d) ? d : []);
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [user]);

    if (authLoading) return <div className="p-12 text-center text-gray-400">جارٍ التحميل...</div>;
    if (!user) return <Navigate to="/office/login" replace />;

    return (
        <>
            <Navbar active="contracts" />
            <div className="min-h-[calc(100vh-72px)] bg-emerald-50/40 py-6">
                <main className="mx-auto w-full max-w-7xl space-y-5 px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
                        <div>
                            <h1 className="text-xl font-extrabold text-emerald-950">عقودي الصادرة</h1>
                            <p className="mt-1 text-sm text-emerald-800">العقود التي أنشأتها كطرف أول</p>
                        </div>
                        <Link to="/create-contract" className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-900 px-5 py-2.5 text-sm font-extrabold text-white shadow-lg shadow-emerald-900/20 transition-colors hover:bg-emerald-950">
                            <i className="ti ti-plus"></i> إنشاء عقد جديد
                        </Link>
                    </div>

                    <div className="overflow-x-auto overflow-hidden rounded-2xl border border-emerald-200 bg-white shadow-sm">
                        {loading ? (
                            <div className="p-10 text-center text-sm text-emerald-800">جارٍ التحميل...</div>
                        ) : (
                            <UiTable striped={false} head={['رقم العقد', 'النوع', 'القيمة', 'الطرف الثاني', 'البداية', 'النهاية', 'الحالة', '']}>
                                <Table.Body>
                                    {contracts.length === 0 ? (
                                        <Table.Row>
                                            <Table.BodyCell colSpan={8} className="px-4 py-12 text-center">
                                                <i className="ti ti-file-off mb-2 block text-3xl text-emerald-300"></i>
                                                <p className="text-sm font-bold text-emerald-800">لا توجد عقود صادرة بعد.</p>
                                                <Link to="/create-contract" className="mt-3 inline-flex items-center gap-2 rounded-lg bg-emerald-900 px-4 py-2 text-xs font-extrabold text-white">
                                                    <i className="ti ti-plus"></i> أنشئ أول عقد
                                                </Link>
                                            </Table.BodyCell>
                                        </Table.Row>
                                    ) : (
                                        contracts.map((c) => (
                                            <Table.Row key={c.id} className="transition-colors hover:bg-emerald-50/40">
                                                <Table.BodyCell className="px-4 py-3.5 font-extrabold text-emerald-950" dir="ltr">{c.number}</Table.BodyCell>
                                                <Table.BodyCell className="px-4 py-3.5 text-emerald-800">{c.type_name || '—'}</Table.BodyCell>
                                                <Table.BodyCell className="px-4 py-3.5 font-extrabold text-emerald-900" dir="ltr">{Number(c.price || 0).toFixed(2)} ر.س</Table.BodyCell>
                                                <Table.BodyCell className="px-4 py-3.5 text-emerald-800">{c.party_name || '—'}</Table.BodyCell>
                                                <Table.BodyCell className="px-4 py-3.5 text-emerald-700" dir="ltr">{c.start_date || '—'}</Table.BodyCell>
                                                <Table.BodyCell className="px-4 py-3.5 text-emerald-700" dir="ltr">{c.end_date || '—'}</Table.BodyCell>
                                                <Table.BodyCell className="px-4 py-3.5">
                                                    {c.party_2_email && !c.party_2_status ? (
                                                        <UiBadge color="warning" icon="ti ti-mail" className="!px-2.5 !py-1 !text-[11px] !font-extrabold">
                                                            بانتظار الطرف الثاني
                                                        </UiBadge>
                                                    ) : (
                                                        <UiBadge color="success" icon="ti ti-circle-dot" className="!px-2.5 !py-1 !text-[11px] !font-extrabold">
                                                            {c.status}
                                                        </UiBadge>
                                                    )}
                                                </Table.BodyCell>
                                                <Table.BodyCell className="px-4 py-3.5">
                                                    <Link to={`/contracts/${c.id}`} className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 px-3 py-1.5 text-xs font-extrabold text-emerald-900 transition-colors hover:bg-emerald-50">
                                                        عرض <i className="ti ti-arrow-left"></i>
                                                    </Link>
                                                </Table.BodyCell>
                                            </Table.Row>
                                        ))
                                    )}
                                </Table.Body>
                            </UiTable>
                        )}
                    </div>
                </main>
            </div>
            <Footer />
        </>
    );
}