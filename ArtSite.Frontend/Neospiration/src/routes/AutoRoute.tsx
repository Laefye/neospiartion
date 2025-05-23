import { Navigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import React from 'react';

export function AuthRoute({ children }: { children: React.ReactNode }) {
    const auth = useAuth();
    
    if (auth.loading) {
        return <div className="loading-spinner">Loading...</div>;
    }
    
    if (!auth.me) {
        return <Navigate to="/login" replace />;
    }
    
    return <>{children}</>;
}

export function UnauthRoute({ children }: { children: React.ReactNode }) {
    const auth = useAuth();
    
    if (auth.loading) {
        return <div className="loading-spinner">Loading...</div>;
    }
    
    if (auth.me) {
        return <Navigate to="/gallery" replace />;
    }
    
    return <>{children}</>;
}
