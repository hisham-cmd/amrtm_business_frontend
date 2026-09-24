import { Select, Label } from 'flowbite-react';

/**
 * قائمة منسدلة Flowbite — البديل الرسمي لـ <select> الأصلي.
 */
export default function UiSelect({ label, error, required, className = '', children, ...rest }) {
    return (
        <div className={className}>
            {label && (
                <Label htmlFor={rest.id || rest.name} className="mb-1.5 block text-xsss font-bold text-slate-700">
                    {label}{required && <span className="text-red-600"> *</span>}
                </Label>
            )}
            <Select
                id={rest.id || rest.name}
                color={error ? 'failure' : 'gray'}
                className="[&>div>select]:rounded-xl [&>div>select]:border-slate-300 [&>div>select]:bg-white [&>div>select]:text-sm [&>div>select]:focus:border-[#006C35]/50 [&>div>select]:focus:ring-2 [&>div>select]:focus:ring-[#006C35]/20"
                {...rest}
            >
                {children}
            </Select>
            {error && <p className="mt-1 text-[11px] font-semibold text-red-600">{error}</p>}
        </div>
    );
}