import { useEffect, useMemo, useState } from "react";
import type { Art, Picture, Profile } from "../../services/types";
import Container from "./Container";
import { ArtController } from "../../services/controllers/ArtController";
import api from "../../services/api";
import Avatar from "./Avatar";

const convertDateToString = (date: Date): string => {
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

export default function Publication({ art, profile }: { art: Art, profile?: Profile }) {
    const [pictures, setPictures] = useState<Picture[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [imageLoaded, setImageLoaded] = useState(false);
    const artController = useMemo(() => new ArtController(api), [api]);


    useEffect(() => {
        const fetchPictureUrls = async () => {
            const pictures = await artController.getPictures(art.id);
            setPictures(pictures);
            setLoading(false);
        };
        fetchPictureUrls();
    }, [art])
    
    console.log(pictures && pictures.length > 0 ? artController.getPictureUrl(pictures[0].id) : '');
    return (
        <Container withoutPadding className="overflow-hidden">
            <div className="p-3">
                <p className="line-clamp-2 text-art-text-hint">{convertDateToString(art.uploadedAt)}</p>
            </div>
            { profile && (
                <div className="flex items-center gap-2 px-2">
                    <Avatar profile={profile} size={40} />
                    <div className="flex flex-col">
                        <p className="text-lg font-semibold">{profile.displayName}</p>
                        <p className="text-art-text-hint text-sm">{profile.description}</p>
                    </div>
                </div>
            )}
            <div className="p-3">
                <p className="line-clamp-2 text-lg">{art.description}</p>
            </div>
            {/* {(loading || !pictures || pictures.length === 0) ? (
                <div className="flex items-center justify-center h-64">
                    <p className="text-art-text-hint">Загрузка...</p>
                </div>
            ) : (
                <img 
                    src={pictures && pictures.length > 0 ? artController.getPictureUrl(pictures[0].id) : ''} 
                    alt={art.description || 'Artwork'} 
                    className="w-full"
                />
            )} */}
            {loading || (!imageLoaded && pictures && pictures.length > 0) && (
                <div className="flex items-center justify-center h-64 bg-gray-200 animate-pulse">
                    <p className="text-art-text-hint">Загрузка...</p>
                </div>)}
            {!loading && pictures && pictures.length > 0 && (
                <img 
                    src={pictures && pictures.length > 0 ? artController.getPictureUrl(pictures[0].id) : ''} 
                    alt={art.description || 'Artwork'} 
                    onLoad={() => setImageLoaded(true)}
                    className={"w-full" + (imageLoaded ? '' : ' hidden')}
                />
            )}
            {!loading && pictures && pictures.length == 0 && (
                <div className="flex items-center justify-center h-64 bg-gray-200">
                    <p className="text-art-text-hint">Нет изображений для отображения</p>
                </div>
            )}

        </Container>
    )
}