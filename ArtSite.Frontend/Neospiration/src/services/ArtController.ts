import type { DefaultClient } from "./api";
import type * as types from "./types";
import { ArtNotFoundException, ArtNotAvailableForProfileException } from "./interfaces/IArtController";
import type { IArtController } from "./interfaces/IArtController";

export class ArtController implements IArtController {
    private api: DefaultClient;
    
    constructor(api: DefaultClient) {
        this.api = api;
    }

    async getArt(artId: number): Promise<types.Art> {
        try {
            const response = await this.api.get(`/arts/${artId}`);
            return response.data;
        } catch (err: any) {
            if (err.response && err.response.status === 404) {
                throw new ArtNotFoundException();
            }
            throw err;
        }
    }

    async createArt(profileId: number, description: string, tierId?: number): Promise<types.Art> {
        try {
            const response = await this.api.post(`/profiles/${profileId}/arts`, {
                description,
                tierId
            });
            return response.data;
        } catch (err: any) {
            if (err.response && err.response.status === 404) {
                throw new ArtNotFoundException();
            }
            if (err.response && err.response.status === 403) {
                throw new ArtNotAvailableForProfileException();
            }
            throw err;
        }
    }

    async getComments(artId: number): Promise<types.Comment[]> {
        try {
            const response = await this.api.get(`/api/arts/${artId}/comments`);
            return response.data;
        } catch (err: any) {
            if (err.response && err.response.status === 404) {
                throw new ArtNotFoundException();
            }
            throw err;
        }
    }

    async addComment(artId: number, text: string): Promise<types.Comment> {
        try {
            const response = await this.api.post(`/api/arts/${artId}/comments`, { text });
            return response.data;
        } catch (err: any) {
            if (err.response && err.response.status === 404) {
                throw new ArtNotFoundException();
            }
            throw err;
        }
    }

    async getPictures(artId: number): Promise<types.Picture[]> {
        try {
            const response = await this.api.get(`/arts/${artId}/pictures`);
            return response.data;
        } catch (err: any) {
            if (err.response && err.response.status === 404) {
                throw new ArtNotFoundException();
            }
            throw err;
        }
    }

    async uploadPicture(artId: number, file: File): Promise<types.Picture> {
        try {
            const formData = new FormData();
            formData.append('file', file);
            const response = await this.api.postFormData(`/arts/${artId}/pictures`, formData);
            return response.data;
        } catch (err: any) {
            if (err.response && err.response.status === 404) {
                throw new ArtNotFoundException();
            }
            throw err;
        }
    }

    getPictureUrl(pictureId: number): string {
        return this.api.url + `/pictures/${pictureId}/view`;
    }
}