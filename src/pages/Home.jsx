import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';

export default function Home() {
    const [categories, setCategories] = useState([]);
    const [officeTypes, setOfficeTypes] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([api.get('/services'), api.get('/office-types')])
            .then(([catRes, ofRes]) => {
                setCategories(catRes.data);
                setOfficeTypes(ofRes.data || {});
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    const typeLabels = {
        law: 'مكاتب المحاماة',
        services: 'مكاتب الخدمات',
        customs: 'مكاتب التخليص الجمركي',
        consultants: 'المستشارون',
    };

    return (
        <main>
            {/* Hero */}
            <section className="bg-gradient-to-b from-primary-light to-gray-50">
                <div className="mx-auto max-w-7xl px-4 py-16 text-center md:py-24">
                    <h1 className="text-3xl font-extrabold leading-tight text-gray-900 md:text-5xl">
                        منصة آمر تم
                        <br />
                        <span className="text-primary">لإنجاز أعمالك بسهولة</span>
                    </h1>
                    <p className="mx-auto mt-4 max-w-2xl text-gray-600 md:text-lg">
                        خدمات حكومية، استشارات مهنية، ومكاتب معتمدة — كل ما تحتاجه في مكان واحد
                    </p>
                    <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                        <Link to="/services" className="btn-primary !px-8 !py-3 !text-base">تصفح الخدمات</Link>
                        <Link to="/consultants" className="btn-outline !px-8 !py-3 !text-base">استشارات</Link>
                    </div>

                    {!loading && (
                        <div className="mx-auto mt-12 grid max-w-3xl grid-cols-2 gap-4 md:grid-cols-4">
                            {Object.entries(typeLabels).map(([key, label]) => (
                                <div key={key} className="card !p-4 text-center">
                                    <p className="text-2xl font-extrabold text-primary">{officeTypes[key] ?? 0}</p>
                                    <p className="mt-1 text-xs text-gray-500">{label}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* التصنيفات */}
            <section className="mx-auto max-w-7xl px-4 py-14">
                <div className="mb-8 text-center">
                    <h2 className="section-title">تصنيفات الخدمات</h2>
                    <p className="mt-2 text-gray-500">اختر التصنيف المناسب لتبدأ</p>
                </div>
                {loading ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="card h-40 animate-pulse !bg-gray-100" />
                        ))}
                    </div>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {categories.map((cat) => (
                            <Link key={cat.id} to={`/services?category=${cat.id}`} className="card group transition hover:-translate-y-1 hover:shadow-lg">
                                <div className="flex h-12 w-12 items-center justify-center rounded-lg text-2xl" style={{ backgroundColor: cat.bg || '#E8F5EE' }}>
                                    {cat.icon || '🏛️'}
                                </div>
                                <h3 className="mt-4 text-lg font-bold text-gray-900 group-hover:text-primary">{cat.name_ar}</h3>
                                <p className="mt-1 text-sm text-gray-500">{cat.name_en}</p>
                                <p className="mt-3 text-xs font-semibold text-primary">{(cat.entities || []).length} جهة</p>
                            </Link>
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}