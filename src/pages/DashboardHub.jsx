import { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * المركز الموحّد — يعادل /dashboard-hub:
 * يوجّه حسب الدور: office → /office/dashboard، admin → /admin، مستخدم → /dashboard.
 */
export default function DashboardHub() {
    const { user, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (loading || !user) return;
        if (user.type === 'office') navigate('/office/dashboard', { replace: true });
        else if (user.is_admin || user.role === 'admin' || user.role === 'supervisor') navigate('/admin', { replace: true });
        else navigate('/dashboard', { replace: true });
    }, [user, loading, navigate]);

    if (loading) return <div className="flex min-h-screen items-center justify-center text-gray-400">جارٍ التحميل...</div>;
    if (!user) return <Navigate to="/login" replace />;

    return <div className="flex min-h-screen items-center justify-center text-gray-400">إعادة التوجيه...</div>;
}