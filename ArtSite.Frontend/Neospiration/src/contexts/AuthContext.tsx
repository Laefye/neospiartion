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
                } else if (error instanceof Error) {
                    alert(error.message);
                }
                throw error;
            }
        })();
    }, [requirement]);
    return (
        <AuthContext.Provider value={{ me: me }}>
            {done && children}
            {!done && (
                <div className="flex flex-col items-center justify-center min-h-screen w-full px-4 py-6 sm:py-12">
                    <div className="w-full max-w-md space-y-8 px-4 sm:px-0">
                        <h1 className="text-center text-3xl font-bold text-art-text-primary">
                            Загрузка...
                        </h1>
                    </div>
                </div>)}
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
