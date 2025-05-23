import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { UserController } from '../services/controllers/UserController';
import api from '../services/api';
import type { Me } from '../services/types';

interface AuthContextType {
    me: Me | null;
    loading: boolean;
    setMe: (me: Me | null) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
    me: null,
    loading: true,
    setMe: () => {},
    logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
    const [me, setMe] = useState<Me | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
        try {
            if (api.tokenStorage.getToken()) {
            const userController = new UserController(api);
            const userData = await userController.me();
            setMe(userData);
            }
        } catch (error) {
            console.error('Failed to load user:', error);
            api.tokenStorage.removeToken();
        } finally {
            setLoading(false);
        }
        };

        loadUser();
    }, []);

    const logout = () => {
        api.tokenStorage.removeToken();
        setMe(null);
        window.location.href = '/login';
    };

    return (
        <AuthContext.Provider value={{ me, loading, setMe, logout }}>
        {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
