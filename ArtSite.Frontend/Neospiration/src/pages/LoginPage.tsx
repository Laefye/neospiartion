import { useState } from 'react';
import type { FormEvent } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, vkLogin, loading, error } = useAuth();
  
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!email || !password) return;
        await login(email, password);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen w-full px-4 py-6 sm:py-12">
            <div className="w-full max-w-md space-y-8 px-4 sm:px-0">
                <h1 className="text-center text-3xl font-bold text-white">
                    Войдите или зарегистрируйтесь
                </h1>
                
                {error && (
                    <div className="bg-red-400/20 border border-red-400 text-red-200 px-4 py-3 rounded-lg relative" role="alert">
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}
                
                <div className="space-y-6">
                    <button
                        type="button"
                        onClick={vkLogin}
                        className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none"
                        style={{ backgroundColor: 'white' }}
                    >
                        <svg className="w-5 h-5 mr-2" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0 23.04C0 12.1788 0 6.74826 3.37413 3.37413C6.74826 0 12.1788 0 23.04 0H24.96C35.8212 0 41.2517 0 44.6259 3.37413C48 6.74826 48 12.1788 48 23.04V24.96C48 35.8212 48 41.2517 44.6259 44.6259C41.2517 48 35.8212 48 24.96 48H23.04C12.1788 48 6.74826 48 3.37413 44.6259C0 41.2517 0 35.8212 0 24.96V23.04Z" fill="#0077FF"/>
                            <path d="M25.54 34.5801C14.6 34.5801 8.3601 27.0801 8.1001 14.6001H13.5801C13.7601 23.7601 17.8 27.6401 21 28.4401V14.6001H26.1602V22.5001C29.3202 22.1601 32.6398 18.5601 33.7598 14.6001H38.9199C38.0599 19.4801 34.4599 23.0801 31.8999 24.5601C34.4599 25.7601 38.5601 28.9001 40.1201 34.5801H34.4399C33.2199 30.7801 30.1802 27.8401 26.1602 27.4401V34.5801H25.54Z" fill="white"/>
                        </svg>
                        Вход через аккаунт VK
                    </button>
                
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-600"></div>
                        </div>
                        <div className="relative flex justify-center">
                            <span className="px-3 text-sm text-gray-300 bg-[#25022A]">или</span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="E-Mail"
                                className="appearance-none rounded-lg bg-transparent border border-[#6c2769] text-white w-full py-3 px-4 focus:outline-none focus:border-purple-500"
                            />
                        </div>
                        
                        <div>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="Password"
                                className="appearance-none rounded-lg bg-transparent border border-[#6c2769] text-white w-full py-3 px-4 focus:outline-none focus:border-purple-500"
                            />
                        </div>
                        
                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-[#6c2769] hover:bg-[#7c3279] focus:outline-none"
                            >
                                {loading ? 'Загрузка...' : 'Продолжить'}
                            </button>
                        </div>
                        
                        <div className="flex justify-center text-sm text-gray-300">
                            <span>Нет аккаунта? </span>
                            <a href="/register" className="ml-1 text-purple-300 hover:text-purple-200">
                                Создайте новый аккаунт
                            </a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}