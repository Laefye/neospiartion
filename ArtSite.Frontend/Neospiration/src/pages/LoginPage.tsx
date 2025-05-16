import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContextDefinition';
import '../assets/styles/AuthPages.css';

import emailFieldSvg from '../assets/styles/E-mail Field.svg';
import passwordFieldSvg from '../assets/styles/Password Field.svg';
import buttonSvg from '../assets/styles/Button.svg';
import vkLoginSvg from '../assets/styles/Log through VK.svg';
import welcomeSvg from '../assets/styles/Log In or Register label.svg';
import createAccountSvg from '../assets/styles/Registration Suggest label.svg';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    
    // Get redirect URL from query params if available
    const from = (location.state as { from?: string })?.from || '/';
    
    // Handle regular email/password login
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);
        
        try {
        const response = await fetch('/api/user/authentication', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Login failed. Please check your credentials.');
        }
        
        const data = await response.json();
        
        // Extract the token from format "Bearer <token>"
        const token = data.accessToken?.startsWith('Bearer ') 
            ? data.accessToken.substring(7) 
            : data.accessToken;
        
        // Save login information
        login(token, {
            userId: data.userId,
            email: email,
            userName: data.userName || email.split('@')[0], // Fallback to part of email if username not provided
            profileId: data.profileId,
        });
        
        // Redirect to the original destination or home
        navigate(from);
        } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
        setIsLoading(false);
        }
    };
    
    // Handle VK authentication
    const handleVKLogin = async () => {
        try {
        // Generate a code verifier (random string)
        const codeVerifier = generateRandomString(64);
        
        // Store code verifier in localStorage to use it later
        localStorage.setItem('vk_code_verifier', codeVerifier);
        
        // State parameter to verify the request later
        const state = generateRandomString(16);
        localStorage.setItem('vk_state', state);
        
        // Get the authorization URL from your backend
        const response = await fetch(`/Vk/authorizationUrl?codeVerifier=${codeVerifier}&state=${state}`);
        
        if (!response.ok) {
            throw new Error('Failed to get VK authorization URL');
        }
        
        const authUrl = await response.text();
        
        // Redirect the user to VK for authentication
        window.location.href = authUrl;
        } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to initiate VK login');
        }
    };
    
    // Helper function to generate random string for PKCE
    const generateRandomString = (length: number) => {
        const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
        let result = '';
        const randomValues = new Uint8Array(length);
        window.crypto.getRandomValues(randomValues);
        for (let i = 0; i < length; i++) {
        result += charset[randomValues[i] % charset.length];
        }
        return result;
    };
    
    return (
        <div className="auth-container">
        <div className="auth-form-wrapper">
            <img src={welcomeSvg} alt="Welcome" className="welcome-image" />
            
            <form onSubmit={handleSubmit} className="auth-form">
            <div className="input-group">
                <img src={emailFieldSvg} alt="Email field" className="input-background" />
                <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
                className="text-input"
                />
            </div>
            
            <div className="input-group">
                <img src={passwordFieldSvg} alt="Password field" className="input-background" />
                <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                className="text-input"
                />
            </div>
            
            {error && <div className="error-message">{error}</div>}
            
            <button type="submit" className="auth-button" disabled={isLoading}>
                <img src={buttonSvg} alt="Login button" />
                <span className="button-text">{isLoading ? 'Logging in...' : 'Login'}</span>
            </button>
            </form>
            
            <div className="alternative-login">
            <button 
                type="button" 
                className="vk-login-button"
                onClick={handleVKLogin}
            >
                <img src={vkLoginSvg} alt="Login with VK" />
            </button>
            </div>
            
            <div className="create-account">
            <Link to="/register">
                <img src={createAccountSvg} alt="Create new account" />
            </Link>
            </div>
        </div>
        </div>
    );
}