import { Badge } from 'flowbite-react';

/**
 * شارة Flowbite بهوية المنصة — بديل <span class="badge"> الأصلي.
 */
export default function UiBadge({ color = 'primary', icon, children, className = '' }) {
    const colors = {
        primary: 'bg-[#006C35]/10 text-[#006C35]',
        success: 'bg-emerald-50 text-emerald-700',
        failure: 'bg-red-50 text-red-700',
        warning: 'bg-amber-50 text-amber-800',
        gray: 'bg-slate-100 text-slate-600',
    };
    return (
        <Badge className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${colors[color]} ${className}`} color={null}>
            {icon && <i className={icon}></i>}
            {children}
        </Badge>
    );
}