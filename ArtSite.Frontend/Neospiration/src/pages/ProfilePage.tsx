import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { ProfileController } from '../services/controllers/ProfileController';
import api from '../services/api';
import type { Profile, Art } from '../services/types';
import Seperator from '../components/ui/Seperator';
import { MessageSquare, PencilLine } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import ButtonLink from '../components/ui/ButtonLink';
import Container from '../components/ui/Container';
import ArtPublishModal from '../components/ui/ArtPublishModal';
import Publication from '../components/ui/Publication';
import Nav from '../components/ui/Nav';
import Avatar from '../components/ui/Avatar';

export default function ProfilePage() {
    const { id } = useParams();
    const auth = useAuth();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [arts, setArts] = useState<Art[]>([]);
    
    const profileController = new ProfileController(api);

    const updateArts = async () => {
        const arts = await profileController.getArts(parseInt(id!));
        setArts(arts);
    }

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const profile = await profileController.getProfile(parseInt(id!));
                setProfile(profile);
                
                await updateArts();
                
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

    const getProfileActions = () => {
        if (!profile) return null;
        
        if (auth.me?.userId === profile.userId) {
            return (
                <ButtonLink variant='outline' href={`/profile/${profile.id}/edit`}>
                    <PencilLine className='me-2' />
                    <span>Редактировать</span>
                </ButtonLink>
            );
        } else if (auth.me) {
            return (
                <ButtonLink variant='outline' href={`/conversation/${profile.id}`}>
                    <MessageSquare className='me-2' />
                    <span>Сообщения</span>
                </ButtonLink>
            );
        }
        return null;
    };
    
    return (
        <>
            <Nav/>
            <div className='min-h-screen bg-gradient-to-b from-[#25022A] to-[#320425] w-full flex flex-col items-center'>
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
                                <Avatar profile={profile} size={64} />
                                <span className='ml-4 text-2xl'>{profile.displayName}</span>
                                <div className='grow'></div>
                                {getProfileActions()}
                            </div>
                            {profile.description && (
                                <>
                                    <Seperator/>
                                    <p className='text-lg'>{profile.description}</p>
                                </>
                            )}
                        </Container>
                        
                        {profile.userId === auth.me?.userId && (
                            <ArtPublishModal onPublished={updateArts} profileId={parseInt(id!)}/>
                        )}
                        
                        {arts.length > 0 && arts.map((art) => (<Publication key={art.id} art={art} settings={{onDeleted: () => updateArts()}}/>))}
                    </div>
                )}
            </div>
        </>
    );
}
