import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api/client';
import Navbar from '../components/Navbar';
import CuHero from '../components/CuHero';
import Footer from '../components/Footer';
import UiInput from '../components/ui/UiInput';
import UiButton from '../components/ui/UiButton';

/**
 * دليل المكاتب — مطابق 1:1 لـ office_directory.blade.php
 * (بطاقات التخصصات + chips عددية، البيانات من /api/v1/offices/{type})
 */
const searchInputClass =
    'w-full [&>div]:w-full [&>div>input]:!py-2.5 [&>div>input]:!px-9 [&>div>input]:!text-[13px] [&>div>input]:!border-slate-200 [&>div>input]:!bg-slate-50/70 [&>div>input]:placeholder:!text-slate-400 [&>div>input]:focus:!border-[#006C35]/40 [&>div>input]:focus:!bg-white [&>div>input]:focus:!outline-none [&>div>input]:focus:!ring-0';

export default function OfficeDirectory() {
    const { type } = useParams();
    const [data, setData] = useState(null);
    const [q, setQ] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        api.get(`/offices/${type}`)
            .then(({ data: d }) => setData(d))
            .catch((e) => console.error('office dir error', e))
            .finally(() => setLoading(false));
    }, [type]);

    if (loading && !data) {
        return (
            <>
                <Navbar active="services" />
                <div className="mx-auto max-w-[1280px] px-4 py-16 text-center text-gray-400">جارٍ التحميل...</div>
            </>
        );
    }

    const cfg = data?.config || {
        name_ar: type, name_en: type, icon: 'ti-building', gradient: 'linear-gradient(135deg,#0B3B2C,#006C35)',
        badge_ar: 'مكاتب متخصصة', hint_ar: 'اختر التخصص المناسب؛ طلبك ينتظر الإسناد',
    };
    const specialties = data?.specialties || [];
    const totalOffices = data?.total_offices ?? 0;
    const totalSpecialties = data?.total_specialties ?? specialties.length;

    const filtered = q.trim()
        ? specialties.filter((s) => {
              const ql = q.trim().toLowerCase();
              const nameMatch = String(s.name_ar || '').toLowerCase().includes(ql);
              const svcMatch = (s.services || []).some((svc) => String(svc.name_ar).toLowerCase().includes(ql));
              return nameMatch || svcMatch;
          })
        : specialties;

    return (
        <>
            <Navbar active="services" />
            <style>{`
                body{background-color:#F8FAF8;background-image:url('/images/bg-pattern.png');background-size:cover;background-repeat:no-repeat;background-position:center top;background-attachment:fixed}
                .sc{border-radius:18px;border:1.5px solid rgba(0,108,53,.1);background:#fff;overflow:hidden;box-shadow:0 4px 18px rgba(0,30,15,.06);text-decoration:none;display:flex;flex-direction:column;transition:transform .3s ease,box-shadow .3s ease,border-color .3s ease}
                .sc:hover{transform:translateY(-5px);box-shadow:0 20px 44px rgba(0,30,15,.12);border-color:rgba(0,108,53,.25)}
                .sc-head{padding:1.4rem 1.4rem 1rem;display:flex;align-items:flex-start;gap:1rem}
                .sc-av{width:52px;height:52px;border-radius:14px;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:20px;font-weight:900;color:#fff;transition:transform .25s}
                .sc:hover .sc-av{transform:scale(1.06)}
                .sc-nm{font-size:16px;font-weight:800;color:#0F2E1F;margin-bottom:6px}
                .sc-badges{display:flex;gap:5px;flex-wrap:wrap}
                .sc-badge{display:inline-flex;align-items:center;gap:4px;padding:3px 9px;border-radius:20px;font-size:11px;font-weight:700;background:rgba(0,108,53,.08);color:#006C35}
                .sc-body{padding:.2rem 1.4rem 1rem;flex:1;display:flex;flex-direction:column}
                .sc-more{padding:5px 9px;font-size:11px;font-weight:700;color:#64748b}
                .sc-foot{padding:.85rem 1.4rem;border-top:1px solid rgba(0,108,53,.08);background:#F8FAF8;display:flex;align-items:center;gap:1rem;flex-wrap:wrap}
                .sc-orig{display:flex;align-items:center;gap:5px;font-size:12px;color:#64748b}
                .sc-cta{margin-right:auto}
                .sc-cta span{font-size:11px;font-weight:700;color:#006C35;background:rgba(0,108,53,.08);padding:4px 12px;border-radius:20px}
            `}</style>

            <CuHero
                breadcrumb={
                    <ol className="flex flex-wrap items-center gap-1.5 text-[12px] text-white/55">
                        <li>
                            <Link to="/" className="inline-flex items-center gap-1 font-semibold text-white/70 no-underline transition-colors duration-200 hover:text-white">
                                <i className="ti ti-home-2 text-[13px]"></i><span>الرئيسية</span>
                            </Link>
                        </li>
                        <li className="text-white/25"><i className="ti ti-chevron-left text-[10px]"></i></li>
                        <li className="font-bold text-white">{cfg.name_ar}</li>
                    </ol>
                }
                title={cfg.name_ar}
                badge={<><i className={`ti ${cfg.icon} text-[12px]`}></i><span>{cfg.badge_ar}</span></>}
                subtitle={
                    <span id="ph-sub">{cfg.hint_ar}</span>
                }
                side={
                    <div className="hidden shrink-0 items-center justify-center lg:flex">
                        <div className="relative flex h-32 w-32 items-center justify-center overflow-hidden rounded-2xl cui-glass shadow-lg ring-1 ring-white/15">
                            <div className="absolute -right-3 -top-4 h-12 w-12 rounded-full bg-white/8 blur-xl"></div>
                            <img src="/images/logo2.jpg" alt="AMRTM Logo" className="h-full w-full object-cover" />
                        </div>
                    </div>
                }
                search={
                    <div className="w-full !rounded-2xl border border-slate-200/80 !bg-white !p-3 shadow-[0_8px_24px_-10px_rgba(0,30,15,.08)]">
                        <div className="flex items-center gap-2">
                            <div className="relative flex-1">
                                <i className="ti ti-search pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[15px] text-slate-400"></i>
                                <UiInput
                                    id="pageSearch"
                                    type="text"
                                    placeholder="ابحث بتخصص أو اسم خدمة..."
                                    autoComplete="off"
                                    dir="rtl"
                                    value={q}
                                    onChange={(e) => setQ(e.target.value)}
                                    className={searchInputClass}
                                />
                            </div>
                            {q && (
                                <UiButton
                                    variant="ghost"
                                    type="button"
                                    onClick={() => setQ('')}
                                    className="hidden shrink-0 !rounded-lg !bg-slate-50/70 !px-2.5 !py-2.5 !text-[12px] !font-semibold !text-slate-500 sm:inline-flex hover:!bg-[#006C35]/8 hover:!text-[#006C35]"
                                >
                                    <i className="ti ti-x text-[14px]"></i>
                                </UiButton>
                            )}
                        </div>
                    </div>
                }
                info={
                    <div className="mt-3 flex flex-wrap items-center justify-center gap-2 lg:justify-end">
                        <span className="cui-glass inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold text-white/85">
                            <i className="ti ti-briefcase"></i>
                            <span>{totalSpecialties}</span>
                            <span>تخصص</span>
                        </span>
                        <span className="cui-glass inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold text-white/85">
                            <i className="ti ti-building"></i>
                            <span>{totalOffices}</span>
                            <span>مكتب متاح</span>
                        </span>
                        <span className="cui-glass inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold text-white/85">
                            <i className="ti ti-shield-check"></i>
                            <span>{totalOffices}</span>
                            <span>معتمد ومتحقق منه</span>
                        </span>
                    </div>
                }
            />

            <section className="mx-auto max-w-[1280px] px-4 py-8 md:py-10">
                <div className="w-full">
                    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#006C35]/8 px-2.5 py-1 text-[11px] font-bold text-[#006C35]">
                            <i className="ti ti-tag text-[12px]"></i>
                            <span>{filtered.length}</span>
                            <span>تخصص</span>
                        </span>
                    </div>

                    {specialties.length === 0 ? (
                        <div className="mx-auto max-w-xl rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                            <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-xl bg-[#006C35]/8">
                                <i className={`ti ${cfg.icon} text-3xl text-[#006C35]`}></i>
                            </div>
                            <h3 className="mb-1 text-base font-extrabold text-slate-900">لا توجد خدمات معتمدة حالياً</h3>
                            <p className="mx-auto mb-5 max-w-sm text-[13px] leading-relaxed text-slate-500">
                                لم يتم اعتماد أي تخصص خدمات في هذا المجال بعد. هل تقدم خدمات في هذا التخصص؟ سجّل الآن وابدأ في استقبال الطلبات.
                            </p>
                            <Link to="/provider-account/create"
                                className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-[13px] font-bold text-white no-underline shadow-md"
                                style={{ background: 'linear-gradient(135deg,#0B3B2C,#006C35)' }}>
                                <i className="ti ti-building-plus"></i> <span>تسجيل مزود خدمة جديد</span>
                            </Link>
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="mx-auto max-w-md rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm">
                            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-xl bg-[#006C35]/8">
                                <i className="ti ti-search-off text-2xl text-[#006C35]"></i>
                            </div>
                            <p className="text-[13px] font-bold text-slate-600">لا نتائج مطابقة</p>
                            <p className="text-[12px] text-slate-500">لم يتم العثور على تخصصات أو خدمات تطابق بحثك. حاول بكلمات مختلفة.</p>
                            <UiButton
                                type="button"
                                variant="ghost"
                                onClick={() => setQ('')}
                                className="mt-2 !rounded-lg !border-0 !bg-transparent !px-3 !py-1.5 !text-[12px] !text-[#006C35] hover:!bg-[#006C35]/8"
                            >
                                <i className="ti ti-rotate ml-1 text-[13px]"></i>إظهار الكل
                            </UiButton>
                        </div>
                    ) : (
                        <div id="spec-grid" className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {filtered.map((spec) => (
                                <Link key={spec.id} to={`/offices/${type}/${spec.id}`} className="sc">
                                    <div className="sc-head">
                                        <div className="sc-av" style={{ background: cfg.gradient }}>
                                            <i className={`ti ${cfg.icon}`} style={{ fontSize: '22px' }}></i>
                                        </div>
                                        <div className="sc-meta" style={{ flex: 1, minWidth: 0 }}>
                                            <div className="sc-nm">{spec.name_ar}</div>
                                            <div className="sc-badges">
                                                <span className="sc-badge"><i className="ti ti-building"></i> {spec.offices_count} <span>مكتب</span></span>
                                                <span className="sc-badge"><i className="ti ti-list-details"></i> {spec.services_count} <span>خدمة</span></span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="sc-body">
                                        {spec.more_count > 0 && (
                                            <div className="sc-more">+ {spec.more_count} <span>خدمات أخرى</span></div>
                                        )}
                                    </div>
                                    <div className="sc-foot">
                                        <div className="sc-orig"><i className="ti ti-shield-check" style={{ color: '#059669' }}></i> <span>طلب وإشراف عبر المنصة</span></div>
                                        <div className="sc-cta"><span>تصفح الخدمات ←</span></div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </>
    );
}