import { useEffect, useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { Checkbox } from 'flowbite-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import UiButton from '../components/ui/UiButton';
import UiInput from '../components/ui/UiInput';

/**
 * إنشاء عقد — تعادل contracts_create_static.blade.php (نسخة مبسطة عملية
 * تعتمد بيانات الأنواع من API create-data).
 */
export default function CreateContract() {
    const { user, loading: authLoading } = useAuth();
    const navigate = useNavigate();

    const [types, setTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({
        contract_type_id: '',
        party_name: '',
        party_2_email: '',
        start_date: '',
        end_date: '',
        terms_accepted: false,
    });
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        api.get('/contracts/create-data')
            .then(({ data }) => {
                const d = data.value || data;
                setTypes(d.contractTypes || []);
                if ((d.contractTypes || []).length > 0) {
                    setForm((f) => ({ ...f, contract_type_id: String(d.contractTypes[0].id) }));
                }
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    if (authLoading) return <div className="p-12 text-center text-gray-400">جارٍ التحميل...</div>;
    if (!user) return <Navigate to="/office/login" replace />;

    const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        if (!form.terms_accepted) {
            setError('يجب الموافقة على الشروط والأحكام.');
            return;
        }
        setSubmitting(true);
        try {
            const { data } = await api.post('/contracts', {
                contract_type_id: Number(form.contract_type_id),
                party_name: form.party_name || null,
                party_2_email: form.party_2_email || null,
                start_date: form.start_date || null,
                end_date: form.end_date || null,
                terms_accepted: true,
            });
            const created = data.value || data;
            navigate(`/contracts/${created.id || ''}`);
        } catch (err) {
            const msg = err.response?.data?.error;
            setError(typeof msg === 'string' ? msg : (msg?.message || 'فشل إنشاء العقد.'));
        } finally {
            setSubmitting(false);
        }
    }

    const selectedType = types.find((t) => String(t.id) === String(form.contract_type_id));

    return (
        <>
            <Navbar active="contracts" />
            <div className="min-h-[calc(100vh-72px)] bg-emerald-50/40 py-6">
                <main className="mx-auto w-full max-w-4xl space-y-5 px-4 sm:px-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-xl font-extrabold text-emerald-950">إنشاء عقد جديد</h1>
                            <p className="mt-1 text-sm text-emerald-800">عقود نظامية حسب النشاط</p>
                        </div>
                        <Link to="/contracts/my" className="text-sm font-extrabold text-emerald-900">عقودي ←</Link>
                    </div>

                    {loading ? (
                        <div className="rounded-2xl border border-emerald-200 bg-white p-10 text-center text-sm font-bold text-emerald-800">جارٍ التحميل...</div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {error && (
                                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
                                    <i className="ti ti-alert-circle mr-1"></i>{error}
                                </div>
                            )}

                            {/* نوع العقد */}
                            <div className="rounded-2xl border border-emerald-200 bg-white p-6 shadow-sm">
                                <label className="mb-3 block text-sm font-extrabold text-emerald-950">نوع العقد</label>
                                <div className="grid gap-3 sm:grid-cols-2">
                                    {types.map((t) => (
                                        <UiButton
                                            type="button"
                                            variant="ghost"
                                            key={t.id}
                                            onClick={() => setForm((f) => ({ ...f, contract_type_id: String(t.id) }))}
                                            className={`!w-full !rounded-xl !border-2 !p-4 !justify-start !text-right transition ${String(t.id) === String(form.contract_type_id) ? '!border-emerald-700 !bg-emerald-50 hover:!bg-emerald-50' : '!border-emerald-100 !bg-white hover:!border-emerald-200 hover:!bg-white'}`}
                                        >
                                            <span className="block">
                                                <span className="block text-sm font-extrabold text-emerald-950">{t.name}</span>
                                                <span className="mt-1 block text-xs font-bold text-emerald-700">{Number(t.price || 0).toFixed(2)} ر.س</span>
                                            </span>
                                        </UiButton>
                                    ))}
                                </div>
                            </div>

                            {/* بيانات الطرف الثاني */}
                            <div className="rounded-2xl border border-emerald-200 bg-white p-6 shadow-sm">
                                <div className="mb-4 text-sm font-extrabold text-emerald-950">بيانات الطرف الثاني</div>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="mb-1.5 block text-xs font-extrabold text-emerald-800">اسم الطرف الثاني</label>
                                        <UiInput type="text" value={form.party_name} onChange={set('party_name')} className="[&>div>input]:!rounded-xl [&>div>input]:!border-emerald-200 [&>div>input]:!bg-white [&>div>input]:focus:!border-emerald-700" />
                                    </div>
                                    <div>
                                        <label className="mb-1.5 block text-xs font-extrabold text-emerald-800">بريد الطرف الثاني (لدعوته)</label>
                                        <UiInput type="email" dir="ltr" value={form.party_2_email} onChange={set('party_2_email')} className="[&>div>input]:!rounded-xl [&>div>input]:!border-emerald-200 [&>div>input]:!bg-white [&>div>input]:focus:!border-emerald-700" placeholder="party@example.com" />
                                    </div>
                                    <div>
                                        <label className="mb-1.5 block text-xs font-extrabold text-emerald-800">تاريخ البداية</label>
                                        <UiInput type="date" dir="ltr" value={form.start_date} onChange={set('start_date')} className="[&>div>input]:!rounded-xl [&>div>input]:!border-emerald-200 [&>div>input]:!bg-white [&>div>input]:focus:!border-emerald-700" />
                                    </div>
                                    <div>
                                        <label className="mb-1.5 block text-xs font-extrabold text-emerald-800">تاريخ النهاية</label>
                                        <UiInput type="date" dir="ltr" value={form.end_date} onChange={set('end_date')} className="[&>div>input]:!rounded-xl [&>div>input]:!border-emerald-200 [&>div>input]:!bg-white [&>div>input]:focus:!border-emerald-700" />
                                    </div>
                                </div>
                            </div>

                            {/* بنود العقد */}
                            {selectedType?.clauses?.length > 0 && (
                                <div className="rounded-2xl border border-emerald-200 bg-white p-6 shadow-sm">
                                    <div className="mb-4 text-sm font-extrabold text-emerald-950">بنود العقد</div>
                                    <div className="space-y-3">
                                        {selectedType.clauses.map((c) => (
                                            <div key={c.id} className="rounded-xl border border-emerald-100 bg-emerald-50/30 p-4">
                                                <div className="text-sm font-extrabold text-emerald-950">{c.name}</div>
                                                <p className="mt-1 text-[13px] leading-relaxed text-emerald-800">{c.description}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* الموافقة */}
                            <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-emerald-200 bg-white p-5 shadow-sm">
                                <Checkbox
                                    checked={form.terms_accepted}
                                    onChange={(e) => setForm((f) => ({ ...f, terms_accepted: e.target.checked }))}
                                    className="mt-1 h-4 w-4 accent-emerald-700"
                                />
                                <span className="text-[13px] leading-relaxed text-emerald-900">
                                    أقر بأنني اطلعت على بنود العقد والاتفاقية، وأوافق على الالتزام بجميع الشروط والأحكام المذكورة.
                                </span>
                            </label>

                            <UiButton type="submit" disabled={submitting} className="!w-full !rounded-xl !px-6 !py-3.5 !text-sm !font-extrabold !shadow-lg shadow-emerald-900/20">
                                {submitting ? 'جارٍ الإنشاء...' : <><i className="ti ti-file-check"></i> إنشاء العقد</>}
                            </UiButton>
                        </form>
                    )}
                </main>
            </div>
            <Footer />
        </>
    );
}