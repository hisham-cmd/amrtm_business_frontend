import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import Navbar from '../components/Navbar';
import CuHero from '../components/CuHero';
import Footer from '../components/Footer';
import UiInput from '../components/ui/UiInput';
import UiButton from '../components/ui/UiButton';

/**
 * دليل المستشارين — مطابق لـ consultants_directory.blade.php
 * (Navbar + CuHero + تخصصات + بطاقات مستشارين + Footer)
 */
const searchInputClass =
    'w-full [&>div]:w-full [&>div>input]:!py-2.5 [&>div>input]:!px-9 [&>div>input]:!text-[13px] [&>div>input]:!border-slate-200 [&>div>input]:!bg-slate-50/70 [&>div>input]:placeholder:!text-slate-400 [&>div>input]:focus:!border-[#006C35]/40 [&>div>input]:focus:!bg-white [&>div>input]:focus:!outline-none [&>div>input]:focus:!ring-0';

export default function Consultants() {
    const [consultants, setConsultants] = useState([]);
    const [specialties, setSpecialties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState('');
    const [activeActivity, setActiveActivity] = useState('');
    const [activeCategory, setActiveCategory] = useState('');

    useEffect(() => {
        Promise.all([api.get('/consultants'), api.get('/consultant-specialties')])
            .then(([cRes, sRes]) => {
                setConsultants(cRes.data);
                setSpecialties(sRes.data?.specialties || []);
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    const filtered = useMemo(() => {
        let list = consultants;
        if (activeActivity) {
            list = list.filter((c) => (c.specialties || []).some((s) => String(s.business_activity) === String(activeActivity)));
        }
        if (activeCategory) {
            list = list.filter((c) => (c.specialties || []).some((s) => String(s.category) === String(activeCategory)));
        }
        if (query.trim()) {
            const q = query.trim().toLowerCase();
            list = list.filter((c) =>
                [c.name_ar, c.name_en, c.city, ...(c.specialties || []).map((s) => s.name_ar)]
                    .filter(Boolean)
                    .some((v) => String(v).toLowerCase().includes(q))
            );
        }
        return list;
    }, [consultants, query, activeActivity, activeCategory]);

    const topCategories = useMemo(() => {
        const map = new Map();
        specialties.forEach((s) => {
            const k = s.category || 'أخرى';
            map.set(k, (map.get(k) || 0) + (s.consultants_count || 0));
        });
        return Array.from(map.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 8)
            .map(([name, count]) => ({ name, count }));
    }, [specialties]);

    return (
        <>
            <Navbar active="consultants" />
            <style>{`
                body{background-color:#F8FAF8;background-image:url('/images/bg-pattern.png');background-size:cover;background-repeat:no-repeat;background-position:center top;background-attachment:fixed}
                .cc-card{display:flex;flex-direction:column;border-radius:1.25rem;border:1.5px solid rgba(0,108,53,.08);background:#fff;box-shadow:0 1px 3px rgba(0,30,15,.06);text-decoration:none;overflow:hidden;transition:transform .3s ease,box-shadow .3s ease,border-color .3s ease}
                .cc-card:hover{transform:translateY(-5px);box-shadow:0 20px 50px -16px rgba(0,30,15,.14);border-color:rgba(0,108,53,.18)}
                .cc-body{padding:1.4rem;flex:1}
                .cc-foot{padding:.8rem 1.4rem;border-top:1px solid rgba(0,108,53,.08);background:#F8FAF8;display:flex;align-items:center;justify-content:space-between;font-size:12px;color:#5A7A6C}
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
                        <li className="font-bold text-white">المستشارون</li>
                    </ol>
                }
                title="المستشارين"
                badge={<><i className="ti ti-user-heart text-[12px]"></i><span>استشارات</span></>}
                subtitle="اختر النشاط التجاري لعرض التخصصات التابعة له ثم اطلب الخدمة مباشرة"
                side={
                    <div className="hidden shrink-0 items-center justify-center lg:flex">
                        <div className="relative flex h-32 w-32 items-center justify-center overflow-hidden rounded-2xl cui-glass shadow-lg ring-1 ring-white/15">
                            <div className="absolute -right-3 -top-4 h-12 w-12 rounded-full bg-white/8 blur-xl"></div>
                            <img src="/images/logo2.jpg" alt="AMRTM" className="h-full w-full object-cover" />
                        </div>
                    </div>
                }
                search={
                    <div className="w-full !rounded-2xl border border-slate-200/80 !bg-white !p-3 shadow-[0_8px_24px_-10px_rgba(0,30,15,.08)]">
                        <div className="relative">
                            <i className="ti ti-search pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[15px] text-slate-400"></i>
                            <UiInput
                                type="text"
                                placeholder="ابحث باسم المستشار أو التخصص..."
                                autoComplete="off"
                                dir="rtl"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className={searchInputClass}
                            />
                        </div>
                    </div>
                }
            />

            {/* الفلاتر */}
            <section className="mx-auto max-w-[1280px] px-4 py-8">
                {/* فئات سريعة */}
                {!loading && topCategories.length > 0 && (
                    <div className="mb-6 flex flex-wrap items-center gap-2">
                        <span className="text-[12px] font-bold text-[#5A7A6C]">التخصصات الشائعة:</span>
                        {topCategories.map((cat) => (
                            <UiButton
                                key={cat.name}
                                variant="ghost"
                                onClick={() => setActiveCategory((c) => (c === cat.name ? '' : cat.name))}
                                className={`!rounded-full !px-3 !py-1.5 !text-[11.5px] transition ${activeCategory === cat.name ? '!border-[#006C35] !bg-[#006C35] !text-white' : '!border-[rgba(0,108,53,.14)] !bg-[#006C35]/5 !text-[#1E3D2E] hover:!bg-[#006C35]/10'}`}
                            >
                                {cat.name} ({cat.count})
                            </UiButton>
                        ))}
                    </div>
                )}

                {/* العدادات */}
                <div className="mb-5 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#006C35]/8 px-2.5 py-1 text-[11px] font-bold text-[#006C35]">
                        <i className="ti ti-user-heart text-[12px]"></i>
                        <span>{filtered.length}</span> <span>مستشار</span>
                    </span>
                    {query && (
                        <UiButton
                            variant="ghost"
                            onClick={() => setQuery('')}
                            className="!border-0 !bg-transparent !p-0 !text-[12px] !text-[#006C35] hover:!bg-transparent"
                        >
                            <i className="ti ti-x mr-1"></i>مسح البحث
                        </UiButton>
                    )}
                </div>

                {/* القائمة */}
                {loading ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-52 animate-pulse rounded-2xl border border-[rgba(0,108,53,.08)] bg-white" />
                        ))}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="mx-auto max-w-md rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                        <i className="ti ti-user-off text-3xl text-[#006C35]"></i>
                        <p className="mt-3 text-sm font-bold text-slate-600">لا يوجد مستشارون مطابقون</p>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {filtered.map((c) => (
                            <Link key={c.id} to={`/consultants/${c.id}`} className="cc-card">
                                <div className="cc-body">
                                    <div className="flex items-start gap-3">
                                        <div className="flex h-[56px] w-[56px] shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[#F0F4F0] text-xl font-black text-[#006C35]">
                                            {c.logo ? (
                                                <img src={c.logo} alt={c.name_ar} className="h-full w-full object-cover" />
                                            ) : (
                                                String(c.name_ar || 'م').charAt(0)
                                            )}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-2">
                                                <h3 className="truncate text-[15px] font-bold text-[#0A1F14]">{c.name_ar}</h3>
                                                {c.is_verified && <span className="shrink-0 rounded-full bg-[#006C35]/8 px-2 py-0.5 text-[10px] font-bold text-[#006C35]">موثّق ✓</span>}
                                            </div>
                                            <div className="mt-0.5 text-[12px] text-[#5A7A6C]">
                                                {c.city || c.region || ''}
                                            </div>
                                        </div>
                                    </div>

                                    {c.bio && <p className="mt-3 line-clamp-2 text-[12.5px] leading-relaxed text-[#5A7A6C]">{c.bio}</p>}

                                    {c.specialties?.length > 0 && (
                                        <div className="mt-3 flex flex-wrap gap-1.5">
                                            {c.specialties.slice(0, 3).map((s) => (
                                                <span key={s.id} className="rounded-md bg-[#F0F4F0] px-2 py-0.5 text-[11px] font-semibold text-[#1E3D2E]">{s.name_ar}</span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className="cc-foot">
                                    <span>{c.completed_consultations_count ?? 0} استشارة منجزة</span>
                                    <span className="flex items-center gap-1 font-bold text-[#006C35]">
                                        التفاصيل <i className="ti ti-arrow-left"></i>
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </section>

            <Footer />
        </>
    );
}