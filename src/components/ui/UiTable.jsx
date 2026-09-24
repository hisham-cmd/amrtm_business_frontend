import { Table } from 'flowbite-react';

/**
 * جدول Flowbite بهوية المنصة — بديل <table> الأصلي في لوحات التحكم.
 */
export default function UiTable({ head, children, empty, emptyText = 'لا توجد بيانات', striped = true }) {
    return (
        <Table striped={striped} hoverable className="w-full text-[13px]">
            <Table.Head className="bg-[#F8FAF8] text-[11px] font-black text-[#5A7A6C] border-b border-slate-100">
                {head.map((h, i) => (
                    <Table.HeadCell key={i} className="px-4 py-3 text-right">{h}</Table.HeadCell>
                ))}
            </Table.Head>
            {children}
            {empty && (
                <Table.Body>
                    <Table.Row>
                        <Table.Cell colSpan={head.length} className="px-4 py-10 text-center">
                            <div className="flex flex-col items-center gap-2 text-slate-400">
                                <i className="ti ti-inbox text-3xl opacity-40"></i>
                                <span className="text-sm font-bold">{emptyText}</span>
                            </div>
                        </Table.Cell>
                    </Table.Row>
                </Table.Body>
            )}
        </Table>
    );
}