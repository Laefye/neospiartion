import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { ProfileController } from '../services/ProfileController';
import api from '../services/api';
import type { Profile } from '../services/types';

export default function ProfilePage() {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);

    useEffect(() => {
        (async () => {
            try {
                const profileController = new ProfileController(api);
                let profile = await profileController.getProfile(parseInt(id!))
                setProfile(profile);
                setLoading(false);
            } catch (err) {
                console.error(err);
            }
        })();
    }, [id]);
    return (<>
        {loading && <div>Loading...</div>}
        {error && <div>{error}</div>}
        {profile && (
            <div>
                <h1>{profile.displayName}</h1>
                <p>User ID: {profile.userId}</p>
                <p>Profile ID: {profile.id}</p>
                <p>Avatar: {profile.avatar}</p>
                <p>Description: {profile.description}</p>
            </div>
        )}
        </>
    );
};
