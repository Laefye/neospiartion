import { useEffect, useState } from "react";
import type { Art, Picture } from "../../services/types";
import Container from "./Container";
import { ArtController } from "../../services/ArtController";
import api from "../../services/api";

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

export default function ArtComponent({ art }: { art: Art }) {
    const [pictures, setPictures] = useState<Picture[] | null>(null);
    const artController = new ArtController(api);


    useEffect(() => {
        const fetchPictureUrls = async () => {
            const pictures = await artController.getPictures(art.id);
            setPictures(pictures);
        };
        fetchPictureUrls();
    }, [art])
    console.log(pictures && pictures.length > 0 ? artController.getPictureUrl(pictures[0].id) : '');
    return (
        <Container withoutPadding className="overflow-hidden">
            <div className="p-3">
                <p className="line-clamp-2 text-art-text-hint">{convertDateToString(art.uploadedAt)}</p>
            </div>
            <div className="p-3">
                <p className="line-clamp-2 text-lg">{art.description}</p>
                {/* Render comment section for each art */}
                {/* <ArtComments artId={art.id} /> */}
            </div>
            <img 
                src={pictures && pictures.length > 0 ? artController.getPictureUrl(pictures[0].id) : ''} 
                alt={art.description || 'Artwork'} 
                className="w-full"
            />

        </Container>
    )
}