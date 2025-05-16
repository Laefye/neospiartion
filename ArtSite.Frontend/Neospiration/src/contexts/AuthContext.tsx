import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { AuthContext } from './AuthContextDefinition';

interface User {
    userId: string;
    email: string;
    userName: string;
    profileId?: number;
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;});
  
    const [token, setToken] = useState<string | null>(() => {
        return localStorage.getItem('token');
    });

    useEffect(() => {
        const verifyToken = async () => {
            if (!token) 
                return;
            try 
            {
                const response = await fetch('/api/user/me', { headers: { 'Authorization': `Bearer ${token}`}});
                if (!response.ok) 
                {
                    logout();
                }
            } 
            catch (error) 
            {
                console.error('Error verifying token:', error);
            }
        };
        verifyToken();
    }, [token]);

    const login = (token: string, user: User) => {
        // Store token without "Bearer " prefix for easier use
        const cleanToken = token.startsWith('Bearer ') ? token.substring(7) : token;
        
        setToken(cleanToken);
        setUser(user);
        localStorage.setItem('token', cleanToken);
        localStorage.setItem('user', JSON.stringify(user));
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('vk_code_verifier');
        localStorage.removeItem('vk_state');
    };

    const isAuthenticated = !!token;

    return (
        <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated }}>
        {children}
        </AuthContext.Provider>
    );
}