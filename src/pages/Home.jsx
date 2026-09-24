import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import Navbar from '../components/Navbar';
import UiButton from '../components/ui/UiButton';
import UiLink from '../components/ui/UiLink';

const OFFICE_LINKS = [
    { type: 'law', label: 'مكاتب المحاماة', icon: 'fa-scale-balanced', grad: 'linear-gradient(135deg,#006C35,#00843D)' },
    { type: 'services', label: 'مكاتب الخدمات والتعقيب', icon: 'fa-briefcase', grad: 'linear-gradient(135deg,#bd15c0,#c71ee5)' },
    { type: 'customs', label: 'شركات التخليص الجمركي', icon: 'fa-address-book', grad: 'linear-gradient(135deg,#2182f0,#0688eb)' },
    { type: 'accounting', label: 'الاستشارات المالية والضريبية', icon: 'fa-calculator', grad: 'linear-gradient(135deg,#2207a7,#0b05d1)' },
    { type: 'engineering', label: 'الاستشارات الهندسية', icon: 'fa-building', grad: 'linear-gradient(135deg,#f69d03,#e9a403)' },
    { type: 'freelance', label: 'أصحاب المهن الحرة', icon: 'fa-user', grad: 'linear-gradient(135deg,#00695C,#00897B)' },
];

const CAT_COLORS = {
    ministries: '#3B82F6',
    authorities: '#A855F7',
    companies: '#22C55E',
    embassies: '#06B6D4',
    consultants: '#F97316',
};

/**
 * الصفحة الرئيسية — مطابقة 1:1 لـ update_service/index.blade.php
 * (نفس الأصناف والبنية، البيانات من GET /api/v1/home).
 */
