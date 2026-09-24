/**
 * مكوّن CuHero — مطابق 1:1 لـ components/cui/hero.blade.php
 */
export default function CuHero({ breadcrumb, title, badge, subtitle, side, search, info }) {
    const hasExtras = Boolean(badge) || Boolean(subtitle);

    return (
        <section className="cui-hero">
            <div className="relative mx-auto w-full max-w-[1280px] !px-4 !py-3 md:!px-6 md:!py-4">
                {breadcrumb && (
                    <nav aria-label="breadcrumb" className="!mb-3">
                        {breadcrumb}
                    </nav>
                )}

                <div className={`cui-hero-row ${search ? 'cui-hero-row--search' : ''}`}>
                    {search ? (
                        <>
                            <div className="cui-hero-titleblock">
                                {hasExtras && (
                                    <div className="cui-hero-extras">
                                        <h1 className="cui-f1-title text-xl font-black leading-[1.15] text-white md:text-[30px]">
                                            {title}
                                        </h1>
                                    </div>
                                )}
                            </div>
                            <div className="cui-hero-search">
                                {subtitle && (
                                    <p className="cui-hs-label mb-2.5 max-w-lg text-[13px] font-bold leading-relaxed text-white md:text-[15px]">
                                        {subtitle}
                                    </p>
                                )}
                                {search}
                            </div>
                            {side && <div className="cui-hero-side">{side}</div>}
                        </>
                    ) : (
                        <>
                            {hasExtras && (
                                <div className="cui-hero-extras">
                                    {badge && <div className="cui-f1-top">{badge}</div>}
                                    <div className="cui-f1-bottom">
                                        {subtitle && (
                                            <p className="my-2 max-w-lg text-[13px] leading-relaxed text-white md:text-[14px]">
                                                {subtitle}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}
                            <div className="cui-hero-title">
                                <h1 className="cui-f1-title text-xl font-black leading-[1.15] text-white md:text-[30px]">
                                    {title}
                                </h1>
                            </div>
                            {side && <div className="cui-hero-side">{side}</div>}
                        </>
                    )}
                </div>

                {info && (
                    <div className="mt-3 flex justify-center lg:justify-end">
                        {info}
                    </div>
                )}
            </div>
        </section>
    );
}