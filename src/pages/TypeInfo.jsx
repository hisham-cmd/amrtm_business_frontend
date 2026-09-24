import { Link, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import CuHero from '../components/CuHero';
import Footer from '../components/Footer';

const TYPE_INFO = {
    law: {
        title: 'مكاتب المحاماة',
        icon: 'ti-scale',
        intro: 'مكاتب المحاماة المعتمدة في منصة آمر تم تقدم خدمات قانونية متخصصة للأفراد وقطاع الأعمال.',
        points: [
            'صياغة ومراجعة العقود والاتفاقيات التجارية',
            'التمثيل القانوني أمام الجهات القضائية والإدارية',
            'الاستشارات القانونية للشركات والمنشآت',
            'التوثيق والاعتماد النظامي للمعاملات',
            'متابعة القضايا التجارية والعمالية',
        ],
        cta: 'اطلب خدمة قانونية الآن',
        route: '/offices/law',
    },
    accounting: {
        title: 'الاستشارات المالية والضريبية',
        icon: 'ti-calculator',
        intro: 'مكاتب متخصصة في المحاسبة والاستشارات المالية والضريبية لخدمة منشآت الأعمال.',
        points: [
            'خدمات المحاسبة والمراجعة الداخلية',
            'الاستشارات الضريبية والتزامات الزكاة والضريبة',
            'إعداد القوائم المالية والتقارير',
            'التخطيط المالي وإدارة التكاليف',
        ],
        cta: 'اطلب استشارة مالية',
        route: '/offices/accounting',
    },
    engineering: {
        title: 'الاستشارات الهندسية',
        icon: 'ti-building',
        intro: 'استشاريون هندسيون معتمدون لمختلف التخصصات والمشاريع.',
        points: [
            'الاستشارات الهندسية والمعمارية',
            'الإشراف على المشاريع',
            'المخططات والتصاميم',
            'دراسات الجدوى الفنية',
        ],
        cta: 'اطلب استشارة هندسية',
        route: '/offices/engineering',
    },
    customs: {
        title: 'شركات التخليص الجمركي',
        icon: 'ti-address-book',
        intro: 'شركات معتمدة للتخليص الجمركي وإجراءات الاستيراد والتصدير.',
        points: [
            'التخليص الجمركي للبضائع',
            'إجراءات الاستيراد والتصدير',
            'الاستشارات الجمركية',
            'متابعة الشحنات والبيانات الجمركية',
        ],
        cta: 'اطلب خدمة تخليص جمركي',
        route: '/offices/customs',
    },
    services: {
        title: 'مكاتب الخدمات والتعقيب',
        icon: 'ti-briefcase',
        intro: 'مكاتب متخصصة في الخدمات العامة وتعقيب المعاملات لدى الجهات الحكومية.',
        points: [
            'تعقيب المعاملات الحكومية',
            'خدمات إصدار وتجديد الوثائق',
            'خدمات قطاع الأعمال المساندة',
            'المتابعة والتوثيق الإلكتروني',
        ],
        cta: 'اطلب خدمة تعقيب',
        route: '/offices/services',
    },
    freelance: {
        title: 'أصحاب المهن الحرة',
        icon: 'ti-user',
        intro: 'أصحاب المهن الحرة والمتخصصون المعتمدون لتقديم خدماتهم.',
        points: [
            'خدمات المهن الحرة المتخصصة',
            'الاستشارات الفردية',
            'خدمات موثقة ومعتمدة',
        ],
        cta: 'تصفح المهن الحرة',
        route: '/offices/freelance',
    },
};

/**
 * صفحة معلومات أنواع المكاتب — تعادل routes /{type}-info في blade.
 */
export default function TypeInfo() {
    const { type } = useParams();
    const info = TYPE_INFO[type] || TYPE_INFO.services;

    return (
        <>
            <Navbar active="services" />
            <CuHero
                breadcrumb={
                    <ol className="flex flex-wrap items-center gap-1.5 text-[12px] text-white/55">
                        <li><Link to="/" className="inline-flex items-center gap-1 font-semibold text-white/70 no-underline hover:text-white"><i className="ti ti-home-2 text-[13px]"></i><span>الرئيسية</span></Link></li>
                        <li className="text-white/25"><i className="ti ti-chevron-left text-[10px]"></i></li>
                        <li className="font-bold text-white">{info.title}</li>
                    </ol>
                }
                title={info.title}
                badge={<i className={`ti ${info.icon} text-[12px]`}></i>}
                subtitle={info.intro}
            />

            <section className="mx-auto max-w-[900px] px-4 py-10">
                <div className="rounded-2xl border border-[rgba(0,108,53,.08)] bg-white p-6 shadow-[0_8px_24px_-8px_rgba(0,30,15,.1)] md:p-8">
                    <p className="text-[15px] leading-loose text-[#1E3D2E]">{info.intro}</p>
                    <ul className="mt-5 space-y-3">
                        {info.points.map((p, i) => (
                            <li key={i} className="flex items-start gap-3 text-[14px] text-[#0A1F14]">
                                <i className="ti ti-circle-check mt-0.5 text-[#006C35]"></i>
                                {p}
                            </li>
                        ))}
                    </ul>
                    <Link to={info.route} className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#006C35] px-6 py-3 text-sm font-black text-white no-underline transition hover:bg-[#00843D]">
                        {info.cta} <i className="ti ti-arrow-left"></i>
                    </Link>
                </div>
            </section>

            <Footer />
        </>
    );
}