export default function Home() {
    const [data, setData] = useState(null);
    const [activeSlide, setActiveSlide] = useState(0);
    const [vidOpen, setVidOpen] = useState(false);
    const [lgmOpen, setLgmOpen] = useState(false);
    const heroSliderRef = useRef(null);

    useEffect(() => {
        api.get('/home')
            .then(({ data: d }) => setData(d))
            .catch((e) => console.error('home API error', e));
    }, []);

    const slides = data?.homepageSlides?.length
        ? data.homepageSlides
        : [
              { id: 'fb1', title: 'fallback1', image_url: '/images/slide-riyadh-business.jpg' },
              { id: 'fb2', title: 'fallback2', image_url: '/images/slide-kafd.jpg' },
          ];

    // سلايدر تلقائي كل 6 ثوانٍ
    useEffect(() => {
        const t = setInterval(() => setActiveSlide((s) => (s + 1) % slides.length), 6000);
        return () => clearInterval(t);
    }, [slides.length]);

    const settings = data?.homepageSettings || {};
    const media = data?.homepageMedia || {
        video_file: '/videos/0829.mp4',
        video_poster: '/images/logo2.jpg',
    };
    const categories = data?.categories || [];
    const officeCounts = data?.officeCounts || {};
    const catWordCount = (name) => (name ? String(name).trim().split(/\s+/).filter(Boolean).length : 0);

    return (
        <>
            <Navbar active="home" />

            {/* HERO */}
            <section className="hero">
                {/* سلايدر */}
                <div className="hero-slider" id="heroSlider">
                    {slides.map((s, i) => (
                        <div
                            key={s.id ?? i}
                            className={`hero-slide ${i === activeSlide ? 'active' : ''}`}
                            style={{ backgroundImage: `url('${s.image_url}')` }}
                        />
                    ))}
                </div>
                <div className="hero-slider-dots" id="heroSliderDots" style={{ display: 'flex' }}>
                    {slides.map((s, i) => (
                        <div
                            key={`dot-${s.id ?? i}`}
                            className={`hero-slider-dot ${i === activeSlide ? 'active' : ''}`}
                            data-index={i}
                            onClick={() => setActiveSlide(i)}
                        />
                    ))}
                </div>
                <div className="hero-slider-arrow prev" onClick={() => setActiveSlide((s) => (s - 1 + slides.length) % slides.length)}>
                    <i className="fa fa-chevron-right"></i>
                </div>
                <div className="hero-slider-arrow next" onClick={() => setActiveSlide((s) => (s + 1) % slides.length)}>
                    <i className="fa fa-chevron-left"></i>
                </div>

                {/* قسم عن المنصة */}
                <div className="about-one-wrap">
                    <div className="about-one__right">
                        <Link to="/create-contract" className="ao-floating-contract" data-create-contract>
                            <i className="fa fa-file-signature"></i>
                            {settings['contract_button_text'] || 'عقود نظامية متاحة حسب النشاط'}
                        </Link>
                        <div className="section-title text-right">
                            <br />
                            <h2 className="section-title__title" id="ao-title">
                                {settings['site_title'] || 'منصة آمر تم لخدمات قطاع الأعمال'}
                            </h2>
                        </div>
                        <p className="about-one__text" id="ao-desc">
                            {settings['site_subtitle'] || 'منصة تعمل وفق مفهوم النافذة الواحدة لاستقبال طلبات العملاء وإنجاز معاملاتهم عبر شبكة من الشركاء والمتخصصين.'}
                        </p>
                    </div>
                    <div className="about-one__left">
                        <div className="about-one__img-box">
                            <div
                                className="about-one__img"
                                onClick={() => setVidOpen(true)}
                                style={{ cursor: 'pointer', position: 'relative', overflow: 'hidden', borderRadius: '24px', boxShadow: '0 15px 40px rgba(0,0,0,0.25)', border: '1.5px solid rgba(255,255,255,0.25)' }}
                            >
                                <img
                                    src={media.video_poster}
                                    alt="منصة أمر تم"
                                    loading="lazy"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.4s ease' }}
                                />
                                <div className="about-one__video-overlay" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,25,12,0.2) 0%, rgba(0,70,35,0.85) 100%)', pointerEvents: 'none' }} />
                                <div className="about-one__video-link" style={{ position: 'absolute', top: '42%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 3, pointerEvents: 'auto' }}>
                                    <div className="about-one__video-icon" style={{ width: '52px', height: '52px', margin: '0 auto' }}>
                                        <span className="fa fa-play" style={{ fontSize: '16px', color: '#fff', marginRight: '-2px' }}></span>
                                        <i className="ripple"></i>
                                    </div>
                                </div>
                                <div className="about-one__video-label" style={{ position: 'absolute', bottom: '10px', left: '8px', right: '8px', zIndex: 3, textAlign: 'center', background: 'rgba(0,0,0,0.48)', backdropFilter: 'blur(8px)', padding: '6px 8px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.2)', pointerEvents: 'none' }}>
                                    <span style={{ color: '#ffffff', fontSize: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                                        <i className="fa fa-circle-play" style={{ color: '#2ecc71', fontSize: '13px' }}></i>
                                        فيديو تعريفي عن الخدمات
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* بطاقات التصنيفات */}
                <div className="offices-sec" id="offices-sec">
                    <div className="offices-inner">
                        <div className="ao-tagline-wrap">
                            <span className="ao-line-right"></span>
                            <span className="ao-title-main">
                                <span id="ao-tagline">
                                    {settings['site_tagline'] || 'أختر الخدمة المطلوبة من خلال الجهات التالية'}
                                </span>
                            </span>
                            <span className="ao-line-left"></span>
                        </div>

                        <div className="about-one__cards-grid">
                            {categories.length > 0 ? (
                                categories.map((cat) => {
                                    const color = CAT_COLORS[cat.key] || cat.color || '#00A651';
                                    const wc = catWordCount(cat.name_ar);
                                    return (
                                        <Link
                                            key={cat.id}
                                            to={`/catalog/${cat.key}`}
                                            className={`ao-card ${wc === 2 ? 'ao-card--sm' : ''}`}
                                            style={{ '--cc': color }}
                                        >
                                            <div className="ao-card-body">
                                                <div className="ao-card-nm">{cat.name_ar}</div>
                                            </div>
                                            <div className="ao-card-foot">
                                                {cat.entities_count > 0 && <span className="ao-card-tag">{cat.entities_count} جهة</span>}
                                                <i className="fa fa-arrow-left ao-card-arr"></i>
                                            </div>
                                        </Link>
                                    );
                                })
                            ) : (
                                <>
                                    <Link to="/catalog/ministries" className="ao-card" style={{ '--cc': '#3B82F6' }}>
                                        <div className="ao-card-body"><div className="ao-card-nm">الــــــوزارات</div></div>
                                        <div className="ao-card-foot"><span className="ao-card-tag">0 جهة</span><i className="fa fa-arrow-left ao-card-arr"></i></div>
                                    </Link>
                                    <Link to="/catalog/authorities" className="ao-card" style={{ '--cc': '#A855F7' }}>
                                        <div className="ao-card-body"><div className="ao-card-nm">الهيئات</div></div>
                                        <div className="ao-card-foot"><span className="ao-card-tag">0 جهة</span><i className="fa fa-arrow-left ao-card-arr"></i></div>
                                    </Link>
                                    <Link to="/catalog/companies" className="ao-card ao-card--sm" style={{ '--cc': '#22C55E' }}>
                                        <div className="ao-card-body"><div className="ao-card-nm">الشركات الحكومية</div></div>
                                        <div className="ao-card-foot"><span className="ao-card-tag">0 جهة</span><i className="fa fa-arrow-left ao-card-arr"></i></div>
                                    </Link>
                                    <Link to="/catalog/embassies" className="ao-card" style={{ '--cc': '#06B6D4' }}>
                                        <div className="ao-card-body"><div className="ao-card-nm">السفارات والقنصليات والمنظمات</div></div>
                                        <div className="ao-card-foot"><span className="ao-card-tag">0 جهة</span><i className="fa fa-arrow-left ao-card-arr"></i></div>
                                    </Link>
                                </>
                            )}

                            <Link to="/consultants" className="ao-card" style={{ '--cc': '#F97316' }}>
                                <div className="ao-card-body"><div className="ao-card-nm">المستشارين</div></div>
                                <div className="ao-card-foot">
                                    {officeCounts.consultants > 0 && <span className="ao-card-tag">{officeCounts.consultants} مستشار</span>}
                                    <i className="fa fa-arrow-left ao-card-arr"></i>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* المكاتب */}
                <div className="offices-sec" id="offices-sec2">
                    <div className="offices-inner offices-inner2">
                        <div className="s-ttl" id="off-ttl">مكاتب المستشارين والشركات المهنية المتخصصة المساندة لتقديم الخدمات لعملاء منصة أمر تم</div>
                        <div className="off-cards-grid">
                            {OFFICE_LINKS.map((o) => (
                                <Link key={o.type} to={`/offices/${o.type}`} className="fs-off">
                                    <div className="fs-off-icon" style={{ background: o.grad }}>
                                        <i className={`fa ${o.icon}`}></i>
                                    </div>
                                    <div className="fs-off-name">{o.label}</div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* مودال الفيديو */}
            {vidOpen && (
                <div className="vm" id="vm" onClick={(e) => { if (e.target === e.currentTarget) setVidOpen(false); }}>
                    <div className="vm-in">
                        <div className="vm-x" onClick={() => setVidOpen(false)}><i className="fa fa-xmark"></i></div>
                        <video controls playsInline preload="auto" style={{ width: '100%', height: 'auto', maxHeight: '80vh', display: 'block', background: '#000' }}>
                            <source src={media.video_file} type="video/mp4" />
                            المتصفح لا يدعم تشغيل هذا الفيديو.
                        </video>
                    </div>
                </div>
            )}

            {/* مودال تسجيل الدخول */}
            {lgmOpen && (
                <div className="em" id="lgm" onClick={(e) => { if (e.target === e.currentTarget) setLgmOpen(false); }} style={{ zIndex: 700 }}>
                    <div className="em-box" style={{ maxWidth: '440px' }}>
                        <div className="em-hd" style={{ background: 'linear-gradient(135deg,#006C35,#00843D)' }}>
                            <div className="em-hd-ico"><i className="fa fa-lock"></i></div>
                            <div>
                                <div className="em-hd-nm">تسجيل الدخول مطلوب</div>
                                <div className="em-hd-sb">يجب تسجيل الدخول لتقديم طلب خدمة</div>
                            </div>
                            <UiButton variant="ghost" size="sm" className="!border-0 !bg-transparent !p-1" onClick={() => setLgmOpen(false)} aria-label="إغلاق"><i className="fa fa-xmark"></i></UiButton>
                        </div>
                        <div style={{ padding: '2rem 1.6rem', textAlign: 'center' }}>
                            <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'rgba(0,108,53,.1)', border: '2px solid rgba(0,108,53,.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.2rem', fontSize: '30px', color: '#006C35' }}>
                                <i className="fa fa-circle-user"></i>
                            </div>
                            <p style={{ fontSize: '14px', color: '#004D28', lineHeight: '1.8', marginBottom: '1.6rem' }}>لتقديم طلب خدمة يجب أن يكون لديك حساب مسجل في المنصة. سجّل دخولك أو أنشئ حساباً جديداً مجاناً.</p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '.75rem' }}>
                                <Link to="/login" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', height: '48px', borderRadius: '12px', background: 'linear-gradient(135deg,#006C35,#00843D)', color: '#fff', fontFamily: 'inherit', fontSize: '14.5px', fontWeight: 800, textDecoration: 'none', transition: 'opacity .2s' }}>
                                    <i className="fa fa-right-to-bracket"></i> <span>تسجيل الدخول</span>
                                </Link>
                                <Link to="/login?mode=register" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', height: '48px', borderRadius: '12px', background: 'transparent', color: '#006C35', fontFamily: 'inherit', fontSize: '14px', fontWeight: 700, textDecoration: 'none', border: '1.5px solid rgba(0,108,53,.2)', transition: 'background .2s' }}>
                                    <i className="fa fa-user-plus"></i> <span>إنشاء حساب جديد</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* الفوتر — من الصفحة الرئيسية نفسها */}
            <footer className="footer">
                <div className="f-main">
                    <div className="f-right">
                        <div className="f-lr">
                            <div className="f-lic">
                                <img src="/images/new-logo1.png" alt="آمر تم" style={{ width: 52, height: 52, objectFit: 'contain' }} />
                            </div>
                            <div>
                                <div className="f-lnm">آمر تم</div>
                                <div className="f-lsb">لقطاع الأعمال</div>
                            </div>
                        </div>
                        <p className="f-ab">منصة إلكترونية متكاملة لخدمة الأفراد وقطاع الأعمال</p>
                    </div>

                    <div className="f-soc">
                        <UiLink className="fsoc" href="https://x.com/amrtmcomsa" aria-label="X"><i className="fa fa-x-twitter"></i></UiLink>
                        <UiLink className="fsoc" href="https://www.linkedin.com/in/amrtm-com-sa/" aria-label="LinkedIn"><i className="fa fa-linkedin"></i></UiLink>
                        <UiLink className="fsoc" href="https://www.instagram.com/amrtm.com.sa/" aria-label="Instagram"><i className="fa fa-instagram"></i></UiLink>
                        <UiLink className="fsoc" href="https://wa.me/966504915222" aria-label="WhatsApp"><i className="fa fa-whatsapp"></i></UiLink>
                    </div>

                    <p className="f-copy">© 2025 جميع الحقوق محفوظة لـ <b>آمر تم</b></p>

                    <div className="f-left">
                        <div className="f-contact">
                            <span className="f-call-lbl">{settings['main_office_label'] || 'المكتب الرئيسي'}</span>
                            <UiLink className="f-call" href={`tel:+${settings['contact_phone'] || '966920002164'}`}>
                                <i className="fa fa-phone"></i>
                                <span>{settings['contact_phone'] || '966920002164'}</span>
                            </UiLink>
                            <UiLink className="f-wa" href={`https://wa.me/${settings['contact_whatsapp'] || '966504915222'}`}>
                                <i className="fa fa-whatsapp"></i>
                                <span>واتساب</span>
                            </UiLink>
                        </div>
                        <UiButton variant="ghost" size="sm" className="!border-0 !bg-transparent !p-0 !text-inherit fbl">سياسة الخصوصية</UiButton>
                        <UiButton variant="ghost" size="sm" className="!border-0 !bg-transparent !p-0 !text-inherit fbl">شروط الاستخدام</UiButton>
                        <UiButton variant="ghost" size="sm" className="!border-0 !bg-transparent !p-0 !text-inherit fbl">تواصل معنا</UiButton>
                    </div>
                </div>
            </footer>

            {/* شريط تواصل ثابت */}
            <div className="cb" id="contact">
                <span className="cb-lbl">المكتب الرئيسي</span>
                <UiLink className="cb-call" href="tel:+966920002164"><i className="fa fa-phone"></i><span>966920002164</span></UiLink>
                <UiLink className="cb-wa" href="https://wa.me/966504915222"><i className="fa fa-whatsapp"></i><span>واتساب</span></UiLink>
            </div>
        </>
    );
}