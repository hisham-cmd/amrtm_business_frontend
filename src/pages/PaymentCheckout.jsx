import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import UiButton from '../components/ui/UiButton';
import UiInput from '../components/ui/UiInput';

const METHODS = [
    { key: 'mada', label: 'مدى', icon: 'ti-credit-card' },
    { key: 'visa', label: 'Visa', icon: 'ti-brand-visa' },
    { key: 'mastercard', label: 'Mastercard', icon: 'ti-brand-mastercard' },
    { key: 'applepay', label: 'Apple Pay', icon: 'ti-brand-apple' },
];

const MIN = 10;

/**
 * صفحة الدفع الآمن — تعادل payment_checkout.blade.php
 */
export default function PaymentCheckout() {
    const { user, loading: authLoading } = useAuth();

    const [amount, setAmount] = useState(MIN.toFixed(2));
    const [method, setMethod] = useState('mada');
    const [card, setCard] = useState({ pan: '4000 0000 0000 0002', exp: '08/28', cvv: '123' });
    const [done, setDone] = useState(null);

    if (authLoading) return <div className="p-12 text-center text-gray-400">جارٍ التحميل...</div>;
    if (!user) return <Navigate to="/login" replace />;

    const amt = parseFloat(String(amount).replace(/[, ]/g, '')) || 0;
    const valid = !isNaN(amt) && amt >= MIN && amt <= 100000;
    const extra = valid ? amt - MIN : 0;
    const fmt = (n) => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    const onPan = (v) => {
        const digits = String(v).replace(/\D/g, '').slice(0, 16);
        setCard((c) => ({ ...c, pan: digits.replace(/(\d{4})(?=\d)/g, '$1 ') }));
    };
    const onExp = (v) => {
        const digits = String(v).replace(/\D/g, '').slice(0, 4);
        setCard((c) => ({ ...c, exp: digits.length > 2 ? digits.slice(0, 2) + '/' + digits.slice(2) : digits }));
    };
    const onCvv = (v) => setCard((c) => ({ ...c, cvv: String(v).replace(/\D/g, '').slice(0, 4) }));

    if (done) {
        return (
            <>
                <Navbar />
                <div className="flex min-h-[calc(100vh-72px)] items-center justify-center bg-surface px-4 py-12">
                    <div className="w-full max-w-md rounded-3xl border border-cui-border bg-white p-10 text-center shadow-xl">
                        <div className={`mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full text-4xl ${done === 'success' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'}`}>
                            <i className={`ti ${done === 'success' ? 'ti-circle-check' : 'ti-circle-x'}`}></i>
                        </div>
                        <h1 className="text-xl font-extrabold text-cui-text">{done === 'success' ? 'تم الدفع بنجاح' : 'فشل الدفع'}</h1>
                        <p className="mt-2 text-sm text-cui-text-muted">
                            {done === 'success' ? `تم إضافة ${fmt(amt)} ر.س إلى رصيد محفظتك.` : 'لم تُتم العملية — يمكنك المحاولة مرة أخرى.'}
                        </p>
                        <div className="mt-6 flex justify-center gap-3">
                            <Link to="/dashboard" className="inline-flex items-center gap-2 rounded-xl bg-[#006C35] px-6 py-2.5 text-sm font-extrabold text-white no-underline hover:bg-[#00843D]">
                                <i className="ti ti-wallet"></i> لوحة التحكم
                            </Link>
                            <UiButton type="button" variant="ghost" size="sm" onClick={() => setDone(null)} className="border-cui-border px-6 py-2.5 text-sm text-cui-text">دفع جديد</UiButton>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="flex min-h-[calc(100vh-72px)] items-center justify-center bg-surface px-4 py-12">
                <div className="w-full max-w-md">
                    <div className="overflow-hidden rounded-3xl border border-cui-border bg-white/95 shadow-[0_30px_60px_-12px_rgba(0,0,0,0.12)]">
                        <div className="border-b border-slate-100 px-6 pt-6 pb-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-[#00843D] to-[#004D28] text-lg text-white shadow-lg shadow-emerald-900/25">
                                        <i className="ti ti-shield-lock"></i>
                                    </div>
                                    <div>
                                        <div className="text-base font-extrabold text-cui-text">الدفع الإلكتروني الآمن</div>
                                        <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-cui-text-muted">
                                            <span>قم بالدفع عبر HyperPay</span>
                                            <span className="inline-block h-1 w-1 rounded-full bg-cui-text-muted"></span>
                                            <span className="text-emerald-700">عملة: ر.س (SAR)</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-[10.5px] font-bold text-emerald-800">
                                    <i className="ti ti-lock"></i> SSL آمن
                                </div>
                            </div>
                            <div className="mt-4 flex flex-wrap items-center gap-2">
                                <span className="rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-extrabold tracking-wide text-emerald-800">MADA</span>
                                <span className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-extrabold tracking-wide text-slate-600">VISA</span>
                                <span className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-extrabold tracking-wide text-slate-600">Mastercard</span>
                                <span className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-extrabold tracking-wide text-slate-600">Apple Pay</span>
                                <span className="ml-auto text-[10.5px] font-semibold text-cui-text-muted"><i className="ti ti-3d-cube-sphere"></i> 3-D Secure</span>
                            </div>
                        </div>

                        <div className="px-6 py-5">
                            <div className="mb-5">
                                <div className="mb-2 flex items-center gap-1.5 text-[12.5px] font-bold text-cui-text">
                                    <i className="ti ti-wallet text-emerald-700"></i> طريقة الدفع
                                </div>
                                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                                    {METHODS.map((m) => (
                                        <UiButton
                                            key={m.key}
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setMethod(m.key)}
                                            aria-pressed={method === m.key}
                                            className={`flex flex-col items-center justify-center gap-1.5 rounded-xl border px-2 py-3 text-[10.5px] font-bold transition-all duration-300 ${method === m.key ? 'border-[#006C35] bg-[#006C35] text-white shadow-[0_8px_20px_-6px_rgba(0,108,53,0.45)]' : 'border-slate-200 bg-white text-slate-600 hover:border-emerald-300 hover:text-[#006C35]'}`}
                                        >
                                            <i className={`ti ${m.icon} text-xl`}></i> {m.label}
                                        </UiButton>
                                    ))}
                                </div>
                            </div>

                            <div className="rounded-2xl bg-gradient-to-br from-[#00843D] via-[#005C2A] to-[#004D28] p-5 text-white shadow-xl shadow-emerald-900/20">
                                <div className="flex items-center justify-between text-[11.5px] font-semibold text-white/75">
                                    <span>المبلغ المطلوب دفعه من بطاقتك</span>
                                    <span className="flex items-center gap-1"><i className="ti ti-wallet"></i> محفظة آمر تم</span>
                                </div>
                                <div className="relative mt-3">
                                    <UiInput
                                        type="number"
                                        min={MIN}
                                        step="0.01"
                                        dir="ltr"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        aria-label="المبلغ المطلوب للدفع"
                                    />
                                    <span className="pointer-events-none absolute inset-y-0 right-[1.05rem] my-auto grid h-9 w-10 place-items-center rounded-lg bg-white/15 text-sm font-bold">ر.س</span>
                                </div>
                                <div className="mt-3 space-y-1.5 text-[11.5px]">
                                    <div className="flex justify-between" dir="ltr">
                                        <span className="text-white/70">قيمة الخدمة (الحد الأدنى)</span>
                                        <span className="font-extrabold tabular-nums">{fmt(MIN)} ر.س</span>
                                    </div>
                                    <div className="flex justify-between" dir="ltr">
                                        <span className="text-white/70">الرصيد المضاف إلى المحفظة</span>
                                        <span className={`font-extrabold tabular-nums ${!valid ? 'text-red-300' : ''}`}>{valid ? `${fmt(extra)} ر.س` : '—'}</span>
                                    </div>
                                </div>
                                {!valid && (
                                    <div className="mt-3 flex items-center gap-1.5 rounded-lg bg-red-500/20 px-3 py-2 text-[11px] font-bold">
                                        <i className="ti ti-alert-triangle"></i> المبلغ أقل من الحد الأدنى المسموح — اختر قيمة أكبر.
                                    </div>
                                )}
                            </div>

                            <p className="mt-3 rounded-xl border border-emerald-100 bg-emerald-50/70 px-3.5 py-2.5 text-[11.5px] leading-6 text-emerald-900">
                                <i className="ti ti-info-circle ml-1"></i>
                                حدّد مبلغاً يساوي قيمة الخدمة أو أكثر؛ أي مبلغ زائد يُضاف تلقائياً إلى رصيد محفظتك ويُنفَق في الخدمات لاحقاً.
                            </p>

                            {method !== 'applepay' && (
                                <div className="mt-5">
                                    <div className="mb-2 flex items-center gap-1.5 text-[12.5px] font-bold text-cui-text">
                                        <i className="ti ti-credit-card text-emerald-700"></i> بيانات البطاقة البنكية
                                    </div>
                                    <UiInput
                                        label="رقم بطاقة مدى / فيزا"
                                        type="text"
                                        dir="ltr"
                                        inputMode="numeric"
                                        value={card.pan}
                                        onChange={(e) => onPan(e.target.value)}
                                    />
                                    <div className="mt-4 grid grid-cols-2 gap-4">
                                        <UiInput
                                            label="تاريخ الانتهاء"
                                            type="text"
                                            dir="ltr"
                                            inputMode="numeric"
                                            value={card.exp}
                                            onChange={(e) => onExp(e.target.value)}
                                            placeholder="MM/YY"
                                        />
                                        <UiInput
                                            label="رمز الأمان CVV"
                                            type="password"
                                            dir="ltr"
                                            inputMode="numeric"
                                            maxLength="4"
                                            value={card.cvv}
                                            onChange={(e) => onCvv(e.target.value)}
                                            placeholder="***"
                                        />
                                    </div>
                                </div>
                            )}

                            {method === 'applepay' && (
                                <div className="mt-5">
                                    <div className="rounded-2xl bg-black p-5 text-center ring-1 ring-slate-300">
                                        <div className="mx-auto flex h-12 w-full max-w-xs items-center justify-center gap-2 rounded-xl bg-white text-black">
                                            <i className="ti ti-brand-apple text-2xl"></i> Pay
                                        </div>
                                        <p className="mt-3 text-[11px] leading-5 text-white/60">يُحاكى قرار Apple Pay بنفس زرّي النتيجة بالأسفل — لا تُرسل أي بيانات فعلية.</p>
                                    </div>
                                </div>
                            )}

                            <p className="mt-3 text-[11px] leading-6 text-cui-text-muted">
                                <i className="ti ti-flask ml-0.5"></i>
                                وضع المحاكاة: هذه البيانات مزيّفة ولا تُرسل لأي جهة، ويُطبَّق قرارك (نجاح/فشل) بنفس إجراءات البوابة الحقيقية.
                            </p>

                            <div className="mt-5 space-y-3">
                                <UiButton
                                    type="button"
                                    variant="primary"
                                    size="lg"
                                    disabled={!valid}
                                    onClick={() => setDone('success')}
                                    className="w-full px-6 py-3 text-sm font-extrabold disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <i className="ti ti-circle-check"></i> إتمام الدفع {valid && <span dir="ltr">({fmt(amt)} ر.س)</span>}
                                </UiButton>
                                <UiButton
                                    type="button"
                                    variant="ghost"
                                    size="lg"
                                    onClick={() => setDone('failure')}
                                    className="w-full px-6 py-3 text-sm bg-transparent text-slate-600 hover:bg-slate-50"
                                >
                                    <i className="ti ti-circle-x"></i> محاكاة فشل الدفع
                                </UiButton>
                            </div>

                            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 border-t border-slate-100 pt-4 text-[10.5px] font-semibold text-cui-text-muted">
                                <span className="flex items-center gap-1"><i className="ti ti-lock-square text-emerald-700"></i> تشفير 256-bit</span>
                                <span className="flex items-center gap-1"><i className="ti ti-shield-check text-emerald-700"></i> متوافق مع PCI DSS</span>
                                <span className="flex items-center gap-1"><i className="ti ti-brand-apple text-slate-400"></i> Powered by <b className="text-slate-600">HyperPay</b></span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 text-center">
                        <Link to="/dashboard" className="inline-flex items-center gap-1 text-[13px] text-cui-text-muted underline hover:text-cui-text">
                            <i className="ti ti-arrow-right"></i> العودة إلى لوحة التحكم
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}