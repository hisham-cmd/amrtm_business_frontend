import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Textarea } from 'flowbite-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import DashboardLayout from '../components/DashboardLayout';
import UiButton from '../components/ui/UiButton';
import UiInput from '../components/ui/UiInput';
import UiModal from '../components/ui/UiModal';
import UiBadge from '../components/ui/UiBadge';

/**
 * إدارة الواجهة والمحتوى — تعادل admin_homepage.blade.php
 * الإعدادات + الشرائح عبر /api/v1/admin/homepage/*.
 */
export default function AdminHomepage() {
    const { user, loading: authLoading } = useAuth();
    const isSupervisor = user?.role === 'supervisor';

    const [settings, setSettings] = useState({
        site_title: '', site_tagline: '', site_subtitle: '',
        main_office_label: '', contact_phone: '', contact_whatsapp: '', contact_address: '',
    });
    const [slides, setSlides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [savedMsg, setSavedMsg] = useState('');
    const [slideModal, setSlideModal] = useState(false);
    const [editSlide, setEditSlide] = useState(null);

    const loadAll = () => {
        Promise.all([api.get('/admin/homepage/settings'), api.get('/admin/homepage/slides')])
            .then(([sRes, slRes]) => {
                const s = sRes.data.value || sRes.data;
                if (s && typeof s === 'object') setSettings((old) => ({ ...old, ...s }));
                const sl = slRes.data.value || slRes.data;
                setSlides(Array.isArray(sl) ? sl : []);
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    };

    useEffect(() => { if (user) loadAll(); }, [user]);

    if (authLoading) return <div className="p-12 text-center text-gray-400">جارٍ التحميل...</div>;
    if (!user) return <Navigate to="/login" replace />;
    if (!user.is_admin && !['admin', 'supervisor'].includes(user.role)) return <Navigate to="/dashboard" replace />;

    const set = (k) => (e) => setSettings((f) => ({ ...f, [k]: e.target.value }));

    async function saveSettings() {
        setSaving(true);
        setSavedMsg('');
        try {
            await api.post('/admin/homepage/settings', settings);
            setSavedMsg('تم حفظ الإعدادات بنجاح.');
        } catch {
            setSavedMsg('فشل حفظ الإعدادات.');
        } finally {
            setSaving(false);
            setTimeout(() => setSavedMsg(''), 3000);
        }
    }

    async function toggleSlide(id) {
        await api.post(`/admin/homepage/slides/${id}/toggle`).catch(() => {});
        loadAll();
    }
    async function deleteSlide(id) {
        if (!window.confirm('حذف هذه الشريحة؟')) return;
        await api.delete(`/admin/homepage/slides/${id}`).catch(() => {});
        loadAll();
    }

    async function saveSlide() {
        const payload = {
            title: document.getElementById('sl-title').value,
            image_url: document.getElementById('sl-image').value,
            link_url: document.getElementById('sl-link').value,
        };
        if (editSlide) {
            await api.put(`/admin/homepage/slides/${editSlide.id}`, payload).catch(() => {});
        } else {
            await api.post('/admin/homepage/slides', payload).catch(() => {});
        }
        setSlideModal(false);
        loadAll();
    }

    const menu = [
        {
            label: 'الإدارة',
            items: [
                { href: '/admin', ar: 'نظرة عامة', icon: 'ti-dashboard' },
                { href: '/admin/homepage', ar: 'إدارة الواجهة', icon: 'ti-home-edit', count: null },
            ],
        },
    ];

    return (
        <DashboardLayout
            pageTitle="إدارة الواجهة والمحتوى"
            personaLabel={isSupervisor ? 'مشرف' : 'مدير النظام'}
            menu={menu}
        >
            <style>{`
                .ahp-grid{display:grid;grid-template-columns:1fr 1fr;gap:1rem}
                .ahp-fld{display:flex;flex-direction:column;gap:6px}
                .ahp-fld label{font-size:13px;font-weight:700;color:#334155}
                .ahp-fld small{font-size:10.5px;color:#94a3b8}
                .ahp-fld input,.ahp-fld select,.ahp-fld textarea{height:42px;padding:0 13px;border-radius:9px;border:1.5px solid rgba(5,150,105,.1);background:#f8fafc;color:#0f172a;font-size:13.5px;outline:none;transition:border-color .2s}
                .ahp-fld textarea{height:auto;min-height:90px;padding:10px 13px;resize:vertical}
                .ahp-fld input:focus,.ahp-fld select:focus,.ahp-fld textarea:focus{border-color:#059669;background:#fff}
                @media(max-width:820px){.ahp-grid{grid-template-columns:1fr}}
            `}</style>

            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <div>
                    <div className="text-lg font-extrabold text-slate-900">إدارة الواجهة ومحتواها</div>
                    <div className="mt-1 text-xs text-slate-500">تحكم في نصوص الواجهة الرئيسية، الفيديو، وشرائح السلايدر</div>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <UiButton onClick={saveSettings} disabled={saving}>
                        <i className="ti ti-device-floppy"></i> {saving ? 'جارٍ الحفظ...' : 'حفظ الإعدادات'}
                    </UiButton>
                    {savedMsg && <span className={`text-xs font-bold ${savedMsg.includes('فشل') ? 'text-red-600' : 'text-emerald-700'}`}>{savedMsg}</span>}
                </div>
            </div>

            {loading ? (
                <div className="rounded-2xl border border-emerald-900/10 bg-white p-10 text-center text-slate-400">جارٍ التحميل...</div>
            ) : (
                <div>
                    {/* المحتوى الأساسي */}
                    <div className="mb-5 rounded-2xl border border-emerald-900/10 bg-white p-6 shadow-sm">
                        <div className="mb-4 flex items-center gap-2.5">
                            <i className="ti ti-letter-case text-xl text-[#059669]"></i>
                            <div>
                                <div className="text-[15px] font-extrabold text-slate-900">المحتوى الأساسي</div>
                                <div className="text-xs text-slate-500">العنوان والوصف ونصوص الأقسام الرئيسية</div>
                            </div>
                        </div>
                        <div className="ahp-grid">
                            <div className="ahp-fld">
                                <label>عنوان المنصة</label>
                                <UiInput value={settings.site_title || ''} onChange={set('site_title')} placeholder="مثال: منصة آمر تم لخدمات قطاع الأعمال" />
                            </div>
                            <div className="ahp-fld">
                                <label>السطر الترحيبي (تاغلاين)</label>
                                <UiInput value={settings.site_tagline || ''} onChange={set('site_tagline')} placeholder="مثال: اختر الخدمة المطلوبة من خلال الجهات التالية" />
                            </div>
                            <div className="ahp-fld" style={{ gridColumn: '1/-1' }}>
                                <label>وصف المنصة</label>
                                <Textarea value={settings.site_subtitle || ''} onChange={set('site_subtitle')} placeholder="اكتب وصفاً تعريفياً مختصراً للمنصة..." className="rounded-xl border-[1.5px] border-[rgba(5,150,105,.1)] bg-[#f8fafc] text-[13.5px] text-[#0f172a] outline-none transition focus:border-[#059669] focus:bg-white" />
                            </div>
                            <div className="ahp-fld">
                                <label>تسمية المكتب الرئيسي</label>
                                <UiInput value={settings.main_office_label || ''} onChange={set('main_office_label')} placeholder="مثال: المكتب الرئيسي" />
                            </div>
                        </div>
                    </div>

                    {/* بيانات التواصل */}
                    <div className="mb-5 rounded-2xl border border-emerald-900/10 bg-white p-6 shadow-sm">
                        <div className="mb-4 flex items-center gap-2.5">
                            <i className="ti ti-phone text-xl text-[#059669]"></i>
                            <div>
                                <div className="text-[15px] font-extrabold text-slate-900">بيانات التواصل</div>
                                <div className="text-xs text-slate-500">رقم الاتصال والواتساب والعنوان الظاهر في الواجهة</div>
                            </div>
                        </div>
                        <div className="ahp-grid">
                            <div className="ahp-fld">
                                <label>رقم الاتصال</label>
                                <UiInput dir="ltr" value={settings.contact_phone || ''} onChange={set('contact_phone')} placeholder="966920002164" />
                                <small>بالصيغة الدولية بدون +</small>
                            </div>
                            <div className="ahp-fld">
                                <label>رقم الواتساب</label>
                                <UiInput dir="ltr" value={settings.contact_whatsapp || ''} onChange={set('contact_whatsapp')} placeholder="966504915222" />
                                <small>بالصيغة الدولية بدون +</small>
                            </div>
                            <div className="ahp-fld" style={{ gridColumn: '1/-1' }}>
                                <label>العنوان / الموقع</label>
                                <UiInput value={settings.contact_address || ''} onChange={set('contact_address')} placeholder="مثال: الرياض، المملكة العربية السعودية" />
                            </div>
                        </div>
                    </div>

                    {/* الشرائح */}
                    <div className="rounded-2xl border border-emerald-900/10 bg-white p-6 shadow-sm">
                        <div className="mb-4 flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <i className="ti ti-photo text-xl text-[#059669]"></i>
                                <div>
                                    <div className="text-[15px] font-extrabold text-slate-900">شرائح السلايدر</div>
                                    <div className="text-xs text-slate-500">إدارة شرائح الواجهة الرئيسية</div>
                                </div>
                            </div>
                            <UiButton size="sm" onClick={() => { setEditSlide(null); setSlideModal(true); }}>
                                <i className="ti ti-plus"></i> شريحة جديدة
                            </UiButton>
                        </div>

                        {slides.length === 0 ? (
                            <div className="rounded-xl border border-dashed border-emerald-900/15 py-10 text-center text-sm text-slate-400">
                                <i className="ti ti-photo-off mb-2 block text-3xl opacity-40"></i>
                                لا توجد شرائح — أضف أول شريحة
                            </div>
                        ) : (
                            <div className="flex flex-col gap-3">
                                {slides.map((s) => (
                                    <div key={s.id} className="flex items-center gap-4 rounded-xl border border-emerald-900/10 bg-slate-50/60 p-3">
                                        <img src={s.image_url || '/images/slide-riyadh-business.jpg'} alt="" className="h-[70px] w-[120px] shrink-0 rounded-lg border border-emerald-900/10 object-cover" />
                                        <div className="min-w-0 flex-1">
                                            <div className="truncate text-[13.5px] font-bold text-slate-900">{s.title || 'بدون عنوان'}</div>
                                            <div className="mt-1 text-[11px] text-slate-500">#{s.id}</div>
                                        </div>
                                        <UiBadge color={s.is_active ? 'success' : 'gray'} className={s.is_active ? '!py-1' : '!py-1 !bg-slate-200 !text-slate-500'}>
                                            {s.is_active ? 'مفعّلة' : 'متوقفة'}
                                        </UiBadge>
                                        <div className="flex shrink-0 gap-1.5">
                                            <UiButton variant="ghost" size="sm" onClick={() => toggleSlide(s.id)} className="!h-8 !w-8 !p-0 !rounded-lg !bg-white !text-slate-600 !border-emerald-900/10 transition hover:!bg-emerald-50 hover:!text-emerald-700" title="تفعيل/إيقاف">
                                                <i className={`ti ${s.is_active ? 'ti-toggle-on' : 'ti-toggle-off'} text-[18px]`}></i>
                                            </UiButton>
                                            <UiButton variant="ghost" size="sm" onClick={() => deleteSlide(s.id)} className="!h-8 !w-8 !p-0 !rounded-lg !bg-white !text-red-500 !border-emerald-900/10 transition hover:!bg-red-50" title="حذف">
                                                <i className="ti ti-trash text-[16px]"></i>
                                            </UiButton>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* مودال شريحة */}
            <UiModal
                open={slideModal}
                onClose={() => setSlideModal(false)}
                title={editSlide ? 'تعديل الشريحة' : 'شريحة جديدة'}
                icon="ti-photo"
                footer={
                    <UiButton onClick={saveSlide} className="w-full">
                        <i className="ti ti-device-floppy"></i> حفظ الشريحة
                    </UiButton>
                }
            >
                <div className="space-y-4">
                    <UiInput label="العنوان" id="sl-title" placeholder="عنوان الشريحة" defaultValue={editSlide?.title || ''} />
                    <UiInput label="رابط الصورة" id="sl-image" dir="ltr" placeholder="/images/slide-... .jpg" defaultValue={editSlide?.image_url || ''} />
                    <UiInput label="رابط الانتقال" id="sl-link" dir="ltr" placeholder="https://..." defaultValue={editSlide?.link_url || ''} />
                </div>
            </UiModal>
        </DashboardLayout>
    );
}