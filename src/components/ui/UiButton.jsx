import { Button as FBButton } from 'flowbite-react';

/**
 * زر Flowbite بهوية المنصة — البديل الرسمي لـ <button> الأصلي.
 * use: <UiButton variant="primary|outline|danger|ghost" ...>نص</UiButton>
 * ملاحظة: أي زر يحمل onClick أو submit يجب أن يكون من هذا المكون.
 */
export default function UiButton({ variant = 'primary', size = 'md', className = '', children, ...rest }) {
    const styles = {
        primary: 'bg-[#006C35] hover:bg-[#00843D] text-white',
        outline: 'border border-[#006C35]/30 bg-white text-[#006C35] hover:bg-[#006C35]/5',
        danger: 'bg-red-600 hover:bg-red-700 text-white',
        ghost: 'border border-slate-200 bg-white text-slate-700 hover:bg-gray-50',
        inherit: '',
    };
    const sizes = {
        sm: 'px-3 py-1.5 text-xs',
        md: 'px-5 py-2.5 text-sm',
        lg: 'px-6 py-3 text-sm',
    };
    return (
        <FBButton
            className={`inline-flex items-center justify-center gap-2 rounded-xl font-bold transition-all duration-200 ${styles[variant]} ${sizes[size]} ${className}`}
            {...rest}
        >
            {children}
        </FBButton>
    );
}