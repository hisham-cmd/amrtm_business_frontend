import { useEffect, useMemo, useState } from 'react';
import api from '../api/client';

export default function Consultants() {
    const [consultants, setConsultants] = useState([]);
    const [specialties, setSpecialties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState('');

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
        if (!query.trim()) return consultants;
        const q = query.trim().toLowerCase();
        return consultants.filter((c) =>
            [c.name_ar, c.name_en, c.city, ...(c.specialties || []).map((s) => s.name_ar)]
                .filter(Boolean)
                .some((v) => String(v).toLowerCase().includes(q))
        );
    }, [consultants, query]);

    const topSpecialties = useMemo(() => [...specialties].sort((a, b) => b.consultants_count - a.consultants_count).slice(0, 8), [specialties]);

    return (
        <main className="mx-auto max-w-7xl px-4 py-10">
            <div className="text-center">
                <h1 className="section-title">دليل المستشارين</h1>
                <p className="mt-2 text-gray-500">تواصل مع مستشارين معتمدين في مختلف التخصصات</p>
            </div>

            {/* بحث */}
            <div className="mt-6 max-w-xl mx-auto">
                <input
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="ابحث باسم المستشار أو التخصص أو المدينة..."
                    className="input"
                />
            </div>

            {/* تخصصات شائعة */}
            {!loading && topSpecialties.length > 0 && !query && (
                <div className="mt-6 flex flex-wrap justify-center gap-2">
                    {topSpecialties.map((s) => (
                        <span key={s.id} className="rounded-full border border-primary/30 bg-primary-light px-3 py-1 text-xs font-semibold text-primary">
                            {s.name_ar} ({s.consultants_count})
                        </span>
                    ))}
                </div>
            )}

            {/* القائمة */}
            <div className="mt-10">
                {loading ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="card h-48 animate-pulse !bg-gray-100" />
                        ))}
                    </div>
                ) : filtered.length === 0 ? (
                    <p className="text-center text-gray-500">لا توجد نتائج مطابقة.</p>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {filtered.map((c) => (
                            <div key={c.id} className="card transition hover:-translate-y-1 hover:shadow-lg">
                                <div className="flex items-start gap-3">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-light text-lg font-bold text-primary">
                                        {c.name_ar?.charAt(0) || 'م'}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-bold text-gray-900">{c.name_ar}</h3>
                                            {c.is_verified && (
                                                <span className="rounded-full bg-primary-light px-2 py-0.5 text-[10px] font-bold text-primary">موثّق ✓</span>
                                            )}
                                        </div>
                                        {c.city && <p className="text-xs text-gray-500">{c.city}{c.region ? ` — ${c.region}` : ''}</p>}
                                    </div>
                                </div>

                                {c.bio && <p className="mt-3 line-clamp-2 text-sm text-gray-600">{c.bio}</p>}

                                {c.specialties?.length > 0 && (
                                    <div className="mt-3 flex flex-wrap gap-1.5">
                                        {c.specialties.slice(0, 4).map((s) => (
                                            <span key={s.id} className="rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-600">{s.name_ar}</span>
                                        ))}
                                    </div>
                                )}

                                <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                                    <span>{c.completed_consultations ?? c.completed_consultations_count ?? 0} استشارة منجزة</span>
                                    <span className="font-semibold text-primary">{c.total_requests_count ?? 0} طلب</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}