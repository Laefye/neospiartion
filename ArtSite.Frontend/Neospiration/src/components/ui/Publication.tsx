import { useEffect, useMemo, useState } from "react";
import { type Subscription, type Art, type Picture, type Profile, type Tier } from "../../services/types";
import Container from "./Container";
import { ArtController } from "../../services/controllers/ArtController";
import api from "../../services/api";
import Avatar from "./Avatar";
import { Heart, MessageCircle, Settings, Trash } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { Link, useNavigate } from "react-router";
import BigText from "./BigText";
import { TierController } from "../../services/controllers/TierController";
import { ProfileController } from "../../services/controllers/ProfileController";
import { ArtNotAvailableForProfileException } from "../../services/interfaces/IArtController";

export const convertDateToString = (date: Date): string => {
    const now = new Date();
    const day = date.getDate();
    const monthNames = [
        "Января", "Февраля", "Марта", "Апреля", "Мая", "Июня",
        "Июля", "Августа", "Сентября", "Октября", "Ноября", "Декабря"
    ];
    const month = monthNames[date.getMonth()];
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    let result = `${day} ${month} ${hours}:${minutes}`;
    if (date.getFullYear() !== now.getFullYear()) {
        result += `, ${date.getFullYear()}`;
    }
    return result;
}

export default function Publication({ art, profile, settings }: { art: Art, profile?: Profile, settings?: { onDeleted: () => void } }) {
    const [pictures, setPictures] = useState<Picture[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [liked, setLiked] = useState(art.isLiked || false);
    const [likeCount, setLikeCount] = useState(art.likeCount || 0);
    const [isOpenedContextMenu, setIsOpenedContextMenu] = useState(false);
    const navigate = useNavigate();
    const artController = useMemo(() => new ArtController(api), [api]);
    const tierController = useMemo(() => new TierController(api), [api]);
    const profileController = useMemo(() => new ProfileController(api), [api]);
    const [tier, setTier] = useState<null | Tier>(null);
    const [needTier, setNeedTier] = useState<boolean>(false);
    const auth = useAuth();


    const likeButtonHandle = async () => {
        if (auth.me == null) return;
        if (liked) {
            await artController.unlikeArt(art.id);
        } else {
            await artController.likeArt(art.id);
        }
        setLikeCount(liked ? likeCount - 1 : likeCount + 1);
        setLiked(!liked);
    };

    const deleteButtonHandle = async () => {
        if (settings && settings.onDeleted) {
            await artController.deleteArt(art.id);
            setIsOpenedContextMenu(false);
            settings.onDeleted();
        }
    };

    useEffect(() => {
        const fetchPictureUrls = async () => {
            if (art.tierId != null) {
                const tierData = await tierController.getTier(art.tierId);
                setTier(tierData);
            }
            try {
                const pictures = await artController.getPictures(art.id);
                setPictures(pictures);
            } catch (error) {
                if (error instanceof ArtNotAvailableForProfileException) {
                    setNeedTier(true);
                }
            } finally {
                setLoading(false);
            }
        };
        fetchPictureUrls();
    }, [art])
    
    return (
        <Container withoutPadding className="overflow-hidden h-min">
            <div className="p-3 flex">
                <p className="line-clamp-2 text-art-text-hint grow">
                    <span>{convertDateToString(art.uploadedAt)}</span>
                    {auth.me && auth.me.profileId === art.profileId && settings && tier && (
                        <span className="text-art-text-hint ml-2">Уровень подписки: {tier?.name}</span>
                    )}
                </p>
                { auth.me && auth.me.profileId === art.profileId && settings != null && (
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
                <Link to={`/profile/${profile.id}`} className="flex items-center gap-2 p-2">
                    <Avatar profile={profile} size={40} />
                    <div className="flex flex-col">
                        <p className="text-lg font-semibold">{profile.displayName}</p>
                    </div>
                </Link>
            )}
            { art.description && (<div className="p-3">
                <BigText className="line-clamp-2 text-lg" textArea={art.description}/>
            </div>)
            }
            {loading || (!imageLoaded && pictures && pictures.length > 0) && (
                <div className="flex items-center justify-center h-64 bg-gray-200 animate-pulse">
                    <p className="text-art-text-hint">Загрузка...</p>
                </div>)}
            {!loading && !needTier && pictures && pictures.length > 0 && (
                <img 
                    src={pictures && pictures.length > 0 ? artController.getPictureUrl(pictures[0].id) : ''} 
                    alt={art.description || 'Artwork'} 
                    onLoad={() => setImageLoaded(true)}
                    className={"w-full" + (imageLoaded ? '' : ' hidden')}
                />
            )}
            {!loading && needTier && (
                <div className="flex items-center justify-center h-64 bg-gray-200 flex-col space-y-2">
                    <p className="text-art-text-hint">Это произведение доступно только для подписчиков</p>
                    <p className="text-art-text-hint">Необходимый уровень: {tier?.name}</p>
                </div>
            )}
            {!loading && pictures && pictures.length == 0 && (
                <div className="flex items-center justify-center h-64 bg-gray-200">
                    <p className="text-art-text-hint">Нет изображений для отображения</p>
                </div>
            )}
            <div className="flex gap-3 p-3">
                <button disabled={auth.me == null} onClick={likeButtonHandle} className={"flex items-center space-x-1.5 " + (liked === true && "text-red-500")}><Heart/><span>{likeCount}</span></button>
                <button className="flex items-center space-x-1.5" onClick={() => navigate(`/art/${art.id}`)}>
                    <MessageCircle />
                    <span>
                        {art.commentCount}
                    </span>
                </button>
            </div>

        </Container>
    )
}