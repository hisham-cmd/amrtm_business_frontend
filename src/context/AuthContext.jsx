import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import api from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(() => localStorage.getItem('amrtm_token'));
    const [loading, setLoading] = useState(!!localStorage.getItem('amrtm_token'));

    const login = useCallback(async (email, password) => {
        const { data } = await api.post('/auth/login', { email, password });
        const { token: newToken, user: newUser } = data.value;
        localStorage.setItem('amrtm_token', newToken);
        localStorage.setItem('amrtm_user', JSON.stringify(newUser));
        setToken(newToken);
        setUser(newUser);
        return newUser;
    }, []);

    const logout = useCallback(async () => {
        try {
            if (token) await api.post('/auth/logout');
        } catch {
            // تجاهل أخطاء تسجيل الخروج
        }
        localStorage.removeItem('amrtm_token');
        localStorage.removeItem('amrtm_user');
        setToken(null);
        setUser(null);
    }, [token]);

    // استرجاع المستخدم عند فتح الصفحة (توكن موجود)
    useEffect(() => {
        if (!token) {
            setLoading(false);
            return;
        }
        api.get('/auth/me')
            .then(({ data }) => setUser(data.value.user))
            .catch(() => {
                localStorage.removeItem('amrtm_token');
                localStorage.removeItem('amrtm_user');
                setToken(null);
                setUser(null);
            })
            .finally(() => setLoading(false));
    }, [token]);

    return (
        <AuthContext.Provider value={{ user, token, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}