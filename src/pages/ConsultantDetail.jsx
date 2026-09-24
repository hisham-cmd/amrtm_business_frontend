import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api/client';
import Navbar from '../components/Navbar';
import CuHero from '../components/CuHero';
import Footer from '../components/Footer';

/**
 * تفاصيل مستشار/مكتب — يعتمد apiOfficeDetail
 */
export default function ConsultantDetail() {
    const { officeId } = useParams();
    const [office, setOffice] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        api.get(`/consultants/${officeId}`)
            .then(({ data: d }) => {
                // apiOfficeDetail يعيد { office } — لاحظ أن office موجود في d.office (كل expose من الـ controller)
                setOffice(d.office || d);
            })
            .catch((e) => console.error('consultant detail api error', e))
            .finally(() => setLoading(false));
    }, [officeId]);

    if (loading && !office) {
        return (
            <>
                <Navbar active="consultants" />
                <div className="mx-auto max-w-[1280px] px-4 py-16 text-center text-gray-400">جارٍ التحميل...</div>
            </>
        );
    }

    if (!office) {
        return (
            <>
                <Navbar active="consultants" />
                <div className="mx-auto max-w-lg px-4 py-20 text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-slate-50 ring-1 ring-slate-200/70">
                        <i className="ti ti-user-off text-3xl text-slate-300"></i>
                    </div>
                    <p className="text-sm font-bold text-slate-600">المستشار غير متاح</p>
                    <Link to="/consultants" className="mt-4 inline-block text-sm font-bold text-[#006C35]">← العودة للدليل</Link>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar active="consultants" />
            <style>{`
                body{background-color:#F8FAF8;background-image:url('/images/bg-pattern.png');background-size:cover;background-repeat:no-repeat;background-position:center top;background-attachment:fixed}
            `}</style>

            <CuHero
                breadcrumb={
                    <ol className="flex flex-wrap items-center gap-1.5 text-[12px] text-white/55">
                        <li><Link to="/" className="inline-flex items-center gap-1 font-semibold text-white/70 no-underline transition-colors hover:text-white"><i className="ti ti-home-2 text-[13px]"></i><span>الرئيسية</span></Link></li>
                        <li className="text-white/25"><i className="ti ti-chevron-left text-[10px]"></i></li>
                        <li><Link to="/consultants" className="font-semibold text-white/70 no-underline transition-colors hover:text-white">المستشارون</Link></li>
                        <li className="text-white/25"><i className="ti ti-chevron-left text-[10px]"></i></li>
                        <li className="font-bold text-white">{office.name_ar}</li>
                    </ol>
                }
                title={office.name_ar}
                badge={<><i className="ti ti-user-heart text-[12px]"></i><span>مستشار</span></>}
                subtitle={office.bio || 'استشارات مهنية متخصصة'}
                side={
                    <div className="hidden shrink-0 items-center justify-center lg:flex">
                        <div className="relative flex h-32 w-32 items-center justify-center overflow-hidden rounded-2xl cui-glass shadow-lg ring-1 ring-white/15">
                            {office.logo ? (
                                <img src={office.logo} alt={office.name_ar} className="h-full w-full object-contain" />
                            ) : (
                                <span className="text-5xl font-black text-white/85">{String(office.name_ar || 'م').charAt(0)}</span>
                            )}
                        </div>
                    </div>
                }
            />

            <section className="mx-auto max-w-[1100px] px-4 py-10">
                {/* بطاقة المستشار */}
                <div className="rounded-2xl border border-[rgba(0,108,53,.08)] bg-white p-6 shadow-[0_8px_24px_-8px_rgba(0,30,15,.1)]">
                    <div className="flex flex-col gap-6 md:flex-row md:items-start">
                        <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-[rgba(0,108,53,.1)] bg-[#F0F4F0] text-4xl font-black text-[#006C35]">
                            {office.logo ? <img src={office.logo} alt={office.name_ar} className="h-full w-full object-cover" /> : String(office.name_ar || 'م').charAt(0)}
                        </div>
                        <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                                <h2 className="text-xl font-black text-[#0A1F14]">{office.name_ar}</h2>
                                {office.is_verified && <span className="rounded-full bg-[#006C35]/8 px-2.5 py-1 text-[11px] font-bold text-[#006C35]">موثّق ✓</span>}
                                {(office.city || office.region) && (
                                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-500">
                                        <i className="ti ti-map-pin mr-1"></i>{office.city || office.region}
                                    </span>
                                )}
                            </div>
                            {office.bio && <p className="mt-3 text-[13.5px] leading-relaxed text-[#5A7A6C]">{office.bio}</p>}

                            {/* تخصصات */}
                            {office.specialties?.length > 0 && (
                                <div className="mt-4">
                                    <div className="mb-2 text-[12px] font-bold text-[#5A7A6C]">التخصصات</div>
                                    <div className="flex flex-wrap gap-2">
                                        {office.specialties.map((s) => (
                                            <span key={s.id} className="rounded-lg border border-[rgba(0,108,53,.14)] bg-[#006C35]/5 px-3 py-1.5 text-[12px] font-bold text-[#1E3D2E]">{s.name_ar}</span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* إحصاءات */}
                            <div className="mt-5 flex flex-wrap gap-6 border-t border-slate-100 pt-4 text-center">
                                <div>
                                    <div className="text-xl font-black text-[#006C35]">{office.total_requests_count ?? 0}</div>
                                    <div className="text-[11.5px] font-bold text-[#5A7A6C]">إجمالي الطلبات</div>
                                </div>
                                <div>
                                    <div className="text-xl font-black text-[#006C35]">{office.views_count ?? 0}</div>
                                    <div className="text-[11.5px] font-bold text-[#5A7A6C]">مرات المشاهدة</div>
                                </div>
                                <div>
                                    <div className="text-xl font-black text-[#006C35]">{(office.services || []).length}</div>
                                    <div className="text-[11.5px] font-bold text-[#5A7A6C]">الخدمات</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* خدمات */}
                    {office.services?.length > 0 && (
                        <div className="mt-6 border-t border-slate-100 pt-5">
                            <div className="mb-3 text-[13px] font-black text-[#0A1F14]">الخدمات المقدمة</div>
                            <div className="grid gap-3 md:grid-cols-2">
                                {office.services.map((svc) => (
                                    <div key={svc.id} className="flex items-center justify-between rounded-xl border border-slate-100 bg-[#F8FAF8] px-4 py-3">
                                        <span className="text-[13px] font-bold text-[#1E3D2E]">{svc.name_ar}</span>
                                        <span className="text-[13px] font-black text-[#006C35]">{svc.price > 0 ? `${svc.price} ر.س` : 'مجاني'}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="mt-6 flex flex-wrap gap-3">
                        <Link to="/login" className="inline-flex items-center gap-2 rounded-xl bg-[#006C35] px-6 py-3 text-sm font-bold text-white no-underline transition hover:bg-[#00843D]">
                            <i className="ti ti-message-circle"></i> تواصل مع المستشار
                        </Link>
                        <Link to="/consultants" className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-6 py-3 text-sm font-bold text-gray-700 no-underline transition hover:bg-gray-50">
                            <i className="ti ti-arrow-right"></i> العودة للدليل
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
}