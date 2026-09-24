import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/client';
import UiButton from '../components/ui/UiButton';

export default function Services() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [params, setParams] = useSearchParams();
    const activeCategory = Number(params.get('category')) || null;

    useEffect(() => {
        api.get('/services')
            .then(({ data }) => setCategories(data))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    const active = categories.find((c) => c.id === activeCategory) || null;

    return (
        <main className="mx-auto max-w-7xl px-4 py-10">
            <h1 className="section-title">الخدمات</h1>
            <p className="mt-2 text-gray-500">تصفح الخدمات حسب التصنيف والجهة</p>

            {/* شريط التصنيفات */}
            <div className="mt-6 flex flex-wrap gap-2">
                <UiButton
                    variant="ghost"
                    size="sm"
                    onClick={() => setParams({})}
                    className={`!rounded-full !px-4 !py-1.5 text-sm font-semibold transition ${!activeCategory ? '!bg-primary text-white' : '!bg-gray-100 text-gray-600 hover:!bg-gray-200'}`}
                    aria-pressed={!activeCategory}
                >
                    الكل
                </UiButton>
                {categories.map((cat) => (
                    <UiButton
                        key={cat.id}
                        variant="ghost"
                        size="sm"
                        onClick={() => setParams({ category: cat.id })}
                        className={`!rounded-full !px-4 !py-1.5 text-sm font-semibold transition ${activeCategory === cat.id ? '!bg-primary text-white' : '!bg-gray-100 text-gray-600 hover:!bg-gray-200'}`}
                        aria-pressed={activeCategory === cat.id}
                    >
                        {cat.name_ar}
                    </UiButton>
                ))}
            </div>

            {loading ? (
                <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">{/* skeleton */}</div>
            ) : (
                <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {(active ? [active] : categories).map((cat) => (
                        <div key={cat.id} className="card md:col-span-2 lg:col-span-1">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg text-xl" style={{ backgroundColor: cat.bg || '#E8F5EE' }}>
                                    {cat.icon || '🏛️'}
                                </div>
                                <div>
                                    <h2 className="font-bold text-gray-900">{cat.name_ar}</h2>
                                    <p className="text-xs text-gray-500">{cat.name_en}</p>
                                </div>
                            </div>

                            <div className="mt-4 space-y-4">
                                {(cat.entities || []).map((ent) => (
                                    <div key={ent.id} className="rounded-lg border border-gray-100 p-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <span className="text-lg">{ent.icon || '📌'}</span>
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-800">{ent.name_ar}</p>
                                                    {ent.tag_ar && <p className="text-xs text-primary">{ent.tag_ar}</p>}
                                                </div>
                                            </div>
                                            <span className="text-xs font-medium text-gray-400">{(ent.services || []).length} خدمة</span>
                                        </div>

                                        <div className="mt-2 space-y-1.5">
                                            {(ent.services || []).map((svc) => (
                                                <div key={svc.id} className="flex items-center justify-between rounded-md bg-gray-50 px-3 py-2 text-sm">
                                                    <span className="text-gray-700">{svc.name_ar}</span>
                                                    <span className="flex items-center gap-3">
                                                        {svc.duration && <span className="text-xs text-gray-400">{svc.duration}</span>}
                                                        <span className="font-bold text-primary">{svc.price > 0 ? `${svc.price} ر.س` : 'مجاني'}</span>
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </main>
    );
}