import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContextDefinition';
import '../assets/styles/AuthPages.css';

import emailFieldSvg from '../assets/styles/E-Mail Field.svg';
import passwordFieldSvg from '../assets/styles/Password Field.svg';
import buttonSvg from '../assets/styles/Button.svg';
import welcomeSvg from '../assets/styles/Log In or Register label.svg';
import haveAccountSvg from '../assets/styles/Registration Suggest label.svg';

export default function RegisterPage() {
    const [email, setEmail] = useState('');
    const [userName, setUserName] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    
    const { login } = useAuth();
    const navigate = useNavigate();
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        
        if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
        }
        
        setIsLoading(true);
        
        try {
        const response = await fetch('/api/user', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
            email, 
            userName, 
            displayName: displayName || userName,
            password 
            }),
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Registration failed. Please try again.');
        }
        
        const loginResponse = await fetch('/api/user/authentication', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });
        
        if (!loginResponse.ok) {
            navigate('/login');
            return;
        }
        
        const loginData = await loginResponse.json();
        
        const token = loginData.accessToken?.startsWith('Bearer ') 
            ? loginData.accessToken.substring(7) 
            : loginData.accessToken;
        
        login(token, {
            userId: loginData.userId,
            email: email,
            userName: userName,
            profileId: loginData.profileId,
        });
        
        navigate('/');
        } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
        setIsLoading(false);
        }
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
                <img src={emailFieldSvg} alt="Username field" className="input-background" />
                <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Username"
                required
                className="text-input"
                />
            </div>
            
            <div className="input-group">
                <img src={emailFieldSvg} alt="Display name field" className="input-background" />
                <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Display Name"
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
            
            <div className="input-group">
                <img src={passwordFieldSvg} alt="Confirm password field" className="input-background" />
                <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                required
                className="text-input"
                />
            </div>
            
            {error && <div className="error-message">{error}</div>}
            
            <button type="submit" className="auth-button" disabled={isLoading}>
                <img src={buttonSvg} alt="Register button" />
                <span className="button-text">{isLoading ? 'Registering...' : 'Register'}</span>
            </button>
            </form>
            
            <div className="login-link">
            <Link to="/login">
                <img src={haveAccountSvg} alt="Already have an account" />
            </Link>
            </div>
        </div>
        </div>
    );
}