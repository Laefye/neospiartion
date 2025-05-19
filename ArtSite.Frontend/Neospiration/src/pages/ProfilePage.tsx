import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { ProfileController } from '../services/ProfileController';
import api from '../services/api';
import type { Profile } from '../services/types';
import Seperator from '../components/ui/Seperator';
import { MessageSquare, PencilLine, Home, Bell } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import ButtonLink from '../components/ui/ButtonLink';
import Container from '../components/ui/Container';
import NotificationWindow from '../components/ui/NotificationWindow';

export default function ProfilePage() {
    const { id } = useParams();
    const auth = useAuth();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    
    useEffect(() => {
        (async () => {
            try {
                const profileController = new ProfileController(api);
                const profile = await profileController.getProfile(parseInt(id!))
                setProfile(profile);
                if (profile.avatar) {
                    const avatarUrl = await profileController.getAvatarUrl(profile.id);
                    setAvatarUrl(avatarUrl);
                }
                setLoading(false);
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError('Неизвестная ошибка');
                }
                setLoading(false);
            }
        })();
    }, [id]);
    
    return (
        <>
            <NotificationWindow 
                isOpen={isNotificationOpen} 
                onClose={() => setIsNotificationOpen(false)} 
            />
            
            <header className="bg-[#320425] py-3 px-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center">
                        <a href="/" className="text-white text-xl font-bold">
                            <img src={'../assets/NEOspiration.svg'} alt="NEOspiration" className="h-8" />
                        </a>
                    </div>

                    <div className="flex items-center space-x-4">
                        <a href="/" className="text-white hover:text-gray-200">
                            <Home size={24} />
                        </a>
                        {auth.me && (
                            <>
                                <button 
                                    className="text-white hover:text-gray-200 relative"
                                    onClick={() => setIsNotificationOpen(prev => !prev)}
                                >
                                    <Bell size={24} />
                                </button>
                                <a href="/messages" className="text-white hover:text-gray-200">
                                    <MessageSquare size={24} />
                                </a>
                            </>
                        )}

                        {auth.me ? (
                            <div className="relative">
                                <button
                                    className="flex items-center text-white hover:text-gray-200"
                                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                                >
                                    <div className="w-8 h-8 rounded-full bg-white mr-2 flex items-center justify-center">
                                        {auth.me?.profileId && (
                                            <img
                                                src={`/api/profiles/${auth.me.profileId}/avatar`}
                                                alt={auth.me.userName}
                                                className="w-8 h-8 rounded-full"
                                                onError={(e) => {
                                                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${auth.me?.userName?.charAt(0)}&background=random`;
                                                }}
                                            />
                                        )}
                                    </div>
                                    <span className="mr-1">{auth.me?.userName || "Cool Artist"}</span>
                                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                    </svg>
                                </button>

                                {isProfileDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                                        <a 
                                            href={`/profile/${auth.me?.profileId}`} 
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            Мой профиль
                                        </a>
                                        <a 
                                            href={`/profile/${auth.me?.profileId}/edit`} 
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            Настройки
                                        </a>
                                        <button
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            onClick={() => {
                                                localStorage.removeItem('token');
                                                window.location.href = '/login';
                                            }}
                                        >
                                            Выйти
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <a href="/login" className="text-white hover:text-gray-200 px-3 py-1">
                                    Войти
                                </a>
                                <a href="/register" className="bg-art-primary text-white px-3 py-1 rounded-md hover:bg-opacity-90">
                                    Зарегистрироваться
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <div className='w-full flex flex-col items-center'>
                {error && <div className='p-2.5 rounded-lg bg-white space-y-2.5'>{error}</div>}
                {loading && (
                    <div className='w-max-container w-full py-5'>
                        <div className='p-2.5 rounded-lg bg-white space-y-2.5'>
                            <div className='flex items-center'>
                                <div className='w-16 h-16 rounded-full bg-gray-200 animate-pulse'></div>
                                <span className='ml-4 w-24 h-6 animate-pulse bg-gray-200 rounded'></span>
                                <div className='grow'></div>
                            </div>
                            <Seperator/>
                            <div className='w-full h-6 animate-pulse bg-gray-200 rounded'></div>
                        </div>
                    </div>
                )}
                {profile && !loading && (
                    <div className='w-max-container w-full py-5'>
                        <Container className='space-y-2.5'>
                            <div className='flex items-center'>
                                {avatarUrl && (
                                    <img
                                        src={avatarUrl}
                                        alt={profile.displayName}
                                        className='w-16 h-16 rounded-full'
                                    />
                                )}
                                {!avatarUrl && (
                                    <div className='w-16 h-16 rounded-full bg-gray-200'></div>
                                )}
                                <span className='ml-4 text-2xl'>{profile.displayName}</span>
                                <div className='grow'></div>
                                {auth.me != null && profile.userId != auth.me.userId && (
                                    <ButtonLink variant='outline' href={'/conversation/' + profile.id}>
                                        <MessageSquare className='me-2' />
                                        <span>Сообщения</span>
                                    </ButtonLink>
                                )}
                                {profile.userId == auth.me?.userId && (
                                    <ButtonLink variant='outline' href={'/profile/' + profile.id + '/edit'}>
                                        <PencilLine className='me-2' />
                                        <span>Редактировать</span>
                                    </ButtonLink>
                                )}
                            </div>
                            { profile.description && (<>
                                <Seperator/>
                                <p className='text-lg'>{profile.description}</p>
                            </>)}
                        </Container>
                    </div>
                )}
            </div>
        </>
    );
};
