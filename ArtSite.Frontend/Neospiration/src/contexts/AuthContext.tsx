import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router';
import { UserController } from '../services/UserController';
import { InvalidTokenException } from '../services/interfaces/IUserController';
import type { Me } from '../services/types';

type AuthContextType = {
    me: Me | null,
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children, requirement }: { children: ReactNode, requirement: 'any' | 'auth' }) {
    let navigate = useNavigate();
    let [done, setDone] = useState(false);
    let [me, setMe] = useState<Me | null>(null);
    useEffect(() => {
        (async () => {
            if (!api.tokenStorage.isAuthenticated() && requirement == 'auth') {
                navigate('/login');
                return;
            }
            let userController = new UserController(api);
            try {
                let me = await userController.me();
                setMe(me);
                setDone(true);
            } catch (error) {
                if (error instanceof InvalidTokenException) {
                    if (requirement == 'auth') {
                        api.tokenStorage.removeToken();
                        navigate('/login');
                        return;
                    } else {
                        setDone(true);
                    }
                }
                throw error;
            }
        })();
    }, [requirement]);
    return (
        <AuthContext.Provider value={{ me: me }}>
            {done && children}
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
