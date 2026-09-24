import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import UiBadge from '../components/ui/UiBadge';

/**
 * عرض عقد — تعادل contract_show.blade.php
 */
export default function ContractShow() {
    const { id } = useParams();
    const { user } = useAuth();
    const [contract, setContract] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;
        api.get(`/contracts/${id}`)
            .then(({ data }) => setContract(data.value || data))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [id, user]);

    return (
        <>
            <Navbar active="contracts" />
            <div className="min-h-[calc(100vh-72px)] bg-emerald-50/40 py-6">
                <main className="mx-auto w-full max-w-5xl space-y-5 px-4 sm:px-6">
                    {loading ? (
                        <div className="rounded-2xl border border-emerald-200 bg-white p-10 text-center text-sm font-bold text-emerald-800">جارٍ التحميل...</div>
                    ) : !contract ? (
                        <div className="rounded-2xl border border-emerald-200 bg-white p-12 text-center shadow-sm">
                            <i className="ti ti-file-off mb-3 block text-4xl text-emerald-300"></i>
                            <p className="text-sm font-bold text-emerald-800">العقد غير موجود أو غير متاح</p>
                            <Link to="/contracts/my" className="mt-3 inline-block text-xs font-extrabold text-emerald-900">← عقودي</Link>
                        </div>
                    ) : (
                        <>
                            <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
                                <div>
                                    <h1 className="text-xl font-extrabold text-emerald-950">عقد رقم {contract.number}</h1>
                                    <p className="mt-1 text-sm text-emerald-800">{contract.type_name || 'عقد'}</p>
                                </div>
                                <UiBadge color="success" className="!px-3 !py-1.5 !text-[11px] !font-extrabold">{contract.status}</UiBadge>
                            </div>

                            <div className="rounded-2xl border border-emerald-200 bg-white p-6 shadow-sm">
                                <div className="grid gap-4 text-sm sm:grid-cols-2">
                                    <div className="rounded-xl bg-emerald-50/50 p-4">
                                        <div className="text-xs font-extrabold text-emerald-600">الطرف الأول</div>
                                        <div className="mt-1 font-extrabold text-emerald-950">{contract.party_1_name || '—'}</div>
                                    </div>
                                    <div className="rounded-xl bg-emerald-50/50 p-4">
                                        <div className="text-xs font-extrabold text-emerald-600">الطرف الثاني</div>
                                        <div className="mt-1 font-extrabold text-emerald-950">{contract.party_name || '—'}</div>
                                        {contract.party_2_email && <div className="mt-0.5 text-xs text-emerald-700" dir="ltr">{contract.party_2_email}</div>}
                                    </div>
                                </div>

                                <div className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
                                    <div><span className="text-emerald-700">القيمة: </span><b className="text-emerald-950" dir="ltr">{Number(contract.price || 0).toFixed(2)} ر.س</b></div>
                                    <div><span className="text-emerald-700">الفترة: </span><b className="text-emerald-950" dir="ltr">{contract.start_date || '—'} → {contract.end_date || '—'}</b></div>
                                </div>
                            </div>

                            {contract.clauses_json?.length > 0 && (
                                <div className="rounded-2xl border border-emerald-200 bg-white p-6 shadow-sm">
                                    <h2 className="mb-4 text-base font-extrabold text-emerald-950">بنود العقد</h2>
                                    <div className="space-y-3">
                                        {contract.clauses_json.map((c, i) => (
                                            <div key={i} className="rounded-xl border border-emerald-100 bg-emerald-50/30 p-4">
                                                <div className="text-sm font-extrabold text-emerald-950">{c.name}</div>
                                                <p className="mt-1 text-[13px] leading-relaxed text-emerald-800">{c.description}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="flex flex-wrap gap-3">
                                <Link to="/contracts/my" className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-white px-5 py-2.5 text-sm font-extrabold text-emerald-900 transition hover:bg-emerald-50">
                                    <i className="ti ti-arrow-right"></i> عقودي
                                </Link>
                            </div>
                        </>
                    )}
                </main>
            </div>
            <Footer />
        </>
    );
}