import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const links = [
    { to: '/services', label: 'الخدمات' },
    { to: '/consultants', label: 'المستشارون' },
];

export default function Navbar() {
    const { user, logout } = useAuth();

    return (
        <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
                <div className="flex items-center gap-8">
                    <Link to="/" className="flex items-center gap-2">
                        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-sm font-extrabold text-white">آ</span>
                        <span className="text-lg font-bold text-gray-900">آمر تم</span>
                    </Link>
                    <nav className="hidden items-center gap-4 md:flex">
                        {links.map((l) => (
                            <NavLink
                                key={l.to}
                                to={l.to}
                                className={({ isActive }) =>
                                    `text-sm font-medium transition ${isActive ? 'text-primary' : 'text-gray-600 hover:text-primary'}`
                                }
                            >
                                {l.label}
                            </NavLink>
                        ))}
                    </nav>
                </div>

                <div className="flex items-center gap-3">
                    {user ? (
                        <>
                            <Link
                                to="/dashboard"
                                className="hidden items-center gap-2 rounded-lg bg-primary-light px-4 py-2 text-sm font-semibold text-primary md:inline-flex"
                            >
                                {user.name}
                            </Link>
                            <button onClick={logout} className="text-sm font-medium text-gray-500 hover:text-red-600">
                                خروج
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="btn-outline !py-2">دخول</Link>
                            <Link to="/login?mode=register" className="btn-primary !py-2">إنشاء حساب</Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}