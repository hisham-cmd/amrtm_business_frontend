import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import UiBadge from '../components/ui/UiBadge';
import UiLink from '../components/ui/UiLink';

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
 * تتبع طلب — /requests/{id}/track
 */
export default function TrackRequest() {
    const { requestId } = useParams();
    const { user } = useAuth();
    const [request, setRequest] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;
        setLoading(true);
        api.get(`/requests/${requestId}`)
            .then(({ data }) => {
                // عند الدالة myRequestShow قد تعيد البيانات مباشرة أو داخل value
                setRequest(data.value || data);
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [requestId, user]);

    const st = request ? (STATUS_MAP[request.status] || { ar: request.status, color: '#999', bg: 'rgba(0,0,0,.05)' }) : null;

    return (
        <>
            <Navbar active="dashboard" />
            <section className="mx-auto max-w-[800px] px-4 py-10">
                <div className="mb-5 flex items-center justify-between">
                    <h1 className="text-xl font-black text-[#0A1F14]">تتبع الطلب</h1>
                    <Link to="/dashboard" className="text-[13px] font-bold text-[#006C35] no-underline"><i className="ti ti-arrow-right mr-1"></i>لوحتي</Link>
                </div>

                {loading ? (
                    <div className="rounded-2xl border border-slate-100 bg-white p-10 text-center text-slate-400">جارٍ التحميل...</div>
                ) : !request ? (
                    <div className="rounded-2xl border border-slate-100 bg-white p-10 text-center">
                        <i className="ti ti-inbox text-4xl text-slate-300"></i>
                        <p className="mt-3 text-sm font-bold text-slate-600">الطلب غير موجود أو غير متاح</p>
                    </div>
                ) : (
                    <div className="space-y-5">
                        {/* بطاقة الطلب */}
                        <div className="rounded-2xl border border-[rgba(0,108,53,.08)] bg-white p-6 shadow-sm">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <div>
                                    <div className="text-[13px] text-slate-400">رقم الطلب</div>
                                    <div className="text-lg font-black text-[#0A1F14]">#{request.id}</div>
                                </div>
                                <UiBadge color={request.status ? (STATUS_BADGE[request.status] || 'gray') : 'gray'} className="!px-3 !py-1.5 !text-[12px] !font-black">
                                    {st.ar}
                                </UiBadge>
                            </div>
                            <div className="mt-4 grid gap-3 text-[13.5px] sm:grid-cols-2">
                                <div><span className="text-slate-400">الخدمة: </span><b>{request.service_name || request.gov_service_name || '—'}</b></div>
                                <div><span className="text-slate-400">الجهة: </span><b>{request.entity_name || request.office_name || '—'}</b></div>
                                <div><span className="text-slate-400">تاريخ التقديم: </span><b dir="ltr">{request.created_at ? String(request.created_at).slice(0, 16) : '—'}</b></div>
                                {request.estimated_completion && <div><span className="text-slate-400">الانتهاء المتوقع: </span><b dir="ltr">{String(request.estimated_completion).slice(0, 16)}</b></div>}
                            </div>
                        </div>

                        {/* الرسائل */}
                        {request.messages?.length > 0 && (
                            <div className="rounded-2xl border border-[rgba(0,108,53,.08)] bg-white p-6 shadow-sm">
                                <div className="mb-4 text-[15px] font-black text-[#0A1F14]">الرسائل والمتابعة</div>
                                <div className="space-y-3">
                                    {request.messages.map((m) => (
                                        <div key={m.id} className={`rounded-xl px-4 py-3 text-[13.5px] ${m.sender_type === 'admin' ? 'bg-[#006C35]/5' : 'bg-slate-50'}`}>
                                            <div className="mb-1 flex items-center justify-between text-[11.5px] font-bold text-slate-400">
                                                <span>{m.sender_name || (m.sender_type === 'admin' ? 'الإدارة' : 'أنت')}</span>
                                                <span dir="ltr">{m.created_at ? String(m.created_at).slice(0, 16) : ''}</span>
                                            </div>
                                            <p className="text-[#1E3D2E]">{m.body || m.message}</p>
                                            {m.attachments?.length > 0 && (
                                                <div className="mt-2 flex flex-wrap gap-2">
                                                    {m.attachments.map((a) => (
                                                        <UiLink key={a.id} href={a.url} className="rounded-lg bg-white px-2.5 py-1 text-[11px] font-bold text-[#006C35] shadow-sm">📎 {a.name}</UiLink>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </section>
            <Footer />
        </>
    );
}