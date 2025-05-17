import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import api from '../services/api';

interface User {
    userId: string;
    email: string;
    userName: string;
    profileId?: number;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    error: string | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    vkLogin: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetchUser();
        }
    }, []);

    const fetchUser = async () => {
        try {
            setLoading(true);
            const response = await api.get('/api/user/me');
            setUser(response.data);
            setIsAuthenticated(true);
        } 
        catch (error) 
        {
            console.error('Failed to fetch user:', error);
            logout();
        } 
        finally 
        {
            setLoading(false);
        }
    };

    const login = async (email: string, password: string) => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await api.post('/api/user/authentication', {
                email,
                password
            });
            
            localStorage.setItem('token', response.data.accessToken);
            setIsAuthenticated(true);
            await fetchUser();
        
        } 
        catch (err: any) 
        {
            const errorMessage = err.response?.data?.detail || 'Неверный email или пароль';
            setError(errorMessage);
            setIsAuthenticated(false);
        } 
        finally 
        {
            setLoading(false);
        }
    };

    const vkLogin = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await api.get('/Vk/authorizationUrl');
            const authUrl = response.data;
            
            window.location.href = authUrl;
        } 
        catch
        {
            setError('Не удалось начать авторизацию через ВКонтакте');
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ 
        user, 
        loading, 
        error, 
        login, 
        logout, 
        vkLogin, 
        isAuthenticated 
        }}>{children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};