import { useState, useEffect, useCallback, useMemo } from 'react';
import { ArtController } from '../services/controllers/ArtController';
import { ProfileController } from '../services/controllers/ProfileController';
import api from '../services/api';
import type { Art, Profile } from '../services/types';
import Nav from '../components/ui/Nav';
import Header from '../components/ui/Header';
import { useNavigate } from 'react-router';
import Button from '../components/ui/Button';
import Publication from '../components/ui/Publication';

const PAGE_SIZE = 4;

export default function ArtGalleryPage() {
    const [arts, setArts] = useState<Art[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [artistProfiles, setArtistProfiles] = useState<Record<number, Profile>>({});
    const navigate = useNavigate();
    const artController = useMemo(() => new ArtController(api), [api]);
    const profileController = useMemo(() => new ProfileController(api), [api]);

    const fetchArts = useCallback(async (currentOffset: number, replace = false) => {
        setLoading(true);
        setError(null);
        try {
            const {count, items: fetchedArts} = await artController.getAllArts(currentOffset, PAGE_SIZE);

            if (count <= PAGE_SIZE) setHasMore(false);

            setArts(prevArts =>
                replace ? (fetchedArts) : [...prevArts, ...(fetchedArts)]
            );

            const missingProfileIds = fetchedArts
                .map(art => art.profileId)
                .filter(id => !(id in artistProfiles));
            const uniqueProfileIds = Array.from(new Set(missingProfileIds));

            if (uniqueProfileIds.length > 0) {
                const profilePromises = uniqueProfileIds.map(id =>
                    profileController.getProfile(id)
                        .then(profile => ({ id, profile }))
                        .catch(() => ({ id, profile: null }))
                );
                const profiles = await Promise.all(profilePromises);
                const profileMap = profiles.reduce((acc, { id, profile }) => {
                    if (profile) acc[id] = profile;
                    return acc;
                }, {} as Record<number, Profile>);
                setArtistProfiles(prev => ({ ...prev, ...profileMap }));
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Не удалось загрузить работы');
        } finally {
            setLoading(false);
        }
    }, [artController, profileController, artistProfiles]);

    useEffect(() => {
        fetchArts(0, true);
        setOffset(0);
        setHasMore(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const loadMore = () => {
        if (!loading && hasMore) {
            const newOffset = offset + PAGE_SIZE;
            setOffset(newOffset);
            fetchArts(newOffset);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#25022A] to-[#320425]">
            <Nav />
            <div className="max-w-7xl mx-auto px-4 py-8">
                <Header className='mb-8' title={<span className='text-white'>Галерея</span>} />

                {error && (
                    <div className="bg-red-900/20 border border-red-500 text-red-200 p-4 rounded-md mb-6">
                        {error}
                    </div>
                )}

                <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
                    {arts.map(art => {
                        const profile = artistProfiles[art.profileId];
                        return (
                            <Publication key={art.id} art={art} profile={profile}/>
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
