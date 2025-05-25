import { use, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Nav from "../components/ui/Nav";
import { Link, useNavigate, useParams } from "react-router";
import { ArtController } from "../services/controllers/ArtController";
import api from "../services/api";
import type { Art, Picture, Profile, Comment, Countable, Tier } from "../services/types";
import ErrorMessage from "../components/ui/ErrorMessage";
import Container from "../components/ui/Container";
import { convertDateToString } from "../components/ui/Publication";
import { Heart, MessageCircle, Settings, Trash } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import Avatar from "../components/ui/Avatar";
import { ProfileController } from "../services/controllers/ProfileController";
import Seperator from "../components/ui/Seperator";
import Button from "../components/ui/Button";
import { FormInput } from "../components/ui/FormInput";
import BigText from "../components/ui/BigText";
import { CommentController } from "../services/controllers/CommentController";
import { ArtNotAvailableForProfileException } from "../services/interfaces/IArtController";
import { TierController } from "../services/controllers/TierController";

export function ArtComments({ art }: { art: Art }) {
    const PAGE_SIZE = 10;
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const commentRef = useRef<HTMLInputElement>(null);
    const [posting, setPosting] = useState(false);
    const artController = useMemo(() => new ArtController(api), [api]);
    const profileController = useMemo(() => new ProfileController(api), [api]);
    const auth = useAuth();

    const fetchComments = useCallback(async (currentOffset = 0, replace = false) => {
        setLoading(true);
        setError(null);
        try {
            // Предполагается, что getComments теперь поддерживает offset и limit
            const commentsData = await artController.getComments(art.id, currentOffset, PAGE_SIZE);
            if (replace) {
                setComments(commentsData.items);
            } else {
                setComments(prev => [...prev, ...commentsData.items]);
            }
            setHasMore(commentsData.count > currentOffset + commentsData.items.length);
        } catch (err) {
            setError("Не удалось загрузить комментарии");
        } finally {
            setLoading(false);
        }
    }, [art.id, artController]);

    useEffect(() => {
        setOffset(0);
        setHasMore(true);
        fetchComments(0, true);
    }, [art.id, artController]);

    const loadMore = () => {
        if (!loading && hasMore) {
            const newOffset = offset + PAGE_SIZE;
            setOffset(newOffset);
            fetchComments(newOffset);
        }
    };

    const handlePostComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!auth.me || commentRef.current == null || !commentRef.current.value.trim()) return;
        setPosting(true);
        try {
            const comment = await artController.addComment(art.id, commentRef.current.value.trim());
            setComments(prev => [...prev, comment]);
            if (commentRef.current) {
                commentRef.current.value = '';
            }
        } catch {
            setError("Не удалось отправить комментарий");
        } finally {
            setPosting(false);
        }
    };

    return (
        <Container withoutPadding className="border-t border-art-border p-3 max-w-[700px] w-full flex flex-col">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
                <MessageCircle size={18} /> Комментарии ({art.commentCount})
            </h3>
            {error && <ErrorMessage>{error}</ErrorMessage>}
            {loading && offset === 0 ? (
                <div className="text-art-text-hint">Загрузка комментариев...</div>
            ) : (
            <div className="space-y-3 mb-3">
                {comments.length === 0 && <div className="text-art-text-hint">Нет комментариев</div>}
                {comments.map(comment => (
                    <CommentItem key={comment.id} comment={comment} profileController={profileController} onDelete={(commentId) => {
                        setComments(prev => prev.filter(c => c.id !== commentId));
                    }} />
                ))}
            </div>
            )}
            {hasMore && !loading && (
                <Button onClick={loadMore} className="w-full mb-2" variant="secondary">
                    Загрузить еще
                </Button>
            )}
            <Seperator/>
            {auth.me ? (
            <form onSubmit={handlePostComment} className="flex w-full gap-2 mt-2 items-end">
                <div className="grow">
                    <FormInput
                        id="comment"
                        placeholder="Оставьте комментарий..."
                        label="Ваш Комментарий"
                        inputRef={commentRef}
                        required
                    />
                </div>
                <Button
                type="submit"
                disabled={posting}
                >
                Отправить
                </Button>
            </form>
            ) : (
                <div className="text-art-text-hint text-sm">Войдите, чтобы оставить комментарий</div>
            )}
        </Container>
    );
}

