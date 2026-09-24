import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api/client';
import Navbar from '../components/Navbar';
import CuHero from '../components/CuHero';
import Footer from '../components/Footer';

/**
 * تخصص مستشار معين — يعتمد apiConsultants + apiConsultantSpecialties
 */
export default function ConsultantSpecialty() {
    const { specialtyId } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        Promise.all([api.get('/consultants'), api.get('/consultant-specialties')])
            .then(([consRes, specsRes]) => {
                const specs = specsRes.data?.specialties || [];
                const spec = specs.find((s) => String(s.id) === String(specialtyId));
                const consultants = (consRes.data || []).filter((c) =>
                    (c.specialties || []).some((s) => String(s.id) === String(specialtyId))
                );
                setData({ spec, consultants });
            })
            .catch((e) => console.error('consultant specialty api error', e))
            .finally(() => setLoading(false));
    }, [specialtyId]);

    if (loading && !data) {
        return (
            <>
                <Navbar active="consultants" />
                <div className="mx-auto max-w-[1280px] px-4 py-16 text-center text-gray-400">جارٍ التحميل...</div>
            </>
        );
    }

    const specName = data?.spec?.name_ar || 'التخصص';

    return (
        <>
            <Navbar active="consultants" />
            <style>{`
                body{background-color:#F8FAF8;background-image:url('/images/bg-pattern.png');background-size:cover;background-repeat:no-repeat;background-position:center top;background-attachment:fixed}
                .cc{display:flex;align-items:center;gap:14px;padding:16px;border-radius:1.25rem;border:1.5px solid rgba(0,108,53,.08);background:#fff;text-decoration:none;transition:transform .25s ease,box-shadow .25s ease;box-shadow:0 1px 3px rgba(0,30,15,.06)}
                .cc:hover{transform:translateY(-3px);box-shadow:0 20px 50px -16px rgba(0,30,15,.14)}
            `}</style>

            <CuHero
                breadcrumb={
                    <ol className="flex flex-wrap items-center gap-1.5 text-[12px] text-white/55">
                        <li><Link to="/" className="inline-flex items-center gap-1 font-semibold text-white/70 no-underline hover:text-white"><i className="ti ti-home-2 text-[13px]"></i><span>الرئيسية</span></Link></li>
                        <li className="text-white/25"><i className="ti ti-chevron-left text-[10px]"></i></li>
                        <li><Link to="/consultants" className="font-semibold text-white/70 no-underline hover:text-white">المستشارون</Link></li>
                        <li className="text-white/25"><i className="ti ti-chevron-left text-[10px]"></i></li>
                        <li className="font-bold text-white">{specName}</li>
                    </ol>
                }
                title={specName}
                badge={<><i className="ti ti-user-heart text-[12px]"></i><span>استشارات</span></>}
                subtitle={`مستشارون متخصصون في ${specName}`}
            />

            <section className="mx-auto max-w-[1000px] px-4 py-10">
                <div className="mb-5">
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#006C35]/8 px-2.5 py-1 text-[11px] font-bold text-[#006C35]">
                        <i className="ti ti-filter text-[12px]"></i>
                        <span>{(data?.consultants || []).length}</span> <span>مستشار</span>
                    </span>
                </div>

                {(data?.consultants || []).length === 0 ? (
                    <div className="mx-auto max-w-xl rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm">
                        <i className="ti ti-user-off text-4xl text-slate-300"></i>
                        <p className="mt-3 text-sm font-bold text-slate-600">لا يوجد مستشارون في هذا التخصص حالياً</p>
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                        {(data?.consultants || []).map((c) => (
                            <Link key={c.id} to={`/consultants/${c.id}`} className="cc">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#F0F4F0] text-lg font-black text-[#006C35]">
                                    {c.logo ? <img src={c.logo} alt="" className="h-full w-full object-cover" /> : String(c.name_ar || 'م').charAt(0)}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2">
                                        <span className="truncate text-[14.5px] font-bold text-[#0A1F14]">{c.name_ar}</span>
                                        {c.is_verified && <span className="shrink-0 rounded-full bg-[#006C35]/8 px-1.5 py-0.5 text-[9px] font-bold text-[#006C35]">✓</span>}
                                    </div>
                                    <div className="text-[12px] text-[#5A7A6C]">{c.city || c.region || ''}</div>
                                </div>
                                <span className="text-[11px] font-bold text-[#5A7A6C]">{c.completed_consultations_count ?? 0} منجزة</span>
                                <i className="ti ti-arrow-left text-[#006C35]"></i>
                            </Link>
                        ))}
                    </div>
                )}
            </section>

            <Footer />
        </>
    );
}