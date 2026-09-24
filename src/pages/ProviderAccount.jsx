import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Checkbox } from 'flowbite-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import UiButton from '../components/ui/UiButton';
import UiInput from '../components/ui/UiInput';
import UiSelect from '../components/ui/UiSelect';

const OFFICE_TYPES = [
    { value: 'law', label: 'مكتب محاماة', icon: 'ti-scale' },
    { value: 'services', label: 'مكتب خدمات وتعقيب', icon: 'ti-briefcase' },
    { value: 'customs', label: 'شركة تخليص جمركي', icon: 'ti-address-book' },
    { value: 'accounting', label: 'استشارات مالية وضريبية', icon: 'ti-calculator' },
    { value: 'engineering', label: 'استشارات هندسية', icon: 'ti-building' },
    { value: 'freelance', label: 'مهنة حرة', icon: 'ti-user' },
];

const MODES = [
    { key: 'office', title: 'تسجيل منشأة جديدة', icon: 'ti-building', desc: 'أدخل بيانات المكتب أو المنشأة والمستندات المطلوبة لإرسال طلب التسجيل للمراجعة والاعتماد.' },
    { key: 'consultant', title: 'تسجيل مستشار جديد', icon: 'ti-user-star', desc: 'أدخل بيانات المستشار والمستندات المطلوبة لإرسال طلب التسجيل للمراجعة والاعتماد.' },
    { key: 'client', title: 'إنشاء حساب عميل', icon: 'ti-user-shield', desc: 'أنشئ حسابك كعميل طالب خدمة — فرداً أو منشأة — لتتمكن من طلب الخدمات ومتابعة الطلبات والعقود على المنصة.' },
];

/**
 * تسجيل مقدم خدمة — تعادل provider-account.blade.php
 */
