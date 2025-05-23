import { useState, useEffect, useCallback } from 'react';
import { ArtController } from '../services/controllers/ArtController';
import { ProfileController } from '../services/controllers/ProfileController';
import api from '../services/api';
import type { Art, Profile } from '../services/types';
import Nav from '../components/ui/Nav';
import Header from '../components/ui/Header';
import { Heart, MessageSquare } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useNavigate } from 'react-router';
import Button from '../components/ui/Button';

export default function ArtGalleryPage() {
    const [arts, setArts] = useState<Art[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [artistProfiles, setArtistProfiles] = useState<Record<number, Profile>>({});
    const navigate = useNavigate();
    const artController = new ArtController(api);
    const profileController = new ProfileController(api);
    
    const fetchArts = useCallback(async (offset: number) => {
        try {
            setLoading(true);
            const fetchedArts = await artController.getAllArts(offset, 12);
            
            if (fetchedArts.length < 12) {
                setHasMore(false);
            }
            
            setArts(prevArts => offset === 0 ? fetchedArts : [...prevArts, ...fetchedArts]);
            
            const profileIds = new Set(fetchedArts.map(art => art.profileId));
            const profilePromises = Array.from(profileIds).map(id => 
                profileController.getProfile(id).then(profile => ({ id, profile }))
            );
            
            const profiles = await Promise.all(profilePromises);
            const profileMap = profiles.reduce((acc, { id, profile }) => {
                acc[id] = profile;
                return acc;
            }, {} as Record<number, Profile>);
            
            setArtistProfiles(prev => ({ ...prev, ...profileMap }));
            
        } catch (err) {
            console.error("Error fetching arts:", err);
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Не удалось загрузить работы');
            }
        } finally {
            setLoading(false);
        }
    }, [artController, profileController]);
    
    useEffect(() => {
        fetchArts(0);
    }, [fetchArts]);
    
    const loadMore = () => {
        if (!loading && hasMore) {
            const newOffset = offset + 12;
            setOffset(newOffset);
            fetchArts(newOffset);
        }
    };
    
    const getPictureUrl = (artId: number) => {
        return `/api/arts/${artId}/pictures`;
    };
    
    return (
        <div className="min-h-screen bg-gradient-to-b from-[#25022A] to-[#320425]">
            <Nav />
            
            <div className="max-w-7xl mx-auto px-4 py-8">
                <Header title="Галерея искусства" />
                
                {error && (
                    <div className="bg-red-900/20 border border-red-500 text-red-200 p-4 rounded-md mb-6">
                        {error}
                    </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {arts.map(art => {
                        const artist = artistProfiles[art.profileId];
                        return (
                            <div 
                                key={art.id} 
                                className="bg-gradient-to-br from-purple-900/20 to-purple-800/20 rounded-lg overflow-hidden shadow-lg border border-purple-900/30 hover:border-purple-700/50 transition-all cursor-pointer"
                                onClick={() => navigate(`/art/${art.id}`)}
                            >
                                <div className="h-64 overflow-hidden">
                                    <img 
                                        src={getPictureUrl(art.id)} 
                                        alt={art.description || 'Artwork'} 
                                        className="w-full h-full object-cover" 
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = '/placeholder-art.png';
                                        }}
                                    />
                                </div>
                                
                                <div className="p-4">
                                    {artist && (
                                        <div className="flex items-center mb-2">
                                            <div className="w-8 h-8 rounded-full bg-purple-700/50 overflow-hidden mr-2">
                                                {artist.avatar ? (
                                                    <img 
                                                        src={`/api/profiles/${artist.id}/avatar`} 
                                                        alt={artist.displayName || "Artist"} 
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-white font-bold">
                                                        {(artist.displayName || "A")[0].toUpperCase()}
                                                    </div>
                                                )}
                                            </div>
                                            <span className="text-white text-sm font-medium">
                                                {artist.displayName}
                                            </span>
                                            <span className="text-gray-400 text-xs ml-auto">
                                                {formatDistanceToNow(new Date(art.uploadedAt), { addSuffix: true, locale: ru })}
                                            </span>
                                        </div>
                                    )}
                                    
                                    <p className="text-white mb-3 line-clamp-2">
                                        {art.description || 'Без описания'}
                                    </p>
                                    
                                    <div className="flex items-center text-gray-300">
                                        <div className="flex items-center mr-4">
                                            <Heart size={16} className="mr-1" />
                                            <span className="text-xs">42</span>
                                        </div>
                                        <div className="flex items-center">
                                            <MessageSquare size={16} className="mr-1" />
                                            <span className="text-xs">52</span>
                                        </div>
                                        
                                        {art.tierId && (
                                            <span className="ml-auto px-2 py-0.5 bg-purple-700/50 rounded-full text-xs text-white">
                                                Premium
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
                
                {loading && (
                    <div className="flex justify-center mt-8">
                        <div className="loader"></div>
                    </div>
                )}
                
                {!loading && hasMore && (
                    <div className="flex justify-center mt-8">
                        <Button 
                            onClick={loadMore}
                            className="w-full gap-2"
                            variant="primary"
                        >
                            Загрузить еще
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
