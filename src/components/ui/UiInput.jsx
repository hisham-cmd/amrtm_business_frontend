import { TextInput, Label } from 'flowbite-react';

/**
 * حقل إدخال Flowbite بهوية المنصة — البديل الرسمي لـ <input> الأصلي.
 * use: <UiInput label="الاسم" name="..." value={...} onChange={...} ... />
 */
export default function UiInput({ label, error, hint, required, className = '', ...rest }) {
    return (
        <div className={className}>
            {label && (
                <Label htmlFor={rest.id || rest.name} className="mb-1.5 block text-xsss font-bold text-slate-700">
                    {label}{required && <span className="text-red-600"> *</span>}
                </Label>
            )}
            <TextInput
                id={rest.id || rest.name}
                color={error ? 'failure' : 'gray'}
                sizing="md"
                className="[&>div]:w-full [&>div>input]:!rounded-xl [&>div>input]:!border-slate-300 [&>div>input]:!bg-white [&>div>input]:!px-4 [&>div>input]:!py-2.5 [&>div>input]:!text-[13px] [&>div>input]:!leading-6 [&>div>input]:!text-slate-900 [&>div>input]:!outline-none [&>div>input]:transition [&>div>input]:focus:!border-[#006C35]/50 [&>div>input]:focus:!ring-2 [&>div>input]:focus:!ring-[#006C35]/20"
                {...rest}
            />
            {hint && <p className="mt-1 text-[10.5px] text-slate-400">{hint}</p>}
            {error && <p className="mt-1 text-[11px] font-semibold text-red-600">{error}</p>}
        </div>
    );
}