// Вспомогательный компонент для отображения одного комментария
function CommentItem({ comment, profileController, onDelete }: { comment: Comment, profileController: ProfileController, onDelete?: (commentId: number) => void }) {
    const [profile, setProfile] = useState<Profile | null>(null);
    const auth = useAuth();
    const commentController = useMemo(() => new CommentController(api), [api]);

    useEffect(() => {
        let mounted = true;
        profileController.getProfile(comment.profileId).then(p => {
            if (mounted) setProfile(p);
        });
        return () => { mounted = false; };
    }, [comment.profileId, profileController]);

    const handleDelete = useCallback(async (e: any) => {
        e.preventDefault();
        if (auth.me && auth.me.profileId === comment.profileId) {
            try {
                await commentController.deleteComment(comment.id);
                if (onDelete) {
                    onDelete(comment.id);
                }
            } catch (error) {
                console.error("Error deleting comment:", error);
            }
        }
    }, [auth.me, comment.id, comment.profileId, commentController, onDelete]);

    return (
        <div className="flex gap-2 items-start">
            { profile && (<Avatar profile={profile || undefined} size={32} />)}
            <div>
                <div className="font-semibold text-sm">{profile?.displayName || "..."}</div>
                <div className="text-art-text">{comment.text}</div>
                <div className="text-art-text-hint text-xs flex gap-1">
                    {convertDateToString(comment.uploadedAt)}
                    { auth.me && auth.me.profileId === comment.profileId && (
                        <a href="#" className="text-red-400" onClick={handleDelete}>Удалить</a>
                    )}
                </div>
            </div>
        </div>
    );
}

