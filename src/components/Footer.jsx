export default function Footer() {
    return (
        <footer className="mt-auto border-t border-gray-200 bg-white">
            <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 md:flex-row">
                <p className="text-sm text-gray-500">© {new Date().getFullYear()} منصة آمر تم — جميع الحقوق محفوظة</p>
                <div className="flex gap-6 text-sm text-gray-500">
                    <span className="cursor-pointer hover:text-primary">الشروط والأحكام</span>
                    <span className="cursor-pointer hover:text-primary">سياسة الخصوصية</span>
                    <span className="cursor-pointer hover:text-primary">اتصل بنا</span>
                </div>
            </div>
        </footer>
    );
}