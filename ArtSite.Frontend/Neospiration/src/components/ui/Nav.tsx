import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Home, Bell, MessageSquare, ChevronDown, LogOut, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function Nav() {
    const auth = useAuth();
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        auth.logout();
    };

    const handleNavigateToProfile = () => {
        if (auth.me?.profileId) {
            navigate(`/profile/${auth.me.profileId}`);
            setIsDropdownOpen(false);
        }
    };

    const handleNavigateToLogin = () => {
        navigate('/login');
        setIsDropdownOpen(false);
    };

    console.log("Auth state in Nav:", auth.me);

    return (
        <header className="bg-[#320425] py-3 px-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div className="flex items-center">
                    <a href="/gallery" className="text-white text-xl font-bold">
                        NEOspiration
                    </a>
                </div>

                <div className="flex items-center space-x-4">
                    <a href="/gallery" className="text-white hover:text-gray-200">
                        <Home size={24} />
                    </a>
                    
                    {auth.me && (
                        <>
                            <a href="/messages" className="text-white hover:text-gray-200">
                                <MessageSquare size={24} />
                            </a>
                            <button 
                                className="text-white hover:text-gray-200"
                                onClick={() => navigate('/notifications')}
                            >
                                <Bell size={24} />
                            </button>
                        </>
                    )}

                    <div className="relative" ref={dropdownRef}>
                        <button
                            className="flex items-center text-white hover:text-gray-200 py-2 px-3 rounded-md hover:bg-purple-900/30 transition-colors"
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        >
                            <span className="mr-2">{auth.me ? auth.me.userName : 'Гость'}</span>
                            <ChevronDown 
                                size={16} 
                                className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} 
                            />
                        </button>

                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                                {auth.me ? (
                                    <>
                                        <button
                                            onClick={handleNavigateToProfile}
                                            className="px-4 py-2 text-sm text-gray-700 hover:bg-purple-100 flex items-center w-full text-left"
                                        >
                                            <User size={16} className="mr-2" />
                                            Моя страница
                                        </button>
                                        <button
                                            onClick={handleLogout}
                                            className="px-4 py-2 text-sm text-gray-700 hover:bg-purple-100 flex items-center w-full text-left"
                                        >
                                            <LogOut size={16} className="mr-2" />
                                            Выйти
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={handleNavigateToLogin}
                                        className="px-4 py-2 text-sm text-gray-700 hover:bg-purple-100 flex items-center w-full text-left"
                                    >
                                        <LogOut size={16} className="mr-2" />
                                        Войти
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
