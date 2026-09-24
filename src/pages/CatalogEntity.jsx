import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api/client';
import Navbar from '../components/Navbar';
import CuHero from '../components/CuHero';
import Footer from '../components/Footer';

/**
 * صفحة جهة (خدماتها) — مطابقة 1:1 لـ catalog_entity.blade.php
 */
export default function CatalogEntity() {
    const { key, entityId } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        api.get(`/catalog/${key}/${entityId}`)
            .then(({ data: d }) => setData(d))
            .catch((e) => console.error('entity api error', e))
            .finally(() => setLoading(false));
    }, [key, entityId]);

    if (loading && !data) {
        return (
            <>
                <Navbar active="services" />
                <div className="mx-auto max-w-[1280px] px-4 py-16 text-center text-gray-400">جارٍ التحميل...</div>
            </>
        );
    }

    const category = data?.category || { key, name_ar: 'الجهة', name_en: 'Entity', color: '#006C35', bg: null };
    const entity = data?.entity;
    const services = data?.services || [];

    if (!entity) {
        return (
            <>
                <Navbar active="services" />
                <div className="mx-auto max-w-lg px-4 py-20 text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-slate-50 ring-1 ring-slate-200/70">
                        <i className="ti ti-building-off text-3xl text-slate-300"></i>
                    </div>
                    <p className="text-sm font-bold text-slate-600">الجهة المطلوبة غير متاحة</p>
                    <Link to={`/catalog/${key}`} className="mt-4 inline-block text-sm font-bold text-[#006C35]">← العودة للتصنيف</Link>
                </div>
            </>
        );
    }

    const eColor = entity.color || '#006C35';

    return (
        <>
            <Navbar active="services" />
            <style>{`
                body{background-color:#F8FAF8;background-image:url('/images/bg-pattern.png');background-size:cover;background-repeat:no-repeat;background-position:center top;background-attachment:fixed}
                .svc-card{display:flex;align-items:center;gap:16px;padding:18px 20px;border-radius:1.25rem;border:1.5px solid rgba(0,108,53,.08);background:#fff;box-shadow:0 1px 3px rgba(0,30,15,.06);transition:transform .25s ease,box-shadow .25s ease,border-color .25s ease;text-decoration:none}
                .svc-card:hover{transform:translateY(-3px);box-shadow:0 20px 50px -16px rgba(0,30,15,.14);border-color:var(--ecc,#006C35)}
                .svc-ico{width:48px;height:48px;border-radius:12px;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:20px}
                .svc-price{font-size:14px;font-weight:800;color:#006C35;white-space:nowrap}
                .svc-dur{font-size:11.5px;color:#5A7A6C}
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
                        <li>
                            <Link to={`/catalog/${category.key}`} className="inline-flex items-center gap-1 font-semibold text-white/70 no-underline transition-colors duration-200 hover:text-white">
                                {category.name_ar}
                            </Link>
                        </li>
                        <li className="text-white/25"><i className="ti ti-chevron-left text-[10px]"></i></li>
                        <li className="font-bold text-white">{entity.name_ar}</li>
                    </ol>
                }
                title={entity.name_ar}
                badge={
                    <>
                        <i className="ti ti-building text-[12px]"></i>
                        <span>{category.name_ar}</span>
                    </>
                }
                subtitle={entity.tag_ar || `خدمات ${entity.name_ar}`}
                side={
                    <div className="hidden shrink-0 items-center justify-center lg:flex">
                        <div className="relative flex h-32 w-32 items-center justify-center overflow-hidden rounded-2xl cui-glass shadow-lg ring-1 ring-white/15">
                            {entity.images ? (
                                <img src={`/images/uploads/${entity.images}`} alt={entity.name_ar} className="h-full w-full object-contain" />
                            ) : (
                                <i className={`ti ${entity.icon || 'ti-building'} text-5xl text-white/80`} style={{ color: eColor }}></i>
                            )}
                        </div>
                    </div>
                }
            />

            {/* الخدمات */}
            <section className="mx-auto max-w-[1280px] px-4 py-10">
                <div className="mb-6 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl text-xl" style={{ background: entity.bg || 'rgba(0,108,53,.06)', border: `1.5px solid ${eColor}33` }}>
                        {entity.images ? (
                            <img src={`/images/uploads/${entity.images}`} alt={entity.name_ar} className="h-9 w-9 object-contain" />
                        ) : (
                            <i className={`ti ${entity.icon || 'ti-building'}`} style={{ color: eColor }}></i>
                        )}
                    </div>
                    <div>
                        <h1 className="text-xl font-black text-[#0A1F14]">{entity.name_ar}</h1>
                        <p className="text-[13px] font-semibold text-[#5A7A6C]">{services.length} خدمة متاحة</p>
                    </div>
                </div>

                {services.length === 0 ? (
                    <div className="mx-auto max-w-xl rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm">
                        <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-xl bg-slate-50 ring-1 ring-slate-200/70">
                            <i className="ti ti-inbox text-4xl text-slate-300"></i>
                        </div>
                        <p className="text-sm font-bold text-slate-600">لا توجد خدمات متاحة لهذه الجهة حالياً</p>
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                        {services.map((svc) => (
                            <div key={svc.id} className="svc-card" style={{ '--ecc': eColor }}>
                                <div className="svc-ico" style={{ background: 'rgba(0,108,53,.07)' }}>
                                    <i className={`ti ${svc.icon || 'ti-file-invoice'} `} style={{ color: eColor }}></i>
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="text-[15px] font-bold text-[#0A1F14]">{svc.name_ar}</div>
                                    {svc.description && <div className="mt-0.5 line-clamp-2 text-[12.5px] text-[#5A7A6C]">{svc.description}</div>}
                                    {svc.duration && <div className="svc-dur mt-1"><i className="ti ti-clock mr-1"></i>{svc.duration}</div>}
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                    <span className="svc-price">{svc.price > 0 ? `${svc.price} ر.س` : 'مجاني'}</span>
                                    <i className="ti ti-arrow-left text-[#006C35]"></i>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            <Footer />
        </>
    );
}