import type { CustomFlowbiteTheme } from 'flowbite-react';

/**
 * ثيم Flowbite الموحّد — يلتزم بهوية منصة آمر تم (الأخضر الرسمي #006C35)
 * ويُطبق على كل مكونات Flowbite في جميع الصفحات.
 */
export const flowbiteTheme: CustomFlowbiteTheme = {
    button: {
        color: {
            primary: 'bg-[#006C35] hover:bg-[#00843D] text-white',
            primaryOutline: 'border border-[#006C35]/30 bg-white text-[#006C35] hover:bg-[#006C35]/5',
            danger: 'bg-red-600 hover:bg-red-700 text-white',
            gray: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
        },
    },
    textInput: {
        field: {
            input: {
                colors: {
                    primary: 'border-slate-300 bg-white text-slate-900 focus:border-[#006C35]/50 focus:ring-[#006C35]/20',
                },
            },
        },
        base: 'w-full',
    },
    textarea: {
        colors: {
            primary: 'border-slate-300 bg-white text-slate-900 focus:border-[#006C35]/50 focus:ring-[#006C35]/20',
        },
    },
    select: {
        field: {
            select: {
                colors: {
                    primary: 'border-slate-300 bg-white text-slate-900 focus:border-[#006C35]/50 focus:ring-[#006C35]/20',
                },
            },
        },
    },
    checkbox: {
        root: 'text-[#006C35] focus:ring-[#006C35]/30',
    },
    badge: {
        color: {
            primary: 'bg-[#006C35]/10 text-[#006C35]',
            success: 'bg-emerald-50 text-emerald-700',
            failure: 'bg-red-50 text-red-700',
            warning: 'bg-amber-50 text-amber-800',
            gray: 'bg-slate-100 text-slate-600',
        },
    },
    table: {
        head: { cell: { base: 'bg-[#F8FAF8] text-[11px] font-black text-[#5A7A6C]' } },
        body: { cell: { base: 'px-4 py-3 text-[13px] text-slate-700' } },
    },
    navbar: {
        root: { base: 'border-b border-slate-200 bg-white sticky top-0 z-[999] shadow-sm' },
        link: {
            active: { on: 'bg-[#006C35]/10 text-[#006C35]', off: 'text-gray-500 hover:bg-[#006C35]/10 hover:text-[#006C35]' },
        },
    },
    sidebar: {
        root: { base: 'h-screen w-72 border-l border-gray-200 bg-white' },
        item: {
            base: 'rounded-xl px-3 py-2.5 text-sm font-semibold',
            active: 'is-active bg-gray-100 text-gray-900',
            content: 'group/item relative flex items-center gap-3',
        },
    },
};