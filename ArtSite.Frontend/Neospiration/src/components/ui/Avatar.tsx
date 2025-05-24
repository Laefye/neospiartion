import { useEffect, useMemo, useState } from "react";
import { ProfileController } from "../../services/controllers/ProfileController";
import api from "../../services/api";
import type { Profile } from "../../services/types";

export default function Avatar({ profile, size = 40 }: { profile: Profile, size?: number }) {
    let [src, setSrc] = useState<string | null>(null);
    let [loading, setLoading] = useState<boolean>(true);
    let profileController = useMemo(() => new ProfileController(api), [api]);
    useEffect(() => {
        if (!profile.avatar) {
            setSrc(null);
            setLoading(false);
            return;
        }
        const fetchAvatar = async () => {
            try {
                const avatarUrl = await profileController.getAvatarUrl(profile.id);
                setSrc(avatarUrl);
            } catch (error) {
                console.error("Failed to fetch avatar:", error);
                setSrc(null);
            } finally {
                setLoading(false);
            }
        };
        fetchAvatar();
    }, [profile]);
    return (
        <>
            {loading && (
                <div className="animate-pulse bg-gray-200 rounded-full" style={{ width: size, height: size }} />
            )}
            {!loading && profile.avatar && (
                <img
                    src={src || "/default-avatar.png"}
                    alt="Avatar"
                    className="rounded-full"
                    style={{ width: size, height: size }}
                />
            )}
            {!loading && !profile.avatar && (
                <div className="bg-gray-200 rounded-full" style={{ width: size, height: size }}>
                    <span className="text-gray-500 text-sm flex items-center justify-center h-full">
                        {profile.displayName.charAt(0).toUpperCase()}
                    </span>    
                </div>
            )}
        </>
    );
}