export default function ProviderAccount() {
    const { user, setSession } = useAuth();
    const [params] = useSearchParams();
    const initialMode = params.get('mode');
    const [mode, setMode] = useState(initialMode === 'consultant' ? 'consultant' : initialMode === 'client' ? 'client' : 'office');
    const [specialties, setSpecialties] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState('');
    const [errors, setErrors] = useState([]);

    const [form, setForm] = useState({
        name_ar: '', name_en: '', office_type: 'law', entity_type: 'company',
        phone: '', email: '', password: '', password_confirmation: '',
        country: 'السعودية', governorate: '', city: '', district: '', street: '',
        cr_number: '', license_number: '', cr_expiry_date: '', license_expiry_date: '',
        specialties: [], manual_specialty: '',
        logo: null, cr_image: null, license_image: null, cv: null,
    });

    const isClient = mode === 'client';

    useEffect(() => {
        if (!isClient) loadSpecialties(form.office_type);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mode, form.office_type]);

    const loadSpecialties = async (officeType) => {
        try {
            const { data } = await api.get(`/provider-account/specialties${mode === 'consultant' ? '?mode=consultant' : `?office_type=${officeType}`}`);
            setSpecialties(data.specialties || []);
        } catch {
            setSpecialties([]);
        }
    };

    const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
    const setFile = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.files[0] || null }));

    const toggleSpecialty = (id) => {
        setForm((f) => {
            const has = f.specialties.includes(String(id));
            return { ...f, specialties: has ? f.specialties.filter((s) => s !== String(id)) : [...f.specialties, String(id)] };
        });
    };

    async function handleSubmit(e) {
        e.preventDefault();
        setErrors([]);
        setSubmitting(true);

        try {
            if (isClient) {
                const { data: regRes } = await api.post('/auth/register', {
                    name: form.name_ar,
                    email: form.email,
                    phone: form.phone,
                    password: form.password,
                    password_confirmation: form.password_confirmation,
                    account_type: 'individual',
                });
                // جلسة فورية: يظهر الـ Navbar بحالة المستخدم مباشرة
                setSession(regRes.value.token, regRes.value.user);
                setSuccess('تم إنشاء حسابك بنجاح. مرحباً بك في منصة آمر تم!');
            } else {
                const data = new FormData();
                Object.entries(form).forEach(([k, v]) => {
                    if (v === null || v === '') return;
                    if (k === 'specialties') {
                        form.specialties.forEach((s) => data.append('specialties[]', s));
                        return;
                    }
                    data.append(k, v);
                });
                data.append('subscription_type', mode === 'consultant' ? 'subscription' : 'commission');
                data.append('account_type', mode === 'consultant' ? 'consultant' : 'office');
                data.append('services', '[]');
                data.append('custom_services', '[]');

                await api.post('/provider-account', data, { headers: { 'Content-Type': 'multipart/form-data' } });
                setSuccess('تم إرسال طلب تسجيل المكتب بنجاح، وسيتم مراجعته من الإدارة.');
            }
        } catch (err) {
            const msg = err.response?.data?.error;
            if (Array.isArray(msg)) setErrors(msg);
            else if (typeof msg === 'object' && msg) setErrors(Object.values(msg).flat());
            else setErrors([typeof msg === 'string' ? msg : (err.message || 'فشل إرسال الطلب.')]);
        } finally {
            setSubmitting(false);
        }
    }

    const activeMode = MODES.find((m) => m.key === mode) || MODES[0];

    return (
        <>
            <Navbar active="services" />

            <div className="min-h-screen bg-[#F4F6FB]">
                <div className="mx-auto max-w-[1240px] px-4 pb-16 md:px-6">
                    <nav className="flex flex-wrap items-center gap-1.5 border-b border-slate-200 bg-white px-2 py-3.5 text-[13px] text-slate-500 md:px-4" aria-label="Breadcrumb">
                        <Link to="/" className="inline-flex items-center gap-1 font-semibold no-underline transition-colors hover:text-[#006C35]">
                            <i className="ti ti-home-2 text-[14px]"></i> <span>الرئيسية</span>
                        </Link>
                        <i className="ti ti-chevron-left text-[11px] text-slate-400"></i>
                        <span className="font-bold text-[#006C35]">{activeMode.title}</span>
                    </nav>

                    {success ? (
                        <div className="flex min-h-[60vh] items-center justify-center py-10">
                            <div className="w-full max-w-[620px] rounded-[22px] border border-slate-200 bg-white px-6 py-12 text-center shadow-[0_15px_45px_rgba(15,23,42,.08)] sm:px-10">
                                <div className="mx-auto mb-6 flex h-[82px] w-[82px] items-center justify-center rounded-full bg-emerald-50 text-[#198754]">
                                    <i className="ti ti-circle-check text-[40px]"></i>
                                </div>
                                <h1 className="mb-3 text-[27px] font-extrabold text-[#198754]">تم إرسال الطلب بنجاح</h1>
                                <p className="m-0 text-[15px] leading-8 text-slate-500">{success}</p>
                                <Link to="/" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#006C35] px-6 py-3 text-sm font-extrabold text-white no-underline hover:bg-[#00843D]">
                                    <i className="ti ti-home"></i> العودة للرئيسية
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <>
                            <section className="relative mb-5 mt-6 overflow-hidden rounded-[22px] bg-gradient-to-br from-[#0f766e] via-[#116e68] to-[#0d5d58] px-6 py-9 text-white shadow-[0_15px_35px_rgba(15,118,110,.15)] sm:px-8">
                                <div className="pointer-events-none absolute -right-20 -top-44 h-[300px] w-[300px] rounded-full bg-white/5"></div>
                                <div className="pointer-events-none absolute -bottom-36 -left-20 h-[220px] w-[220px] rounded-full bg-white/5"></div>
                                <div className="relative z-[2] text-center">
                                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-[17px] border border-white/15 bg-white/10">
                                        <i className={`ti ${activeMode.icon} text-[25px]`}></i>
                                    </div>
                                    <h1 className="mb-2 text-[27px] font-extrabold">{activeMode.title}</h1>
                                    <p className="mx-auto max-w-[700px] text-[13px] leading-relaxed text-white/90">{activeMode.desc}</p>
                                </div>
                            </section>

                            <div className="mb-5 grid gap-3 sm:grid-cols-3">
                                {MODES.map((m) => (
                                    <UiButton key={m.key} type="button" variant="ghost" size="sm"
                                        onClick={() => setMode(m.key)}
                                        className={`flex cursor-pointer items-center gap-3 rounded-[18px] border px-4 py-4 text-right transition-all duration-200 ${mode === m.key ? 'border-[#0f766e] bg-teal-50 text-[#0f766e] shadow-[0_4px_14px_rgba(15,118,110,.12)]' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'}`}>
                                        <i className={`ti ${m.icon} text-[20px]`}></i>
                                        <span className="text-[12.5px] font-extrabold">{m.title}</span>
                                    </UiButton>
                                ))}
                            </div>

                            {errors.length > 0 && (
                                <div className="mb-4 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[12px] leading-relaxed text-red-900">
                                    <i className="ti ti-alert-circle mt-1 text-[16px]"></i>
                                    <div>
                                        <strong>يرجى مراجعة البيانات التالية:</strong>
                                        <ul className="mt-1.5 list-disc space-y-1 pr-5">
                                            {errors.map((er, i) => <li key={i}>{er}</li>)}
                                        </ul>
                                    </div>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-4">
                                {!isClient && (
                                    <section className="rounded-[18px] border border-slate-200 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,.055)] sm:p-6">
                                        <div className="mb-5 flex items-center gap-3 border-b border-slate-100 pb-4">
                                            <div className="flex h-[43px] w-[43px] min-w-[43px] items-center justify-center rounded-xl bg-teal-50 text-[#0f766e]">
                                                <i className="ti ti-building text-[18px]"></i>
                                            </div>
                                            <div>
                                                <h2 className="m-0 text-[17px] font-extrabold text-[#172033]">بيانات المنشأة</h2>
                                                <p className="m-0 mt-0.5 text-[11px] text-slate-500">البيانات الأساسية للمكتب أو مقدم الخدمة</p>
                                            </div>
                                        </div>

                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <UiInput
                                                label="الاسم بالعربية"
                                                name="name_ar"
                                                type="text"
                                                required
                                                value={form.name_ar}
                                                onChange={set('name_ar')}
                                            />
                                            <UiInput
                                                label="الاسم بالإنجليزية"
                                                name="name_en"
                                                type="text"
                                                required
                                                dir="ltr"
                                                value={form.name_en}
                                                onChange={set('name_en')}
                                            />
                                            <UiSelect
                                                label="نوع المنشأة"
                                                name="entity_type"
                                                required
                                                value={form.entity_type}
                                                onChange={set('entity_type')}
                                            >
                                                <option value="company">شركة</option>
                                                <option value="institution">مؤسسة</option>
                                            </UiSelect>
                                            {mode !== 'consultant' && (
                                                <UiSelect
                                                    label="نوع المكتب"
                                                    name="office_type"
                                                    required
                                                    value={form.office_type}
                                                    onChange={set('office_type')}
                                                >
                                                    {OFFICE_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                                                </UiSelect>
                                            )}
                                            <UiInput
                                                label="السجل التجاري"
                                                name="cr_number"
                                                type="text"
                                                required
                                                dir="ltr"
                                                value={form.cr_number}
                                                onChange={set('cr_number')}
                                            />
                                            <UiInput
                                                label="رقم الترخيص"
                                                name="license_number"
                                                type="text"
                                                required
                                                dir="ltr"
                                                value={form.license_number}
                                                onChange={set('license_number')}
                                            />
                                            <UiInput
                                                label="انتهاء السجل التجاري"
                                                name="cr_expiry_date"
                                                type="date"
                                                dir="ltr"
                                                value={form.cr_expiry_date}
                                                onChange={set('cr_expiry_date')}
                                            />
                                            <UiInput
                                                label="انتهاء الترخيص"
                                                name="license_expiry_date"
                                                type="date"
                                                dir="ltr"
                                                value={form.license_expiry_date}
                                                onChange={set('license_expiry_date')}
                                            />
                                        </div>
                                    </section>
                                )}

                                <section className="rounded-[18px] border border-slate-200 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,.055)] sm:p-6">
                                    <div className="mb-5 flex items-center gap-3 border-b border-slate-100 pb-4">
                                        <div className="flex h-[43px] w-[43px] min-w-[43px] items-center justify-center rounded-xl bg-teal-50 text-[#0f766e]">
                                            <i className="ti ti-user text-[18px]"></i>
                                        </div>
                                        <div>
                                            <h2 className="m-0 text-[17px] font-extrabold text-[#172033]">بيانات التواصل</h2>
                                            <p className="m-0 mt-0.5 text-[11px] text-slate-500">{isClient ? 'بيانات حسابك كعميل' : 'بيانات حساب المكتب ومسؤول التواصل'}</p>
                                        </div>
                                    </div>

                                    <div className="grid gap-4 sm:grid-cols-2">
                                        {isClient && (
                                            <div className="sm:col-span-2">
                                                <UiInput
                                                    label="الاسم الكامل"
                                                    name="name_ar"
                                                    type="text"
                                                    required
                                                    value={form.name_ar}
                                                    onChange={set('name_ar')}
                                                />
                                            </div>
                                        )}
                                        <UiInput
                                            label="رقم الجوال"
                                            name="phone"
                                            type="tel"
                                            required
                                            dir="ltr"
                                            value={form.phone}
                                            onChange={set('phone')}
                                            placeholder="05xxxxxxxx"
                                        />
                                        <UiInput
                                            label="البريد الإلكتروني"
                                            name="email"
                                            type="email"
                                            required
                                            dir="ltr"
                                            value={form.email}
                                            onChange={set('email')}
                                            placeholder="office@example.com"
                                        />
                                        <UiInput
                                            label="كلمة المرور"
                                            name="password"
                                            type="password"
                                            required
                                            dir="ltr"
                                            minLength={8}
                                            value={form.password}
                                            onChange={set('password')}
                                            placeholder="8 أحرف على الأقل"
                                        />
                                        <UiInput
                                            label="تأكيد كلمة المرور"
                                            name="password_confirmation"
                                            type="password"
                                            required
                                            dir="ltr"
                                            minLength={8}
                                            value={form.password_confirmation}
                                            onChange={set('password_confirmation')}
                                        />
                                    </div>
                                </section>

                                {!isClient && (
                                    <section className="rounded-[18px] border border-slate-200 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,.055)] sm:p-6">
                                        <div className="mb-5 flex items-center gap-3 border-b border-slate-100 pb-4">
                                            <div className="flex h-[43px] w-[43px] min-w-[43px] items-center justify-center rounded-xl bg-teal-50 text-[#0f766e]">
                                                <i className="ti ti-map-pin text-[18px]"></i>
                                            </div>
                                            <div>
                                                <h2 className="m-0 text-[17px] font-extrabold text-[#172033]">العنوان</h2>
                                                <p className="m-0 mt-0.5 text-[11px] text-slate-500">عنوان المكتب الرئيسي</p>
                                            </div>
                                        </div>
                                        <div className="grid gap-4 sm:grid-cols-3">
                                            <UiSelect
                                                label="الدولة"
                                                name="country"
                                                required
                                                value={form.country}
                                                onChange={set('country')}
                                            >
                                                <option value="السعودية">السعودية</option>
                                            </UiSelect>
                                            <UiInput
                                                label="المنطقة"
                                                name="governorate"
                                                type="text"
                                                required
                                                value={form.governorate}
                                                onChange={set('governorate')}
                                            />
                                            <UiInput
                                                label="المدينة"
                                                name="city"
                                                type="text"
                                                required
                                                value={form.city}
                                                onChange={set('city')}
                                            />
                                            <UiInput
                                                label="الحي"
                                                name="district"
                                                type="text"
                                                value={form.district}
                                                onChange={set('district')}
                                            />
                                            <UiInput
                                                label="الشارع"
                                                name="street"
                                                type="text"
                                                value={form.street}
                                                onChange={set('street')}
                                            />
                                        </div>
                                    </section>
                                )}

                                {!isClient && (
                                    <section className="rounded-[18px] border border-slate-200 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,.055)] sm:p-6">
                                        <div className="mb-5 flex items-center gap-3 border-b border-slate-100 pb-4">
                                            <div className="flex h-[43px] w-[43px] min-w-[43px] items-center justify-center rounded-xl bg-teal-50 text-[#0f766e]">
                                                <i className="ti ti-settings text-[18px]"></i>
                                            </div>
                                            <div>
                                                <h2 className="m-0 text-[17px] font-extrabold text-[#172033]">التخصصات</h2>
                                                <p className="m-0 mt-0.5 text-[11px] text-slate-500">اختر تخصصاً واحداً على الأقل</p>
                                            </div>
                                        </div>

                                        {specialties.length === 0 ? (
                                            <p className="rounded-xl bg-slate-50 px-4 py-3 text-[12px] text-slate-500">جارٍ تحميل التخصصات...</p>
                                        ) : (
                                            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                                                {specialties.slice(0, 60).map((s) => (
                                                    <label key={s.id} className={`flex cursor-pointer items-start gap-2.5 rounded-xl border px-3.5 py-3 transition-all duration-200 ${form.specialties.includes(String(s.id)) ? 'border-[#0f766e] bg-teal-50 shadow-[0_4px_14px_rgba(15,118,110,.1)]' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
                                                        <Checkbox checked={form.specialties.includes(String(s.id))} onChange={() => toggleSpecialty(s.id)} className="mt-0.5 h-4 w-4 accent-[#0f766e]" />
                                                        <span className="text-[12px] font-bold text-[#172033]">{s.name_ar}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        )}

                                        <div className="mt-4">
                                            <UiInput
                                                label="تخصص يدوي (اختياري)"
                                                name="manual_specialty"
                                                type="text"
                                                value={form.manual_specialty}
                                                onChange={set('manual_specialty')}
                                                placeholder="اكتب تخصصاً غير موجود في القائمة"
                                            />
                                        </div>
                                    </section>
                                )}

                                {!isClient && (
                                    <section className="rounded-[18px] border border-slate-200 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,.055)] sm:p-6">
                                        <div className="mb-5 flex items-center gap-3 border-b border-slate-100 pb-4">
                                            <div className="flex h-[43px] w-[43px] min-w-[43px] items-center justify-center rounded-xl bg-teal-50 text-[#0f766e]">
                                                <i className="ti ti-paperclip text-[18px]"></i>
                                            </div>
                                            <div>
                                                <h2 className="m-0 text-[17px] font-extrabold text-[#172033]">المستندات</h2>
                                                <p className="m-0 mt-0.5 text-[11px] text-slate-500">السجل التجاري والترخيص وملفات إضافية (JPG/PNG/PDF — حتى 5MB)</p>
                                            </div>
                                        </div>

                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <UiInput label="السجل التجاري (صورة)" name="cr_image" type="file" required accept=".jpg,.jpeg,.png,.pdf" onChange={setFile('cr_image')} />
                                            <UiInput label="الترخيص (صورة)" name="license_image" type="file" required accept=".jpg,.jpeg,.png,.pdf" onChange={setFile('license_image')} />
                                            <UiInput label="الشعار" name="logo" type="file" accept=".png,.jpg,.jpeg,.webp" onChange={setFile('logo')} />
                                            {mode === 'consultant' && (
                                                <div>
                                                    <UiInput label="السيرة الذاتية (PDF/DOC)" name="cv" type="file" accept=".pdf,.doc,.docx" onChange={setFile('cv')} />
                                                </div>
                                            )}
                                        </div>
                                    </section>
                                )}

                                <section className="rounded-[18px] border border-slate-200 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,.055)] sm:p-6">
                                    <div className="flex flex-col items-center justify-between gap-5 sm:flex-row">
                                        <div className="text-[11px] leading-relaxed text-slate-500">
                                            <i className="ti ti-info-circle ml-1 text-[#0f766e]"></i>
                                            تأكد من صحة جميع البيانات قبل الإرسال.<br />
                                            الحقول التي تحمل <span className="text-red-600">*</span> إلزامية.
                                        </div>
                                        <UiButton type="submit" variant="primary" size="sm" disabled={submitting}
                                            className="min-h-[45px] cursor-pointer whitespace-nowrap bg-gradient-to-br from-[#0f766e] to-[#115e59] px-6 py-2.5 text-[12px] font-extrabold text-white shadow-[0_6px_15px_rgba(15,118,110,.16)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_9px_20px_rgba(15,118,110,.22)] disabled:cursor-not-allowed disabled:opacity-70">
                                            {submitting ? <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"></span> جارٍ الإرسال...</> : <><i className="ti ti-send"></i> إرسال الطلب للمراجعة</>}
                                        </UiButton>
                                    </div>
                                </section>
                            </form>
                        </>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
}