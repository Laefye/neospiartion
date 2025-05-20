import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router'; // Fixed import
import { ProfileController } from '../services/ProfileController';
import { ArtController } from '../services/ArtController';
import api from '../services/api';
import type { Profile, Art } from '../services/types';
import Seperator from '../components/ui/Seperator';
import { MessageSquare, PencilLine, Home, Bell, Plus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import ButtonLink from '../components/ui/ButtonLink';
import Container from '../components/ui/Container';
import NotificationWindow from '../components/ui/NotificationWindow';
import ArtPublishModal from '../components/ui/ArtPublishModal';
import ArtComments from '../components/ui/ArtComments';

export default function ProfilePage() {
    const { id } = useParams();
    const auth = useAuth();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [showCreatePostForm, setShowCreatePostForm] = useState(false);
    const [postDescription, setPostDescription] = useState('');
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [arts, setArts] = useState<Art[]>([]);
    const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
    
    const toggleNotification = () => {
        setIsNotificationOpen(prev => !prev);
    };
    
    const closeNotification = () => {
        setIsNotificationOpen(false);
    };
    
    useEffect(() => {
        const loadProfile = async () => {
            try {
                const profileController = new ProfileController(api);
                const profile = await profileController.getProfile(parseInt(id!));
                setProfile(profile);
                
                if (profile.avatar) {
                    const avatarUrl = await profileController.getAvatarUrl(profile.id);
                    setAvatarUrl(avatarUrl);
                }
                
                const arts = await profileController.getArts(profile.id);
                setArts(arts);
                
                setLoading(false);
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError('Неизвестная ошибка');
                }
                setLoading(false);
            }
        };
        
        if (id) {
            loadProfile();
        }
    }, [id]);
    
    const handleCreatePost = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!profile) return;
        if (!fileInputRef.current?.files?.length) {
            setError('Пожалуйста, выберите файл для загрузки');
            return;
        }
        
        setUploading(true);
        setError(null);
        
        try {
            const artController = new ArtController(api);
            const art = await artController.createArt(
                profile.id, 
                postDescription
            );
            
            await artController.uploadPicture(
                art.id, 
                fileInputRef.current.files[0]
            );
            
            setPostDescription('');
            setShowCreatePostForm(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
            
            const profileController = new ProfileController(api);
            const updatedArts = await profileController.getArts(profile.id);
            setArts(updatedArts);
            
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Ошибка при создании поста');
            }
        } finally {
            setUploading(false);
        }
    };
    
    return (
        <>
            <NotificationWindow 
                isOpen={isNotificationOpen} 
                onClose={closeNotification}
            />
            
            <header className="bg-[#320425] py-3 px-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center">
                        <a href="/" className="text-white text-xl font-bold">
                            NEOspiration
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
                                    onClick={toggleNotification}
                                    aria-label="Notifications"
                                >
                                    <Bell size={24} />
                                </button>
                                <a href="/messages" className="text-white hover:text-gray-200">
                                    <MessageSquare size={24} />
                                </a>
                            </>
                        )}

                        <div className="relative">
                            <button
                                className="flex items-center text-white hover:text-gray-200"
                                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                            >
                                <span className="mr-1">Cool Artist</span>
                                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                </svg>
                            </button>
                        </div>
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
                    <div className='w-max-container w-full py-5 space-y-5'>
                        <Container className='space-y-2.5'>
                            <div className='flex items-center'>
                                {avatarUrl ? (
                                    <img
                                        src={avatarUrl}
                                        alt={profile.displayName}
                                        className='w-16 h-16 rounded-full'
                                    />
                                ) : (
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
                            {profile.description && (
                                <>
                                    <Seperator/>
                                    <p className='text-lg'>{profile.description}</p>
                                </>
                            )}
                        </Container>
                        
                        {profile.userId === auth.me?.userId && (
                            <div className="w-full flex justify-center mb-4">
                                {!showCreatePostForm ? (
                                    <button
                                        onClick={() => setShowCreatePostForm(true)}
                                        className="w-full bg-[#1E1E1E] hover:bg-opacity-90 text-white py-3 rounded-md flex items-center justify-center gap-2 transition-colors"
                                    >
                                        <Plus size={20} />
                                        <span>Создать пост</span>
                                    </button>
                                ) : (
                                    <Container className='space-y-4'>
                                        <h3 className="text-lg font-medium">Создать новый пост</h3>
                                        {error && <div className="p-3 bg-red-100 text-red-700 rounded-md">{error}</div>}
                                        
                                        <form onSubmit={handleCreatePost} className="space-y-4">
                                            <div className="space-y-2">
                                                <label htmlFor="postDescription" className="block text-sm font-medium">
                                                    Описание
                                                </label>
                                                <textarea
                                                    id="postDescription"
                                                    value={postDescription}
                                                    onChange={(e) => setPostDescription(e.target.value)}
                                                    disabled={uploading}
                                                    placeholder="Расскажите о вашей работе..."
                                                    className="w-full p-2 border border-gray-300 rounded-md h-24"
                                                />
                                            </div>
                                            
                                            <div className="space-y-2">
                                                <label htmlFor="artFile" className="block text-sm font-medium">
                                                    Изображение
                                                </label>
                                                <input
                                                    id="artFile"
                                                    type="file"
                                                    ref={fileInputRef}
                                                    disabled={uploading}
                                                    accept="image/*"
                                                    className="w-full p-2 border border-gray-300 rounded-md"
                                                />
                                            </div>
                                            
                                            <div className="flex gap-3">
                                                <button 
                                                    type="submit"
                                                    disabled={uploading}
                                                    className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
                                                >
                                                    {uploading ? 'Загрузка...' : 'Опубликовать'}
                                                </button>
                                                
                                                <button
                                                    type="button"
                                                    onClick={() => setShowCreatePostForm(false)}
                                                    disabled={uploading}
                                                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                                                >
                                                    Отмена
                                                </button>
                                            </div>
                                        </form>
                                    </Container>
                                )}
                            </div>
                        )}
                        
                        {arts.length > 0 && (
                            <Container>
                                <h3 className="text-lg font-medium mb-4">Работы</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {arts.map(art => (
                                        <div key={art.id} className="border rounded-lg overflow-hidden">
                                            <img 
                                                src={`/api/arts/${art.id}/pictures`} 
                                                alt={art.description || 'Artwork'} 
                                                className="w-full h-48 object-cover"
                                            />
                                            <div className="p-3">
                                                <p className="line-clamp-2">{art.description}</p>
                                                {/* Render comment section for each art */}
                                                <ArtComments artId={art.id} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Container>
                        )}
                        
                        <ArtPublishModal
                            open={isPublishModalOpen}
                            onClose={() => setIsPublishModalOpen(false)}
                            profileId={profile.id}
                            onPublished={async () => {
                                const profileController = new ProfileController(api);
                                setArts(await profileController.getArts(profile.id));
                                setIsPublishModalOpen(false);
                            }}
                        />
                    </div>
                )}
            </div>
        </>
    );
}
