import { useEffect, useState, useRef } from "react";
import { Search, X } from "lucide-react";
import { useNavigate } from "react-router";
import { ProfileController } from "../../services/controllers/ProfileController";
import type { Profile } from "../../services/types";
import api from '../../services/api'
import Avatar from "./Avatar";
import Button from "./Button";

const MAX_RECENT_SEARCHES = 10;

export default function SearchBar() {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(false);
    const [recentSearches, setRecentSearches] = useState<Profile[]>(() => {
        try {
            const saved = localStorage.getItem('recentSearches');
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    const searchRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const profileController = new ProfileController(api);

    useEffect(() => {
        localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
    }, [recentSearches]);

    useEffect(() => {
        const searchProfiles = async () => {
            if (query.length < 1) return;
            setLoading(true);
            try {
                const profiles = await profileController.searchProfiles(query);
                setResults(profiles);
            } catch (error) {
                console.error("Error searching profiles:", error);
            } finally {
                setLoading(false);
            }
        };

        const timer = setTimeout(searchProfiles, 300);
        return () => clearTimeout(timer);
    }, [query, profileController]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
        if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
            setIsOpen(false);
        }
        }
        
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleProfileClick = (profile: Profile) => {
        setRecentSearches(prev => {
            const filtered = prev.filter(p => p.id !== profile.id);
            return [profile, ...filtered].slice(0, MAX_RECENT_SEARCHES);
        });
        
        navigate(`/profile/${profile.id}`);
        setIsOpen(false);
        setQuery('');
    };

    const removeRecentSearch = (e: React.MouseEvent, profileId: number) => {
        e.stopPropagation();
        setRecentSearches(prev => prev.filter(p => p.id !== profileId));
    }

    const clearAllRecent = () => {
        setRecentSearches([]);
    };

    return (
        <div className="relative" ref={searchRef}>
            <div className="relative flex items-center">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search size={16} className="text-gray-400" />
                </div>
                <input
                    type="text"
                    placeholder="Search"
                    className="bg-black/50 w-full pl-10 pr-4 py-2 rounded-full text-white border-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setIsOpen(true)}
                />
            </div>

            {isOpen && (
                <div className="absolute top-full mt-2 w-full bg-purple-900/90 border border-purple-800 rounded-lg shadow-lg z-50 overflow-hidden">
                    {query.length < 2 && recentSearches.length > 0 ? (
                        <div>
                            <div className="flex justify-between items-center p-3 border-b border-purple-800">
                                <h3 className="text-sm text-gray-400">Недавние</h3>
                                <Button 
                                    onClick={clearAllRecent} 
                                    className="text-blue-500 text-xs hover:text-blue-400"
                                >
                                    Очистить всё
                                </Button>
                            </div>
                        
                            <div className="max-h-72 overflow-y-auto">
                                {recentSearches.map(profile => (
                                <div 
                                    key={profile.id}
                                    className="flex items-center p-3 hover:bg-purple-800/50 cursor-pointer"
                                    onClick={() => handleProfileClick(profile)}
                                >
                                    <div className="mr-3">
                                        <Avatar 
                                            profile={profile}
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-white">{profile.displayName}</div>
                                        <div className="text-xs text-gray-400">@{profile.id}</div>
                                    </div>
                                    <Button 
                                        onClick={(e) => removeRecentSearch(e, profile.id)}
                                        className="primary hover:text-white"
                                    >
                                        <X size={16} />
                                    </Button>
                                </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="bg-purple-1000">
                            {loading ? (
                                <div className="flex justify-center p-4">
                                    <div className="w-5 h-5 border-2 border-t-transparent border-purple-500 rounded-full animate-spin"></div>
                                </div>
                            ) : results.length > 0 ? (
                                <div className="max-h-72 overflow-y-auto">
                                    {results.map(profile => (
                                        <div 
                                            key={profile.id}
                                            className="flex items-center p-3 hover:bg-purple-800/50 cursor-pointer"
                                            onClick={() => handleProfileClick(profile)}
                                        >
                                            <div className="mr-3">
                                                <Avatar 
                                                    profile={profile}
                                                />
                                            </div>
                                            <div>
                                                <div className="text-white">{profile.displayName}</div>
                                                <div className="text-xs text-gray-400">@{profile.id}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : query.length >= 2 ? (
                                <div className="p-4 text-center text-gray-200">
                                    Никого не нашлось
                                </div>
                            ) : null}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}