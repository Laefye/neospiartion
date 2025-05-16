import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContextDefinition';

export default function VkCallbackPage() {
    const [error, setError] = useState<string | null>(null);
    const { login } = useAuth();
    const navigate = useNavigate();
    
    useEffect(() => {
        const processVkCallback = async () => {
        try {
            const codeVerifier = localStorage.getItem('vk_code_verifier');
            const savedState = localStorage.getItem('vk_state');
            
            if (!codeVerifier || !savedState) {
            throw new Error('Authentication failed. Missing verification data.');
            }
            
            const currentUri = window.location.href;
            
            const urlParams = new URLSearchParams(window.location.search);
            const returnedState = urlParams.get('state');
            
            if (returnedState !== savedState) {
            throw new Error('Authentication failed. Invalid state parameter.');
            }
            
            const response = await fetch(`/Vk/authenticate?uri=${encodeURIComponent(currentUri)}&codeVerifier=${codeVerifier}`);
            
            if (!response.ok) {
            throw new Error('Failed to authenticate with VK');
            }
            
            const accessToken = await response.text();
            
            const userResponse = await fetch('/api/user/me', {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
            });
            
            if (!userResponse.ok) {
            throw new Error('Failed to get user information');
            }
            
            const userData = await userResponse.json();
            
            login(accessToken, {
            userId: userData.userId,
            email: userData.email,
            userName: userData.userName,
            profileId: userData.profileId
            });
            
            localStorage.removeItem('vk_code_verifier');
            localStorage.removeItem('vk_state');
            
            navigate('/');
        } 
        catch (error) 
        {
            setError(error instanceof Error ? error.message : 'Authentication failed');
        }
        };
        
        processVkCallback();
    }, [login, navigate]);
    
    if (error) {
        return (
        <div className="vk-callback-error">
            <h1>Authentication Error</h1>
            <p>{error}</p>
            <button onClick={() => navigate('/login')}>Return to Login</button>
        </div>
        );
    }
    
    return (
        <div className="vk-callback-loading">
        <h1>Authenticating...</h1>
        <p>Please wait while we complete the authentication process.</p>
        {/* todo: add a spinner here */}
        </div>
    );
}