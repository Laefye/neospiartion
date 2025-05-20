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
import Nav from '../components/ui/Nav';
import ArtComponent from '../components/ui/ArtComponent';

export default function ProfilePage() {
    const { id } = useParams();
    const auth = useAuth();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [showCreatePostForm, setShowCreatePostForm] = useState(false);
    const [postDescription, setPostDescription] = useState('');
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [arts, setArts] = useState<Art[]>([]);
    const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
    
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
    
    return (
        <>
            <Nav/>
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
                            <ArtPublishModal
                                onPublished={async () => { } } profileId={parseInt(id!)}/>
                        )}
                        
                        {arts.length > 0 && arts.map((art) => (<ArtComponent key={art.id} art={art}/>))}
                    </div>
                )}
            </div>
        </>
    );
}
