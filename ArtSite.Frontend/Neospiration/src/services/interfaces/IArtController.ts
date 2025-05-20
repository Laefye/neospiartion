import type * as types from "../types";

export class ArtException extends Error {
    constructor(message: string) {
        super(message);
        this.name = "ArtException";
    }
}

export class ArtNotFoundException extends ArtException {
    constructor() {
        super("Арт не найден");
    }
}

export class ArtNotAvailableForProfileException extends ArtException {
    constructor() {
        super("Арт не доступен для этого профиля");
    }
}

export interface IArtController {
    getArt(artId: number): Promise<types.Art>;
    // createArt(profileId: number, description: string, tierId?: number): Promise<types.Art>;
    getComments(artId: number): Promise<types.Comment[]>;
    addComment(artId: number, text: string): Promise<types.Comment>;
    uploadPicture(artId: number, file: File): Promise<types.Picture>;
    getPictureUrl(pictureId: number): string;
}
