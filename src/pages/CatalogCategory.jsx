import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api/client';
import Navbar from '../components/Navbar';
import CuHero from '../components/CuHero';
import Footer from '../components/Footer';
import UiInput from '../components/ui/UiInput';
import UiButton from '../components/ui/UiButton';

const entityTermByKey = { ministries: 'الوزارة', authorities: 'الهيئة' };

/**
 * صفحة تصنيف الكتالوج — مطابقة 1:1 لـ catalog_category.blade.php
 */
const searchInputClass =
    'w-full [&>div]:w-full [&>div>input]:!py-2.5 [&>div>input]:!px-9 [&>div>input]:!text-[13px] [&>div>input]:!border-slate-200 [&>div>input]:!bg-slate-50/70 [&>div>input]:placeholder:!text-slate-400 [&>div>input]:focus:!border-[#006C35]/40 [&>div>input]:focus:!bg-white [&>div>input]:focus:!outline-none [&>div>input]:focus:!ring-0';

export default function CatalogCategory() {
    const { key } = useParams();
    const [data, setData] = useState(null);
    const [q, setQ] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        api.get(`/catalog/${key}`)
            .then(({ data: d }) => setData(d))
            .catch((e) => console.error('catalog api error', e))
            .finally(() => setLoading(false));
    }, [key]);

    if (loading && !data) {
        return (
            <>
                <Navbar active="services" />
                <div className="mx-auto max-w-[1280px] px-4 py-16 text-center text-gray-400">جارٍ التحميل...</div>
            </>
        );
    }

    const category = data?.category || { key, name_ar: key, name_en: key, color: '#006C35', bg: null, icon: null };
    const entities = data?.entities || [];
    const catColor = category.color || '#006C35';
    const catBg = category.bg || 'rgba(0,108,53,.06)';
    const entityTerm = entityTermByKey[key] || 'الجهة';

    const filtered = q.trim()
        ? entities.filter((e) => {
              const s = q.trim().toLowerCase();
              const nameMatch = String(e.name_ar || '').toLowerCase().includes(s);
              const tagMatch = String(e.tag_ar || '').toLowerCase().includes(s);
              const svcMatch = (e.services || []).some((svc) => String(svc.name_ar || '').toLowerCase().includes(s));
              return nameMatch || tagMatch || svcMatch;
          })
        : entities;

    return (
        <>
            <Navbar active="services" />
            <style>{`
                #entities-sec{max-width:1600px;margin-inline:auto;padding-inline:12px;padding-block:32px}
                @media(min-width:768px){#entities-sec{padding-inline:16px;padding-block:40px}}
                #entities-grid{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:10px!important}
                @media(min-width:640px){#entities-grid{grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:12px!important}}
                @media(min-width:1024px){#entities-grid{grid-template-columns:repeat(5,minmax(0,1fr))!important;gap:12px!important}}
                body{background-color:#F8FAF8;background-image:url('/images/bg-pattern.png');background-size:cover;background-repeat:no-repeat;background-position:center top;background-attachment:fixed}
                .ec{position:relative;display:flex;flex-direction:column;border-radius:1.25rem;border:1.5px solid rgba(0,108,53,.08);background:#fff;overflow:hidden;box-shadow:0 1px 3px rgba(0,30,15,.06);cursor:pointer;text-decoration:none;transition:transform .3s ease,box-shadow .3s ease,border-color .3s ease}
                .ec:hover{transform:translateY(-6px);box-shadow:0 20px 50px -16px rgba(0,30,15,.14);border-color:var(--ecc,#006C35)}
                .ec-body{padding:1.5rem 1.4rem 1.1rem;display:flex;align-items:flex-start;gap:1rem;flex:1}
                .ec-ico{width:56px;height:56px;border-radius:14px;display:flex;align-items:center;justify-content:center;flex-shrink:0;overflow:hidden;transition:transform .25s ease}
                .ec-ico .entity-logo{width:100%;height:100%;object-fit:contain}
                .ec-ico i{font-size:26px}
                .ec:hover .ec-ico{transform:scale(1.08)}
                .ec-info{flex:1;min-width:0}
                .ec-nm{font-size:15px;font-weight:800;color:#0A1F14;line-height:1.4;margin-bottom:4px}
                .ec-tag{font-size:11.5px;font-weight:600;color:#5A7A6C}
                .ec-foot{padding:.8rem 1.4rem;border-top:1px solid rgba(0,108,53,.08);background:#F0F4F0;display:flex;align-items:center;justify-content:flex-end}
                .ec-arr{font-size:18px;transition:transform .2s ease}
                .ec:hover .ec-arr{transform:translateX(-4px)}
            `}</style>

            <CuHero
                breadcrumb={
                    <ol className="flex flex-wrap items-center gap-1.5 text-[12px] text-white/55">
                        <li>
                            <Link to="/" className="inline-flex items-center gap-1 font-semibold text-white/70 no-underline transition-colors duration-200 hover:text-white">
                                <i className="ti ti-home-2 text-[13px]"></i>
                                <span>الرئيسية</span>
                            </Link>
                        </li>
                        <li className="text-white/25"><i className="ti ti-chevron-left text-[10px]"></i></li>
                        <li className="font-bold text-white">{category.name_ar}</li>
                    </ol>
                }
                title={category.name_ar}
                badge={
                    <>
                        <i className="ti ti-category-2 text-[12px]"></i>
                        <span>قطاع حكومي</span>
                    </>
                }
                subtitle={`اختر ${entityTerm} التي ترغب انها اجراءاتك لديها`}
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
                                    placeholder="ابحث عن جهة أو خدمة..."
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
            />

            {/* الجهات */}
            <section id="entities-sec" className="mx-auto max-w-[1600px] px-3 py-8 md:px-4 md:py-10">
                <div className="w-full">
                    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#006C35]/8 px-2.5 py-1 text-[11px] font-bold text-[#006C35]">
                            <i className="ti ti-filter text-[12px]"></i>
                            <span id="filter-count-val">{filtered.length}</span>
                            <span>نتيجة</span>
                        </span>
                    </div>

                    {entities.length === 0 ? (
                        <div className="mx-auto max-w-xl rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm">
                            <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-xl bg-slate-50 ring-1 ring-slate-200/70">
                                <i className="ti ti-inbox text-4xl text-slate-300"></i>
                            </div>
                            <p className="text-sm font-bold text-slate-600">لا توجد جهات متاحة في هذا القطاع حالياً</p>
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="mx-auto max-w-md rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm">
                            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-xl bg-[#006C35]/8">
                                <i className="ti ti-search-off text-2xl text-[#006C35]"></i>
                            </div>
                            <p className="text-[13px] font-bold text-slate-600">لا توجد نتائج مطابقة لبحثك</p>
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
                        <div id="entities-grid" className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                            {filtered.map((entity) => {
                                const eColor = entity.color || catColor;
                                const hasLogo = Boolean(entity.images);
                                return (
                                    <Link
                                        key={entity.id}
                                        to={`/catalog/${category.key}/${entity.id}`}
                                        className="ec cui-fade"
                                        style={{ '--ecc': eColor }}
                                    >
                                        <div className="ec-body">
                                            <div className="ec-ico" style={{ background: entity.bg || catBg, border: `1.5px solid ${eColor}33` }}>
                                                {hasLogo ? (
                                                    <>
                                                        <img src={`/images/uploads/${entity.images}`} alt={entity.name_ar} className="entity-logo" onError={(e) => (e.target.style.display = 'none')} />
                                                    </>
                                                ) : (
                                                    <i className={`ti ${entity.icon || 'ti-building'}`} style={{ color: eColor }}></i>
                                                )}
                                            </div>
                                            <div className="ec-info">
                                                <div className="ec-nm">{entity.name_ar}</div>
                                                {entity.tag_ar && <div className="ec-tag">{entity.tag_ar}</div>}
                                            </div>
                                        </div>
                                        <div className="ec-foot">
                                            <i className="ti ti-arrow-left ec-arr" style={{ color: eColor }}></i>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </>
    );
}