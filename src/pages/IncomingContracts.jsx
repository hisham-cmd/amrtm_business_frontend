import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import UiBadge from '../components/ui/UiBadge';

/**
 * العقود الواردة إليّ — تعادل contracts_incoming.blade.php
 */
export default function IncomingContracts() {
    const { user, loading: authLoading } = useAuth();
    const [contracts, setContracts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;
        api.get('/contracts/incoming')
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
                    <div>
                        <h1 className="text-xl font-extrabold text-emerald-950">العقود الواردة إليّ</h1>
                        <p className="mt-1 text-sm text-emerald-800">العقود التي أُضيف بريدك فيها كطرف ثانٍ</p>
                    </div>

                    <div className="space-y-4">
                        {loading ? (
                            <div className="rounded-2xl border border-emerald-200 bg-white p-10 text-center text-sm font-bold text-emerald-800">جارٍ التحميل...</div>
                        ) : contracts.length === 0 ? (
                            <div className="rounded-2xl border border-emerald-200 bg-white p-12 text-center shadow-sm">
                                <i className="ti ti-inbox mb-3 block text-4xl text-emerald-300"></i>
                                <p className="text-sm font-bold text-emerald-800">لا توجد عقود واردة إليك حالياً.</p>
                                <p className="mt-1 text-xs text-emerald-700">عندما يُنشئ طرف أول عقداً ويضيف بريدك كطرف ثانٍ، سيظهر هنا تلقائياً.</p>
                            </div>
                        ) : (
                            contracts.map((c) => (
                                <article key={c.id} className="flex flex-col gap-4 rounded-2xl border border-emerald-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center">
                                    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-emerald-100 text-emerald-800">
                                        <i className="ti ti-file-contract text-xl"></i>
                                    </div>
                                    <div className="min-w-0 flex-1 space-y-1.5">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h2 className="text-base font-extrabold text-emerald-950">{c.type_name || 'عقد'}</h2>
                                            <UiBadge color="success" className="!font-extrabold">{c.number}</UiBadge>
                                        </div>
                                        <p className="text-sm text-emerald-800">من: <strong className="text-emerald-950">{c.party_1_name || 'الطرف الأول'}</strong></p>
                                        <p className="text-xs text-emerald-700">
                                            القيمة: <span className="font-extrabold text-emerald-900" dir="ltr">{Number(c.price || 0).toFixed(2)} ر.س</span>
                                            • البداية: <span dir="ltr">{c.start_date || '—'}</span>
                                            • النهاية: <span dir="ltr">{c.end_date || '—'}</span>
                                        </p>
                                        {c.status === 'pending_signature' ? (
                                            <UiBadge color="warning" icon="ti ti-bell" className="!px-2.5 !py-1 !text-[11px] !font-extrabold">
                                                بانتظار قبولك والتوقيع
                                            </UiBadge>
                                        ) : (
                                            <UiBadge color="success" icon="ti ti-check" className="!px-2.5 !py-1 !text-[11px] !font-extrabold">
                                                {c.status}
                                            </UiBadge>
                                        )}
                                    </div>
                                    <Link to={`/contracts/${c.id}`} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-emerald-900 px-5 py-2.5 text-sm font-extrabold text-white transition-colors hover:bg-emerald-950">
                                        عرض العقد والتوقيع <i className="ti ti-arrow-left"></i>
                                    </Link>
                                </article>
                            ))
                        )}
                    </div>
                </main>
            </div>
            <Footer />
        </>
    );
}