export function ArtDetails({ art: oldArt }: { art: Art }) {
    const auth = useAuth();
    const [isOpenedContextMenu, setIsOpenedContextMenu] = useState(false);
    const [pictures, setPictures] = useState<Picture[]>([]);
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [art, setArt] = useState<Art>(oldArt);
    const [liked, setLiked] = useState(oldArt.isLiked || false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const navigate = useNavigate();
    const artController = useMemo(() => new ArtController(api), [api]);
    const profileController = useMemo(() => new ProfileController(api), [api]);
    const [needTier, setNeedTier] = useState<boolean>(false);
    const tierController = useMemo(() => new TierController(api), [api]);
    const [tier, setTier] = useState<null | Tier>(null);
    
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const profileData = await profileController.getProfile(oldArt.profileId);
                setProfile(profileData);
                if (oldArt.tierId != null) {
                    const tierData = await tierController.getTier(oldArt.tierId);
                    setTier(tierData);
                }
                const picturesData = await artController.getPictures(oldArt.id);
                setPictures(picturesData);
            } catch (error) {
                if (error instanceof ArtNotAvailableForProfileException) {
                    setNeedTier(true);
                }
                console.error("Error fetching profile:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [oldArt]);

    const likeButtonHandle = useCallback(async () => {
        if (auth.me == null) return;
        try {
            if (liked) {
                await artController.unlikeArt(oldArt.id);
            } else {
                await artController.likeArt(oldArt.id);
            }
            setLiked(!liked);
            setArt(prev => ({ ...prev, likeCount: prev.likeCount + (liked ? -1 : 1) }));
        } catch (error) {
            console.error("Error liking/unliking art:", error);
        }
    }, [auth.me, liked, artController]);

    const deleteButtonHandle = useCallback(async () => {
        if (auth.me && auth.me.profileId === oldArt.profileId) {
            try {
                await artController.deleteArt(oldArt.id);
                setIsOpenedContextMenu(false);
                navigate('/profile/' + auth.me.profileId);
            } catch (error) {
                console.error("Error deleting art:", error);
            }
        }
    }, [auth.me, oldArt.id, oldArt.profileId, artController, navigate]);

    return (
        <Container withoutPadding className="overflow-hidden h-min w-full max-w-[700px]">
            <div className="p-3 flex">
                <p className="line-clamp-2 text-art-text-hint grow">{convertDateToString(oldArt.uploadedAt)}</p>
                { auth.me && auth.me.profileId === oldArt.profileId && (
                    <button className="text-art-text-hint" onClick={() => setIsOpenedContextMenu(!isOpenedContextMenu)}>
                        <Settings/>
                    </button>
                )}
                {isOpenedContextMenu && (
                    <div className="relative">
                        <div className="absolute right-0 top-8 bg-white shadow-lg rounded-md p-2 flex flex-col">
                            <button className="w-full text-red-500 flex space-x-1.5" onClick={deleteButtonHandle}>
                                <Trash className="inline mr-1" />
                                <span>Удалить</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
            { profile && (
                <Link to={`/profile/${profile.id}`} className="flex items-center gap-2 px-2">
                    <Avatar profile={profile} size={40} />
                    <div className="flex flex-col">
                        <p className="text-lg font-semibold">{profile.displayName}</p>
                        <p className="text-art-text-hint text-sm">{profile.description}</p>
                    </div>
                </Link>
            )}
            {oldArt.description != null && (
                <div className="p-3">
                    <BigText className="line-clamp-2 text-lg" textArea={oldArt.description}/>
                </div>
            )}
            {!needTier && (<>
                {loading || (!imageLoaded && pictures && pictures.length > 0) && (
                    <div className="flex items-center justify-center h-64 bg-gray-200 animate-pulse">
                        <p className="text-art-text-hint">Загрузка...</p>
                    </div>)}
                {!loading && pictures && pictures.length > 0 && (
                    <img 
                        src={pictures && pictures.length > 0 ? artController.getPictureUrl(pictures[0].id) : ''} 
                        alt={oldArt.description || 'Artwork'} 
                        onLoad={() => setImageLoaded(true)}
                        className={"w-full" + (imageLoaded ? '' : ' hidden')}
                    />
                )}
                {!loading && pictures && pictures.length == 0 && (
                    <div className="flex items-center justify-center h-64 bg-gray-200">
                        <p className="text-art-text-hint">Нет изображений для отображения</p>
                    </div>
                )}
            </>)}
            {needTier && (
                <div className="flex items-center justify-center h-64 bg-gray-200 flex-col space-y-2">
                    <p className="text-art-text-hint">Это произведение доступно только для подписчиков</p>
                    <p className="text-art-text-hint">Необходимый уровень: {tier?.name}</p>
                </div>
            )}
            <div className="flex gap-3 p-3">
                <button disabled={auth.me == null} onClick={likeButtonHandle} className={"flex items-center space-x-1.5 " + (liked === true && "text-red-500")}><Heart/><span>{art.likeCount}</span></button>
            </div>
        </Container>
    );
}

export default function ArtPage() {
    const { artId } = useParams<{ artId: string }>();
    const [art, setArt] = useState<Art | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const artController = useMemo(() => new ArtController(api), [api]);

    useEffect(() => {
        const fetchArtDetails = async () => {
            if (!artId) {
                setError("Art ID is required");
                return;
            }
            try {
                setArt(await artController.getArt(parseInt(artId)));
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError("An unexpected error occurred");
                }
            } finally {
                setLoading(false);
            }
        };
        fetchArtDetails();
    }, [artId])

    return (
        <>
            <Nav/>
            <div className='min-h-screen bg-gradient-to-b from-[#25022A] to-[#320425] w-full flex flex-col items-center py-3 gap-3'>
                {error && <ErrorMessage>{error}</ErrorMessage>}
                {!loading && !error && art && (<ArtDetails art={art} />)}
                {!loading && !error && art && <ArtComments art={art} />}
            </div>
        </>
    );
}